# backend/schemas.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


# --- USER SCHEMAS ---
class UserBase(BaseModel):
    telegram_id: int
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None


class UserCreate(UserBase):
    pass


class UserResponse(BaseModel):
    id: int
    telegram_id: int
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    free_orders_left: int
    created_at: datetime

    class Config:
        from_attributes = True


# --- SUBSCRIPTION SCHEMAS ---
class SubscriptionCreate(BaseModel):
    tier: str
    duration_days: int


class SubscriptionResponse(BaseModel):
    id: int
    tier: str
    duration_days: int
    price: int
    started_at: datetime
    expires_at: datetime
    is_active: bool

    class Config:
        from_attributes = True


class UserWithSubscription(BaseModel):
    user: UserResponse
    subscription: Optional[SubscriptionResponse] = None
    can_create_order: bool


# --- ORDER SCHEMAS ---
class OrderBase(BaseModel):
    title: str                            # Loyiha nomi
    description: str                      # Loyiha tavsifi
    order_type: Optional[str] = "bot"     # bot yoki website
    budget: Optional[str] = "Noma'lum"    # Byudjet
    deadline: Optional[str] = "Noma'lum"  # Muddat
    logo_url: Optional[str] = None        # Loyiha logotipi (URL)


class OrderCreate(OrderBase):
    pass


class OrderResponse(OrderBase):
    id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# --- AUTH / TELEGRAM SCHEMAS ---
class TelegramInitData(BaseModel):
    init_data: str