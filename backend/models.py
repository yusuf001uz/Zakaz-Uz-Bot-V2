# backend/models.py
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    telegram_id = Column(Integer, unique=True, index=True, nullable=False)
    username = Column(String, nullable=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    free_orders_left = Column(Integer, default=10, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    subscription = relationship("Subscription", back_populates="user", uselist=False)
    orders = relationship("Order", back_populates="user")
    support_messages = relationship("SupportMessage", back_populates="user")


class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    tier = Column(String, nullable=False)  # oddiy, pro, plus, premium
    duration_days = Column(Integer, nullable=False)  # 31 or 365
    price = Column(Integer, nullable=False)  # in UZS
    started_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)
    is_active = Column(Boolean, default=True)
    
    user = relationship("User", back_populates="subscription")


class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    title = Column(String, nullable=False)  # Loyiha nomi
    logo_url = Column(String, nullable=True)  # Loyiha logotipi (URL/path)
    order_type = Column(String, nullable=False, default="bot")  # bot, website va h.k.
    description = Column(Text, nullable=False)  # Loyiha tavsifi
    budget = Column(String, nullable=True)  # Byudjet
    deadline = Column(String, nullable=True)  # Muddat
    
    status = Column(String, default="pending")  # pending, approved, rejected, in_progress, completed
    admin_note = Column(Text, nullable=True)  # Admin tomonidan yozilgan sabab yoki izoh
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="orders")


class SupportMessage(Base):
    __tablename__ = "support_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message_text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="support_messages")