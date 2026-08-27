# Deliverable 2: Network Design Document

## 1. Problem Understanding
Modern enterprise applications are hybrid, extending from private data centers to public clouds. This poses significant security risks. If an application in the public cloud is compromised, the attack can propagate to the internal private data center if proper segmentation and access controls are not implemented. This project designs a secure hybrid network architecture using VLANs, ACLs, and cloud security policies to ensure that application components are isolated and administrative access is strictly controlled.

## 2. Architecture Diagram (Logical)

```text
[Cloud Network] 
   | (172.16.10.0/24)
[ CLOUD-APP ]
   |
[ CLOUD-R1 ] (200.1.1.2)
   |
   | (WAN Link - 200.1.1.0/30)
   |
[ DC-R1 ] (200.1.1.1)
   |
   | (Trunk Link - 802.1Q)
   |
[ CORE-SW1 ]
   |
   +--- [ DMZ-SERVER ] (VLAN 50)
   |
[ ACCESS-SW2 ]
   |
   +--- [ FACULTY-PC1 ] (VLAN 10)
   +--- [ FACULTY-PC2 ] (VLAN 10)
   +--- [ MGMT-PC ]     (VLAN 99)
   +--- [ APP-A-SERVER ](VLAN 20)
   +--- [ APP-B-SERVER ](VLAN 30)
   +--- [ DB-SERVER ]   (VLAN 40)
```

## 3. Device List
- **DC-R1**: Data Center Edge Router (Router-on-a-stick)
- **CLOUD-R1**: Cloud Gateway Router
- **CORE-SW1**: Core Layer Switch
- **ACCESS-SW2**: Access Layer Switch
- **FACULTY-PC1 / FACULTY-PC2**: End-user PCs
- **MGMT-PC**: Network Administrator PC
- **APP-A-SERVER**: Application A
- **APP-B-SERVER**: Application B
- **DB-SERVER**: Private Database
- **DMZ-SERVER**: Public-facing DMZ Server
- **CLOUD-APP**: Simulated Kubernetes Pod in Public Cloud

## 4. VLAN Design
| VLAN ID | Name | Subnet | Gateway |
|---------|------|--------|---------|
| 10 | FACULTY | 192.168.10.0/24 | 192.168.10.1 |
| 20 | APP_A | 192.168.20.0/24 | 192.168.20.1 |
| 30 | APP_B | 192.168.30.0/24 | 192.168.30.1 |
| 40 | DATABASE | 192.168.40.0/24 | 192.168.40.1 |
| 50 | DMZ | 192.168.50.0/24 | 192.168.50.1 |
| 99 | MANAGEMENT | 192.168.99.0/24 | 192.168.99.1 |

## 5. IP Addressing
*See Testing Report for End-Device IP assignments.*

## 6. Routing Design
**Static Routing:**
- DC-R1 -> Cloud Network: `ip route 172.16.10.0 255.255.255.0 200.1.1.2`
- CLOUD-R1 -> Data Center: `ip route 192.168.0.0 255.255.0.0 200.1.1.1`

## 7. ACL & Security Policies
- **Rule 1 (App Isolation):** App A (VLAN 20) denied access to App B (VLAN 30).
- **Rule 2 (Database Protection):** Faculty (VLAN 10) denied direct access to DB (VLAN 40).
- **Rule 3 (App to DB):** App A (VLAN 20) allowed access to DB (VLAN 40).
- **Rule 4 (Secure Management):** Only MGMT-PC (VLAN 99) can SSH to DC-R1. Faculty SSH is denied via VTY ACL.
- **Rule 5 (DMZ Isolation):** Internet/DMZ denied access to Database (VLAN 40).
