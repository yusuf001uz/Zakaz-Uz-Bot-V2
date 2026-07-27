# backend/routers/support.py
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import User, SupportMessage
from routers.auth import validate_telegram_init_data
from routers.orders import send_tg_async
import os
import html

router = APIRouter()

class SupportSchema(BaseModel):
    message: str

@router.post("/api/support")
async def send_support_message(
    data: SupportSchema,
    init_data: str | None = Header(None, alias="Telegram-Init-Data"),
    db: Session = Depends(get_db)
):
    user_data = validate_telegram_init_data(init_data) if init_data else {}
    telegram_id = user_data.get("id")
    
    if not telegram_id:
        raise HTTPException(status_code=401, detail="Mualliflikdan o'tilmagan")

    user = db.query(User).filter(User.telegram_id == telegram_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Foydalanuvchi topilmadi")

    # Bazaga saqlash
    support_msg = SupportMessage(user_id=user.id, message_text=data.message)
    db.add(support_msg)
    db.commit()

    # Adminga Telegram orqali yuborish
    admin_id = os.getenv("ADMIN_TELEGRAM_ID")
    if admin_id:
        username = user_data.get("username")
        contact = f"@{username}" if username else f"ID: {telegram_id}"
        first_name = html.escape(str(user_data.get("first_name", "Foydalanuvchi")))
        
        msg_text = (
            f"<b>📩 YANGI SUPPORT XABARI</b>\n\n"
            f"👤 <b>Kimdan:</b> {first_name} ({contact})\n"
            f"🆔 <b>Telegram ID:</b> <code>{telegram_id}</code>\n\n"
            f"💬 <b>Xabar:</b>\n<i>{html.escape(data.message)}</i>"
        )
        
        # Admin botdan to'g'ridan-to'g'ri reply qilishi uchun Inline keyboard
        keyboard = {
            "inline_keyboard": [
                [{"text": "💬 Javob berish", "callback_data": f"reply_support_{telegram_id}"}]
            ]
        }
        await send_tg_async(admin_id, msg_text, reply_markup=keyboard)

    return {"success": True, "message": "Xabaringiz adminga yuborildi"}