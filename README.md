# Secure Hybrid Data Center Network Architecture

🎉 **[CLICK HERE TO VIEW THE LIVE INTERACTIVE SIMULATION]** (https://rishva-404.github.io/Cybersecurity-project/) 🎉

This repository contains my complete submission for the Cisco Virtual Internship 2026 problem statement. This project was independently designed from first principles as a 2nd-year undergraduate cybersecurity project.

## 📁 Project Deliverables

All required documentation has been consolidated into a single, comprehensive project report.

1. **Full Project Report:** See `NexGen_Campus_Project_Report.md`. This massive 40-section document covers the entire network architecture, VLAN design, routing, ACL configurations, attack scenarios, troubleshooting, and Viva preparation.
2. **Packet Tracer Configurations:** See `Cisco_Packet_Tracer_Configuration_Commands.txt` for the exact, copy-pasteable CLI commands used to configure the `.pkt` file.

---

## 🌐 The Interactive "Security Twin" Web Dashboard

To supplement the Cisco Packet Tracer file and provide a visual demonstration of the Cloud Security concepts (VPCs, IAM, and Kubernetes segmentation), a custom **React-based Web Dashboard** was built.

**Testing the Web Dashboard:**
1. **Security Twin:** Visualizes the NexGen Campus network architecture (VLAN 100, VLAN 110, Cloud App Network, etc.) as an interactive map.
2. **Incident Center:** Simulates a "Compromised Application" on the Cloud App. The *Blast Radius Engine* proves the ACLs prevent the malware from reaching the Database VLAN.
3. **IAM Simulator:** Select the "Staff User" role and try to access the "Database" to see the Zero-Trust RBAC system explicitly DENY the connection based on the security policy.

## 🛠️ Tech Stack (Web Dashboard)
- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Visualization:** React Flow
- **Hosting:** GitHub Pages
