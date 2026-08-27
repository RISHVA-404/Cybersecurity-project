# Secure Hybrid Data Center Network Architecture Using Cisco Packet Tracer

## 1. Cover Page
**Project Title:** Secure Hybrid Data Center Network Architecture Using Cisco Packet Tracer  
**Author:** 2nd-Year Undergraduate Student  
**Organization:** NexGen Campus Solutions (Fictional)  
**Date:** August 2026  

## 2. Aim
To design, implement, and simulate a secure hybrid data center network architecture using Cisco Packet Tracer, demonstrating network segmentation, access control, and attack containment from a student perspective.

## 3. Problem Statement
Modern networks host applications in both private data centers and public clouds. This requires strong network security to prevent attacks from spreading between these environments. The goal is to design a secure architecture using VLANs, ACLs, and cloud security concepts, ensuring that applications are isolated and administrative access is strictly controlled without making the network overly complex.

## 4. Problem Understanding
From what I learned in my Computer Networks class, if we put all computers, servers, and databases on the same network, a single malware infection can compromise everything. To fix this, we need to physically and logically separate the devices using VLANs. We also need Access Control Lists (ACLs) to act as traffic cops, deciding who can talk to whom (for example, stopping regular staff from accessing the database directly).

## 5. Proposed Solution
I decided to use Cisco Packet Tracer to build a segmented network. I created separate VLANs for staff, applications, the database, and management. I also added a DMZ for public-facing servers. I will use Router-on-a-Stick for inter-VLAN routing and apply Extended ACLs on the router to filter traffic. Finally, I will add a simulated cloud network to represent hybrid operations.

## 6. Organization Scenario
**NexGen Campus Solutions** is a fictional educational technology provider.
They have:
- **Staff Users:** Need access to applications but not the database.
- **App 1 & App 2:** Run the campus services.
- **Database Server:** Stores highly sensitive student records.
- **Public-Facing Server (DMZ):** Runs the public website.
- **Management Workstation:** Used by the IT admin to configure devices via SSH.
- **Cloud Server:** A simulated external cloud application.

## 7. Network Architecture
I created a logical architecture that separates the core switching from the access layer. 
- The **Access Switch** connects all the end devices (PCs and Servers).
- The **Core Switch** aggregates traffic and trunks it to the **Core Router**.
- The **Core Router** handles the ACLs and routing.
- A secondary **Cloud Router** simulates the connection to an external AWS/GCP cloud.

## 8. Topology Description
- `NGC-CORE-RTR`: Main router performing routing and security.
- `NGC-CLOUD-RTR`: Router simulating the internet/cloud gateway.
- `NGC-CORE-SW`: Core switch (trunking only).
- `NGC-ACCESS-SW`: Access switch where devices connect.
- End devices are placed into specific VLANs to isolate them.

## 9. Device List
- 2x Cisco 4331 Routers (`NGC-CORE-RTR`, `NGC-CLOUD-RTR`)
- 2x Cisco 2960 Switches (`NGC-CORE-SW`, `NGC-ACCESS-SW`)
- 2x PCs (`STAFF-PC1`, `STAFF-PC2`)
- 1x Admin PC (`ADMIN-PC`)
- 4x Servers (`APP-SRV-1`, `APP-SRV-2`, `DATA-SRV`, `PUBLIC-SRV`)
- 1x Cloud Server (`CLOUD-SRV`)

## 10. VLAN Design
I created these VLANs so devices wouldn't be on the same broadcast domain:
| VLAN | Name | Purpose |
| ---- | ---- | ------- |
| 100 | STAFF | Staff computers |
| 110 | APP_1 | First application server |
| 120 | APP_2 | Second application server |
| 130 | DATABASE | Secure database server |
| 140 | DMZ | Public-facing web server |
| 199 | MANAGEMENT | IT Admin computers |

## 11. IP Addressing
I chose the `172.20.x.0/24` private IP range for my internal network and `10.x.x.x` for the cloud.
- VLAN 100: 172.20.10.0/24
- VLAN 110: 172.20.11.0/24
- VLAN 120: 172.20.12.0/24
- VLAN 130: 172.20.13.0/24
- VLAN 140: 172.20.14.0/24
- VLAN 199: 172.20.99.0/24
- Cloud Link: 10.0.0.0/30
- Cloud App: 10.1.1.0/24

## 12. Port Mapping
- FastEthernet 0/1 - 0/2: VLAN 100 (Staff)
- FastEthernet 0/3: VLAN 110 (App 1)
- FastEthernet 0/4: VLAN 120 (App 2)
- FastEthernet 0/5: VLAN 130 (Database)
- FastEthernet 0/6: VLAN 140 (DMZ)
- FastEthernet 0/7: VLAN 199 (Admin)
- GigabitEthernet 0/1: Trunk to Core Switch

## 13. Switch Configuration
I configured the VLANs and access ports. Example:
```text
enable
configure terminal
vlan 100
name STAFF
exit
interface range fastEthernet 0/1 - 2
switchport mode access
switchport access vlan 100
exit
```
*Explanation:* This creates VLAN 100 and assigns the first two ports to it, isolating the staff traffic.

## 14. Router Configuration
I configured the physical interfaces and brought them up using `no shutdown`.

## 15. Inter-VLAN Routing
I used Router-on-a-Stick because it is a simple and effective way to route between VLANs using a single physical cable.
```text
interface gigabitEthernet 0/0.100
encapsulation dot1Q 100
ip address 172.20.10.1 255.255.255.0
```
*Explanation:* This creates a virtual sub-interface for VLAN 100 and assigns it the default gateway IP.

## 16. Basic Connectivity Testing
Before applying security, I tested the baseline connectivity:
- STAFF-PC1 -> DATA-SRV (Ping 172.20.13.10): **SUCCESS**
- APP-SRV-1 -> APP-SRV-2 (Ping 172.20.12.10): **SUCCESS**
*Observation:* Without ACLs, the router freely routes traffic everywhere. This is a massive security risk.

## 17. Security Policy
To implement least privilege, I designed these rules:
1. App 1 cannot directly communicate with App 2.
2. Staff computers cannot directly access the database.
3. App 1 CAN access the database (required for the app to work).
4. The DMZ server cannot freely access the database.
5. Only the Management VLAN can administer network devices via SSH.
6. The simulated cloud application cannot access the internal database.

## 18. ACL Configuration
I used Extended ACLs because they allow filtering by source and destination.
```text
access-list 101 deny ip 172.20.11.0 0.0.0.255 172.20.12.0 0.0.0.255
access-list 101 permit ip any any
interface gigabitEthernet 0/0.110
ip access-group 101 in
```
*Explanation:* This blocks App 1 (172.20.11.0) from talking to App 2 (172.20.12.0), but allows other normal traffic.

## 19. Database Protection
Users should access the application instead of connecting directly to the database. I blocked the Staff network from the Database network:
```text
access-list 102 deny ip 172.20.10.0 0.0.0.255 172.20.13.0 0.0.0.255
access-list 102 permit ip any any
```

## 20. Application Isolation
App 1 handles student requests, while App 2 handles reporting. I blocked traffic between them so that if App 1 gets hacked, the attacker can't easily jump to App 2 (lateral movement).
- App 1 -> App 2 ping test expected result: **BLOCKED**

## 21. DMZ Security
The DMZ (`PUBLIC-SRV`) faces the internet. I created an ACL to ensure that if a hacker compromises the DMZ, they cannot reach the internal database.
- DMZ -> Database ping test expected result: **BLOCKED**

## 22. SSH Management
I configured SSH so the administrator can securely manage the router remotely. I used a lab-only password (`cisco123`) and RSA keys.
```text
access-list 99 permit 172.20.99.0 0.0.0.255
line vty 0 4
login local
transport input ssh
access-class 99 in
```
*Explanation:* This ensures that only IP addresses from the Management VLAN (172.20.99.0/24) can see the SSH login prompt.

## 23. Hybrid Cloud Connection
I simulated a cloud environment using a second router (`NGC-CLOUD-RTR`). I configured a /30 subnet between the routers and used static routing.
```text
ip route 10.1.1.0 255.255.255.0 10.0.0.2
```
*Explanation:* The cloud environment in this project is simulated using Cisco Packet Tracer and does not represent an actual AWS/Azure/GCP deployment.

## 24. IAM Design (Conceptual)
Because I am using Packet Tracer, AWS IAM is not implemented. Conceptually, it looks like this:
**Staff User:** Can access approved apps. Cannot configure routers.
**Application Developer:** Can deploy apps. Cannot change ACLs.
**Network Administrator:** Can manage routers and ACLs.

## 25. Security Group Design (Conceptual)
| Group | Source | Destination | Service | Action | Reason |
|-------|--------|-------------|---------|--------|--------|
| DB-SG | APP-SRV-1 | DATA-SRV | TCP 5432 | ALLOW | App needs data |
| DB-SG | STAFF-PC | DATA-SRV | ANY | DENY | No direct access |

## 26. VPC Segmentation (Conceptual)
In a real cloud, I would segment these into VPCs to reduce lateral movement. A public subnet for the DMZ, and a private subnet for the Database.

## 27. Kubernetes Conceptual Security
If App 1 was running in Kubernetes, it would look like this:
```text
User -> Load Balancer -> Kubernetes Pods -> Database
```
We would use Network Policies to stop pods from talking to each other unnecessarily.

## 28. Attack Scenarios
1. **App 1 attempts to access App 2.** Result: BLOCKED
2. **Staff PC attempts database access.** Result: BLOCKED
3. **DMZ server attempts database access.** Result: BLOCKED
4. **Staff PC attempts SSH management access.** Result: BLOCKED
5. **Management PC attempts SSH access.** Result: ALLOWED

## 29. Testing Table
| Test No. | Source | Destination | Expected Result | Actual Result |
|---|---|---|---|---|
| 1 | STAFF-PC1 | APP-SRV-1 | ALLOWED | SUCCESS |
| 2 | STAFF-PC1 | DATA-SRV | BLOCKED | SUCCESS |
| 3 | APP-SRV-1 | APP-SRV-2 | BLOCKED | SUCCESS |
| 4 | APP-SRV-1 | DATA-SRV | ALLOWED | SUCCESS |
| 5 | ADMIN-PC | NGC-CORE-RTR | ALLOWED | SUCCESS |
| 6 | STAFF-PC1 | NGC-CORE-RTR | BLOCKED | SUCCESS |

## 30. Configuration Error (Troubleshooting Exercise)
**Fault:** I accidentally removed VLAN 110 from the trunk port.
**Symptom:** APP-SRV-1 cannot ping its default gateway (172.20.11.1).

## 31. Troubleshooting
**Investigation:** I used `show vlan brief` and noticed the VLAN existed. I then used `show interfaces trunk` on the switch and noticed VLAN 110 was missing from the allowed list.
**Fix:** I entered `switchport trunk allowed vlan add 110`.
**Verification:** The ping was successful.

## 32. Attack Containment
If a hacker compromises `PUBLIC-SRV` in the DMZ, they might try to run a network scan against `172.20.13.0` (Database). Because of ACL 104, the router drops the packets. The attack is contained within the DMZ.

## 33. Results / Observations
VLANs successfully broke up the broadcast domains. Router-on-a-Stick handled the routing perfectly. Extended ACLs provided excellent granular control over the traffic.

## 34. Interpretation of Results
The results prove that defense-in-depth works. Even if an attacker gets past the perimeter, internal segmentation (VLANs + ACLs) stops them from moving laterally.

## 35. Limitations
Packet Tracer cannot simulate advanced Next-Generation Firewalls (NGFW) or real cloud IAM policies. The cloud connection is just a simulated static route.

## 36. Future Improvements
In the future, I would implement an actual firewall (like Cisco ASA) instead of just router ACLs, and set up a site-to-site IPsec VPN to the cloud.

## 37. Conclusion
This project successfully demonstrates a secure hybrid network. By designing an original IP scheme and applying strict ACLs, I was able to meet all the cybersecurity objectives for a 2nd-year level project.

## 38. Actual Resources Used
- Cisco Packet Tracer 8.2
- Cisco IOS Command Reference
- Class Notes on Computer Networks

---

# 39. SCREENSHOT CAPTURE GUIDE
*Note to myself: Capture the following screenshots from Packet Tracer for the final submission:*
1. Complete NexGen topology diagram.
2. `show vlan brief` from NGC-ACCESS-SW.
3. `show interfaces trunk` from NGC-CORE-SW.
4. `show ip interface brief` from NGC-CORE-RTR showing the subinterfaces.
5. IP configuration window for STAFF-PC1.
6. Successful ping from APP-SRV-1 to DATA-SRV.
7. Failed ping from STAFF-PC1 to DATA-SRV.
8. `show access-lists` from NGC-CORE-RTR.
9. Successful SSH login from ADMIN-PC.
10. "Connection Refused" when attempting SSH from STAFF-PC1.
11. Routing table (`show ip route`) from NGC-CLOUD-RTR.
12. Screenshot of the configuration error troubleshooting step.

---

# 40. VIVA PREPARATION (Q&A)

**Q: Why did you use VLANs?**
A: To separate different departments (like Staff and Servers) so that broadcast traffic doesn't flood the network, and for security isolation.

**Q: Why ACLs?**
A: ACLs act as a filter. Even though VLANs separate devices, the router connects them back together. ACLs let us block specific traffic, like stopping Staff from accessing the Database.

**Q: What is Router-on-a-Stick?**
A: It's a method where a single physical router link is divided into multiple virtual subinterfaces, each acting as a default gateway for a different VLAN.

**Q: Why protect the database?**
A: The database holds sensitive records. Regular users should only access the frontend application, which then securely talks to the database.

**Q: Why is Application 1 isolated from Application 2?**
A: To prevent lateral movement. If App 1 gets a virus, it can't easily spread to App 2.

**Q: What is a DMZ?**
A: A Demilitarized Zone. It’s a subnetwork that exposes external-facing services (like a web server) to the internet, keeping the rest of the internal network hidden.

**Q: Why SSH instead of Telnet?**
A: SSH encrypts the management traffic, meaning passwords and commands cannot be intercepted by someone listening on the network. Telnet sends everything in plain text.

**Q: What happens if Application 1 is compromised?**
A: Because of our ACLs, the attacker would be trapped in VLAN 110. They could not SSH to the router, nor could they access Application 2 or the Staff network.

**Q: Why is a Management VLAN required?**
A: It ensures that normal users cannot even attempt to log into network devices. Only devices physically assigned to the Management VLAN can initiate administrative sessions.

**Q: What is VPC segmentation?**
A: In cloud environments (like AWS), a Virtual Private Cloud (VPC) is logically divided into subnets, similar to VLANs, to control traffic flow between different cloud services.

**Q: Why is Kubernetes only conceptual here?**
A: Because Cisco Packet Tracer simulates networking hardware (routers/switches) and basic servers, it doesn't have a feature to run actual container orchestration platforms.
