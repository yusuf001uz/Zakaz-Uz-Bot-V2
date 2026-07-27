# backend/ping_tunnel.py
import time
import httpx

TUNNEL_URL = "https://zakaz-bot-uz.loca.lt"

while True:
    try:
        res = httpx.get(TUNNEL_URL)
        print(f"Ping sent: {res.status_code}")
    except Exception as e:
        print(f"Ping error: {e}")
    time.sleep(120)  # Har 2 daqiqada ping yuboradi