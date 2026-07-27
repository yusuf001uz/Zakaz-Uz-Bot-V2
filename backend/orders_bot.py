# backend/orders_bot.py
import os
import asyncio
from aiogram import Bot, Dispatcher
from aiogram.fsm.storage.memory import MemoryStorage
from dotenv import load_dotenv

# Handlers routerni import qilamiz
from handlers.admin_orders import router as admin_router

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN")

if not BOT_TOKEN:
    raise ValueError("❌ .env faylida BOT_TOKEN topilmadi!")

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher(storage=MemoryStorage())

# Admin callback va FSM handlerlarini ulaymiz
dp.include_router(admin_router)

async def main():
    print("🤖 Moderatsiya va Admin Boti muvaffaqiyatli ishga tushdi...")
    # Eski update'larni o'tkazib yuborish
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        print("🤖 Bot to'xtatildi.")