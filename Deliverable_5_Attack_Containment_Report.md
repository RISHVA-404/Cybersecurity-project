# Deliverable 5: Attack Containment Report

This report evaluates how the secure hybrid network architecture mitigates simulated cybersecurity threats.

## Scenario 1: Compromised Application
- **Attack/Symptom:** App A (VLAN 20) is compromised via malware. The malware attempts to scan and access App B (VLAN 30) to propagate.
- **Security Control:** Inter-VLAN routing ACL + Network Segmentation.
- **Result:** **Blocked**. The Extended ACL on DC-R1 drops traffic originating from 192.168.20.0/24 destined for 192.168.30.0/24. Lateral movement is successfully prevented.

## Scenario 2: Insider Threat / Faculty Database Access
- **Attack/Symptom:** A user on a Faculty PC attempts unauthorized direct access to the backend Database server (VLAN 40).
- **Security Control:** Inbound ACL on VLAN 10 (Faculty) sub-interface restricting access to 192.168.40.0/24.
- **Result:** **Blocked**. The router immediately denies the packets. Faculty must access the database indirectly via approved Application servers.

## Scenario 3: External Internet Attack
- **Attack/Symptom:** An external threat actor on the Public Internet attempts to directly access the internal Database server.
- **Security Control:** DMZ Segmentation and Edge Router ACL policy.
- **Result:** **Blocked**. Only DMZ-hosted services (VLAN 50) are exposed to the public network. Traffic from the Internet/DMZ directed at VLAN 40 is explicitly denied.

## Scenario 4: Unauthorized Infrastructure Management
- **Attack/Symptom:** An unauthorized user on the Faculty Network attempts an SSH brute-force attack against the core router's management IP.
- **Security Control:** VTY Line Access-Class ACL (Management network restriction).
- **Result:** **Blocked**. The router's VTY lines only accept SSH connections from the Management network (VLAN 99: 192.168.99.0/24). The connection is instantly refused.

## Scenario 5: Cloud Workload Compromise
- **Attack/Symptom:** A cloud-native Kubernetes pod (Cloud App) is compromised and attempts to extract data from the private data center's Database (VLAN 40).
- **Security Control:** Zero-Trust Hybrid Policy ACL on DC-R1 (Denying 172.16.10.0/24 to 192.168.40.0/24).
- **Result:** **Blocked**. Cloud workloads are not inherently trusted simply because a site-to-site connection exists. The ACL prevents the cloud environment from reaching sensitive private data center resources.
