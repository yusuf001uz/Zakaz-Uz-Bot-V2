from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from pydantic import BaseModel
from models import User, Subscription
from schemas import SubscriptionCreate, SubscriptionResponse
from database import get_db
from routers.auth import validate_telegram_init_data
import os

router = APIRouter()

# Pricing matrix (in UZS)
PRICING = {
    "oddiy": {
        365: 25000
    },
    "pro": {
        31: 15000,
        365: 30000
    },
    "plus": {
        31: 25000,
        365: 50000
    },
    "premium": {
        31: 50000,
        365: 100000
    }
}

# Order limits per tier
ORDER_LIMITS = {
    "oddiy": 30,
    "pro": 100,
    "plus": 300,
    "premium": float("inf")  # unlimited
}

class CheckoutRequest(BaseModel):
    tier: str
    duration_days: int

class CheckoutResponse(BaseModel):
    success: bool
    invoice_url: str = None
    message: str

@router.get("/subscriptions/pricing")
async def get_pricing():
    """Get pricing matrix"""
    return PRICING

@router.post("/subscriptions/checkout", response_model=CheckoutResponse)
async def create_checkout(
    checkout: CheckoutRequest,
    init_data: str = Header(..., alias="Telegram-Init-Data"),
    db: Session = Depends(get_db)
):
    """Create a checkout session for subscription purchase"""
    user_data = validate_telegram_init_data(init_data)
    telegram_id = user_data.get("id")
    
    user = db.query(User).filter(User.telegram_id == telegram_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Validate pricing
    if checkout.tier not in PRICING:
        raise HTTPException(status_code=400, detail="Invalid tier")
    
    if checkout.duration_days not in PRICING[checkout.tier]:
        raise HTTPException(status_code=400, detail=f"Invalid duration for tier {checkout.tier}")
    
    price = PRICING[checkout.tier][checkout.duration_days]
    
    # For Telegram Stars payment, we'll use a simplified approach
    # In production, you would integrate with Telegram Payments API
    # For now, we'll simulate the payment and directly activate subscription
    # This is a demo implementation - replace with actual Telegram Invoice integration
    
    # Deactivate existing subscription
    existing_sub = db.query(Subscription).filter(
        Subscription.user_id == user.id,
        Subscription.is_active == True
    ).first()
    
    if existing_sub:
        existing_sub.is_active = False
    
    # Create new subscription
    expires_at = datetime.utcnow() + timedelta(days=checkout.duration_days)
    new_subscription = Subscription(
        user_id=user.id,
        tier=checkout.tier,
        duration_days=checkout.duration_days,
        price=price,
        expires_at=expires_at,
        is_active=True
    )
    
    db.add(new_subscription)
    db.commit()
    db.refresh(new_subscription)
    
    return CheckoutResponse(
        success=True,
        message="Subscription activated successfully"
    )

@router.post("/subscriptions/subscribe", response_model=SubscriptionResponse)
async def create_subscription(
    subscription: SubscriptionCreate,
    init_data: str = Header(..., alias="Telegram-Init-Data"),
    db: Session = Depends(get_db)
):
    """Create a new subscription (legacy endpoint, use checkout instead)"""
    user_data = validate_telegram_init_data(init_data)
    telegram_id = user_data.get("id")
    
    user = db.query(User).filter(User.telegram_id == telegram_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Validate pricing
    if subscription.tier not in PRICING:
        raise HTTPException(status_code=400, detail="Invalid tier")
    
    if subscription.duration_days not in PRICING[subscription.tier]:
        raise HTTPException(status_code=400, detail=f"Invalid duration for tier {subscription.tier}")
    
    price = PRICING[subscription.tier][subscription.duration_days]
    
    # Deactivate existing subscription
    existing_sub = db.query(Subscription).filter(
        Subscription.user_id == user.id,
        Subscription.is_active == True
    ).first()
    
    if existing_sub:
        existing_sub.is_active = False
    
    # Create new subscription
    expires_at = datetime.utcnow() + timedelta(days=subscription.duration_days)
    new_subscription = Subscription(
        user_id=user.id,
        tier=subscription.tier,
        duration_days=subscription.duration_days,
        price=price,
        expires_at=expires_at,
        is_active=True
    )
    
    db.add(new_subscription)
    db.commit()
    db.refresh(new_subscription)
    
    return new_subscription

@router.get("/subscriptions/my", response_model=SubscriptionResponse)
async def get_my_subscription(
    init_data: str = Header(..., alias="Telegram-Init-Data"),
    db: Session = Depends(get_db)
):
    """Get current user's subscription"""
    user_data = validate_telegram_init_data(init_data)
    telegram_id = user_data.get("id")
    
    user = db.query(User).filter(User.telegram_id == telegram_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    subscription = db.query(Subscription).filter(
        Subscription.user_id == user.id,
        Subscription.is_active == True
    ).first()
    
    if not subscription:
        raise HTTPException(status_code=404, detail="No active subscription")
    
    return subscription
