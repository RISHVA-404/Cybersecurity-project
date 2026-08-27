# Deliverable 3: Cloud Security Design

## 1. IAM Roles Architecture
As the project integrates public cloud (AWS/GCP) workloads, strict Identity and Access Management (IAM) must be defined.

### IAM ROLE 1 – FACULTY
**Allowed:**
- Teaching applications (read-only)
- Research repositories (read/write)
- Approved cloud services

**Not Allowed:**
- Router/Switch configuration
- Database administration
- Security Group modification

### IAM ROLE 2 – APPLICATION DEVELOPER
**Allowed:**
- Application deployment to Kubernetes (EKS/GKE)
- Application logs (CloudWatch/Stackdriver)
- Application monitoring

**Not Allowed:**
- Core network configuration
- Security policy modification without authorization
- Direct production database access

### IAM ROLE 3 – NETWORK ADMINISTRATOR
**Allowed:**
- Router and Switch administration
- Network security configuration
- VPN/Direct Connect management

## 2. Cloud Security Groups (AWS SG Equivalent)

### Application A Security Group (Simulated in AWS)
| Source | Protocol/Service | Action |
|--------|------------------|--------|
| Faculty Network (VLAN 10) | HTTPS (443) | Allow |
| Application B (VLAN 30) | Unnecessary traffic | Deny |
| Internet | Direct internal access | Deny |

### Database Security Group
| Source | Service | Action |
|--------|---------|--------|
| Application A | Required database service (PostgreSQL 5432) | Allow |
| Faculty | Direct database access | Deny |
| Public Internet | Any | Deny |

## 3. VPC Segmentation Design
To reduce lateral movement during a breach, workloads are strictly segmented:

- **VPC / NETWORK 1:** Faculty Services (VLAN 10)
- **VPC / NETWORK 2:** Application A (VLAN 20)
- **VPC / NETWORK 3:** Application B (VLAN 30)
- **VPC / NETWORK 4:** Database (VLAN 40)
- **VPC / CLOUD 1:** Kubernetes Microservices (172.16.10.x)

*Objective:* Only necessary communication (e.g., App A to DB) is permitted.

## 4. Kubernetes Application Isolation (Conceptual)
Cloud-native workloads running in Kubernetes require internal segmentation.

```text
  USER
   |
   v
LOAD BALANCER
   |
   v
KUBERNETES CLUSTER (Cloud App Network)
   |
 ---------------------
 |         |         |
APP POD   APP POD   APP POD
 |
 v
DATABASE (VLAN 40)
```

**Workload Protection Mechanisms:**
- **Network Policies (Calico/Cilium):** Restricts pod-to-pod communication within the cluster.
- **IAM (IRSA):** Pods are assigned specific IAM roles rather than node-level access.
- **Security Groups:** Node groups are restricted from communicating with the private data center except over specific required ports.
