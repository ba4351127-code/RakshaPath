import React, { useState, useEffect, useCallback } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MapView from './components/MapView';
import TimelineControl from './components/TimelineControl';
import DetailedReportSection from './components/DetailedReportSection';
import NationalOverviewModal from './components/NationalOverviewModal';
import DispatchModal from './components/DispatchModal';
import CrewMobileModal from './components/CrewMobileModal';
import SimulationModal from './components/SimulationModal';
import GuideModal from './components/GuideModal';
import { 
  fetchStates, 
  fetchNodes, 
  fetchShelters, 
  fetchHazards, 
  fetchUnits, 
  findNearestNode, 
  evaluateHazardRisk, 
  calculateRoute, 
  resetNetworkGrid,
  subscribeBackendHealth
} from './services/api';

export default function App() {
  // STAGE 1: User Role & Onboarding State (null shows Welcome Screen)
  const [userRole, setUserRole] = useState(null);

  // Backend connection state
  const [backendState, setBackendState] = useState({ isOnline: false, mode: 'Initializing...' });

  // Navigation & Hierarchy State (defaults to Prayagraj Pilot focus)
  const [statesData, setStatesData] = useState({});
  const [selectedState, setSelectedState] = useState('Uttar Pradesh');
  const [selectedDistrict, setSelectedDistrict] = useState('Prayagraj');

  // Network Nodes & Selection
  const [allNodes, setAllNodes] = useState([]);
  const [originNodes, setOriginNodes] = useState([]);
  const [destNodes, setDestNodes] = useState([]);
  const [selectedOrigin, setSelectedOrigin] = useState('UP_PRY_SANGAM_CHOKE');
  const [selectedDest, setSelectedDest] = useState('UP_PRY_SRN_HOSP');

  // Vehicle Profile
  const [vehicleType, setVehicleType] = useState('Ambulance');

  // Physical Hazard Calibration Sliders
  const [waterDepth, setWaterDepth] = useState(45);
  const [damageLevel, setDamageLevel] = useState(4.0);
  const [debrisLevel, setDebrisLevel] = useState(3.5);
  const [hazardEvaluation, setHazardEvaluation] = useState(null);

  // Predictive Flood Timeline (0 - 6 Hours) & Scenarios
  const [forecastHour, setForecastHour] = useState(0);
  const [scenarioId, setScenarioId] = useState('heavy');

  // Active Incidents & Fleet
  const [hazards, setHazards] = useState([]);
  const [units, setUnits] = useState([]);

  // Computed Dual Corridor Telemetry
  const [routeData, setRouteData] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Modals state
  const [showNationalOverview, setShowNationalOverview] = useState(false);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [showCrewMobileModal, setShowCrewMobileModal] = useState(false);
  const [showSimulationModal, setShowSimulationModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  // 1. Subscribe to Backend Connectivity Status
  useEffect(() => {
    const unsub = subscribeBackendHealth(setBackendState);
    return unsub;
  }, []);

  // 2. Initial Data Loading
  useEffect(() => {
    async function initData() {
      const sData = await fetchStates();
      setStatesData(sData);
      const hList = await fetchHazards();
      setHazards(hList);
      const uList = await fetchUnits();
      setUnits(uList);
    }
    initData();
  }, []);

  // 3. Load Nodes & Shelters when State / District changes
  useEffect(() => {
    async function loadSectorNodes() {
      const nodes = await fetchNodes(selectedState);
      setAllNodes(nodes);

      // Filter Origins
      let filteredOrigins = nodes;
      if (selectedDistrict && selectedDistrict !== 'All Districts') {
        filteredOrigins = nodes.filter((n) => n.district === selectedDistrict);
        if (filteredOrigins.length === 0) filteredOrigins = nodes;
      }
      setOriginNodes(filteredOrigins);

      if (!filteredOrigins.some((n) => n.id === selectedOrigin)) {
        if (filteredOrigins.length > 0) setSelectedOrigin(filteredOrigins[0].id);
      }

      // Fetch Shelters & Hospitals
      const shelters = await fetchShelters(selectedState, selectedDistrict);
      const validDest = shelters.length > 0 ? shelters : nodes;
      setDestNodes(validDest);

      if (!validDest.some((n) => n.id === selectedDest)) {
        const fallbackDest = validDest.find((n) => n.id !== selectedOrigin) || validDest[0];
        if (fallbackDest) setSelectedDest(fallbackDest.id);
      }
    }
    loadSectorNodes();
  }, [selectedState, selectedDistrict]);

  // 4. Evaluate Soft-Sigmoid Hazard Physics whenever parameters change
  useEffect(() => {
    async function updateHazardEval() {
      const evalResult = await evaluateHazardRisk(waterDepth, damageLevel, debrisLevel, vehicleType);
      setHazardEvaluation(evalResult);
    }
    updateHazardEval();
  }, [waterDepth, damageLevel, debrisLevel, vehicleType]);

  // 5. Compute Dual Route Corridors (Primary + Backup)
  const computeRoute = useCallback(async () => {
    if (!selectedOrigin || !selectedDest) return;
    setIsCalculating(true);
    const data = await calculateRoute(
      selectedOrigin,
      selectedDest,
      vehicleType,
      waterDepth,
      damageLevel,
      debrisLevel,
      forecastHour,
      scenarioId
    );
    if (data && data.success) {
      setRouteData(data);
    }
    setIsCalculating(false);
  }, [selectedOrigin, selectedDest, vehicleType, waterDepth, damageLevel, debrisLevel, forecastHour, scenarioId]);

  // Run route calculation when origin, destination, vehicle, hour, or scenario change
  useEffect(() => {
    if (selectedOrigin && selectedDest) {
      computeRoute();
    }
  }, [selectedOrigin, selectedDest, vehicleType, forecastHour, scenarioId]);

  // City Switcher
  const handleSelectCity = (city) => {
    setSelectedState(city.state);
    if (city.district) setSelectedDistrict(city.district);
    if (city.node) setSelectedOrigin(city.node);
  };

  // Jump from Pan-India Modal
  const handleDeployRegion = (region) => {
    setSelectedState(region.state);
    if (region.default_origin) setSelectedOrigin(region.default_origin);
    if (region.default_dest) setSelectedDest(region.default_dest);
  };

  // GPS Device Locator
  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const nearest = await findNearestNode(latitude, longitude);
        if (nearest) {
          if (nearest.state) setSelectedState(nearest.state);
          if (nearest.district) setSelectedDistrict(nearest.district);
          setSelectedOrigin(nearest.id);
        }
      },
      async (err) => {
        console.warn('Geolocation fallback to default hub:', err);
        const nearest = await findNearestNode(25.4358, 81.8463);
        if (nearest) {
          setSelectedOrigin(nearest.id);
          setSelectedState(nearest.state || 'Uttar Pradesh');
        }
      }
    );
  };

  // Instant Flood Surge Simulation
  const handleSimulateFlood = () => {
    setWaterDepth(85);
    setScenarioId('extreme');
    setForecastHour(3);
  };

  // Set Origin from Autocomplete Search Result
  const handleSelectSearchNode = (node) => {
    if (node.state) setSelectedState(node.state);
    if (node.district) setSelectedDistrict(node.district);
    setSelectedOrigin(node.id);
  };

  // Reset Form to Baseline
  const handleResetForm = async () => {
    setWaterDepth(20);
    setDamageLevel(2.0);
    setDebrisLevel(1.5);
    setVehicleType('Ambulance');
    setForecastHour(0);
    setScenarioId('heavy');
    await resetNetworkGrid();
    const hList = await fetchHazards(selectedState);
    setHazards(hList);
    computeRoute();
  };

  // Refresh hazards after reporting
  const handleIncidentReported = async () => {
    const hList = await fetchHazards(selectedState);
    setHazards(hList);
    computeRoute();
  };

  // Switch to backup route when roadblock is reported in crew view
  const handleSwitchToBackupRoute = () => {
    computeRoute();
  };

  // STAGE 1: Render Welcome Screen if no role has been chosen yet
  if (!userRole) {
    return (
      <div className="min-h-screen h-auto overflow-y-auto pb-20 w-full bg-slate-950 font-sans text-slate-100">
        <WelcomeScreen 
          onSelectRole={(role) => setUserRole(role)} 
        />
      </div>
    );
  }

  // STAGE 2 & STAGE 3: Main Dashboard Layout
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100">
      {/* STAGE 2 (LEFT): Scrollable Sidebar Control Panel */}
      <Sidebar
        statesData={statesData}
        selectedState={selectedState}
        onStateChange={(st) => { setSelectedState(st); setSelectedDistrict('All Districts'); }}
        selectedDistrict={selectedDistrict}
        onDistrictChange={(dist) => setSelectedDistrict(dist)}
        originNodes={originNodes}
        selectedOrigin={selectedOrigin}
        onOriginChange={(id) => setSelectedOrigin(id)}
        destNodes={destNodes}
        selectedDest={selectedDest}
        onDestChange={(id) => setSelectedDest(id)}
        vehicleType={vehicleType}
        onVehicleChange={(v) => setVehicleType(v)}
        waterDepth={waterDepth}
        onWaterDepthChange={(val) => setWaterDepth(val)}
        damageLevel={damageLevel}
        onDamageLevelChange={(val) => setDamageLevel(val)}
        debrisLevel={debrisLevel}
        onDebrisLevelChange={(val) => setDebrisLevel(val)}
        hazardEvaluation={hazardEvaluation}
        onCalculateRoute={computeRoute}
        isCalculating={isCalculating}
        onResetForm={handleResetForm}
        userRole={userRole}
        onSwitchRole={() => setUserRole(null)}
        backendState={backendState}
        onOpenCrewMobileModal={() => setShowCrewMobileModal(true)}
      />

      {/* STAGE 2 (RIGHT) & STAGE 3: Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-slate-950 relative">
        {/* Top Header Search, Quick Jumpers, Role Controls & Modals */}
        <Header
          selectedState={selectedState}
          onSelectCity={handleSelectCity}
          onUseLocation={handleUseLocation}
          onSimulateFlood={handleSimulateFlood}
          onSelectSearchNode={handleSelectSearchNode}
          userRole={userRole}
          onSwitchRole={() => setUserRole(null)}
          backendState={backendState}
          onOpenNationalOverview={() => setShowNationalOverview(true)}
          onOpenDispatchModal={() => setShowDispatchModal(true)}
          onOpenSimulationModal={() => setShowSimulationModal(true)}
          onOpenCrewMobileModal={() => setShowCrewMobileModal(true)}
          onOpenGuideModal={() => setShowGuideModal(true)}
        />

        {/* Predictive Flood Timeline (0 - 6 Hours) */}
        <TimelineControl
          forecastHour={forecastHour}
          onHourChange={(h) => setForecastHour(h)}
          scenarioId={scenarioId}
          onScenarioChange={(s) => setScenarioId(s)}
          maxWaterDepthCm={waterDepth}
        />

        {/* Interactive Leaflet Map Canvas */}
        <div className="w-full h-[440px] lg:h-[480px] shrink-0 relative border-b border-slate-800">
          <MapView
            nodes={allNodes}
            hazards={hazards}
            units={units}
            routeData={routeData}
            selectedOrigin={selectedOrigin}
            selectedDest={selectedDest}
            selectedState={selectedState}
          />
        </div>

        {/* STAGE 3: Dedicated Detailed Incident & Corridor Report Section */}
        <DetailedReportSection
          routeData={routeData}
          vehicleType={vehicleType}
          waterDepth={waterDepth}
          damageLevel={damageLevel}
          debrisLevel={debrisLevel}
          selectedState={selectedState}
          selectedDistrict={selectedDistrict}
          units={units}
          onIncidentReported={handleIncidentReported}
          userRole={userRole}
          onOpenCrewMobileModal={() => setShowCrewMobileModal(true)}
        />
      </main>

      {/* Pan-India Flood Command Center Modal */}
      <NationalOverviewModal
        isOpen={showNationalOverview}
        onClose={() => setShowNationalOverview(false)}
        onSelectRegion={handleDeployRegion}
      />

      {/* Joint Hungarian Dispatch Optimizer Modal */}
      <DispatchModal
        isOpen={showDispatchModal}
        onClose={() => setShowDispatchModal(false)}
        selectedState={selectedState}
      />

      {/* In-Cab Crew Mobile Driver Modal */}
      <CrewMobileModal
        isOpen={showCrewMobileModal}
        onClose={() => setShowCrewMobileModal(false)}
        routeData={routeData}
        vehicleType={vehicleType}
        onSwitchToBackupRoute={handleSwitchToBackupRoute}
      />

      {/* Simulation Benchmark Modal */}
      <SimulationModal
        isOpen={showSimulationModal}
        onClose={() => setShowSimulationModal(false)}
      />

      {/* Platform Guide Modal */}
      <GuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      />
    </div>
  );
}
