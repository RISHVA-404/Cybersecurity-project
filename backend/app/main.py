from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, SessionLocal
from . import models, api

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SentinelMesh API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api.router, prefix="/api")

def seed_db():
    db = SessionLocal()
    if not db.query(models.Zone).first():
        # Create Zones
        zones_data = [
            {"name": "Public Guest Wi-Fi", "trust_level": 1, "description": "Unsecured public zone"},
            {"name": "Student Zone", "trust_level": 3, "description": "Authenticated students"},
            {"name": "Faculty Zone", "trust_level": 5, "description": "Faculty and staff devices"},
            {"name": "Campus DMZ", "trust_level": 4, "description": "Internet facing services"},
            {"name": "Application VPC (Cloud)", "trust_level": 7, "description": "Cloud native apps"},
            {"name": "Database VPC (Cloud)", "trust_level": 9, "description": "Sensitive DB cluster"},
            {"name": "Private Data Center", "trust_level": 10, "description": "Highly restricted internal IT"}
        ]
        
        for z in zones_data:
            db.add(models.Zone(**z))
        db.commit()

        # Create Assets
        assets_data = [
            {"name": "Guest Mobile", "ip_address": "10.0.1.15", "type": "Endpoint", "criticality": 1, "zone_id": 1},
            {"name": "Student Laptop", "ip_address": "10.0.2.100", "type": "Endpoint", "criticality": 3, "zone_id": 2},
            {"name": "Faculty Desktop", "ip_address": "10.0.3.50", "type": "Endpoint", "criticality": 5, "zone_id": 3},
            {"name": "Web Server", "ip_address": "10.0.4.10", "type": "Server", "criticality": 7, "zone_id": 4},
            {"name": "K8s Cluster", "ip_address": "172.16.1.5", "type": "Container", "criticality": 8, "zone_id": 5},
            {"name": "PostgreSQL Primary", "ip_address": "172.16.2.10", "type": "Database", "criticality": 10, "zone_id": 6},
            {"name": "Student Records System", "ip_address": "192.168.1.50", "type": "Server", "criticality": 10, "zone_id": 7},
        ]
        for a in assets_data:
            db.add(models.Asset(**a))
        db.commit()

        # Create Rules
        rules_data = [
            {"source_zone_id": 1, "dest_zone_id": 4, "protocol": "HTTPS", "port": "443", "action": "ALLOW", "priority": 100},
            {"source_zone_id": 1, "dest_zone_id": 6, "protocol": "ANY", "port": "ANY", "action": "DENY", "priority": 50},
            {"source_zone_id": 2, "dest_zone_id": 5, "protocol": "HTTPS", "port": "443", "action": "ALLOW", "priority": 100},
            {"source_zone_id": 3, "dest_zone_id": 7, "protocol": "TCP", "port": "3389", "action": "ALLOW", "priority": 100},
            {"source_zone_id": 4, "dest_zone_id": 5, "protocol": "API", "port": "8080", "action": "ALLOW", "priority": 100},
            {"source_zone_id": 5, "dest_zone_id": 6, "protocol": "TCP", "port": "5432", "action": "ALLOW", "priority": 100},
        ]
        for r in rules_data:
            db.add(models.SecurityRule(**r))
        db.commit()

    if not db.query(models.Role).first():
        # Create Roles
        roles_data = [
            {"name": "Guest", "permissions": "read:public"},
            {"name": "Student", "permissions": "read:public,read:student"},
            {"name": "Faculty", "permissions": "read:public,read:student,read:faculty"},
            {"name": "IT Admin", "permissions": "all"},
            {"name": "Security Analyst", "permissions": "read:all"},
            {"name": "Cloud Engineer", "permissions": "read:cloud,write:cloud"}
        ]
        for r in roles_data:
            db.add(models.Role(**r))
        db.commit()

        # Create Users
        users_data = [
            {"username": "guest_user", "role_id": 1},
            {"username": "alice_student", "role_id": 2},
            {"username": "bob_faculty", "role_id": 3},
            {"username": "charlie_admin", "role_id": 4},
            {"username": "diana_sec", "role_id": 5},
            {"username": "eve_cloud", "role_id": 6}
        ]
        for u in users_data:
            db.add(models.User(**u))
        db.commit()

    db.close()

@app.on_event("startup")
def on_startup():
    seed_db()

@app.get("/")
def read_root():
    return {"message": "SentinelMesh API is running"}
