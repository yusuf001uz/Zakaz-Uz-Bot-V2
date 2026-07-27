import os
import asyncio
from contextlib import asynccontextmanager
from dotenv import load_dotenv

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database import init_db
from routers import auth, subscriptions, orders
from dotenv import load_dotenv
import os

# .env faylini aniq yo'l bo'yicha yuklash
load_dotenv()

# Tekshirish uchun log chiqarish
print("BOT_TOKEN:", os.getenv("BOT_TOKEN"))
print("ADMIN_TELEGRAM_ID:", os.getenv("ADMIN_TELEGRAM_ID"))
# 1. Environment o'zgaruvchilarni yuklash


from bot import bot, start_bot


async def lifespan(app: FastAPI):
    init_db()
    bot_task = asyncio.create_task(start_bot())
    print("Backend muvaffaqiyatli ishga tushdi!")

    yield

    bot_task.cancel()
    try:
        await bot_task
    except asyncio.CancelledError:
        pass
    await bot.session.close()


app = FastAPI(title="Zakaz API", lifespan=lifespan)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routerlarni ulash
app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(subscriptions.router, prefix="/api", tags=["subscriptions"])
app.include_router(orders.router, prefix="", tags=["orders"])


@app.get("/health")
async def health_check():
    return {"status": "ok"}


# Static fayllarni eng oxirida mount qilish lozim (barcha route'lardan keyin)
frontend_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "dist")
if os.path.exists(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=False)