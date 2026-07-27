# Zakaz - Telegram Mini App for Ordering Bots/Websites

A complete production-ready Telegram Mini App with a Python backend (FastAPI + Aiogram 3) and React frontend, featuring a freemium limit model and paid subscription tiers.

## Features

- **Telegram Bot Integration**: Responds to `/start` command with Mini App menu button
- **User Authentication**: Telegram `initData` validation for secure Mini App access
- **Freemium Model**: 10 free orders for new users
- **Subscription Tiers**: Oddiy, Pro, Plus, Premium with different pricing and limits
- **Order Management**: Create and track bot/website orders
- **Dark/Light Theme**: Auto-syncs with Telegram native theme
- **Responsive UI**: Built with React, Vite, and Tailwind CSS

## Tech Stack

### Backend
- Python 3.11+
- FastAPI (REST API)
- Aiogram 3.x (Telegram Bot)
- SQLAlchemy (ORM)
- SQLite (database, PostgreSQL-ready)

### Frontend
- React.js (Vite)
- Tailwind CSS
- Telegram WebApp SDK (`@twa-dev/sdk`)
- React Router DOM

## Project Structure

```
zakaz-v2/
├── backend/
│   ├── main.py                  # FastAPI server & Telegram Bot
│   ├── database.py              # Database connection & ORM setup
│   ├── models.py                # User, Subscription, Order models
│   ├── schemas.py               # Pydantic validation schemas
│   ├── routers/
│   │   ├── auth.py              # Telegram initData validation
│   │   ├── subscriptions.py     # Subscription tier logic
│   │   └── orders.py            # Order management
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx       # User info & progress bar
│   │   │   ├── PricingModal.jsx # Subscription modal
│   │   │   └── OrderForm.jsx    # Order creation form
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Home page
│   │   │   ├── Pricing.jsx      # Pricing page
│   │   │   └── History.jsx      # Order history
│   │   ├── App.jsx              # Main app with routing
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Tailwind CSS
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

## Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+
- Telegram Bot Token (from [@BotFather](https://t.me/botfather))

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment variables:
```bash
cp .env .env
```

Edit `.env` with your values:
```
BOT_TOKEN=your_bot_token_here
WEBAPP_URL=https://your-domain.com
DATABASE_URL=sqlite:///./zakaz.db
```

5. Run the server:
```bash
python main.py
```

The backend will start on `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

4. Build for production:
```bash
npm run build
```

The build output will be in `frontend/dist/`

### Telegram Bot Setup

1. Create a bot via [@BotFather](https://t.me/botfather)
2. Get your bot token and add it to `.env`
3. Set up your WebApp URL (must be HTTPS for production)
4. Configure the Mini App in [@BotFather]:
   - `/newapp` - Create a new Mini App
   - Provide your WebApp URL
   - Get the Mini App URL

## API Endpoints

### Authentication
- `POST /api/auth/validate` - Validate Telegram initData and get/create user

### User Info
- `GET /api/me` - Get user info with subscription status and order limits

### Orders
- `POST /api/orders` - Create a new order
- `GET /api/orders` - Get user's order history

### Subscriptions
- `GET /api/subscriptions/pricing` - Get pricing matrix
- `POST /api/subscriptions/subscribe` - Create a new subscription
- `GET /api/subscriptions/my` - Get current user's subscription

## Subscription Tiers & Pricing

| Tier | 31 Days | 1 Year | Order Limit |
|------|---------|--------|-------------|
| Oddiy | - | 25,000 UZS | 30/month |
| Pro | 15,000 UZS | 30,000 UZS | 100/month |
| Plus | 25,000 UZS | 50,000 UZS | 300/month |
| Premium | 50,000 UZS | 100,000 UZS | Unlimited |

## Environment Variables

- `BOT_TOKEN`: Your Telegram bot token from @BotFather
- `WEBAPP_URL`: Your deployed WebApp URL (HTTPS required for production)
- `DATABASE_URL`: Database connection string (SQLite by default)

## Deployment

### Backend Deployment
1. Deploy to a server (e.g., Railway, Render, or VPS)
2. Set environment variables
3. Use PostgreSQL for production database
4. Configure webhook for Telegram bot (optional)

### Frontend Deployment
1. Build the frontend: `npm run build`
2. Deploy `frontend/dist/` to a static hosting service (Vercel, Netlify, or serve via FastAPI)
3. Update `WEBAPP_URL` in backend `.env`

## Development Notes

- The frontend uses Vite proxy to forward `/api` requests to the backend
- Telegram WebApp SDK is loaded via CDN in `index.html`
- Theme variables sync automatically with Telegram's native theme
- The bot only responds to `/start` command as per requirements

## License

MIT
