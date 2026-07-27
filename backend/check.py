# backend/check.py
import os
import json
import urllib.request
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN")
ADMIN_TELEGRAM_ID = os.getenv("ADMIN_TELEGRAM_ID")
ADMIN_CHANNEL_ID = os.getenv("ADMIN_CHANNEL_ID")

print(f"--- FAYLLARNI TEKSHIRISH ---")
print(f"BOT_TOKEN: {BOT_TOKEN[:10]}..." if BOT_TOKEN else "❌ BOT_TOKEN TOPILMADI!")
print(f"ADMIN_TELEGRAM_ID: {ADMIN_TELEGRAM_ID}")
print(f"ADMIN_CHANNEL_ID: {ADMIN_CHANNEL_ID}")

def send_msg(chat_id, text):
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    payload = {"chat_id": chat_id, "text": text}
    try:
        data = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req) as res:
            return res.read().decode('utf-8')
    except Exception as e:
        return f"XATO: {e}"

if BOT_TOKEN:
    print("\n1. Lichkaga xabar yuborish:")
    print(send_msg(ADMIN_TELEGRAM_ID, "Test: Lichka ishlayapti!"))

    print("\n2. Kanalga xabar yuborish:")
    print(send_msg(ADMIN_CHANNEL_ID, "Test: Kanal ishlayapti!"))