# Cisco Virtual Internship 2026 - Secure Hybrid Data Center

🎉 **[CLICK HERE TO VIEW THE LIVE INTERACTIVE SIMULATION]** (https://rishva-404.github.io/Cybersecurity-project/) 🎉

This repository contains the complete submission for the **Cisco Virtual Internship 2026: Secure Hybrid Data Center Network Architecture** problem statement.

## 📁 Project Deliverables

All required documentation deliverables from the manual have been completed and are located in the root of this repository:

1. **Deliverable 1 (Packet Tracer File):** See `Cisco_Packet_Tracer_Configuration_Commands.txt` for the exact CLI scripts used to configure the `.pkt` file.
2. **Deliverable 2 (Network Design):** See `Deliverable_2_Network_Design.md` (Topology, VLANs, IPs, Routing, ACLs).
3. **Deliverable 3 (Cloud Security Design):** See `Deliverable_3_Cloud_Security_Design.md` (IAM Roles, AWS Security Groups, VPCs).
4. **Deliverable 4 (Test Report):** See `Deliverable_4_Test_Report.md` (Connectivity and ACL validation).
5. **Deliverable 5 (Attack Containment Report):** See `Deliverable_5_Attack_Containment_Report.md` (Analysis of 5 simulated breach scenarios).

---

## 🌐 The Interactive "Security Twin" Web Dashboard

To supplement the Cisco Packet Tracer file and provide a stunning visual demonstration of the Cloud Security concepts (VPCs, IAM, and Kubernetes segmentation), a custom **React-based Web Dashboard** was built.

**Testing the Web Dashboard:**
1. **Security Twin:** Visualizes the network architecture (VLAN 10, VLAN 20, Cloud App Network, etc.) as an interactive map.
2. **Incident Center:** Proves Deliverable 5 (Attack Containment). If you simulate a "Compromised Application" on the Cloud App, the *Blast Radius Engine* proves the ACLs prevent the malware from reaching the Database VLAN.
3. **IAM Simulator:** Proves Deliverable 3 (Cloud Security Design). Select the "Faculty" role and try to access the "Database" to see the Zero-Trust RBAC system explicitly DENY the connection based on the security policy.

## 🛠️ Tech Stack (Web Dashboard)
- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Visualization:** React Flow
- **Hosting:** GitHub Pages
