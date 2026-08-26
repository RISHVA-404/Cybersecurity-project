from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from .database import Base


class Zone(Base):
    __tablename__ = "zones"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    trust_level = Column(Integer)
    description = Column(String)
    allowed_protocols = Column(String, default="HTTPS,SSH")
    requires_mfa = Column(Boolean, default=False)
    is_cloud = Column(Boolean, default=False)
    color_tag = Column(String, default="blue")

    assets = relationship("Asset", back_populates="zone")


class Asset(Base):
    __tablename__ = "assets"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    ip_address = Column(String, unique=True, index=True)
    asset_type = Column(String)
    criticality = Column(Integer)
    zone_id = Column(Integer, ForeignKey("zones.id"))
    is_compromised = Column(Boolean, default=False)
    exposure_level = Column(Integer, default=1)
    privilege_level = Column(Integer, default=1)
    services = Column(String, default="")
    status = Column(String, default="NORMAL")

    zone = relationship("Zone", back_populates="assets")


class Connection(Base):
    __tablename__ = "connections"
    id = Column(Integer, primary_key=True, index=True)
    source_asset_id = Column(Integer, ForeignKey("assets.id"))
    dest_asset_id = Column(Integer, ForeignKey("assets.id"))
    protocol = Column(String)
    port = Column(String)
    is_active = Column(Boolean, default=True)


class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    clearance_level = Column(Integer, default=1)
    allowed_zones = Column(String, default="")
    can_admin = Column(Boolean, default=False)
    description = Column(String, default="")

    users = relationship("User", back_populates="role")


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    full_name = Column(String)
    role_id = Column(Integer, ForeignKey("roles.id"))
    mfa_enabled = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    last_login = Column(String, default="")
    login_anomaly = Column(Boolean, default=False)
    session_status = Column(String, default="ACTIVE")

    role = relationship("Role", back_populates="users")


class SecurityRule(Base):
    __tablename__ = "security_rules"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, default="Unnamed Rule")
    source_zone_id = Column(Integer, ForeignKey("zones.id"))
    dest_zone_id = Column(Integer, ForeignKey("zones.id"))
    protocol = Column(String)
    port = Column(String)
    action = Column(String)
    priority = Column(Integer)
    is_enabled = Column(Boolean, default=True)
    description = Column(String, default="")

    source_zone = relationship("Zone", foreign_keys=[source_zone_id])
    dest_zone = relationship("Zone", foreign_keys=[dest_zone_id])


class Incident(Base):
    __tablename__ = "incidents"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text)
    scenario_type = Column(String)
    affected_asset_id = Column(Integer, ForeignKey("assets.id"))
    severity = Column(String)
    status = Column(String, default="DETECTED")
    timestamp = Column(String)
    risk_score = Column(Float, default=0.0)
    blast_radius_count = Column(Integer, default=0)
    containment_action = Column(Text, default="")
    timeline = Column(Text, default="[]")

    affected_asset = relationship("Asset")


class SecurityEvent(Base):
    __tablename__ = "security_events"
    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String)
    severity = Column(String)
    zone_id = Column(Integer, ForeignKey("zones.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=True)
    message = Column(Text)
    timestamp = Column(String)
    incident_id = Column(Integer, ForeignKey("incidents.id"), nullable=True)
    is_resolved = Column(Boolean, default=False)


class CloudResource(Base):
    __tablename__ = "cloud_resources"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    resource_type = Column(String)
    cloud_provider = Column(String, default="AWS")
    region = Column(String, default="ap-south-1")
    zone_id = Column(Integer, ForeignKey("zones.id"))
    is_public = Column(Boolean, default=False)
    security_groups = Column(String, default="")
    iam_roles = Column(String, default="")
    risk_level = Column(String, default="LOW")


class RiskAssessment(Base):
    __tablename__ = "risk_assessments"
    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.id"))
    incident_id = Column(Integer, ForeignKey("incidents.id"), nullable=True)
    asset_criticality = Column(Float)
    exposure_score = Column(Float)
    suspicious_activity = Column(Float)
    privilege_score = Column(Float)
    propagation_potential = Column(Float)
    total_score = Column(Float)
    timestamp = Column(String)
