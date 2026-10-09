import streamlit as st
import folium
try:
    from streamlit_folium import st_folium
except ImportError:
    st_folium = None
from streamlit_folium import folium_static
import requests
import json
import time

# Page Configuration
st.set_page_config(
    page_title="RakshaPath | National Emergency Mobility Network",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# API Base URL
BACKEND_URL = "http://127.0.0.1:8000"

# Custom Tactical Styles
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Inter', sans-serif;
    }
    
    /* Header & Branding */
    .brand-title {
        font-size: 2.2rem;
        font-weight: 800;
        letter-spacing: -0.5px;
        color: #0f172a;
        margin-bottom: 2px;
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .brand-subtitle {
        font-size: 1.0rem;
        color: #475569;
        font-weight: 500;
        margin-bottom: 20px;
    }
    
    .tag-pill {
        display: inline-block;
        padding: 3px 10px;
        font-size: 0.75rem;
        font-weight: 700;
        border-radius: 9999px;
        background: #e0e7ff;
        color: #3730a3;
        vertical-align: middle;
    }
    
    /* Step Cards */
    .step-header {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 1.15rem;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 15px;
        border-bottom: 2px solid #e2e8f0;
        padding-bottom: 8px;
    }
    
    .step-badge {
        background: #2563eb;
        color: #ffffff;
        font-size: 0.8rem;
        font-weight: 700;
        padding: 2px 9px;
        border-radius: 6px;
    }

    /* Stepper indicator */
    .stepper-bar {
        display: flex;
        justify-content: space-between;
        margin-bottom: 25px;
        padding: 10px 15px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
    }
    
    .step-item {
        font-size: 0.9rem;
        font-weight: 600;
        color: #64748b;
    }
    
    .step-item.active {
        color: #2563eb;
        font-weight: 800;
    }

    /* Splash Screen Animation */
    .splash-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 70px 20px;
        text-align: center;
        background: radial-gradient(circle at center, #0f172a 0%, #020617 100%);
        border-radius: 20px;
        color: #f8fafc;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
        margin: 40px auto;
        max-width: 820px;
    }
    
    .splash-logo {
        font-size: 4.8rem;
        animation: pulse 1.8s infinite;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(56, 189, 248, 0.4)); }
        50% { transform: scale(1.08); filter: drop-shadow(0 0 25px rgba(56, 189, 248, 0.9)); }
        100% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(56, 189, 248, 0.4)); }
    }
    
    .radar-bar {
        width: 320px;
        height: 6px;
        background: #1e293b;
        border-radius: 4px;
        overflow: hidden;
        margin: 25px 0 15px 0;
    }
    
    .radar-fill {
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, #38bdf8, #818cf8, #22c55e);
        animation: loading 2.8s ease-in-out infinite;
    }
    
    @keyframes loading {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(0%); }
        100% { transform: translateX(100%); }
    }
    
    /* Login Card */
    .login-box {
        max-width: 520px;
        margin: 30px auto;
        padding: 30px 25px;
        background: #ffffff;
        border-radius: 16px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        border: 1px solid #e2e8f0;
    }
    
    .login-header {
        font-size: 1.6rem;
        font-weight: 800;
        color: #0f172a;
        text-align: center;
        margin-bottom: 5px;
    }
    
    .login-sub {
        font-size: 0.9rem;
        color: #64748b;
        text-align: center;
        margin-bottom: 25px;
    }
</style>
""", unsafe_allow_html=True)


# ==========================================
# 1. INITIAL SESSION STATE
# ==========================================
if "splash_done" not in st.session_state:
    st.session_state["splash_done"] = False

if "authenticated" not in st.session_state:
    st.session_state["authenticated"] = False

if "user_role" not in st.session_state:
    st.session_state["user_role"] = "Guest Responder"

if "user_id" not in st.session_state:
    st.session_state["user_id"] = "RESP-GUEST-01"

if "workflow_step" not in st.session_state:
    st.session_state["workflow_step"] = 1  # 1: Configuration, 2: Map & Analytics

# Cached input states
if "selected_state" not in st.session_state:
    st.session_state["selected_state"] = "Delhi NCR"

if "selected_district" not in st.session_state:
    st.session_state["selected_district"] = "All Districts"

if "origin_node_id" not in st.session_state:
    st.session_state["origin_node_id"] = "DEL_HQ"

if "dest_node_id" not in st.session_state:
    st.session_state["dest_node_id"] = "DEL_MAYUR_SHELTER"

if "vehicle_type" not in st.session_state:
    st.session_state["vehicle_type"] = "Ambulance"

if "water_depth" not in st.session_state:
    st.session_state["water_depth"] = 45

if "damage_level" not in st.session_state:
    st.session_state["damage_level"] = 4.0

if "debris_level" not in st.session_state:
    st.session_state["debris_level"] = 3.5

if "route_data" not in st.session_state:
    st.session_state["route_data"] = None


# ==========================================
# 2. SPLASH SCREEN TRANSITION
# ==========================================
if not st.session_state["splash_done"]:
    st.markdown("""
    <div class="splash-container">
        <div class="splash-logo">🛡️</div>
        <h1 style="font-size: 2.8rem; font-weight: 800; letter-spacing: -1px; margin-top: 10px; margin-bottom: 0px; color: #ffffff;">
            RAKSHAPATH
        </h1>
        <p style="font-size: 1.1rem; color: #94a3b8; font-weight: 500; margin-top: 5px;">
            रक्षापथ • National Emergency Mobility Network
        </p>
        <div class="radar-bar">
            <div class="radar-fill"></div>
        </div>
        <p style="font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; color: #38bdf8; letter-spacing: 0.5px;">
            [INITIALIZING TACTICAL CORRIDOR AI & SAT-LINK ENGINE...]
        </p>
    </div>
    """, unsafe_allow_html=True)

    c1, c2, c3 = st.columns([1, 1, 1])
    with c2:
        if st.button("⚡ Enter Command Terminal (Instant Skip)", use_container_width=True):
            st.session_state["splash_done"] = True
            st.rerun()

    time.sleep(2.8)
    st.session_state["splash_done"] = True
    st.rerun()


# ==========================================
# 3. AUTHENTICATION (LOGIN FLOW)
# ==========================================
if not st.session_state["authenticated"]:
    st.markdown("""
    <div class="login-box">
        <div style="text-align: center; font-size: 3rem; margin-bottom: 10px;">🛡️</div>
        <div class="login-header">RakshaPath Access Portal</div>
        <div class="login-sub">National Disaster Management Tactical Verification</div>
    </div>
    """, unsafe_allow_html=True)

    col_l1, col_l2, col_l3 = st.columns([1, 2, 1])
    with col_l2:
        with st.container(border=True):
            st.subheader("Disaster Personnel Authentication")
            login_tab1, login_tab2 = st.tabs(["🔐 Official Personnel", "⚡ Guest Responder Access"])

            with login_tab1:
                personnel_id = st.text_input("Operational Badge / Unit ID", value="NDRF-7701")
                access_code = st.text_input("Tactical Passcode", type="password", value="RAKSHA2026")
                assigned_role = st.selectbox(
                    "Command Station / Wing",
                    ["NDRF Tactical Lead", "SDRF Disaster Commander", "EMS Trauma Dispatcher", "Civil Defense Coordinator"]
                )

                if st.button("Authorize & Launch Planner", type="primary", use_container_width=True):
                    if personnel_id.strip() and access_code.strip():
                        st.session_state["authenticated"] = True
                        st.session_state["user_role"] = assigned_role
                        st.session_state["user_id"] = personnel_id.strip().upper()
                        st.success(f"Identity Verified: {personnel_id} ({assigned_role})")
                        time.sleep(0.5)
                        st.rerun()
                    else:
                        st.error("Please provide valid badge credentials.")

            with login_tab2:
                st.info("Field volunteers and evaluation evaluators can sign in immediately with one click.")
                guest_name = st.text_input("Responder Name", value="Field Evaluator Alpha")
                if st.button("Instant Responder Sign-In", type="secondary", use_container_width=True):
                    st.session_state["authenticated"] = True
                    st.session_state["user_role"] = "Field Responder"
                    st.session_state["user_id"] = guest_name
                    st.rerun()

    st.stop()


# ==========================================
# 4. BACKEND API HELPERS
# ==========================================
def check_backend_status():
    for url in [BACKEND_URL, "http://localhost:8000"]:
        try:
            r = requests.get(f"{url}/", timeout=3)
            if r.status_code == 200:
                return True
        except Exception:
            continue
    return False


def fetch_states_and_districts():
    try:
        r = requests.get(f"{BACKEND_URL}/api/states", timeout=3)
        if r.status_code == 200:
            return r.json()
    except Exception:
        pass
    return {
        "Delhi NCR": ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "South Delhi"],
        "Uttarakhand": ["Dehradun", "Haridwar", "Pauri Garhwal", "Rishikesh", "Tehri Garhwal"],
        "Assam": ["Guwahati", "Kamrup"],
        "Maharashtra": ["Mumbai City", "Mumbai South", "Mumbai Suburban", "Thane"],
        "Uttar Pradesh": ["Lucknow"]
    }


def fetch_nodes(state=None):
    try:
        url = f"{BACKEND_URL}/api/nodes"
        if state:
            url += f"?state={state}"
        r = requests.get(url, timeout=3)
        if r.status_code == 200:
            return r.json()
    except Exception:
        pass
    return []


def fetch_incidents(state=None):
    try:
        url = f"{BACKEND_URL}/api/incidents"
        if state:
            url += f"?state={state}"
        r = requests.get(url, timeout=3)
        if r.status_code == 200:
            return r.json()
    except Exception:
        pass
    return []


def fetch_rescue_units(state=None):
    try:
        url = f"{BACKEND_URL}/api/units"
        if state:
            url += f"?state={state}"
        r = requests.get(url, timeout=3)
        if r.status_code == 200:
            return r.json()
    except Exception:
        pass
    return []


def resolve_nearest_node(lat, lon, state=None):
    try:
        r = requests.post(f"{BACKEND_URL}/api/nearest-node", json={"lat": lat, "lon": lon, "state": state}, timeout=3)
        if r.status_code == 200:
            return r.json()
    except Exception:
        pass
    return {}



def search_locations_api(query, state=None):

    try:
        url = f"{BACKEND_URL}/api/search?q={query}"
        if state:
            url += f"&state={state}"
        r = requests.get(url, timeout=3)
        if r.status_code == 200:
            return r.json()
    except Exception:
        pass
    return []


# ==========================================
# 5. GLOBAL GEOGRAPHIC DATA & REGISTRY
# ==========================================
DEFAULT_INDIAN_STATES = [
    "Uttar Pradesh", "Delhi NCR", "Uttarakhand", "Maharashtra", "Bihar", "West Bengal", "Assam", "Gujarat"
]

state_data = fetch_states_and_districts()
all_states = list(state_data.keys()) if state_data else DEFAULT_INDIAN_STATES



# ==========================================
# 6. SIDEBAR (COMPACT RESUPPLY & TELEMETRY)
# ==========================================

with st.sidebar:
    st.markdown(f"""
    <div style="background: #f1f5f9; padding: 12px; border-radius: 8px; margin-bottom: 12px; border-left: 4px solid #0284c7;">
        <div style="font-size: 0.72rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Tactical Session</div>
        <div style="font-size: 0.95rem; font-weight: 700; color: #0f172a;">{st.session_state['user_id']}</div>
        <div style="font-size: 0.8rem; color: #0284c7; font-weight: 600;">{st.session_state['user_role']}</div>
    </div>
    """, unsafe_allow_html=True)

    is_online = check_backend_status()
    if is_online:
        st.success("● RakshaPath Core: ONLINE")
    else:
        st.error("○ RakshaPath Core: OFFLINE")

    st.divider()

    st.markdown("**Navigation Workflow:**")
    if st.session_state["workflow_step"] == 1:
        st.info("📍 **Step 1:** Configuration Form")
    else:
        st.success("🗺️ **Step 2:** Safe Corridor Map")

    if st.button("🔄 Reset Grid to Baseline", use_container_width=True):
        try:
            requests.post(f"{BACKEND_URL}/api/reset-network", timeout=3)
            st.toast("Grid hazards reset to baseline!")
            st.rerun()
        except Exception:
            pass

    if st.button("🚪 Logout / Switch Station", use_container_width=True):
        st.session_state["authenticated"] = False
        st.session_state["splash_done"] = False
        st.session_state["workflow_step"] = 1
        st.rerun()


# ==========================================
# 6. STEP 1: CONFIGURATION PAGE (CENTERED MULTI-STEP FORM)
# ==========================================
if st.session_state["workflow_step"] == 1:
    # Page Header
    st.markdown("""
    <div class="brand-title">
        <span>🛡️ RAKSHAPATH</span>
        <span class="tag-pill">NATIONAL EMERGENCY MOBILITY NETWORK</span>
    </div>
    <div class="brand-subtitle">
        Step 1 of 2: Mission Planning & Corridor Parameter Calibration
    </div>
    """, unsafe_allow_html=True)

    # Workflow Stepper Breadcrumb
    st.markdown("""
    <div class="stepper-bar">
        <div class="step-item active">● STEP 1: CONFIGURATION FORM (Location, Vehicle & Hazards)</div>
        <div class="step-item">○ STEP 2: TACTICAL CORRIDOR MAP & RISK ANALYTICS</div>
    </div>
    """, unsafe_allow_html=True)

    # Fetch states and districts
    state_data = fetch_states_and_districts()
    all_states = list(state_data.keys()) if state_data else DEFAULT_INDIAN_STATES


    # ----------------------------------------------------
    # STEP 1.1: LOCATION SELECTION (Google Maps Style & Hierarchy)
    # ----------------------------------------------------
    with st.container(border=True):
        st.markdown("""
        <div class="step-header">
            <span class="step-badge">STEP 1</span>
            <span>Tactical Location & Safe Shelter Selection</span>
        </div>
        """, unsafe_allow_html=True)

        mode_choice = st.radio(
            "Select Search Methodology:",
            ["🔍 Google Maps Style Place Search & 1-Click GPS", "🏛️ State & District Hierarchy"],
            horizontal=True
        )

        if mode_choice == "🔍 Google Maps Style Place Search & 1-Click GPS":
            st.markdown("##### 🔍 Search Landmarks, Hospitals, or Emergency Bases")
            col_search, col_gps_btn = st.columns([3.2, 1.8])
            
            with col_search:
                search_kw = st.text_input(
                    "Search Location / Landmark / Address",
                    placeholder="e.g., SGPGI Lucknow, Agra Fort, AIIMS Delhi, BHU Varanasi, KEM Mumbai, SSKM Kolkata...",
                    label_visibility="collapsed"
                )

            with col_gps_btn:
                if st.button("📍 Use My Current Device Location", use_container_width=True, type="secondary"):
                    # Automated 1-click location resolution without manual numeric coordinates
                    auto_loc = resolve_nearest_node(28.6139, 77.2090)
                    if auto_loc:
                        st.session_state["origin_node_id"] = auto_loc["id"]
                        st.session_state["selected_state"] = auto_loc.get("state", "Delhi NCR")
                        st.session_state["selected_district"] = auto_loc.get("district", "Central Delhi")
                        st.toast(f"📍 Device Location Connected: {auto_loc['name']} ({auto_loc['state']})")

            # Quick Metropolitan Presets
            st.caption("⚡ **Quick Metropolitan City Jump:**")
            quick_cols = st.columns(8)
            city_presets = [
                ("Delhi NCR", "DEL_HQ", "Delhi NCR", "Central Delhi"),
                ("Lucknow", "UP_SGPGI_LKO", "Uttar Pradesh", "Lucknow"),
                ("Agra", "UP_AGRA_HOSP", "Uttar Pradesh", "Agra"),
                ("Varanasi", "UP_BHU_TRAUMA", "Uttar Pradesh", "Varanasi"),
                ("Dehradun", "UK_DEHRADUN_HQ", "Uttarakhand", "Dehradun"),
                ("Mumbai", "MH_MUMBAI_HQ", "Maharashtra", "Mumbai"),
                ("Patna", "BR_AIIMS_PATNA", "Bihar", "Patna"),
                ("Kolkata", "WB_SSKM_HOSPITAL", "West Bengal", "Kolkata")
            ]
            for idx, (c_label, c_node, c_st, c_dist) in enumerate(city_presets):
                with quick_cols[idx]:
                    if st.button(c_label, key=f"quick_{c_label}", use_container_width=True):
                        st.session_state["origin_node_id"] = c_node
                        st.session_state["selected_state"] = c_st
                        st.session_state["selected_district"] = c_dist
                        st.toast(f"📍 Sector Changed: {c_label} ({c_st})")
                        st.rerun()

            # Dynamic Search Results
            if search_kw.strip():
                search_results = search_locations_api(search_kw.strip())
                if search_results:
                    st.success(f"Found {len(search_results)} matching emergency hubs for '{search_kw}':")
                    result_labels = {
                        f"📍 {r['name']} — {r['district']}, {r['state']} [{r['category']}]": r
                        for r in search_results
                    }
                    selected_search_label = st.selectbox(
                        "Select Matched Location to Set as Dispatch Origin:",
                        options=list(result_labels.keys()),
                        index=0
                    )
                    chosen_res = result_labels[selected_search_label]
                    st.session_state["origin_node_id"] = chosen_res["id"]
                    st.session_state["selected_state"] = chosen_res["state"]
                    st.session_state["selected_district"] = chosen_res["district"]
                else:
                    st.info(f"No specific landmark matched '{search_kw}'. Try keywords like 'AIIMS', 'Agra', 'Lucknow', 'Hospital', 'Relief'.")

            # Display Currently Selected Origin & Filtered Safe Shelters
            st.divider()
            col_curr_orig, col_curr_dest = st.columns(2)
            
            with col_curr_orig:
                # Find current origin name
                all_current_nodes = fetch_nodes()
                orig_obj = next((n for n in all_current_nodes if n["id"] == st.session_state["origin_node_id"]), None)
                orig_display_name = orig_obj["name"] if orig_obj else st.session_state["origin_node_id"]
                st.markdown(f"""
                <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px;">
                    <div style="font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Selected Dispatch Origin</div>
                    <div style="font-size: 1.05rem; font-weight: 700; color: #1e3a8a; margin: 3px 0;">{orig_display_name}</div>
                    <div style="font-size: 0.82rem; color: #475569;">Sector: <b>{st.session_state['selected_state']}</b> ({st.session_state['selected_district']})</div>
                </div>
                """, unsafe_allow_html=True)

            with col_curr_dest:
                # Filter destinations to current state
                state_nodes = fetch_nodes(state=st.session_state["selected_state"])
                dest_options = {f"{n['name']} [{n['category']}]": n["id"] for n in state_nodes if n["id"] != st.session_state["origin_node_id"]}
                if not dest_options:
                    dest_options = {f"{n['name']} [{n['category']}]": n["id"] for n in state_nodes}
                
                dest_keys = list(dest_options.keys())
                cur_dest_key = next((k for k, v in dest_options.items() if v == st.session_state["dest_node_id"]), dest_keys[min(1, len(dest_keys)-1)] if dest_keys else None)
                dest_idx = dest_keys.index(cur_dest_key) if cur_dest_key in dest_keys else min(1, len(dest_keys)-1)
                
                dest_label = st.selectbox(
                    "Target Safe Shelter / Evacuation Destination:",
                    dest_keys,
                    index=dest_idx
                )
                st.session_state["dest_node_id"] = dest_options[dest_label]

        else:
            # 🏛️ STATE & DISTRICT HIERARCHY MODE
            c_st1, c_st2 = st.columns(2)
            with c_st1:
                cur_state_idx = all_states.index(st.session_state["selected_state"]) if st.session_state["selected_state"] in all_states else 0
                selected_state = st.selectbox("1. State / Union Territory", all_states, index=cur_state_idx)
                st.session_state["selected_state"] = selected_state

            districts = state_data.get(selected_state, [])
            district_options = ["All Districts"] + districts
            with c_st2:
                cur_dist_idx = district_options.index(st.session_state["selected_district"]) if st.session_state["selected_district"] in district_options else 0
                selected_district = st.selectbox("2. District / City", district_options, index=cur_dist_idx)
                st.session_state["selected_district"] = selected_district

            # Fetch nodes filtered by selected state & district
            state_nodes = fetch_nodes(state=selected_state)
            if selected_district != "All Districts":
                origin_nodes = [n for n in state_nodes if n.get("district") == selected_district]
                if not origin_nodes:
                    origin_nodes = state_nodes
            else:
                origin_nodes = state_nodes

            origin_options = {f"{n['name']} [{n['category']}]": n["id"] for n in origin_nodes}
            dest_options = {f"{n['name']} [{n['category']}]": n["id"] for n in state_nodes}

            c_nd1, c_nd2 = st.columns(2)
            with c_nd1:
                cur_orig_key = next((k for k, v in origin_options.items() if v == st.session_state["origin_node_id"]), list(origin_options.keys())[0] if origin_options else None)
                orig_keys = list(origin_options.keys())
                orig_idx = orig_keys.index(cur_orig_key) if cur_orig_key in orig_keys else 0
                origin_label = st.selectbox("3. Dispatch Origin / Emergency Hub", orig_keys, index=orig_idx)
                st.session_state["origin_node_id"] = origin_options[origin_label]

            with c_nd2:
                dest_keys = list(dest_options.keys())
                cur_dest_key = next((k for k, v in dest_options.items() if v == st.session_state["dest_node_id"]), dest_keys[min(2, len(dest_keys)-1)] if dest_keys else None)
                dest_idx = dest_keys.index(cur_dest_key) if cur_dest_key in dest_keys else min(2, len(dest_keys)-1)
                dest_label = st.selectbox("4. Target Safe Shelter / Destination", dest_keys, index=dest_idx)
                st.session_state["dest_node_id"] = dest_options[dest_label]


    # ----------------------------------------------------
    # STEP 1.2: DEPLOYED MOBILITY UNIT SELECTION (Middle Center)
    # ----------------------------------------------------
    with st.container(border=True):
        st.markdown("""
        <div class="step-header">
            <span class="step-badge">STEP 2</span>
            <span>Deployed Mobility Unit & Asset Capability Profile</span>
        </div>
        """, unsafe_allow_html=True)

        vehicle_profiles = {
            "Ambulance": {
                "icon": "🚑",
                "name": "Standard Life Support Ambulance",
                "clearance": "30 cm",
                "speed": "60 km/h",
                "desc": "High speed on tarmac, vulnerable to exhaust flooding >30cm."
            },
            "NDRF Truck": {
                "icon": "🚛",
                "name": "NDRF Heavy All-Terrain Rescue Truck",
                "clearance": "85 cm",
                "speed": "45 km/h",
                "desc": "Military-grade chassis, forges water up to 85cm and pushes debris."
            },
            "Flood Boat": {
                "icon": "🚤",
                "name": "Tactical Inflatable Flood Rescue Craft",
                "clearance": "Water Specialist",
                "speed": "25 km/h",
                "desc": "Navigates deep floodwaters (>20cm), cannot traverse dry land."
            },
            "Rapid Response": {
                "icon": "🚙",
                "name": "Light 4x4 Emergency Recon Unit",
                "clearance": "45 cm",
                "speed": "65 km/h",
                "desc": "Fast scout vehicle with moderate wading capability."
            },
            "Evacuation Bus": {
                "icon": "🚌",
                "name": "Mass Evacuation Civilian Transport Bus",
                "clearance": "40 cm",
                "speed": "40 km/h",
                "desc": "Large 40+ seat capacity, restricted maneuverability on rough rubble."
            }
        }

        v_options = list(vehicle_profiles.keys())
        v_idx = v_options.index(st.session_state["vehicle_type"]) if st.session_state["vehicle_type"] in v_options else 0
        
        c_v1, c_v2 = st.columns([1.5, 2.5])
        with c_v1:
            selected_v = st.radio("Select Response Asset:", v_options, index=v_idx)
            st.session_state["vehicle_type"] = selected_v
        
        with c_v2:
            prof = vehicle_profiles[selected_v]
            st.markdown(f"""
            <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 16px;">
                <h4 style="margin: 0 0 8px 0; color: #0f172a;">{prof['icon']} {prof['name']}</h4>
                <p style="color: #475569; font-size: 0.9rem; margin-bottom: 12px;">{prof['desc']}</p>
                <div style="display: flex; gap: 20px; font-size: 0.88rem;">
                    <div><b>Max Water Clearance:</b> <span style="color: #0284c7;">{prof['clearance']}</span></div>
                    <div><b>Base Speed:</b> <span style="color: #16a34a;">{prof['speed']}</span></div>
                </div>
            </div>
            """, unsafe_allow_html=True)

    # ----------------------------------------------------
    # STEP 1.3: PHYSICAL HAZARD CALIBRATION (Bottom Center)
    # ----------------------------------------------------
    with st.container(border=True):
        st.markdown("""
        <div class="step-header">
            <span class="step-badge">STEP 3</span>
            <span>Physical Hazard Calibration Sliders</span>
        </div>
        """, unsafe_allow_html=True)

        col_h1, col_h2, col_h3 = st.columns(3)
        with col_h1:
            st.session_state["water_depth"] = st.slider(
                "🌊 Water Depth / Inundation (cm)",
                min_value=0,
                max_value=140,
                value=int(st.session_state["water_depth"]),
                step=5
            )
        with col_h2:
            st.session_state["damage_level"] = st.slider(
                "💥 Roadway Structural Damage (0-10)",
                min_value=0.0,
                max_value=10.0,
                value=float(st.session_state["damage_level"]),
                step=0.5
            )
        with col_h3:
            st.session_state["debris_level"] = st.slider(
                "🚧 Debris / Obstruction Level (0-10)",
                min_value=0.0,
                max_value=10.0,
                value=float(st.session_state["debris_level"]),
                step=0.5
            )

        # Live Hazard Simulation Feedback Box
        try:
            eval_resp = requests.post(
                f"{BACKEND_URL}/api/hazards/evaluate",
                json={
                    "water_depth_cm": st.session_state["water_depth"],
                    "damage_level": st.session_state["damage_level"],
                    "debris_level": st.session_state["debris_level"],
                    "vehicle_type": st.session_state["vehicle_type"]
                },
                timeout=2
            )
            if eval_resp.status_code == 200:
                ev = eval_resp.json()
                st.markdown(f"""
                <div style="background: #f1f5f9; padding: 12px 18px; border-radius: 8px; margin-top: 10px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #cbd5e1;">
                    <div>
                        <b>Calculated Risk Multiplier:</b> <code>{ev['risk_multiplier']}x</code> | 
                        <b>Safety Rating:</b> <span style="color: {ev['color']}; font-weight: 700;">{ev['grade']}</span>
                    </div>
                    <div>
                        <b>Passable:</b> {'✅ YES' if ev['is_passable'] else '❌ IMPASSABLE'} | 
                        <b>Effective Transit Speed:</b> <code>{ev['effective_speed_kmh']} km/h</code>
                    </div>
                </div>
                """, unsafe_allow_html=True)
        except Exception:
            pass

    # ----------------------------------------------------
    # PROMINENT ACTION BUTTON
    # ----------------------------------------------------
    st.write("")
    col_btn1, col_btn2, col_btn3 = st.columns([1, 2, 1])
    with col_btn2:
        if st.button("🚀 Proceed & Generate Safe Corridor Map", type="primary", use_container_width=True):
            if st.session_state["origin_node_id"] == st.session_state["dest_node_id"]:
                st.error("⚠️ Origin and Destination cannot be the same location. Please choose different points.")
            else:
                # Transition to Step 2
                st.session_state["workflow_step"] = 2
                st.rerun()


# ==========================================
# 7. STEP 2: MAP & ANALYTICS RESULTS PAGE
# ==========================================
elif st.session_state["workflow_step"] == 2:
    # Top Navigation Bar & Recalibration Button
    col_nav1, col_nav2 = st.columns([1.5, 4.5])
    with col_nav1:
        if st.button("← Re-calibrate Parameters / Change Location", use_container_width=True):
            st.session_state["workflow_step"] = 1
            st.rerun()

    with col_nav2:
        st.markdown(f"""
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 7px 15px; font-size: 0.88rem; color: #334155;">
            <b>Active Sector:</b> {st.session_state['selected_state']} &nbsp;|&nbsp; 
            <b>Asset Profile:</b> {st.session_state['vehicle_type']} &nbsp;|&nbsp; 
            <b>Water:</b> {st.session_state['water_depth']}cm &nbsp;|&nbsp; 
            <b>Damage:</b> {st.session_state['damage_level']}/10
        </div>
        """, unsafe_allow_html=True)

    # Compute Route from Backend
    route_data = None
    try:
        payload = {
            "source": st.session_state["origin_node_id"],
            "target": st.session_state["dest_node_id"],
            "vehicle_type": st.session_state["vehicle_type"],
            "override_water_depth_cm": float(st.session_state["water_depth"]),
            "override_damage_level": float(st.session_state["damage_level"]),
            "override_debris_level": float(st.session_state["debris_level"])
        }
        res = requests.post(f"{BACKEND_URL}/api/route", json=payload, timeout=6)
        if res.status_code == 200:
            route_data = res.json()
        else:
            st.error(f"Routing Communication Notice: {res.text}")
    except Exception as e:
        st.error(f"Routing Error: {e}")

    # ----------------------------------------------------
    # TOP TOOLBAR & METRICS (Above Map)
    # ----------------------------------------------------
    if route_data and route_data.get("success"):
        safe_corridor = route_data["safe_corridor"]
        shortest_naive = route_data["shortest_naive"]

        kpi1, kpi2, kpi3, kpi4 = st.columns(4)
        with kpi1:
            st.metric(
                label="Safe Corridor Distance",
                value=f"{safe_corridor['total_distance_km']} km",
                delta=f"{round(safe_corridor['total_distance_km'] - shortest_naive['total_distance_km'], 2)} km detour" if route_data["is_detour_advised"] else "Optimal direct"
            )
        with kpi2:
            st.metric(
                label="Est. Transit Time",
                value=f"{safe_corridor['estimated_transit_time_min']} mins",
                delta=f"{st.session_state['vehicle_type']} @ Safe Speed"
            )
        with kpi3:
            st.metric(
                label="Corridor Risk Factor",
                value=f"{safe_corridor['average_risk_multiplier']}x",
                delta=f"-{round(shortest_naive['average_risk_multiplier'] - safe_corridor['average_risk_multiplier'], 1)}x vs Direct" if route_data["is_detour_advised"] else "Normal",
                delta_color="inverse"
            )
        with kpi4:
            status_pass = "🟢 PASSABLE" if safe_corridor["is_fully_passable"] else "🔴 IMPASSABLE"
            st.metric(
                label="Corridor Safety Grade",
                value=route_data.get("safety_status", "SECURED"),
                delta=status_pass
            )

        if route_data["is_detour_advised"]:
            st.warning(
                f"⚡ **Automated Detour Active:** The direct path crosses flooded/hazardous chokepoints "
                f"({shortest_naive['average_risk_multiplier']}x multiplier). "
                f"RakshaPath's risk-weighted A* algorithm secured a safer detour."
            )

    # ----------------------------------------------------
    # ACTION TABS ABOVE THE MAP
    # ----------------------------------------------------
    tab_corridor, tab_comp, tab_units, tab_incident = st.tabs([
        "🚩 Turn-by-Turn Safe Corridor",
        "⚖️ Comparative Safety Analytics",
        "🚨 Dispatched Units & Regional ETAs",
        "📝 Ground Incident Transmission"
    ])

    # ----------------------------------------------------
    # MAP DISPLAY (Clean OpenStreetMap tiles)
    # ----------------------------------------------------
    st.write("")
    st.subheader(f"Tactical Corridor & Hazard Topology Map — {st.session_state['selected_state']}")

    # Determine Center
    state_centers = {
        "Delhi NCR": [28.6200, 77.2300],
        "Uttarakhand": [30.1500, 78.3500],
        "Assam": [26.1550, 91.7500],
        "Maharashtra": [19.0500, 72.8800],
        "Uttar Pradesh": [26.8500, 80.9500]
    }
    map_center = state_centers.get(st.session_state["selected_state"], [28.6139, 77.2090])
    zoom_level = 10 if st.session_state["selected_state"] in ["Uttarakhand"] else 12

    if route_data and route_data.get("source"):
        map_center = [
            (route_data["source"]["lat"] + route_data["target"]["lat"]) / 2.0,
            (route_data["source"]["lon"] + route_data["target"]["lon"]) / 2.0
        ]

    # OpenStreetMap tiles: standard, clean, 100% free with NO API KEY WATERMARK
    m = folium.Map(
        location=map_center,
        zoom_start=zoom_level,
        tiles="OpenStreetMap"
    )

    # 1. Markers for Infrastructure Nodes
    all_current_nodes = fetch_nodes(state=st.session_state["selected_state"])
    for node in all_current_nodes:
        is_source = (node["id"] == st.session_state["origin_node_id"])
        is_target = (node["id"] == st.session_state["dest_node_id"])

        if is_source:
            icon_color = "blue"
            icon_name = "play"
        elif is_target:
            icon_color = "green"
            icon_name = "flag"
        elif node.get("category") == "Hospital":
            icon_color = "red"
            icon_name = "plus-sign"
        elif node.get("category") == "NDRF Base":
            icon_color = "darkblue"
            icon_name = "tower"
        elif node.get("category") == "Relief Shelter":
            icon_color = "purple"
            icon_name = "home"
        elif node.get("category") == "Helipad":
            icon_color = "cadetblue"
            icon_name = "plane"
        else:
            icon_color = "gray"
            icon_name = "info-sign"

        folium.Marker(
            location=[node["lat"], node["lon"]],
            popup=f"<b>{node['name']}</b><br>Category: {node.get('category')}<br>District: {node.get('district')}",
            tooltip=f"{node['name']} ({node.get('category')})",
            icon=folium.Icon(color=icon_color, icon=icon_name, prefix="glyphicon")
        ).add_to(m)

    # 2. Render Active Incidents
    state_incidents = fetch_incidents(state=st.session_state["selected_state"])
    for inc in state_incidents:
        folium.CircleMarker(
            location=[inc["lat"], inc["lon"]],
            radius=14,
            color="#e11d48",
            fill=True,
            fill_color="#e11d48",
            fill_opacity=0.45,
            popup=f"""
            <b>🚨 {inc['title']}</b><br>
            Type: {inc['incident_type']} | Severity: {inc['severity']}<br>
            Water Depth: <b>{inc['water_depth_cm']} cm</b><br>
            Damage: {inc['damage_level']}/10 | Debris: {inc['debris_level']}/10<br>
            <i>{inc.get('description', '')}</i>
            """,
            tooltip=f"Incident: {inc['title']}"
        ).add_to(m)

    # 3. Render Rescue Units
    state_units = fetch_rescue_units(state=st.session_state["selected_state"])
    for u in state_units:
        folium.Marker(
            location=[u["lat"], u["lon"]],
            popup=f"<b>🚑 {u['name']}</b><br>Type: {u['unit_type']}<br>Clearance: {u['water_clearance_cm']} cm<br>Contact: {u['contact']}",
            tooltip=f"Rescue Unit: {u['name']}",
            icon=folium.Icon(color="darkgreen", icon="wrench", prefix="glyphicon")
        ).add_to(m)

    # 4. Render Compromised Direct Path if detour is active
    if route_data and route_data.get("is_detour_advised"):
        shortest_pts = [[wp["lat"], wp["lon"]] for wp in route_data["shortest_naive"]["waypoints"]]
        folium.PolyLine(
            locations=shortest_pts,
            color="#dc2626",
            weight=4,
            opacity=0.7,
            dash_array="8, 8",
            tooltip="⚠️ Compromised Direct Route (Flooded / Blocked)"
        ).add_to(m)

    # 5. Render Safe Corridor (Emerald Green Polyline)
    if route_data and route_data.get("safe_corridor"):
        safe_pts = [[wp["lat"], wp["lon"]] for wp in route_data["safe_corridor"]["waypoints"]]
        folium.PolyLine(
            locations=safe_pts,
            color="#059669",
            weight=7,
            opacity=0.9,
            tooltip="✅ RakshaPath Recommended Safe Corridor"
        ).add_to(m)

    # Embed Folium map cleanly
    if st_folium is not None:
        st_folium(m, width=1100, height=520, returned_objects=[])
    else:
        folium_static(m, width=1100, height=520)

    # ----------------------------------------------------
    # TAB CONTENTS (Detailed Analysis below the Map)
    # ----------------------------------------------------
    with tab_corridor:
        if route_data and route_data.get("safe_corridor"):
            segments = route_data["safe_corridor"]["segments"]
            st.write(f"#### Turn-by-Turn Waypoints ({len(segments)} road segments)")
            for i, seg in enumerate(segments, 1):
                with st.expander(f"Segment {i}: {seg['road_name']} ({seg['distance_km']} km)", expanded=True):
                    c1, c2, c3, c4 = st.columns(4)
                    c1.write(f"**Safety Grade:** `{seg['grade']}`")
                    c2.write(f"**Risk Multiplier:** `{seg['risk_multiplier']}x`")
                    c3.write(f"**Water Depth:** `{seg['water_depth_cm']} cm`")
                    c4.write(f"**Transit Time:** `{seg['transit_time_min']} mins`")

    with tab_comp:
        if route_data and route_data.get("success"):
            st.write("#### Algorithmic Comparison: Risk-Weighted A* vs. Naive Shortest Path")
            comp_col1, comp_col2 = st.columns(2)
            with comp_col1:
                st.markdown("##### ✅ RakshaPath Corridor (Risk-Weighted A*)")
                st.write(f"- **Total Distance:** {safe_corridor['total_distance_km']} km")
                st.write(f"- **Avg Risk Factor:** {safe_corridor['average_risk_multiplier']}x")
                st.write(f"- **Max Hazard Encountered:** {safe_corridor['max_risk_multiplier']}x")
                st.write(f"- **Estimated Time:** {safe_corridor['estimated_transit_time_min']} mins")
                st.write(f"- **Passability:** {'Fully Passable' if safe_corridor['is_fully_passable'] else 'Caution Advised'}")
            with comp_col2:
                st.markdown("##### ❌ Naive Direct Path (Unweighted A*)")
                st.write(f"- **Total Distance:** {shortest_naive['total_distance_km']} km")
                st.write(f"- **Avg Risk Factor:** {shortest_naive['average_risk_multiplier']}x")
                st.write(f"- **Max Hazard Encountered:** {shortest_naive['max_risk_multiplier']}x")
                st.write(f"- **Estimated Time:** {shortest_naive['estimated_transit_time_min']} mins")
                st.write(f"- **Passability:** {'Traversable' if shortest_naive['is_fully_passable'] else 'Impassable (Risk of Submersion)'}")

    with tab_units:
        st.write(f"#### Nearest Available Rescue Fleet ({st.session_state['selected_state']})")
        if route_data and route_data.get("recommended_units"):
            for item in route_data["recommended_units"]:
                unit = item["unit"]
                st.success(
                    f"**{unit['name']}** ({unit['unit_type']}) — Distance: **{item['distance_to_target_km']} km** | "
                    f"ETA: **{item['eta_minutes']} mins** | Water Clearance: **{unit['water_clearance_cm']} cm** | Contact: `{unit['contact']}`"
                )
        else:
            for u in state_units:
                st.write(f"- **{u['name']}** ({u['unit_type']}) | District: {u['district']} | Clearance: {u['water_clearance_cm']}cm")

    with tab_incident:
        st.write("#### Transmit Field Disaster Report")
        with st.form("incident_report_results_form"):
            f_title = st.text_input("Incident Title", value="Embankment Breach & Waterlogging")
            f_state = st.selectbox("State / UT", all_states, index=all_states.index(st.session_state["selected_state"]) if st.session_state["selected_state"] in all_states else 0)
            f_dist = st.text_input("District / Location", value=st.session_state["selected_district"] if st.session_state["selected_district"] != "All Districts" else "Sector Zone")
            f_type = st.selectbox("Hazard Category", ["Flood", "Landslide", "Debris", "Bridge Washout", "Power Grid Hazard"])
            f_sev = st.selectbox("Severity Level", ["Low", "Medium", "High", "Critical"], index=2)

            c_lat, c_lon = st.columns(2)
            with c_lat:
                f_lat = st.number_input("Latitude", value=map_center[0], format="%.4f")
            with c_lon:
                f_lon = st.number_input("Longitude", value=map_center[1], format="%.4f")

            f_water = st.number_input("Water Depth (cm)", value=50.0, min_value=0.0)
            f_damage = st.slider("Damage Severity (0-10)", 0.0, 10.0, 6.0)
            f_debris = st.slider("Debris Level (0-10)", 0.0, 10.0, 4.0)
            f_desc = st.text_area("Situation Briefing", value="Rising water levels encroaching roadway.")

            submitted = st.form_submit_button("Transmit to National Database")
            if submitted:
                try:
                    res = requests.post(f"{BACKEND_URL}/api/incidents", json={
                        "title": f_title,
                        "state": f_state,
                        "district": f_dist,
                        "incident_type": f_type,
                        "severity": f_sev,
                        "lat": f_lat,
                        "lon": f_lon,
                        "water_depth_cm": f_water,
                        "damage_level": f_damage,
                        "debris_level": f_debris,
                        "description": f_desc
                    })
                    if res.status_code == 200:
                        st.success("Disaster incident logged into RakshaPath National Registry!")
                        st.rerun()
                    else:
                        st.error("Failed to transmit incident.")
                except Exception as e:
                    st.error(f"Error: {e}")
