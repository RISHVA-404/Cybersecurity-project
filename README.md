# SentinelMesh — Adaptive Hybrid Network Security & Attack Containment Platform

SentinelMesh is a college-level educational cybersecurity simulation project. It provides a **Digital Security Twin** to model hybrid network architectures (campus and cloud), visualize trust zones, simulate identity and access management (IAM), and test security policies. 

Its central feature is the **Blast Radius Engine**, which calculates potential propagation paths and risk scores when an asset is compromised.

> **Disclaimer:** This project is entirely a **defensive simulation**. It uses synthetic, locally generated data to visualize security boundaries and enforce policies. It does NOT perform real attacks, unauthorized scanning, exploitation, credential attacks, or attacks against external systems.

## Key Features

1. **Digital Security Twin (Network Topology):** An interactive React Flow graph showing Campus Networks, DMZs, Cloud VPCs, and their allowed communication channels.
2. **Blast Radius Engine:** An original algorithm that determines the potential spread of an incident across trust boundaries using BFS graph traversal.
3. **What-If Security Simulator (Policy Lab):** A real-time simulator where administrators can toggle security rules (Allow/Deny) and immediately observe changes in attack surface and risk scores.
4. **IAM Simulator:** Tests role-based access control and least-privilege principles by evaluating user clearance against a zone's required trust level.
5. **Incident Response Simulator:** Simulates anomalous behavior, lateral movement attempts, and compromised assets to trigger the containment workflow.

## Tech Stack

* **Backend:** Python, FastAPI, SQLAlchemy, NetworkX, SQLite
* **Frontend:** React (Vite), TypeScript, Tailwind CSS, React Flow, Recharts

## Architecture

SentinelMesh uses a modular architecture:
- **Models:** Defines `Zone`, `Asset`, `User`, `Role`, `SecurityRule`, and `Incident`.
- **Engine:** `BlastRadiusEngine` constructs a directed graph of network topology and security rules to calculate risk.
- **API:** RESTful endpoints for the frontend to interact with the simulated environment.
- **Frontend UI:** Professional SOC-style interface for monitoring and policy configuration.

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 24+

### Backend Setup
```bash
cd backend
python -m venv venv
# On Windows: .\venv\Scripts\activate
# On Unix: source venv/bin/activate
pip install fastapi uvicorn sqlalchemy pydantic networkx
uvicorn app.main:app --reload --port 8000
```
*Note: The SQLite database (`sentinelmesh.db`) is automatically seeded with fictional zones, assets, and rules on the first run.*

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Usage

1. **Dashboard:** View overall security posture, active incidents, and recent security events.
2. **Security Twin:** Visualize the network topology. Green animated lines represent allowed connections across trust boundaries.
3. **Policy Lab:** Toggle rules between ALLOW and DENY. Observe how turning off segmentation increases the risk surface in the network.
4. **IAM Simulator:** Test if a user's role grants them clearance to access an asset based on the asset's underlying zone trust level.
5. **Incident Center:** Trigger synthetic incidents (e.g., "Compromised Application") and analyze the blast radius report.

## Future Enhancements
- Integration with live log ingestion (e.g., ELK stack).
- More complex pathfinding algorithms factoring in specific port/protocol vulnerabilities.
- Multi-factor authentication (MFA) simulation states.

## Author
College Cybersecurity Capstone / Simulation Project
