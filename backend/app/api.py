from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from . import models, schemas
from .database import get_db
from .engine import BlastRadiusEngine
import random
import datetime

router = APIRouter()

@router.get("/zones", response_model=List[schemas.Zone])
def read_zones(db: Session = Depends(get_db)):
    return db.query(models.Zone).all()

@router.get("/assets", response_model=List[schemas.Asset])
def read_assets(db: Session = Depends(get_db)):
    return db.query(models.Asset).all()

@router.get("/rules", response_model=List[schemas.SecurityRule])
def read_rules(db: Session = Depends(get_db)):
    return db.query(models.SecurityRule).all()

@router.post("/rules")
def create_rule(rule: schemas.SecurityRuleCreate, db: Session = Depends(get_db)):
    db_rule = models.SecurityRule(**rule.model_dump())
    db.add(db_rule)
    db.commit()
    db.refresh(db_rule)
    return db_rule

@router.put("/rules/{rule_id}")
def update_rule(rule_id: int, action: str, db: Session = Depends(get_db)):
    rule = db.query(models.SecurityRule).filter(models.SecurityRule.id == rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")
    rule.action = action
    db.commit()
    return rule

@router.get("/incidents", response_model=List[schemas.Incident])
def read_incidents(db: Session = Depends(get_db)):
    return db.query(models.Incident).order_by(models.Incident.id.desc()).all()

@router.post("/simulate/incident")
def simulate_incident(scenario: str, db: Session = Depends(get_db)):
    assets = db.query(models.Asset).all()
    if not assets:
        raise HTTPException(status_code=400, detail="No assets available")
        
    target_asset = random.choice(assets)
    timestamp = datetime.datetime.now().isoformat()
    
    if scenario == "Compromised Application":
        title = "Malware Detected on Application"
        description = f"Suspicious outbound connections from {target_asset.name}."
        severity = "High"
    elif scenario == "Privilege Violation":
        title = "Excessive Access Attempt"
        description = f"User attempted to access {target_asset.name} beyond role permissions."
        severity = "Medium"
    else:
        title = "Traffic Anomaly"
        description = f"Unusual spike in traffic at {target_asset.name}."
        severity = "Low"
        
    incident = models.Incident(
        title=title,
        description=description,
        affected_asset_id=target_asset.id,
        severity=severity,
        status="DETECTED",
        timestamp=timestamp
    )
    db.add(incident)
    db.commit()
    db.refresh(incident)
    
    # Run blast radius automatically
    engine = BlastRadiusEngine(db)
    analysis = engine.calculate_blast_radius(target_asset.id)
    
    # Update incident state to ANALYZED
    incident.status = "ANALYZED"
    db.commit()
    
    return {
        "incident": incident,
        "blast_radius_analysis": analysis
    }

@router.get("/blast-radius/{asset_id}")
def get_blast_radius(asset_id: int, db: Session = Depends(get_db)):
    engine = BlastRadiusEngine(db)
    return engine.calculate_blast_radius(asset_id)

@router.get("/topology", response_model=schemas.Topology)
def get_topology(db: Session = Depends(get_db)):
    zones = db.query(models.Zone).all()
    assets = db.query(models.Asset).all()
    rules = db.query(models.SecurityRule).all()
    
    nodes = []
    edges = []
    
    x_offset = 0
    y_offset = 0
    
    for i, zone in enumerate(zones):
        nodes.append({
            "id": f"Z_{zone.id}",
            "type": "default",
            "position": {"x": 100 + (i % 3) * 300, "y": 100 + (i // 3) * 250},
            "data": {"label": f"{zone.name} (Trust: {zone.trust_level})"}
        })
        
        zone_assets = [a for a in assets if a.zone_id == zone.id]
        for j, asset in enumerate(zone_assets):
            nodes.append({
                "id": f"A_{asset.id}",
                "type": "default",
                "position": {"x": 100 + (i % 3) * 300 + j * 60, "y": 100 + (i // 3) * 250 + 70},
                "data": {"label": f"{asset.name}"}
            })
            edges.append({
                "id": f"e_Z{zone.id}_A{asset.id}",
                "source": f"Z_{zone.id}",
                "target": f"A_{asset.id}",
                "animated": False,
                "style": {"stroke": "#ccc"}
            })

    # Add edges for rules
    for rule in rules:
        if rule.action == "ALLOW":
            edges.append({
                "id": f"rule_{rule.id}",
                "source": f"Z_{rule.source_zone_id}",
                "target": f"Z_{rule.dest_zone_id}",
                "animated": True,
                "style": {"stroke": "#10b981", "strokeWidth": 2}
            })
            
    return {"nodes": nodes, "edges": edges}

@router.get("/users", response_model=List[schemas.User])
def read_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

@router.get("/roles", response_model=List[schemas.Role])
def read_roles(db: Session = Depends(get_db)):
    return db.query(models.Role).all()

@router.post("/iam/evaluate")
def evaluate_iam(req: schemas.IAMEvaluateRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == req.user_id).first()
    asset = db.query(models.Asset).filter(models.Asset.id == req.asset_id).first()
    
    if not user or not asset:
        raise HTTPException(status_code=404, detail="User or Asset not found")
        
    zone = db.query(models.Zone).filter(models.Zone.id == asset.zone_id).first()
    
    # Simple simulated IAM logic based on trust levels
    role_clearance_map = {
        "Student": 3,
        "Faculty": 5,
        "IT Admin": 10,
        "Security Analyst": 10,
        "Cloud Engineer": 8,
        "Guest": 1
    }
    
    clearance = role_clearance_map.get(user.role.name, 1)
    required_trust = zone.trust_level
    
    if clearance >= required_trust:
        decision = "ALLOW"
        explanation = f"User {user.username} with role {user.role.name} has sufficient clearance ({clearance}) to access {asset.name} in zone {zone.name} (required: {required_trust})."
    else:
        decision = "DENY"
        explanation = f"User {user.username} with role {user.role.name} has insufficient clearance ({clearance}) to access {asset.name} in zone {zone.name} (required: {required_trust})."
        
    return {
        "decision": decision,
        "explanation": explanation,
        "user_role": user.role.name,
        "role_clearance": clearance,
        "required_trust": required_trust
    }
