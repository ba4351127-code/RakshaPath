# RakshaPath | National Emergency Mobility Network
## Platform Evaluation & Live Demonstration Script

This document details 3 complete end-to-end operational scenarios to evaluate and demonstrate the capabilities of the RakshaPath platform, whether running locally or on Vercel (`https://rakshapath-live.vercel.app`).

---

### Scenario 1: Prayagraj Sangam Monsoonal Surge & Dual Corridor Routing

**Operational Context:**
The confluence of the Ganga and Yamuna rivers in Prayagraj experiences rapid monsoon discharge. High-water levels inundate low-lying arterial access roads connecting the Sangam Pilgrimage Camp to the SRN Medical Trauma Center.

#### Step-by-Step Walkthrough:
1. **Launch & Overview:**
   - Open RakshaPath. On the Welcome Screen, select **Responder / Command Center** and click **Enter Command Center &rarr;**.
   - In the top navigation bar, click **Pan-India (7 Zones)**.
   - Click on the **Prayagraj (Sangam Surge)** zone card. Notice the camera instantaneously animates to coordinates `(25.4358, 81.8463)`.
2. **Hydrological Timeline Simulation:**
   - Locate the floating **Predictive Flood Timeline** control at the top-center of the map.
   - Switch the rain scenario from **Moderate** to **Extreme Surge (280mm/24h)**.
   - Drag the hour slider from **T+0h** to **T+3h**, then **T+5h**:
     - At **T+0h**, water inundation is shallow (~15 cm). The Primary route via the river causeway is open.
     - At **T+3h**, inundation reaches ~48 cm. An alert appears warning that standard Ambulances face a high probability of engine hydraulic stall.
     - At **T+5h**, the causeway is fully submerged (78 cm). The system dynamically flags the primary corridor as **HAZARDOUS/IMPASSABLE**.
3. **Vehicle Passability & Corridors:**
   - In the left sidebar, observe the **Vehicle Profile** selector:
     - Select **Ambulance**: Notice the soft-sigmoid curve $P(d)$ drops below 10%, flagging the low causeway as impassable.
     - Switch to **NDRF Heavy Truck** (rated for 85 cm wading clearance, $d_{\text{safe}} = 70\text{ cm}$): Passability probability jumps to $88\%$.
   - Click **Calculate Safe Evacuation Route**:
     - The map renders two distinct paths:
       - **Primary Corridor (Solid Emerald):** Fastest viable elevated route over Shastri Bridge.
       - **Backup Corridor (Dashed Sky Blue):** Geographically diverse secondary route through Curzon Bridge Bypass.
     - Below the map, inspect the **Detailed Incident & Route Report**:
       - Verify both corridors display their **Reliability Score** ($R = \prod P_e$), distance, and ETA.
       - Read the plain-language turn-by-turn reasoning: e.g. *"Taking Shastri Bridge Embankment (+2.8 km detour) to bypass 72 cm waterlogged low-line causeway."*

---

### Scenario 2: In-Cab Crew Mobile View & 1-Tap Roadblock Failover

**Operational Context:**
An emergency ambulance crew en route from Safdarjung to Mayur Vihar Emergency Relief Shelter encounters sudden unmapped tree fall and road collapse on the primary causeway.

#### Step-by-Step Walkthrough:
1. **Activate Crew Mobile View:**
   - In the sidebar or top header, click the **In-Cab Crew Mobile** button.
   - A realistic mobile command viewport appears, formatted for a tablet/smartphone mounted on an ambulance dashboard.
2. **Review Real-Time Telemetry:**
   - The crew sees the current destination (**Mayur Vihar Relief Shelter**), transit speed (45 km/h), remaining distance, and ETA.
   - The Primary Corridor is highlighted as currently active.
3. **Simulate Unmapped Obstruction / Road Blockage:**
   - Tap the prominent red **ROAD BLOCKED / FAILOVER** button.
   - Observe the instant failover response:
     - The platform instantly reroutes navigation to the **Geographically Diverse Backup Corridor**.
     - An alert notification sounds/displays: *"Failover triggered: Primary corridor blocked. Switching to Backup Corridor via Elevated Outer Ring Flyway."*
     - The mobile UI and map instantly transition to the secondary corridor without requiring dispatcher re-entry.

---

### Scenario 3: Joint Hungarian Dispatch & Free ICU Bed Verification

**Operational Context:**
A monsoonal flash surge generates multiple concurrent distress calls across the metropolitan sector. The Command Center must optimally match incidents to available rescue units and triage patients to hospitals with verified ICU bed capacity.

#### Step-by-Step Walkthrough:
1. **Open Dispatch Optimizer:**
   - In the top header bar, click **Dispatch Optimizer**.
   - The modal displays the **Multi-Asset Hungarian Dispatch Center**:
     - Left column: Active Incident Queue (e.g., Sangam Ghat Drowning [Critical], Lowland Colony Inundation [High], Underpass Bus Stall [Medium]).
     - Middle column: Available Rescue Fleet (Ambulances, NDRF Trucks, Rapid Response 4x4, Flood Boats).
     - Right column: Receiving Regional Hospitals with real-time **ICU Beds Free** counters.
2. **Run Joint Bipartite Optimization:**
   - Click **Run Hungarian Optimization**:
     - The bipartite matching algorithm calculates the optimal cost matrix based on transit distance, vehicle wading capability, and hospital bed availability.
     - Notice that **Critical** deep-water incidents are automatically routed to **NDRF Trucks** or **Flood Boats**, rejecting light ambulances that would drown.
     - Each unit is assigned a receiving hospital that has $N > 0$ free ICU beds. The hospital's remaining bed count decrements automatically, preventing diversion bottlenecks.
3. **Execute Manual Dispatcher Override:**
   - If field intelligence indicates a specific hospital has an auxiliary generator failure, the operator can click **Override** on any assignment row to reassign the target hospital or unit directly.
   - Click **Commit Fleet Dispatch** to push assignments to active units.

---

### Verifying Offline / Standalone Resilience on Vercel

To verify that the platform functions with zero backend dependencies:
1. Open DevTools in Chrome/Edge/Firefox (`F12`).
2. Go to the **Network** tab and toggle **Offline** or observe that no backend requests are failing even when `VITE_API_URL` is disconnected.
3. Perform route calculations, timeline scrubbing, Hungarian dispatch matching, and crew roadblock failover.
4. Verify all calculations complete locally within < 50 milliseconds via the embedded browser engine.
