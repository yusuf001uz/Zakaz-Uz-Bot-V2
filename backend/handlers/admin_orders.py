# bot/handlers/admin_orders.py
from aiogram import Router, F, Bot
from aiogram.types import CallbackQuery, Message
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Order, User

router = Router()

class AdminActionState(StatesGroup):
    waiting_for_reject_reason = State()
    waiting_for_approve_note = State()
    waiting_for_support_reply = State()

# --- 1. ZAKAZNI TASTIQLASH (Izoh bilan) ---
@router.callback_query(F.data.startswith("approve_"))
async def process_approve_click(callback: CallbackQuery, state: FSMContext):
    order_id = int(callback.data.split("_")[1])
    await state.update_data(order_id=order_id)
    await state.set_state(AdminActionState.waiting_for_approve_note)
    
    await callback.message.reply(
        f"✅ <b>ORD-{order_id:04d}</b> buyurtmasini tasdiqlash uchun mijozga biror izoh yoki havola (link) yozing:\n"
        f"<i>(Agar izoh shart bo'lmasa, '-' bosing)</i>"
    )
    await callback.answer()

@router.message(AdminActionState.waiting_for_approve_note)
async def process_approve_note_input(message: Message, state: FSMContext, bot: Bot):
    data = await state.get_data()
    order_id = data["order_id"]
    note = message.text.strip() if message.text != "-" else "Buyurtmangiz tasdiqlandi!"

    db: Session = SessionLocal()
    order = db.query(Order).filter(Order.id == order_id).first()
    
    if order:
        order.status = "approved"
        order.admin_note = note
        db.commit()
        
        user = db.query(User).filter(User.id == order.user_id).first()
        if user and user.telegram_id:
            # Mijozga botdan xabar boradi
            user_msg = (
                f"🎉 <b>Ajoyib xabar! Buyurtmangiz tasdiqlandi.</b>\n\n"
                f"🆔 <b>Loyiha:</b> ORD-{order.id:04d}\n"
                f"📌 <b>Nomi:</b> {order.title}\n\n"
                f"💬 <b>Admin izohi:</b>\n{note}"
            )
            try:
                await bot.send_message(chat_id=user.telegram_id, text=user_msg, parse_mode="HTML")
            except Exception as e:
                print(f"Mijozga xabar yuborishda xato: {e}")

        await message.answer(f"✅ ORD-{order_id:04d} tasdiqlandi va mijozga bildirishnoma yuborildi.")
    
    db.close()
    await state.clear()


# --- 2. ZAKAZNI RAD ETISH (Sababi bilan) ---
@router.callback_query(F.data.startswith("reject_"))
async def process_reject_click(callback: CallbackQuery, state: FSMContext):
    order_id = int(callback.data.split("_")[1])
    await state.update_data(order_id=order_id)
    await state.set_state(AdminActionState.waiting_for_reject_reason)
    
    await callback.message.reply(
        f"❌ <b>ORD-{order_id:04d}</b> buyurtmasini rad etish sababini yozing:"
    )
    await callback.answer()

@router.message(AdminActionState.waiting_for_reject_reason)
async def process_reject_reason_input(message: Message, state: FSMContext, bot: Bot):
    data = await state.get_data()
    order_id = data["order_id"]
    reason = message.text.strip()

    db: Session = SessionLocal()
    order = db.query(Order).filter(Order.id == order_id).first()
    
    if order:
        order.status = "rejected"
        order.admin_note = reason
        db.commit()
        
        user = db.query(User).filter(User.id == order.user_id).first()
        if user and user.telegram_id:
            # Mijozga botdan rad sababi boradi
            user_msg = (
                f"❌ <b>Buyurtmangiz rad etildi.</b>\n\n"
                f"🆔 <b>Loyiha:</b> ORD-{order.id:04d}\n"
                f"📌 <b>Nomi:</b> {order.title}\n\n"
                f"⚠️ <b>Rad etilish sababi:</b>\n<i>{reason}</i>"
            )
            try:
                await bot.send_message(chat_id=user.telegram_id, text=user_msg, parse_mode="HTML")
            except Exception as e:
                print(f"Mijozga xabar yuborishda xato: {e}")

        await message.answer(f"🚫 ORD-{order_id:04d} rad etildi va mijozga sababi yuborildi.")
    
    db.close()
    await state.clear()


# --- 3. SUPPORT XABARIGA JAVOB BERISH ---
@router.callback_query(F.data.startswith("reply_support_"))
async def process_support_reply_click(callback: CallbackQuery, state: FSMContext):
    target_user_id = callback.data.split("_")[2]
    await state.update_data(target_user_id=target_user_id)
    await state.set_state(AdminActionState.waiting_for_support_reply)
    
    await callback.message.reply("💬 Foydalanuvchiga yuboriladigan javob matnini yozing:")
    await callback.answer()

@router.message(AdminActionState.waiting_for_support_reply)
async def process_support_reply_input(message: Message, state: FSMContext, bot: Bot):
    data = await state.get_data()
    target_user_id = data["target_user_id"]
    reply_text = message.text.strip()

    user_msg = (
        f"🎧 <b>Qo'llab-quvvatlash xizmati (Admin javobi):</b>\n\n"
        f"<i>{reply_text}</i>"
    )
    try:
        await bot.send_message(chat_id=target_user_id, text=user_msg, parse_mode="HTML")
        await message.answer("✅ Javobingiz foydalanuvchiga muvaffaqiyatli yetkazildi.")
    except Exception as e:
        await message.answer(f"❌ Xabar yuborishda xatolik: {e}")

    await state.clear()