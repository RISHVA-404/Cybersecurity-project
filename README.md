# SentinelMesh — Secure Hybrid Datacenter Architecture

🎉 **[CLICK HERE TO VIEW THE LIVE INTERACTIVE PROJECT]** (https://rishva-404.github.io/Cybersecurity-project/) 🎉

SentinelMesh is a specialized cybersecurity simulation designed to solve the challenges of **Secure Hybrid Datacenter Network Architecture**. 

As enterprise applications transition to hybrid workloads (spanning private data centers and public clouds like AWS/GCP), this project demonstrates how to securely orchestrate Kubernetes microservices (EKS/GKE/OpenShift) while balancing simplicity, security, and scale.

## 🎯 Problem Statement & Solutions

This platform was built to directly address the following architectural challenges:

### 1. How should IAM function?
**Solution:** (View the **IAM Simulator**)
The project implements a Zero-Trust Role-Based Access Control (RBAC) model. Faculty, students, and network engineers are dynamically evaluated based on Clearance Levels. The system ensures that users working remotely or on-campus have secure, uninterrupted access to teaching tools, while simultaneously blocking unauthorized access to sensitive hybrid workloads.

### 2. What kind of security groups must be utilized?
**Solution:** (View the **Policy Lab**)
The project demonstrates the use of strict, port-level Security Group policies. Instead of traditional perimeter security, policies are applied between micro-segments. You can toggle ALLOW/DENY rules in real-time to see how security groups govern traffic between the public cloud VPCs and the private datacenter.

### 3. How can applications be segmented in VPCs to mitigate attack spreading?
**Solution:** (View the **Security Twin** & **Incident Center**)
The platform maps the infrastructure into distinct Trust Zones (e.g., Campus DMZ, Application VPC, Private Data Center). If a single Kubernetes microservice is compromised, you can use the **Incident Center** to simulate the attack. The custom *Blast Radius Engine* calculates the spread, proving that strict VPC segmentation actively mitigates the attack and prevents it from propagating into the enterprise network.

---

## 🧪 How to Test This Project (For Evaluators)

This live environment is a fully functional simulation where you can input data, trigger attacks, and observe how the hybrid security architecture responds.

1. **Visualize the Network Topology:** Navigate to the **Security Twin** tab to view the interactive node-graph mapping the infrastructure across 7 security zones. Green lines represent active security group rules.
2. **Simulate a Cyberattack:** Navigate to the **Incident Center** tab. Click **"Simulate New Incident"** to watch the Blast Radius Engine calculate how segmentation limits the spread of malware.
3. **Evaluate Access Control:** Navigate to the **IAM Simulator** tab. Select a User Role (e.g., Faculty) and a Target Asset (e.g., Database VPC) to see how hybrid IAM policies enforce Least Privilege.

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Visualization:** React Flow (for node-based network mapping)
- **Data Engine:** Serverless Simulation Engine (TypeScript implementation of the Blast Radius Algorithm)
- **Deployment:** GitHub Pages

*Note: This repository contains the complete source code. The live demo has been compiled into a serverless Edge application for seamless browser execution and evaluation.*
