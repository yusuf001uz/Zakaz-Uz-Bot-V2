# backend/routers/orders.py
import os
import html
import httpx
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from database import get_db
from models import User, Order
from schemas import OrderCreate
from routers.auth import validate_telegram_init_data

router = APIRouter()

async def send_tg_async(chat_id: str, text: str, reply_markup: dict = None) -> bool:
    """FastAPI uchun HTTPX orqali Telegram API'ga asinxron so'rov yuborish"""
    bot_token = os.getenv("BOT_TOKEN")
    
    if not bot_token:
        print("❌ XATOLIK: .env faylida BOT_TOKEN topilmadi!")
        return False
    if not chat_id:
        print("❌ XATOLIK: chat_id ko'rsatilmagan!")
        return False

    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "HTML"
    }
    if reply_markup:
        payload["reply_markup"] = reply_markup

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload, timeout=10.0)
            res_json = response.json()
            if not res_json.get("ok"):
                print(f"❌ Telegram API Error: {res_json.get('description')}")
                return False
            print(f"✅ Adminga xabar yuborildi! (Chat ID: {chat_id})")
            return True
        except Exception as e:
            print(f"❌ Telegram HTTP Request Error: {e}")
            return False

@router.post("/api/orders")
async def create_order(
    order: OrderCreate,
    init_data: str | None = Header(None, alias="Telegram-Init-Data"),
    db: Session = Depends(get_db)
):
    try:
        user_data = validate_telegram_init_data(init_data) if init_data else {}
        telegram_id = user_data.get("id", 12345678)

        # Foydalanuvchini olish yoki yangi yaratish
        user = db.query(User).filter(User.telegram_id == telegram_id).first()
        if not user:
            user = User(
                telegram_id=telegram_id,
                username=user_data.get("username"),
                first_name=user_data.get("first_name"),
                free_orders_left=10
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        # Bazaga buyurtmani saqlash
        new_order = Order(
            user_id=user.id,
            title=order.title,
            logo_url=order.logo_url,
            order_type=order.order_type or "bot",
            description=order.description,
            budget=order.budget or "Noma'lum",
            deadline=order.deadline or "Noma'lum",
            status="pending"
        )
        db.add(new_order)
        db.commit()
        db.refresh(new_order)

        # Xabar ma'lumotlarini tayyorlash
        order_id_str = f"ORD-{new_order.id:04d}"
        username = user_data.get("username")
        user_contact = f"@{username}" if username else f"ID: {telegram_id}"
        first_name = html.escape(str(user_data.get("first_name", "Mijoz")))

        title = html.escape(order.title or "Nomsiz")
        description = html.escape(order.description or "")
        budget = html.escape(order.budget or "Noma'lum")
        deadline = html.escape(order.deadline or "Noma'lum")
        order_type = html.escape(order.order_type or "Telegram Bot")
        logo_url = html.escape(order.logo_url) if order.logo_url else "Mavjud emas"

        msg_text = (
            f"<b>🔹 ZAKAZ BOT 🔹</b>\n"
            f"<b>🆕 YANGI BUYURTMA (MODERATSIYA)</b>\n\n"
            f"📋 <b>BUYURTMA MA'LUMOTLARI</b>\n"
            f"━━━━━━━━━━━━━━━━━━━━━━\n"
            f"🆔 <b>Loyiha ID:</b> <code>{order_id_str}</code>\n"
            f"📌 <b>Loyiha Nomi:</b> <b>{title}</b>\n"
            f"🖼 <b>Logotip URL:</b> {logo_url}\n"
            f"🔧 <b>Turi:</b> 🤖 {order_type}\n"
            f"📝 <b>Tavsif:</b>\n<i>{description}</i>\n"
            f"💰 <b>Byudjet:</b> {budget}\n"
            f"⏰ <b>Muddat:</b> 📅 {deadline}\n"
            f"📞 <b>Aloqa:</b> {user_contact} ({first_name})\n"
            f"━━━━━━━━━━━━━━━━━━━━━━\n\n"
            f"<b>Kanalga chop etishni tasdiqlaysizmi?</b>"
        )

        keyboard = {
            "inline_keyboard": [
                [
                    {"text": "✅ Qabul qilish", "callback_data": f"approve_{new_order.id}"},
                    {"text": "❌ Rad etish", "callback_data": f"reject_{new_order.id}"}
                ]
            ]
        }

        # Dynamic tarzda har bir so'rovda env qiymatini olish
        admin_telegram_id = os.getenv("ADMIN_TELEGRAM_ID")

        if admin_telegram_id:
            await send_tg_async(admin_telegram_id, msg_text, reply_markup=keyboard)
        else:
            print("⚠️ ADMIN_TELEGRAM_ID topilmadi! .env faylni tekshiring.")

        return {"success": True, "order_id": new_order.id}

    except Exception as e:
        print(f"❌ Server Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))