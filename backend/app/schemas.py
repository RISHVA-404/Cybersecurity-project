from pydantic import BaseModel
from typing import List, Optional

class ZoneBase(BaseModel):
    name: str
    trust_level: int
    description: str

class ZoneCreate(ZoneBase):
    pass

class Zone(ZoneBase):
    id: int
    class Config:
        from_attributes = True

class AssetBase(BaseModel):
    name: str
    ip_address: str
    type: str
    criticality: int
    zone_id: int

class AssetCreate(AssetBase):
    pass

class Asset(AssetBase):
    id: int
    class Config:
        from_attributes = True

class SecurityRuleBase(BaseModel):
    source_zone_id: int
    dest_zone_id: int
    protocol: str
    port: str
    action: str
    priority: int

class SecurityRuleCreate(SecurityRuleBase):
    pass

class SecurityRule(SecurityRuleBase):
    id: int
    class Config:
        from_attributes = True

class IncidentBase(BaseModel):
    title: str
    description: str
    affected_asset_id: int
    severity: str
    status: str
    timestamp: str

class Incident(IncidentBase):
    id: int
    class Config:
        from_attributes = True
        
class GraphNode(BaseModel):
    id: str
    data: dict
    position: dict
    type: str

class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    animated: bool
    style: Optional[dict] = None

class Topology(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]

class Role(BaseModel):
    id: int
    name: str
    permissions: str
    class Config:
        from_attributes = True

class User(BaseModel):
    id: int
    username: str
    role_id: int
    role: Role
    class Config:
        from_attributes = True

class IAMEvaluateRequest(BaseModel):
    user_id: int
    asset_id: int
