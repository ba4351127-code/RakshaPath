/**
 * Comprehensive Pan-India Emergency Infrastructure Graph
 * With Deep Pilot Calibration for Prayagraj (Sangam Basin) and 7 Major Flood Zones.
 */

export const PAN_INDIA_REGIONS = [
  {
    id: 'prayagraj',
    name: 'Prayagraj / Ganga-Yamuna Doab',
    state: 'Uttar Pradesh',
    basin: 'Ganga-Yamuna River Basin',
    warning_level: 'Critical (CWA Level 3)',
    severity: 'High',
    water_trend: '+12 cm/h rising',
    key_bridge: 'Shastri Bridge (Elevated 25m)',
    default_origin: 'UP_PRY_SANGAM_CHOKE',
    default_dest: 'UP_PRY_SRN_HOSP',
    center: [25.4358, 81.8463],
    zoom: 12
  },
  {
    id: 'delhi',
    name: 'Delhi NCR / Yamuna Basin',
    state: 'Delhi NCR',
    basin: 'Upper Yamuna Floodplain',
    warning_level: 'Elevated Alert',
    severity: 'Moderate',
    water_trend: '+4 cm/h steady',
    key_bridge: 'Signature Bridge (Elevated)',
    default_origin: 'DEL_HQ',
    default_dest: 'DEL_MAYUR_SHELTER',
    center: [28.6139, 77.2090],
    zoom: 11
  },
  {
    id: 'patna',
    name: 'Patna / Middle Ganga Basin',
    state: 'Bihar',
    basin: 'Ganga-Son Confluence',
    warning_level: 'High Inundation Alert',
    severity: 'High',
    water_trend: '+8 cm/h rising',
    key_bridge: 'Digha Elevated AIIMS Corridor',
    default_origin: 'BR_PATNA_GHAT_CHOKE',
    default_dest: 'BR_AIIMS_PATNA',
    center: [25.6000, 85.1400],
    zoom: 12
  },
  {
    id: 'guwahati',
    name: 'Guwahati / Brahmaputra Basin',
    state: 'Assam',
    basin: 'Brahmaputra Valley Floodway',
    warning_level: 'Severe Flash Flood Alert',
    severity: 'Critical',
    water_trend: '+15 cm/h surge',
    key_bridge: 'Saraighat Double-Deck Bridge',
    default_origin: 'AS_GHY_GHAT_CHOKE',
    default_dest: 'AS_GMCH_HOSP',
    center: [26.1550, 91.7500],
    zoom: 12
  },
  {
    id: 'mumbai',
    name: 'Mumbai / Mithi River Basin',
    state: 'Maharashtra',
    basin: 'Konkan Coastal & Mithi Basin',
    warning_level: 'Monsoon High Tide Advisory',
    severity: 'High',
    water_trend: '+10 cm/h spring tide',
    key_bridge: 'Bandra-Worli Sea Link (Elevated)',
    default_origin: 'MH_SION_LOWLAND_CHOKE',
    default_dest: 'MH_KEM_HOSPITAL',
    center: [19.0500, 72.8800],
    zoom: 12
  },
  {
    id: 'chennai',
    name: 'Chennai / Adyar Basin',
    state: 'Tamil Nadu',
    basin: 'Adyar-Cooum Coastal Drainage',
    warning_level: 'Coastal Inundation Watch',
    severity: 'Moderate',
    water_trend: '+5 cm/h receding',
    key_bridge: 'Kathipara Elevated Grade Separator',
    default_origin: 'TN_ADYAR_RIVER_CHOKE',
    default_dest: 'TN_RGGGH_HOSP',
    center: [13.0827, 80.2707],
    zoom: 12
  },
  {
    id: 'kolkata',
    name: 'Kolkata / Hooghly Basin',
    state: 'West Bengal',
    basin: 'Lower Gangetic Delta',
    warning_level: 'Tidal Inundation Watch',
    severity: 'Moderate',
    water_trend: '+6 cm/h steady',
    key_bridge: 'Vidyasagar Setu (Toll Elevated)',
    default_origin: 'WB_HOWRAH_CHOKE',
    default_dest: 'WB_SSKM_HOSPITAL',
    center: [22.5700, 88.3600],
    zoom: 12
  }
];

export const NETWORK_NODES = {
  // ==========================================
  // 1. PRAYAGRAJ (PILOT CALIBRATION AREA)
  // ==========================================
  'UP_PRY_SANGAM_CHOKE': {
    name: 'Sangam Lowland Ghats (Flood Zone)',
    state: 'Uttar Pradesh',
    district: 'Prayagraj',
    lat: 25.4265,
    lon: 81.8845,
    category: 'Bridge/Chokepoint',
    elevation_m: 78,
    is_flood_prone: true
  },
  'UP_PRY_SHASTRI_BRIDGE': {
    name: 'Shastri Bridge (Elevated 25m Deck)',
    state: 'Uttar Pradesh',
    district: 'Prayagraj',
    lat: 25.4380,
    lon: 81.8760,
    category: 'Elevated Corridor',
    elevation_m: 104,
    is_flood_prone: false
  },
  'UP_PRY_CIVIL_LINES': {
    name: 'Civil Lines Tactical Staging Hub',
    state: 'Uttar Pradesh',
    district: 'Prayagraj',
    lat: 25.4520,
    lon: 81.8350,
    category: 'Command Center',
    elevation_m: 98,
    is_flood_prone: false
  },
  'UP_PRY_SRN_HOSP': {
    name: 'Swaroop Rani Nehru (SRN) Apex Hospital',
    state: 'Uttar Pradesh',
    district: 'Prayagraj',
    lat: 25.4410,
    lon: 81.8480,
    category: 'Hospital',
    elevation_m: 96,
    total_beds: 450,
    occupied_beds: 382,
    icu_beds_free: 14,
    is_flood_prone: false
  },
  'UP_PRY_NAINI_SHELTER': {
    name: 'Naini High-Ground Relief Shelter',
    state: 'Uttar Pradesh',
    district: 'Prayagraj',
    lat: 25.3950,
    lon: 81.8650,
    category: 'Relief Shelter',
    elevation_m: 102,
    capacity: 1200,
    occupancy: 410,
    is_flood_prone: false
  },
  'UP_PRY_NEW_YAMUNA_BRIDGE': {
    name: 'New Yamuna Cable-Stayed Bridge',
    state: 'Uttar Pradesh',
    district: 'Prayagraj',
    lat: 25.4250,
    lon: 81.8560,
    category: 'Elevated Corridor',
    elevation_m: 108,
    is_flood_prone: false
  },
  'UP_PRY_PHAPHAMAU_HUB': {
    name: 'Phaphamau North Safe Logistics Hub',
    state: 'Uttar Pradesh',
    district: 'Prayagraj',
    lat: 25.5050,
    lon: 81.8550,
    category: 'Relief Shelter',
    elevation_m: 106,
    capacity: 800,
    occupancy: 190,
    is_flood_prone: false
  },
  'UP_PRY_CURZON_BRIDGE': {
    name: 'Curzon Bridge Old Crossing (Low Deck)',
    state: 'Uttar Pradesh',
    district: 'Prayagraj',
    lat: 25.4950,
    lon: 81.8620,
    category: 'Bridge/Chokepoint',
    elevation_m: 82,
    is_flood_prone: true
  },
  'UP_PRY_ALLENGANJ_OUTPOST': {
    name: 'Allenganj Emergency Medical Outpost',
    state: 'Uttar Pradesh',
    district: 'Prayagraj',
    lat: 25.4670,
    lon: 81.8590,
    category: 'Hospital',
    elevation_m: 95,
    total_beds: 120,
    occupied_beds: 95,
    icu_beds_free: 6,
    is_flood_prone: false
  },

  // ==========================================
  // 2. DELHI NCR
  // ==========================================
  'DEL_HQ': {
    name: 'National Disaster Management Command (Delhi)',
    state: 'Delhi NCR',
    district: 'Central Delhi',
    lat: 28.6139,
    lon: 77.2090,
    category: 'Command Center',
    elevation_m: 215,
    is_flood_prone: false
  },
  'DEL_AIIMS_TRAUMA': {
    name: 'AIIMS Apex Trauma Center',
    state: 'Delhi NCR',
    district: 'South Delhi',
    lat: 28.5672,
    lon: 77.2100,
    category: 'Hospital',
    elevation_m: 218,
    total_beds: 650,
    occupied_beds: 590,
    icu_beds_free: 22,
    is_flood_prone: false
  },
  'DEL_MAYUR_SHELTER': {
    name: 'Mayur Vihar Multi-Tier Relief Shelter',
    state: 'Delhi NCR',
    district: 'East Delhi',
    lat: 28.6080,
    lon: 77.2950,
    category: 'Relief Shelter',
    elevation_m: 202,
    capacity: 2500,
    occupancy: 860,
    is_flood_prone: false
  },
  'DEL_YAMUNA_CHOKE': {
    name: 'ITO Yamuna Barrage Flood Chokepoint',
    state: 'Delhi NCR',
    district: 'Central Delhi',
    lat: 28.6290,
    lon: 77.2510,
    category: 'Bridge/Chokepoint',
    elevation_m: 198,
    is_flood_prone: true
  },
  'DEL_SIGNATURE_BRIDGE': {
    name: 'Signature Bridge Elevated Corridor',
    state: 'Delhi NCR',
    district: 'North East Delhi',
    lat: 28.7060,
    lon: 77.2310,
    category: 'Elevated Corridor',
    elevation_m: 225,
    is_flood_prone: false
  },
  'DEL_KASHMIRI_GATE': {
    name: 'ISBT Kashmiri Gate Lowland Hub',
    state: 'Delhi NCR',
    district: 'North Delhi',
    lat: 28.6670,
    lon: 77.2290,
    category: 'Bridge/Chokepoint',
    elevation_m: 201,
    is_flood_prone: true
  },

  // ==========================================
  // 3. PATNA (BIHAR)
  // ==========================================
  'BR_PATNA_GHAT_CHOKE': {
    name: 'Ganga Ghats Lowland Drainage Point',
    state: 'Bihar',
    district: 'Patna',
    lat: 25.6200,
    lon: 85.1680,
    category: 'Bridge/Chokepoint',
    elevation_m: 48,
    is_flood_prone: true
  },
  'BR_AIIMS_PATNA': {
    name: 'AIIMS Super-Specialty Medical Institute',
    state: 'Bihar',
    district: 'Patna',
    lat: 25.5610,
    lon: 85.0420,
    category: 'Hospital',
    elevation_m: 56,
    total_beds: 500,
    occupied_beds: 410,
    icu_beds_free: 18,
    is_flood_prone: false
  },
  'BR_PMCH_PATNA': {
    name: 'PMCH Apex Hospital & Trauma Center',
    state: 'Bihar',
    district: 'Patna',
    lat: 25.6230,
    lon: 85.1550,
    category: 'Hospital',
    elevation_m: 51,
    total_beds: 700,
    occupied_beds: 645,
    icu_beds_free: 8,
    is_flood_prone: false
  },
  'BR_DIGHA_CORRIDOR': {
    name: 'Digha Elevated Bypass Safe Corridor',
    state: 'Bihar',
    district: 'Patna',
    lat: 25.6420,
    lon: 85.0980,
    category: 'Elevated Corridor',
    elevation_m: 65,
    is_flood_prone: false
  },
  'BR_KANKARBAGH_SHELTER': {
    name: 'Kankarbagh Community Relief Shelter',
    state: 'Bihar',
    district: 'Patna',
    lat: 25.5950,
    lon: 85.1500,
    category: 'Relief Shelter',
    elevation_m: 53,
    capacity: 1500,
    occupancy: 520,
    is_flood_prone: false
  },

  // ==========================================
  // 4. GUWAHATI (ASSAM)
  // ==========================================
  'AS_GHY_GHAT_CHOKE': {
    name: 'Uzanbazar Brahmaputra Riverfront',
    state: 'Assam',
    district: 'Guwahati',
    lat: 26.1920,
    lon: 91.7580,
    category: 'Bridge/Chokepoint',
    elevation_m: 49,
    is_flood_prone: true
  },
  'AS_GMCH_HOSP': {
    name: 'Gauhati Medical College & Hospital (GMCH)',
    state: 'Assam',
    district: 'Guwahati',
    lat: 26.1580,
    lon: 91.7720,
    category: 'Hospital',
    elevation_m: 64,
    total_beds: 600,
    occupied_beds: 490,
    icu_beds_free: 25,
    is_flood_prone: false
  },
  'AS_SARAIGHAT_BRIDGE': {
    name: 'Saraighat Elevated River Bridge',
    state: 'Assam',
    district: 'Guwahati',
    lat: 26.1280,
    lon: 91.6020,
    category: 'Elevated Corridor',
    elevation_m: 78,
    is_flood_prone: false
  },
  'AS_JALUKBARI_SHELTER': {
    name: 'Jalukbari Safe Staging & Relief Hub',
    state: 'Assam',
    district: 'Guwahati',
    lat: 26.1450,
    lon: 91.6620,
    category: 'Relief Shelter',
    elevation_m: 68,
    capacity: 1800,
    occupancy: 410,
    is_flood_prone: false
  },

  // ==========================================
  // 5. MUMBAI (MAHARASHTRA)
  // ==========================================
  'MH_SION_LOWLAND_CHOKE': {
    name: 'Sion Railway Colony Inundation Chokepoint',
    state: 'Maharashtra',
    district: 'Mumbai',
    lat: 19.0410,
    lon: 72.8620,
    category: 'Bridge/Chokepoint',
    elevation_m: 7,
    is_flood_prone: true
  },
  'MH_KEM_HOSPITAL': {
    name: 'KEM Apex Medical & Trauma Center',
    state: 'Maharashtra',
    district: 'Mumbai',
    lat: 19.0020,
    lon: 72.8420,
    category: 'Hospital',
    elevation_m: 14,
    total_beds: 850,
    occupied_beds: 790,
    icu_beds_free: 30,
    is_flood_prone: false
  },
  'MH_SEA_LINK': {
    name: 'Bandra-Worli Sea Link Elevated Corridor',
    state: 'Maharashtra',
    district: 'Mumbai',
    lat: 19.0350,
    lon: 72.8150,
    category: 'Elevated Corridor',
    elevation_m: 28,
    is_flood_prone: false
  },
  'MH_BKC_SHELTER': {
    name: 'BKC Complex Disaster Relief Staging Hub',
    state: 'Maharashtra',
    district: 'Mumbai',
    lat: 19.0680,
    lon: 72.8710,
    category: 'Relief Shelter',
    elevation_m: 12,
    capacity: 3000,
    occupancy: 850,
    is_flood_prone: false
  },

  // ==========================================
  // 6. CHENNAI (TAMIL NADU)
  // ==========================================
  'TN_ADYAR_RIVER_CHOKE': {
    name: 'Saidapet Adyar River Causeway',
    state: 'Tamil Nadu',
    district: 'Chennai',
    lat: 13.0180,
    lon: 80.2220,
    category: 'Bridge/Chokepoint',
    elevation_m: 6,
    is_flood_prone: true
  },
  'TN_RGGGH_HOSP': {
    name: 'Rajiv Gandhi Government General Hospital',
    state: 'Tamil Nadu',
    district: 'Chennai',
    lat: 13.0820,
    lon: 80.2780,
    category: 'Hospital',
    elevation_m: 12,
    total_beds: 750,
    occupied_beds: 680,
    icu_beds_free: 19,
    is_flood_prone: false
  },
  'TN_GUINDY_SHELTER': {
    name: 'Guindy Racecourse Multi-Purpose Safe Shelter',
    state: 'Tamil Nadu',
    district: 'Chennai',
    lat: 13.0080,
    lon: 80.2110,
    category: 'Relief Shelter',
    elevation_m: 15,
    capacity: 2200,
    occupancy: 610,
    is_flood_prone: false
  },

  // ==========================================
  // 7. KOLKATA (WEST BENGAL)
  // ==========================================
  'WB_HOWRAH_CHOKE': {
    name: 'Howrah Station Approach Lowland',
    state: 'West Bengal',
    district: 'Kolkata',
    lat: 22.5850,
    lon: 88.3410,
    category: 'Bridge/Chokepoint',
    elevation_m: 5,
    is_flood_prone: true
  },
  'WB_SSKM_HOSPITAL': {
    name: 'SSKM Apex Institute of Emergency Medicine',
    state: 'West Bengal',
    district: 'Kolkata',
    lat: 22.5390,
    lon: 88.3430,
    category: 'Hospital',
    elevation_m: 11,
    total_beds: 800,
    occupied_beds: 730,
    icu_beds_free: 28,
    is_flood_prone: false
  },
  'WB_VIDYASAGAR_SETU': {
    name: 'Vidyasagar Setu (Elevated Cable Bridge)',
    state: 'West Bengal',
    district: 'Kolkata',
    lat: 22.5580,
    lon: 88.3280,
    category: 'Elevated Corridor',
    elevation_m: 35,
    is_flood_prone: false
  },
  'WB_SALT_LAKE_SHELTER': {
    name: 'Salt Lake Stadium Disaster Shelter Complex',
    state: 'West Bengal',
    district: 'Kolkata',
    lat: 22.5700,
    lon: 88.4060,
    category: 'Relief Shelter',
    elevation_m: 14,
    capacity: 4000,
    occupancy: 1100,
    is_flood_prone: false
  }
};

/**
 * Road Graph Edges with Real-World Distances, Elevations, and Structural Types
 */
export const ROAD_EDGES = [
  // --- Prayagraj Pilot Corridors ---
  {
    u: 'UP_PRY_SANGAM_CHOKE',
    v: 'UP_PRY_SHASTRI_BRIDGE',
    distance_km: 2.2,
    base_water_cm: 65.0,
    elevation_type: 'lowland_underpass',
    road_name: 'Bandhwa Lowland Embankment Road',
    damage: 4.5,
    debris: 3.0
  },
  {
    u: 'UP_PRY_SHASTRI_BRIDGE',
    v: 'UP_PRY_SRN_HOSP',
    distance_km: 3.8,
    base_water_cm: 0.0,
    elevation_type: 'elevated_bridge',
    road_name: 'Shastri Bridge Elevated Ramp',
    damage: 1.0,
    debris: 0.5
  },
  {
    u: 'UP_PRY_SANGAM_CHOKE',
    v: 'UP_PRY_NEW_YAMUNA_BRIDGE',
    distance_km: 4.1,
    base_water_cm: 55.0,
    elevation_type: 'river_crossway',
    road_name: 'Kydganj Ghat Submerged Link',
    damage: 5.5,
    debris: 4.0
  },
  {
    u: 'UP_PRY_NEW_YAMUNA_BRIDGE',
    v: 'UP_PRY_NAINI_SHELTER',
    distance_km: 3.5,
    base_water_cm: 0.0,
    elevation_type: 'elevated_bridge',
    road_name: 'New Yamuna Bridge Highway Deck',
    damage: 0.5,
    debris: 0.2
  },
  {
    u: 'UP_PRY_SRN_HOSP',
    v: 'UP_PRY_CIVIL_LINES',
    distance_km: 2.1,
    base_water_cm: 15.0,
    elevation_type: 'standard_road',
    road_name: 'Mahatma Gandhi Marg Central Arterial',
    damage: 1.5,
    debris: 1.0
  },
  {
    u: 'UP_PRY_CIVIL_LINES',
    v: 'UP_PRY_ALLENGANJ_OUTPOST',
    distance_km: 2.8,
    base_water_cm: 20.0,
    elevation_type: 'standard_road',
    road_name: 'Kasturba Gandhi Marg Secondary Bypass',
    damage: 2.0,
    debris: 1.5
  },
  {
    u: 'UP_PRY_ALLENGANJ_OUTPOST',
    v: 'UP_PRY_PHAPHAMAU_HUB',
    distance_km: 5.2,
    base_water_cm: 10.0,
    elevation_type: 'standard_road',
    road_name: 'Teliyarganj High Ridge Connector',
    damage: 1.8,
    debris: 1.0
  },
  {
    u: 'UP_PRY_SANGAM_CHOKE',
    v: 'UP_PRY_CURZON_BRIDGE',
    distance_km: 7.5,
    base_water_cm: 80.0,
    elevation_type: 'lowland_underpass',
    road_name: 'Salori Riverfront Submerged Drain Way',
    damage: 7.0,
    debris: 6.0
  },
  {
    u: 'UP_PRY_CURZON_BRIDGE',
    v: 'UP_PRY_PHAPHAMAU_HUB',
    distance_km: 2.1,
    base_water_cm: 75.0,
    elevation_type: 'river_crossway',
    road_name: 'Old Curzon Low Deck Causeway',
    damage: 6.5,
    debris: 5.0
  },
  {
    u: 'UP_PRY_SRN_HOSP',
    v: 'UP_PRY_NAINI_SHELTER',
    distance_km: 5.8,
    base_water_cm: 12.0,
    elevation_type: 'elevated_bridge',
    road_name: 'Rewa Road Overpass to Naini',
    damage: 1.2,
    debris: 0.8
  },

  // --- Delhi NCR Corridors ---
  {
    u: 'DEL_HQ',
    v: 'DEL_YAMUNA_CHOKE',
    distance_km: 4.5,
    base_water_cm: 70.0,
    elevation_type: 'lowland_underpass',
    road_name: 'ITO Submerged Underpass',
    damage: 5.0,
    debris: 4.5
  },
  {
    u: 'DEL_YAMUNA_CHOKE',
    v: 'DEL_MAYUR_SHELTER',
    distance_km: 5.2,
    base_water_cm: 85.0,
    elevation_type: 'river_crossway',
    road_name: 'Vikas Marg Yamuna Floodway',
    damage: 6.0,
    debris: 5.0
  },
  {
    u: 'DEL_HQ',
    v: 'DEL_AIIMS_TRAUMA',
    distance_km: 6.2,
    base_water_cm: 12.0,
    elevation_type: 'standard_road',
    road_name: 'Aurobindo Marg Elevated Flyovers',
    damage: 1.0,
    debris: 0.5
  },
  {
    u: 'DEL_AIIMS_TRAUMA',
    v: 'DEL_MAYUR_SHELTER',
    distance_km: 9.8,
    base_water_cm: 5.0,
    elevation_type: 'elevated_bridge',
    road_name: 'Barapullah Elevated Flyover Highway',
    damage: 0.8,
    debris: 0.2
  },
  {
    u: 'DEL_HQ',
    v: 'DEL_KASHMIRI_GATE',
    distance_km: 5.8,
    base_water_cm: 60.0,
    elevation_type: 'lowland_underpass',
    road_name: 'Ring Road Yamuna Lowland Track',
    damage: 4.5,
    debris: 3.5
  },
  {
    u: 'DEL_KASHMIRI_GATE',
    v: 'DEL_SIGNATURE_BRIDGE',
    distance_km: 4.2,
    base_water_cm: 45.0,
    elevation_type: 'river_crossway',
    road_name: 'Wazirabad Old Embankment Route',
    damage: 4.0,
    debris: 3.0
  },
  {
    u: 'DEL_SIGNATURE_BRIDGE',
    v: 'DEL_MAYUR_SHELTER',
    distance_km: 11.5,
    base_water_cm: 0.0,
    elevation_type: 'elevated_bridge',
    road_name: 'Signature Bridge High Elevated Ring Express',
    damage: 0.5,
    debris: 0.2
  },

  // --- Patna Corridors ---
  {
    u: 'BR_PATNA_GHAT_CHOKE',
    v: 'BR_PMCH_PATNA',
    distance_km: 1.8,
    base_water_cm: 75.0,
    elevation_type: 'river_crossway',
    road_name: 'Ashok Rajpath Inundated Ghat Road',
    damage: 5.5,
    debris: 4.0
  },
  {
    u: 'BR_PMCH_PATNA',
    v: 'BR_KANKARBAGH_SHELTER',
    distance_km: 4.2,
    base_water_cm: 25.0,
    elevation_type: 'standard_road',
    road_name: 'Exhibition Road Drainage Corridor',
    damage: 2.5,
    debris: 1.5
  },
  {
    u: 'BR_PATNA_GHAT_CHOKE',
    v: 'BR_DIGHA_CORRIDOR',
    distance_km: 6.5,
    base_water_cm: 15.0,
    elevation_type: 'elevated_bridge',
    road_name: 'Atal Path Ganga Marine Drive Elevated',
    damage: 0.5,
    debris: 0.2
  },
  {
    u: 'BR_DIGHA_CORRIDOR',
    v: 'BR_AIIMS_PATNA',
    distance_km: 8.5,
    base_water_cm: 0.0,
    elevation_type: 'elevated_bridge',
    road_name: 'AIIMS-Digha 4-Lane Elevated Expressway',
    damage: 0.2,
    debris: 0.1
  },
  {
    u: 'BR_AIIMS_PATNA',
    v: 'BR_KANKARBAGH_SHELTER',
    distance_km: 9.2,
    base_water_cm: 20.0,
    elevation_type: 'standard_road',
    road_name: 'Bypass Highway South Ring',
    damage: 1.8,
    debris: 1.0
  },

  // --- Guwahati Corridors ---
  {
    u: 'AS_GHY_GHAT_CHOKE',
    v: 'AS_GMCH_HOSP',
    distance_km: 4.5,
    base_water_cm: 85.0,
    elevation_type: 'lowland_underpass',
    road_name: 'Brahmaputra Bank MG Road Inundated Path',
    damage: 6.0,
    debris: 5.0
  },
  {
    u: 'AS_GHY_GHAT_CHOKE',
    v: 'AS_SARAIGHAT_BRIDGE',
    distance_km: 12.0,
    base_water_cm: 20.0,
    elevation_type: 'elevated_bridge',
    road_name: 'National Highway Elevated North Corridor',
    damage: 1.2,
    debris: 0.8
  },
  {
    u: 'AS_SARAIGHAT_BRIDGE',
    v: 'AS_JALUKBARI_SHELTER',
    distance_km: 4.8,
    base_water_cm: 5.0,
    elevation_type: 'elevated_bridge',
    road_name: 'Jalukbari Grade Separator Overpass',
    damage: 0.4,
    debris: 0.2
  },
  {
    u: 'AS_GMCH_HOSP',
    v: 'AS_JALUKBARI_SHELTER',
    distance_km: 8.2,
    base_water_cm: 15.0,
    elevation_type: 'standard_road',
    road_name: 'GS Road - Guwahati Ridge Arterial',
    damage: 1.5,
    debris: 1.0
  },

  // --- Mumbai Corridors ---
  {
    u: 'MH_SION_LOWLAND_CHOKE',
    v: 'MH_KEM_HOSPITAL',
    distance_km: 5.8,
    base_water_cm: 90.0,
    elevation_type: 'lowland_underpass',
    road_name: 'Dr. Babasaheb Ambedkar Road Submerged Tracks',
    damage: 7.0,
    debris: 5.5
  },
  {
    u: 'MH_SION_LOWLAND_CHOKE',
    v: 'MH_SEA_LINK',
    distance_km: 6.2,
    base_water_cm: 25.0,
    elevation_type: 'standard_road',
    road_name: 'Dharavi Elevated Flyover Connector',
    damage: 2.2,
    debris: 1.5
  },
  {
    u: 'MH_SEA_LINK',
    v: 'MH_KEM_HOSPITAL',
    distance_km: 4.9,
    base_water_cm: 0.0,
    elevation_type: 'elevated_bridge',
    road_name: 'Bandra-Worli Sea Link Elevated Deck',
    damage: 0.2,
    debris: 0.1
  },
  {
    u: 'MH_KEM_HOSPITAL',
    v: 'MH_BKC_SHELTER',
    distance_km: 6.5,
    base_water_cm: 20.0,
    elevation_type: 'standard_road',
    road_name: 'Eastern Express Highway South Deck',
    damage: 1.4,
    debris: 0.8
  },

  // --- Chennai Corridors ---
  {
    u: 'TN_ADYAR_RIVER_CHOKE',
    v: 'TN_RGGGH_HOSP',
    distance_km: 8.2,
    base_water_cm: 70.0,
    elevation_type: 'river_crossway',
    road_name: 'Mount Road Adyar Bridge Low Deck',
    damage: 5.0,
    debris: 4.0
  },
  {
    u: 'TN_ADYAR_RIVER_CHOKE',
    v: 'TN_GUINDY_SHELTER',
    distance_km: 2.5,
    base_water_cm: 30.0,
    elevation_type: 'standard_road',
    road_name: 'Kathipara Link Flyover Road',
    damage: 1.8,
    debris: 1.0
  },
  {
    u: 'TN_GUINDY_SHELTER',
    v: 'TN_RGGGH_HOSP',
    distance_km: 9.5,
    base_water_cm: 10.0,
    elevation_type: 'elevated_bridge',
    road_name: 'Chennai Central Elevated Flyover Corridor',
    damage: 0.6,
    debris: 0.2
  },

  // --- Kolkata Corridors ---
  {
    u: 'WB_HOWRAH_CHOKE',
    v: 'WB_SSKM_HOSPITAL',
    distance_km: 6.8,
    base_water_cm: 80.0,
    elevation_type: 'lowland_underpass',
    road_name: 'Howrah Bridge Approach Road Flooding Zone',
    damage: 6.0,
    debris: 4.5
  },
  {
    u: 'WB_HOWRAH_CHOKE',
    v: 'WB_VIDYASAGAR_SETU',
    distance_km: 3.2,
    base_water_cm: 15.0,
    elevation_type: 'standard_road',
    road_name: 'Kona Expressway Flyover Ramp',
    damage: 1.5,
    debris: 0.8
  },
  {
    u: 'WB_VIDYASAGAR_SETU',
    v: 'WB_SSKM_HOSPITAL',
    distance_km: 2.9,
    base_water_cm: 0.0,
    elevation_type: 'elevated_bridge',
    road_name: 'Vidyasagar Setu Toll Cable Bridge High Deck',
    damage: 0.1,
    debris: 0.0
  },
  {
    u: 'WB_SSKM_HOSPITAL',
    v: 'WB_SALT_LAKE_SHELTER',
    distance_km: 8.5,
    base_water_cm: 15.0,
    elevation_type: 'standard_road',
    road_name: 'Maa Elevated Flyover (Park Circus to Salt Lake)',
    damage: 0.5,
    debris: 0.2
  }
];

export const INITIAL_RESCUE_UNITS = [
  {
    id: 'UNIT-PRY-AMB-01',
    name: '108 ALS Ambulance Prayagraj-01',
    unit_type: 'Ambulance',
    state: 'Uttar Pradesh',
    district: 'Prayagraj',
    lat: 25.4480,
    lon: 81.8410,
    status: 'Available',
    speed_kmh: 60.0,
    water_clearance_cm: 30.0,
    capacity: 2
  },
  {
    id: 'UNIT-PRY-NDRF-02',
    name: 'NDRF Heavy Rescue Truck 11-BN',
    unit_type: 'NDRF Truck',
    state: 'Uttar Pradesh',
    district: 'Prayagraj',
    lat: 25.4380,
    lon: 81.8760,
    status: 'Available',
    speed_kmh: 45.0,
    water_clearance_cm: 85.0,
    capacity: 12
  },
  {
    id: 'UNIT-PRY-BOAT-03',
    name: 'SDRF Inflatable Flood Boat Alpha',
    unit_type: 'Flood Boat',
    state: 'Uttar Pradesh',
    district: 'Prayagraj',
    lat: 25.4265,
    lon: 81.8845,
    status: 'Available',
    speed_kmh: 25.0,
    water_clearance_cm: 999.0,
    capacity: 8
  },
  {
    id: 'UNIT-DEL-AMB-04',
    name: '102 Emergency Ambulance Delhi Central',
    unit_type: 'Ambulance',
    state: 'Delhi NCR',
    district: 'Central Delhi',
    lat: 28.6180,
    lon: 77.2150,
    status: 'Available',
    speed_kmh: 60.0,
    water_clearance_cm: 30.0,
    capacity: 2
  },
  {
    id: 'UNIT-DEL-NDRF-05',
    name: 'NDRF 8th Battalion Heavy Rescue',
    unit_type: 'NDRF Truck',
    state: 'Delhi NCR',
    district: 'East Delhi',
    lat: 28.6100,
    lon: 77.2900,
    status: 'Available',
    speed_kmh: 45.0,
    water_clearance_cm: 85.0,
    capacity: 12
  },
  {
    id: 'UNIT-PAT-AMB-06',
    name: 'Patna Trauma Ambulance 108',
    unit_type: 'Ambulance',
    state: 'Bihar',
    district: 'Patna',
    lat: 25.5680,
    lon: 85.0500,
    status: 'Available',
    speed_kmh: 60.0,
    water_clearance_cm: 30.0,
    capacity: 2
  },
  {
    id: 'UNIT-GHY-BOAT-07',
    name: 'Assam State Disaster Boat Unit 01',
    unit_type: 'Flood Boat',
    state: 'Assam',
    district: 'Guwahati',
    lat: 26.1900,
    lon: 91.7500,
    status: 'Available',
    speed_kmh: 25.0,
    water_clearance_cm: 999.0,
    capacity: 8
  },
  {
    id: 'UNIT-MUM-4X4-08',
    name: 'Mumbai Fire Brigade 4x4 Quick Recon',
    unit_type: 'Rapid Response',
    state: 'Maharashtra',
    district: 'Mumbai',
    lat: 19.0300,
    lon: 72.8200,
    status: 'Available',
    speed_kmh: 65.0,
    water_clearance_cm: 50.0,
    capacity: 4
  }
];

export const INITIAL_INCIDENTS = [
  {
    id: 1,
    title: 'Severe Water Inundation Near Sangam Ghats',
    incident_type: 'Flooding / Waterlogging',
    severity: 'Critical',
    state: 'Uttar Pradesh',
    district: 'Prayagraj',
    lat: 25.4265,
    lon: 81.8845,
    water_depth_cm: 75.0,
    damage_level: 5.0,
    debris_level: 3.5,
    patients_count: 3,
    status: 'Active',
    description: 'River Ganga backflow submerged approach road. 3 citizens requiring medical evacuation.',
    reported_at: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Yamuna Floodplain Lowland Encroachment',
    incident_type: 'Flooding / Waterlogging',
    severity: 'High',
    state: 'Delhi NCR',
    district: 'Central Delhi',
    lat: 28.6290,
    lon: 77.2510,
    water_depth_cm: 65.0,
    damage_level: 4.0,
    debris_level: 4.0,
    patients_count: 2,
    status: 'Active',
    description: 'Drain 12 overflow near ITO barrier. Low-chassis vehicles immobilized.',
    reported_at: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Sion Railway Colony Inundation Chokepoint',
    incident_type: 'Flooding / Waterlogging',
    severity: 'Critical',
    state: 'Maharashtra',
    district: 'Mumbai',
    lat: 19.0410,
    lon: 72.8620,
    water_depth_cm: 85.0,
    damage_level: 6.5,
    debris_level: 5.0,
    patients_count: 4,
    status: 'Active',
    description: 'High tide combined with heavy downpour submerged underpass up to 85 cm.',
    reported_at: new Date().toISOString()
  }
];
