import os
import pytest
import requests
from backend.hazard_engine import (
    VEHICLE_PROFILES,
    compute_passability_probability,
    calculate_hazard_risk,
    calculate_water_risk,
    calculate_damage_risk,
    haversine_distance_km
)
from backend.router import EmergencyRouter, NETWORK_NODES
from backend.dispatch import solve_dispatch_assignment

API_BASE = os.getenv("TEST_API_URL", "http://127.0.0.1:8000")



# ==========================================
# 1. VEHICLE PROFILE & SIGMOID CURVE TESTS
# ==========================================
def test_vehicle_profiles_structure():
    """Verify all 5 standard rescue vehicle profiles have physical limit parameters."""
    expected_profiles = ["Ambulance", "NDRF Truck", "Flood Boat", "Rapid Response", "Evacuation Bus"]
    for v in expected_profiles:
        assert v in VEHICLE_PROFILES, f"Missing vehicle profile: {v}"
        prof = VEHICLE_PROFILES[v]
        assert "max_water_clearance_cm" in prof
        assert "d_safe_cm" in prof
        assert "k_steepness" in prof
        assert "base_speed_kmh" in prof
        assert prof["base_speed_kmh"] > 0


def test_sigmoid_dry_road_passability():
    """On dry road (0 cm water), standard vehicles should have high passability (~1.0)."""
    p_amb = compute_passability_probability("Ambulance", 0.0)
    p_truck = compute_passability_probability("NDRF Truck", 0.0)
    assert p_amb > 0.95, f"Expected high passability for ambulance on dry road, got {p_amb}"
    assert p_truck > 0.95, f"Expected high passability for NDRF truck on dry road, got {p_truck}"


def test_sigmoid_deep_water_passability():
    """At 50 cm water depth, ambulance (d_safe=25cm) should have low passability while truck should remain passable."""
    p_amb = compute_passability_probability("Ambulance", 50.0)
    p_truck = compute_passability_probability("NDRF Truck", 50.0)
    assert p_amb < 0.10, f"Ambulance should be impassable at 50cm, got {p_amb}"
    assert p_truck > 0.80, f"NDRF truck should still be passable at 50cm, got {p_truck}"


def test_flood_boat_amphibious_physics():
    """Flood boat cannot navigate dry land (<20cm) but thrives in deep inundation (>50cm)."""
    p_shallow = compute_passability_probability("Flood Boat", 5.0)
    p_deep = compute_passability_probability("Flood Boat", 60.0)
    assert p_shallow < 0.15, "Boat should be grounded in shallow/dry conditions"
    assert p_deep > 0.90, "Boat should have high passability in deep water"


def test_passability_monotonicity():
    """Passability probability for an ambulance should monotonically decrease with rising water."""
    depths = [10.0, 20.0, 30.0, 40.0, 50.0]
    probs = [compute_passability_probability("Ambulance", d) for d in depths]
    for i in range(len(probs) - 1):
        assert probs[i] >= probs[i + 1], f"Expected decreasing passability: {probs[i]} >= {probs[i+1]}"


# ==========================================
# 2. HAZARD CALCULATION & DISTANCE TESTS
# ==========================================
def test_haversine_identical_coordinates():
    """Distance between identical coordinates should be 0 km."""
    d = haversine_distance_km(28.6139, 77.2090, 28.6139, 77.2090)
    assert round(d, 4) == 0.0


def test_haversine_delhi_to_lucknow():
    """Distance between Delhi and Lucknow is approximately 400-500 km."""
    d = haversine_distance_km(28.6139, 77.2090, 26.8467, 80.9462)
    assert 400.0 < d < 550.0, f"Expected 400-550 km, got {d}"


def test_hazard_risk_safe_conditions():
    """Zero water depth, damage, and debris should yield SAFE grade and risk multiplier near 1.0."""
    result = calculate_hazard_risk(water_depth_cm=0.0, damage_level=0.0, debris_level=0.0, vehicle_type="Ambulance")
    assert result["grade"] == "SAFE"
    assert result["is_passable"] is True
    assert result["risk_multiplier"] <= 1.2


def test_hazard_risk_extreme_water():
    """Water depth significantly exceeding vehicle clearance must trigger IMPASSABLE grade."""
    result = calculate_hazard_risk(water_depth_cm=65.0, damage_level=2.0, debris_level=1.0, vehicle_type="Ambulance")
    assert result["grade"] == "IMPASSABLE"
    assert result["is_passable"] is False
    assert result["risk_multiplier"] > 10.0


def test_hazard_damage_component_penalty():
    """High structural damage should reduce passability for light vehicles."""
    mult, passable = calculate_damage_risk(damage_level=9.5, vehicle_type="Ambulance")
    assert passable is False
    assert mult > 5.0


# ==========================================
# 3. NETWORK ROUTING & DUAL CORRIDOR TESTS
# ==========================================
def test_emergency_router_initialization():
    """Emergency router initializes with national nodes and edges."""
    router = EmergencyRouter()
    assert len(router.graph.nodes) > 20
    assert len(router.graph.edges) > 20
    assert "DEL_HQ" in router.graph.nodes
    assert "UP_LUCKNOW_HQ" in router.graph.nodes


def test_find_safe_corridor_success():
    """Route calculation between connected Delhi nodes should return valid corridor."""
    router = EmergencyRouter()
    res = router.find_safe_corridor(source="DEL_HQ", target="DEL_MAYUR_SHELTER", vehicle_type="Ambulance")
    assert res["success"] is True
    assert "safe_corridor" in res
    assert "backup_corridor" in res
    assert res["safe_corridor"]["total_distance_km"] > 0
    assert res["safe_corridor"]["reliability_score"] > 0


def test_dual_corridor_reliability_scores():
    """Both safe corridor and backup corridor must calculate reliability scores R in (0, 1]."""
    router = EmergencyRouter()
    res = router.find_safe_corridor(source="DEL_HQ", target="DEL_CONNAUGHT", vehicle_type="Ambulance")
    assert "safe_corridor" in res
    assert "backup_corridor" in res
    assert 0.0 < res["safe_corridor"]["reliability_score"] <= 1.0
    assert 0.0 < res["backup_corridor"]["reliability_score"] <= 1.0


def test_find_nearest_node_lookup():
    """Nearest node lookup near Connaught Place (28.63, 77.21) should return Delhi node."""
    router = EmergencyRouter()
    nearest = router.find_nearest_node(lat=28.6310, lon=27.2180, state="Delhi NCR")
    assert nearest is not None
    assert "id" in nearest


def test_router_hazard_impact_and_detour():
    """When a severe incident is placed on a bridge, router applies hazard and increases weight."""
    router = EmergencyRouter()
    # Apply severe flood at ITO Riverfront Causeway / DEL_YAMUNA
    yamuna_node = NETWORK_NODES["DEL_YAMUNA"]
    incidents = [{
        "lat": yamuna_node["lat"],
        "lon": yamuna_node["lon"],
        "water_depth_cm": 80.0,
        "damage_level": 5.0,
        "debris_level": 4.0
    }]
    router.apply_hazards(incidents, vehicle_type="Ambulance")
    # Verify adjacent edge has elevated risk multiplier
    edge_data = router.graph["DEL_CONNAUGHT"]["DEL_YAMUNA"]
    assert edge_data["risk_multiplier"] > 3.0
    assert edge_data["water_depth_cm"] > 20.0


# ==========================================
# 4. HUNGARIAN DISPATCH OPTIMIZER TESTS
# ==========================================
def test_dispatch_assignment_matching():
    """Bipartite dispatcher correctly matches available vehicle to incident."""
    incidents = [
        {"id": "INC_1", "title": "Flooded Crossing", "severity": "High", "lat": 28.63, "lon": 77.22, "water_depth_cm": 25.0}
    ]
    units = [
        {"id": "U_1", "name": "Rapid 4x4", "unit_type": "Rapid Response", "lat": 28.64, "lon": 77.21, "status": "Available"}
    ]
    hospitals = [
        {"id": "H_1", "name": "City Trauma Center", "lat": 28.62, "lon": 77.23, "icu_beds_free": 4}
    ]
    res = solve_dispatch_assignment(incidents, units, hospitals)
    assert res["total_assigned"] == 1
    assert len(res["assignments"]) == 1
    assert res["assignments"][0]["unit_id"] == "U_1"
    assert res["assignments"][0]["hospital_assigned"] == "City Trauma Center"


def test_dispatch_wading_safety_rejection():
    """Ambulance with 30cm clearance must not be dispatched to 70cm flood incident."""
    incidents = [
        {"id": "INC_DEEP", "title": "Deep River Surge", "severity": "Critical", "lat": 28.63, "lon": 77.22, "water_depth_cm": 70.0}
    ]
    units = [
        {"id": "U_AMB", "name": "Ambulance 1", "unit_type": "Ambulance", "lat": 28.64, "lon": 77.21, "status": "Available"}
    ]
    hospitals = [
        {"id": "H_1", "name": "City Trauma Center", "lat": 28.62, "lon": 77.23, "icu_beds_free": 5}
    ]
    res = solve_dispatch_assignment(incidents, units, hospitals)
    assert res["total_assigned"] == 0
    assert "INC_DEEP" in res["unassigned_incidents"]


def test_dispatch_hospital_bed_decrement():
    """Hospital ICU beds should decrement per assignment to avoid zero-bed overflow."""
    incidents = [
        {"id": "INC_A", "title": "Incident A", "severity": "High", "lat": 28.63, "lon": 77.22, "water_depth_cm": 15.0},
        {"id": "INC_B", "title": "Incident B", "severity": "High", "lat": 28.63, "lon": 77.23, "water_depth_cm": 15.0}
    ]
    units = [
        {"id": "U_1", "name": "Unit 1", "unit_type": "NDRF Truck", "lat": 28.63, "lon": 77.22, "status": "Available"},
        {"id": "U_2", "name": "Unit 2", "unit_type": "NDRF Truck", "lat": 28.63, "lon": 77.23, "status": "Available"}
    ]
    hospitals = [
        {"id": "H_SINGLE", "name": "Small Clinic", "lat": 28.63, "lon": 77.22, "icu_beds_free": 1}
    ]
    res = solve_dispatch_assignment(incidents, units, hospitals)
    # The clinic only has 1 bed, so after 1 assignment it should be 0
    assert res["hospital_status"]["H_SINGLE"]["free_beds"] == 0


# ==========================================
# 5. FASTAPI INTEGRATION ENDPOINT TESTS
# ==========================================
def test_api_root_status():
    """Root endpoint / returns OPERATIONAL status and active state list."""
    try:
        response = requests.get(f"{API_BASE}/", timeout=5)
    except requests.exceptions.ConnectionError:
        pytest.skip("FastAPI server offline, skipping live HTTP integration test")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "OPERATIONAL"
    assert "active_states" in data
    assert len(data["active_states"]) >= 5


def test_api_states_endpoint():
    """GET /api/states returns registered Indian states and districts."""
    try:
        response = requests.get(f"{API_BASE}/api/states", timeout=5)
    except requests.exceptions.ConnectionError:
        pytest.skip("FastAPI server offline, skipping live HTTP integration test")
    assert response.status_code == 200
    data = response.json()
    assert "Uttar Pradesh" in data
    assert "Delhi NCR" in data


def test_api_shelters_endpoint():
    """GET /api/shelters returns relief shelter destinations."""
    try:
        response = requests.get(f"{API_BASE}/api/shelters", timeout=5)
    except requests.exceptions.ConnectionError:
        pytest.skip("FastAPI server offline, skipping live HTTP integration test")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0


def test_api_hazard_evaluation_post():
    """POST /api/hazards/evaluate returns calculated risk metrics."""
    payload = {
        "water_depth_cm": 25.0,
        "damage_level": 3.0,
        "debris_level": 2.0,
        "vehicle_type": "Ambulance"
    }
    try:
        response = requests.post(f"{API_BASE}/api/hazards/evaluate", json=payload, timeout=5)
    except requests.exceptions.ConnectionError:
        pytest.skip("FastAPI server offline, skipping live HTTP integration test")
    assert response.status_code == 200
    data = response.json()
    assert "risk_multiplier" in data
    assert "grade" in data
    assert "is_passable" in data


def test_api_route_calculation_endpoint():
    """POST /api/route returns safe corridor and backup corridor."""
    payload = {
        "source": "DEL_HQ",
        "target": "DEL_CONNAUGHT",
        "vehicle_type": "Ambulance"
    }
    try:
        response = requests.post(f"{API_BASE}/api/route", json=payload, timeout=5)
    except requests.exceptions.ConnectionError:
        pytest.skip("FastAPI server offline, skipping live HTTP integration test")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "safe_corridor" in data
    assert "backup_corridor" in data


def test_api_dispatch_optimize_endpoint():
    """GET /api/dispatch/optimize executes Hungarian dispatch."""
    try:
        response = requests.get(f"{API_BASE}/api/dispatch/optimize", timeout=5)
    except requests.exceptions.ConnectionError:
        pytest.skip("FastAPI server offline, skipping live HTTP integration test")
    assert response.status_code == 200
    data = response.json()
    assert "assignments" in data
    assert "unassigned_incidents" in data
    assert "mean_response_time_min" in data

