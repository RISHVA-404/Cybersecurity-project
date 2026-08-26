import networkx as nx
from . import models
from sqlalchemy.orm import Session
from typing import List

class BlastRadiusEngine:
    def __init__(self, db: Session):
        self.db = db
        self.graph = nx.DiGraph()
        self._build_graph()

    def _build_graph(self):
        # Nodes: Zones and Assets
        zones = self.db.query(models.Zone).all()
        assets = self.db.query(models.Asset).all()
        rules = self.db.query(models.SecurityRule).all()
        
        # Add zones and assets to graph
        for zone in zones:
            self.graph.add_node(f"Z_{zone.id}", type="zone", data=zone)
        for asset in assets:
            self.graph.add_node(f"A_{asset.id}", type="asset", data=asset)
            # Link asset to its zone
            self.graph.add_edge(f"A_{asset.id}", f"Z_{asset.zone_id}", type="belongs_to")
            self.graph.add_edge(f"Z_{asset.zone_id}", f"A_{asset.id}", type="contains")
            
        # Add edges based on allow rules
        for rule in rules:
            if rule.action == "ALLOW":
                # Create an edge from source zone to dest zone
                self.graph.add_edge(f"Z_{rule.source_zone_id}", f"Z_{rule.dest_zone_id}", type="rule", data=rule)

    def calculate_blast_radius(self, asset_id: int):
        start_node = f"A_{asset_id}"
        if start_node not in self.graph:
            return {"error": "Asset not found"}

        # Perform BFS to find all reachable assets
        visited = set()
        queue = [start_node]
        affected_assets = []
        path_tree = []
        
        # To compute risk score
        risk_score = 0
        
        while queue:
            current = queue.pop(0)
            if current not in visited:
                visited.add(current)
                
                node_data = self.graph.nodes[current]
                if node_data['type'] == 'asset':
                    asset = node_data['data']
                    affected_assets.append({
                        "id": asset.id,
                        "name": asset.name,
                        "criticality": asset.criticality,
                        "zone_id": asset.zone_id
                    })
                    risk_score += asset.criticality * (11 - self.graph.nodes[f"Z_{asset.zone_id}"]['data'].trust_level)
                    
                for neighbor in self.graph.successors(current):
                    edge_data = self.graph.get_edge_data(current, neighbor)
                    if edge_data['type'] in ['belongs_to', 'contains', 'rule']:
                        if neighbor not in visited:
                            queue.append(neighbor)
                            path_tree.append({
                                "source": current,
                                "target": neighbor,
                                "type": edge_data['type']
                            })
                            
        # Risk Score Calculation (Custom Educational Model)
        # Criticality (1-10) * Exposure factor based on trust level
        
        return {
            "start_asset": asset_id,
            "total_affected_assets": len(affected_assets),
            "affected_assets": affected_assets,
            "risk_score": risk_score,
            "propagation_paths": path_tree
        }
