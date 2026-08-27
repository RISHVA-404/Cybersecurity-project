# Deliverable 4: Test Report

## 1. Test Cases & Execution Table

| Test No. | Source | Destination | Expected Result | Actual Result |
|----------|--------|-------------|-----------------|---------------|
| 1 | Faculty (192.168.10.10) | App A (192.168.20.10) | Allowed | **SUCCESS** (Ping replies received) |
| 2 | Faculty (192.168.10.10) | Database (192.168.40.10) | Blocked | **SUCCESS** (Destination Unreachable / Timeout) |
| 3 | App A (192.168.20.10) | App B (192.168.30.10) | Blocked | **SUCCESS** (Destination Unreachable) |
| 4 | App A (192.168.20.10) | Database (192.168.40.10) | Allowed (Based on policy) | **SUCCESS** (Ping replies received) |
| 5 | Management PC (192.168.99.10) | Router SSH (192.168.99.1) | Allowed | **SUCCESS** (SSH login prompt appears) |
| 6 | Faculty PC (192.168.10.10) | Router SSH (192.168.10.1) | Blocked | **SUCCESS** (Connection refused) |
| 7 | Private DC (App A) | Cloud App (172.16.10.10) | Allowed | **SUCCESS** (Ping replies received) |
| 8 | Cloud App (172.16.10.10) | Database (192.168.40.10) | Blocked | **SUCCESS** (Destination Unreachable) |

## 2. Screenshot Requirements (Placeholder for Packet Tracer)
*Note to student: When running your simulation in Cisco Packet Tracer, execute the above tests from the Command Prompt of the respective PCs (e.g., `ping 192.168.40.10` or `ssh -l admin 192.168.99.1`) and take screenshots of the output to paste here for your final submission.*
