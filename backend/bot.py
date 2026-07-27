# backend/bot.py
import os
import html
from aiogram import Bot, Dispatcher, F, types
from aiogram.filters import CommandStart
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from database import SessionLocal
from models import Order

BOT_TOKEN = os.getenv("BOT_TOKEN")
ADMIN_CHANNEL_ID = os.getenv("ADMIN_CHANNEL_ID")
WEB_APP_URL = os.getenv("WEB_APP_URL", "https://zakaz-uz-bot.netlify.app")

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

@dp.message(CommandStart())
async def cmd_start(message: types.Message):
    """/start buyrug'i uchun chiroyli javob"""
    welcome_text = (
        f"Assalomu alaykum, <b>{html.escape(message.from_user.first_name)}</b>! 👋\n\n"
        f"<b>Zakaz Bot</b> platformasiga xush kelibsiz!\n\n"
        f"Bu yerda siz o'z loyihalaringiz (Telegram bot, Veb-sayt va boshqalar) uchun "
        f"oson buyurtma berishingiz hamda buyurtmalarni boshqarishingiz mumkin.\n\n"
        f"👇 Buyurtma berish uchun pastdagi tugmani bosing:"
    )
    
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="🚀 Mini App-ni ochish", web_app=WebAppInfo(url=WEB_APP_URL))]
    ])
    
    await message.answer(welcome_text, parse_mode="HTML", reply_markup=keyboard)

@dp.callback_query(F.data.startswith("approve_"))
async def approve_order_callback(callback: types.CallbackQuery):
    """Admin buyurtmani tasdiqlaganda kanalga chop etish"""
    order_id = int(callback.data.split("approve_")[1])
    db = SessionLocal()
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        await callback.answer("❌ Buyurtma topilmadi!", show_alert=True)
        db.close()
        return

    order.status = "approved"
    db.commit()

    order_id_str = f"ORD-{order.id:04d}"
    logo_info = f"\n🖼 <b>Logo:</b> {html.escape(order.logo_url)}" if order.logo_url else ""

    channel_msg = (
        f"<b>🔹 ZAKAZ BOT 🔹</b>\n"
        f"<b>🆕 YANGI BUYURTMA!</b>\n\n"
        f"🆔 <b>Loyiha ID:</b> <code>{order_id_str}</code>\n"
        f"📌 <b>Loyiha Nomi:</b> <b>{html.escape(order.title)}</b>{logo_info}\n"
        f"🔧 <b>Turi:</b> 🤖 {html.escape(order.order_type)}\n"
        f"📝 <b>Tavsif:</b>\n<i>{html.escape(order.description)}</i>\n"
        f"💰 <b>Byudjet:</b> {html.escape(order.budget or 'Noma\'lum')}\n"
        f"⏰ <b>Muddat:</b> 📅 {html.escape(order.deadline or 'Noma\'lum')}\n"
    )

    # Kanalga chiqarish
    if ADMIN_CHANNEL_ID:
        await bot.send_message(chat_id=ADMIN_CHANNEL_ID, text=channel_msg, parse_mode="HTML")

    await callback.message.edit_text(
        callback.message.text + "\n\n✅ <b>KANALGA CHOP ETILDI!</b>",
        parse_mode="HTML"
    )
    await callback.answer("✅ Kanalga joylandi!")
    db.close()

@dp.callback_query(F.data.startswith("reject_"))
async def reject_order_callback(callback: types.CallbackQuery):
    """Admin buyurtmani rad etganda"""
    order_id = int(callback.data.split("reject_")[1])
    db = SessionLocal()
    order = db.query(Order).filter(Order.id == order_id).first()

    if order:
        order.status = "rejected"
        db.commit()

    await callback.message.edit_text(
        callback.message.text + "\n\n❌ <b>RAD ETILDI!</b>",
        parse_mode="HTML"
    )
    await callback.answer("Rad etildi!")
    db.close()

async def start_bot():
    """Bot polling rejimida ishga tushishi uchun"""
    await dp.start_polling(bot)
