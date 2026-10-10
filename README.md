# 🛡️ RakshaPath (रक्षापथ)
### National Emergency Mobility Network • Autonomous Disaster Corridor AI

[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688.svg)](https://fastapi.tiangolo.com/)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.25%2B-FF4B4B.svg)](https://streamlit.io/)
[![NetworkX](https://img.shields.io/badge/NetworkX-A*_Routing-orange.svg)](https://networkx.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**RakshaPath** is an autonomous tactical emergency routing system built for disaster management authorities (NDRF, SDRF, EMS, Civil Defense). It computes **risk-weighted safe corridors** across floodwaters, landslide rubble, and damaged roadways using physical hazard penalty models and NetworkX A* algorithms.

---

## 🌟 Key Features

1. **Risk-Weighted A* Corridor Algorithm**:
   - Compares physical road distances against composite hazard multipliers.
   - Dynamically reroutes rescue teams around submerged bridges and damaged roadways while contrasting against naive direct routes.

2. **Physical Hazard Engine**:
   - Accounts for **water inundation depth (cm)**, **structural damage level (0–10)**, and **debris obstruction (0–10)**.
   - Vehicle capability profiles: *Life Support Ambulance, NDRF Heavy Truck, Tactical Flood Boat, Rapid Response 4x4, Evacuation Bus*.

3. **Immersive GIS-First Interface & Clean Everyday English**:
   - Expansive 620px interactive OpenStreetMap topology map taking center stage (free of tile watermarks).
   - Intuitive, clear everyday English terminology allowing both emergency responders and everyday citizens to navigate effortlessly.
   - Floating top hero bar with Google Maps–style landmark search, 1-click GPS device geolocation, and quick city jump presets (*Delhi, Lucknow, Agra, Varanasi, Dehradun, Mumbai*).
   - Floating route metrics HUD directly above the map: Safe Route Distance, Est. Travel Time, Road Danger Factor, and Safety Status.
   - Collapsible docked control sidebar housing multi-state origin/shelter selection, rescue vehicle profiles, and real-time danger level sliders.

4. **Embedded Standalone Engine for Cloud Deployment**:
   - Features a built-in NetworkX A* routing engine fallback inside the Streamlit frontend.
   - Automatically computes risk-weighted corridors locally if deployed on Streamlit Community Cloud without requiring an external FastAPI Uvicorn server (`Core: ONLINE (Embedded Engine)`).

5. **Disaster Management Auth & Ground Transmission Portal**:
   - Tactical responder authentication with badge identification.
   - Real-time ground incident reporting terminal saving directly to SQLite database.
   - Tabbed post-route analysis: turn-by-turn waypoints, comparative safety metrics, and regional fleet deployment ETAs.

---

## 📂 Project Structure

```
RakshaPath/
├── requirements.txt           # Dependencies
├── .gitignore                 # Git ignore rules
├── backend/
│   ├── database.py            # SQLite ORM models (RescueUnits & Incidents) + Auto-seeder
│   ├── hazard_engine.py       # Physics-based risk multiplier models
│   ├── router.py              # Multi-state NetworkX A* emergency corridor graph
│   └── main.py                # FastAPI REST API & search endpoints
└── frontend/
    └── app.py                 # Streamlit tactical command dashboard with Folium maps
```

---

## 🚀 Quick Start Guide

### 1. Installation
Clone this repository and install dependencies:
```bash
git clone https://github.com/ba4351127-code/RakshaPath.git
cd RakshaPath
pip install -r requirements.txt
```

### 2. Start Backend API
```bash
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
API runs at `http://localhost:8000` (Swagger docs at `http://localhost:8000/docs`).

### 3. Start Frontend Dashboard
```bash
python -m streamlit run frontend/app.py --server.port 8501
```
Open `http://localhost:8501` in your browser.

---

## 🛡️ License
Distributed under the MIT License. Built for national disaster resilience.
