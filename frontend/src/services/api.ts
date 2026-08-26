// Local in-memory database simulating the backend

let db = {
    zones: [
        { id: 1, name: "Public Guest Wi-Fi", trust_level: 1, description: "Unsecured public zone" },
        { id: 2, name: "Student Zone", trust_level: 3, description: "Authenticated students" },
        { id: 3, name: "Faculty Zone", trust_level: 5, description: "Faculty and staff devices" },
        { id: 4, name: "Campus DMZ", trust_level: 4, description: "Internet facing services" },
        { id: 5, name: "Application VPC (Cloud)", trust_level: 7, description: "Cloud native apps" },
        { id: 6, name: "Database VPC (Cloud)", trust_level: 9, description: "Sensitive DB cluster" },
        { id: 7, name: "Private Data Center", trust_level: 10, description: "Highly restricted internal IT" }
    ],
    assets: [
        { id: 1, name: "Guest Mobile", ip_address: "10.0.1.15", type: "Endpoint", criticality: 1, zone_id: 1 },
        { id: 2, name: "Student Laptop", ip_address: "10.0.2.100", type: "Endpoint", criticality: 3, zone_id: 2 },
        { id: 3, name: "Faculty Desktop", ip_address: "10.0.3.50", type: "Endpoint", criticality: 5, zone_id: 3 },
        { id: 4, name: "Web Server", ip_address: "10.0.4.10", type: "Server", criticality: 7, zone_id: 4 },
        { id: 5, name: "K8s Cluster", ip_address: "172.16.1.5", type: "Container", criticality: 8, zone_id: 5 },
        { id: 6, name: "PostgreSQL Primary", ip_address: "172.16.2.10", type: "Database", criticality: 10, zone_id: 6 },
        { id: 7, name: "Student Records System", ip_address: "192.168.1.50", type: "Server", criticality: 10, zone_id: 7 },
    ],
    rules: [
        { id: 1, source_zone_id: 1, dest_zone_id: 4, protocol: "HTTPS", port: "443", action: "ALLOW", priority: 100 },
        { id: 2, source_zone_id: 1, dest_zone_id: 6, protocol: "ANY", port: "ANY", action: "DENY", priority: 50 },
        { id: 3, source_zone_id: 2, dest_zone_id: 5, protocol: "HTTPS", port: "443", action: "ALLOW", priority: 100 },
        { id: 4, source_zone_id: 3, dest_zone_id: 7, protocol: "TCP", port: "3389", action: "ALLOW", priority: 100 },
        { id: 5, source_zone_id: 4, dest_zone_id: 5, protocol: "API", port: "8080", action: "ALLOW", priority: 100 },
        { id: 6, source_zone_id: 5, dest_zone_id: 6, protocol: "TCP", port: "5432", action: "ALLOW", priority: 100 },
    ],
    roles: [
        { id: 1, name: "Guest", permissions: "read:public" },
        { id: 2, name: "Student", permissions: "read:public,read:student" },
        { id: 3, name: "Faculty", permissions: "read:public,read:student,read:faculty" },
        { id: 4, name: "IT Admin", permissions: "all" },
        { id: 5, name: "Security Analyst", permissions: "read:all" },
        { id: 6, name: "Cloud Engineer", permissions: "read:cloud,write:cloud" }
    ],
    users: [
        { id: 1, username: "guest_user", role_id: 1 },
        { id: 2, username: "alice_student", role_id: 2 },
        { id: 3, username: "bob_faculty", role_id: 3 },
        { id: 4, username: "charlie_admin", role_id: 4 },
        { id: 5, username: "diana_sec", role_id: 5 },
        { id: 6, username: "eve_cloud", role_id: 6 }
    ],
    incidents: [] as any[]
};

const simulateDelay = <T>(data: T): Promise<T> => new Promise(resolve => setTimeout(() => resolve(data), 100));

export const fetchTopology = async () => {
    const nodes: any[] = [];
    const edges: any[] = [];

    db.zones.forEach((zone, i) => {
        nodes.push({
            id: `Z_${zone.id}`,
            type: "default",
            position: { x: 100 + (i % 3) * 300, y: 100 + Math.floor(i / 3) * 250 },
            data: { label: `${zone.name} (Trust: ${zone.trust_level})` }
        });

        const zoneAssets = db.assets.filter(a => a.zone_id === zone.id);
        zoneAssets.forEach((asset, j) => {
            nodes.push({
                id: `A_${asset.id}`,
                type: "default",
                position: { x: 100 + (i % 3) * 300 + j * 60, y: 100 + Math.floor(i / 3) * 250 + 70 },
                data: { label: asset.name }
            });
            edges.push({
                id: `e_Z${zone.id}_A${asset.id}`,
                source: `Z_${zone.id}`,
                target: `A_${asset.id}`,
                animated: false,
                style: { stroke: "#ccc" }
            });
        });
    });

    db.rules.forEach(rule => {
        if (rule.action === "ALLOW") {
            edges.push({
                id: `rule_${rule.id}`,
                source: `Z_${rule.source_zone_id}`,
                target: `Z_${rule.dest_zone_id}`,
                animated: true,
                style: { stroke: "#10b981", strokeWidth: 2 }
            });
        }
    });

    return simulateDelay({ nodes, edges });
};

// BFS Blast Radius Engine ported to TypeScript
const calculateBlastRadius = (assetId: number) => {
    const startNode = `A_${assetId}`;
    
    // Build adjacency list
    const graph: Record<string, string[]> = {};
    const edgesList: any[] = [];
    
    db.assets.forEach(asset => {
        const aNode = `A_${asset.id}`;
        const zNode = `Z_${asset.zone_id}`;
        if (!graph[aNode]) graph[aNode] = [];
        if (!graph[zNode]) graph[zNode] = [];
        graph[aNode].push(zNode);
        graph[zNode].push(aNode);
    });

    db.rules.forEach(rule => {
        if (rule.action === "ALLOW") {
            const szNode = `Z_${rule.source_zone_id}`;
            const dzNode = `Z_${rule.dest_zone_id}`;
            if (!graph[szNode]) graph[szNode] = [];
            graph[szNode].push(dzNode);
        }
    });

    const visited = new Set<string>();
    const queue = [startNode];
    const affectedAssets: any[] = [];
    const pathTree: any[] = [];
    let riskScore = 0;

    while (queue.length > 0) {
        const current = queue.shift()!;
        if (!visited.has(current)) {
            visited.add(current);

            if (current.startsWith("A_")) {
                const id = parseInt(current.split("_")[1]);
                const asset = db.assets.find(a => a.id === id);
                if (asset) {
                    affectedAssets.push(asset);
                    const zone = db.zones.find(z => z.id === asset.zone_id);
                    if (zone) {
                        riskScore += asset.criticality * (11 - zone.trust_level);
                    }
                }
            }

            const neighbors = graph[current] || [];
            neighbors.forEach(neighbor => {
                if (!visited.has(neighbor)) {
                    queue.push(neighbor);
                    pathTree.push({ source: current, target: neighbor, type: "connection" });
                }
            });
        }
    }

    return {
        start_asset: assetId,
        total_affected_assets: affectedAssets.length,
        affected_assets: affectedAssets,
        risk_score: riskScore,
        propagation_paths: pathTree
    };
};

export const simulateIncident = async (scenario: string) => {
    const targetAsset = db.assets[Math.floor(Math.random() * db.assets.length)];
    let title, description, severity;

    if (scenario === "Compromised Application") {
        title = "Malware Detected on Application";
        description = `Suspicious outbound connections from ${targetAsset.name}.`;
        severity = "High";
    } else if (scenario === "Privilege Violation") {
        title = "Excessive Access Attempt";
        description = `User attempted to access ${targetAsset.name} beyond role permissions.`;
        severity = "Medium";
    } else {
        title = "Traffic Anomaly";
        description = `Unusual spike in traffic at ${targetAsset.name}.`;
        severity = "Low";
    }

    const incident = {
        id: db.incidents.length + 1,
        title,
        description,
        affected_asset_id: targetAsset.id,
        severity,
        status: "ANALYZED",
        timestamp: new Date().toISOString()
    };

    db.incidents.unshift(incident);

    const analysis = calculateBlastRadius(targetAsset.id);

    return simulateDelay({
        incident,
        blast_radius_analysis: analysis
    });
};

export const fetchIncidents = async () => {
    return simulateDelay(db.incidents);
};

export const fetchRules = async () => {
    return simulateDelay(db.rules);
};

export const updateRuleAction = async (ruleId: number, action: string) => {
    const rule = db.rules.find(r => r.id === ruleId);
    if (rule) {
        rule.action = action;
    }
    return simulateDelay(rule);
};

export const fetchUsers = async () => {
    const usersWithRoles = db.users.map(u => ({
        ...u,
        role: db.roles.find(r => r.id === u.role_id)
    }));
    return simulateDelay(usersWithRoles);
};

export const fetchAssets = async () => {
    return simulateDelay(db.assets);
};

export const evaluateIAM = async (userId: number, assetId: number) => {
    const user = db.users.find(u => u.id === userId);
    const asset = db.assets.find(a => a.id === assetId);
    if (!user || !asset) throw new Error("Not found");
    
    const role = db.roles.find(r => r.id === user.role_id);
    const zone = db.zones.find(z => z.id === asset.zone_id);

    const role_clearance_map: Record<string, number> = {
        "Student": 3,
        "Faculty": 5,
        "IT Admin": 10,
        "Security Analyst": 10,
        "Cloud Engineer": 8,
        "Guest": 1
    };

    const clearance = role_clearance_map[role!.name] || 1;
    const required_trust = zone!.trust_level;

    let decision, explanation;
    if (clearance >= required_trust) {
        decision = "ALLOW";
        explanation = `User ${user.username} with role ${role!.name} has sufficient clearance (${clearance}) to access ${asset.name} in zone ${zone!.name} (required: ${required_trust}).`;
    } else {
        decision = "DENY";
        explanation = `User ${user.username} with role ${role!.name} has insufficient clearance (${clearance}) to access ${asset.name} in zone ${zone!.name} (required: ${required_trust}).`;
    }

    return simulateDelay({
        decision,
        explanation,
        user_role: role!.name,
        role_clearance: clearance,
        required_trust
    });
};
