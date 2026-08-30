# 🌾 Smart Agri Connect

A full-stack agriculture marketplace connecting farmers directly with buyers, traders, and companies — inspired by DeHaat.

Farmers can sell crops, buy agri-inputs, chat with buyers, and get crop advisory. Buyers can browse/search crops, send offers, and shop the agri-store. Admins verify listings, manage users/products, and view analytics.

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite) + Tailwind CSS + React Router + i18next |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (JSON Web Tokens) + bcrypt |
| Real-time | Socket.io (chat + live notifications) |
| File uploads | Multer (crop photos, product images, profile photos) |

---

## 📁 Folder Structure

```
smart-agri-connect/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js                # JWT protect + role-based authorize()
│   │   ├── errorHandler.js        # Central error handler
│   │   └── upload.js              # Multer image upload config
│   ├── models/
│   │   ├── User.js                # Farmer / Buyer / Admin (single model, role field)
│   │   ├── Crop.js                # Crop listings
│   │   ├── Offer.js               # Buyer offers on crops
│   │   ├── Product.js             # Agri-store products
│   │   ├── Cart.js                # Shopping cart
│   │   ├── Order.js               # Store orders
│   │   ├── Message.js             # Chat messages
│   │   ├── Question.js            # Crop advisory Q&A
│   │   ├── Review.js              # Ratings & reviews
│   │   └── Notification.js        # In-app notifications
│   ├── routes/
│   │   ├── authRoutes.js          # register, login, /me
│   │   ├── userRoutes.js          # profile, selling history
│   │   ├── cropRoutes.js          # CRUD + search/filter crop listings
│   │   ├── offerRoutes.js         # send / accept / reject offers
│   │   ├── productRoutes.js       # agri-store product CRUD
│   │   ├── cartRoutes.js          # cart management
│   │   ├── orderRoutes.js         # place orders, order status
│   │   ├── advisoryRoutes.js      # tips, weather, disease guide, Q&A
│   │   ├── chatRoutes.js          # conversations + messages
│   │   ├── reviewRoutes.js        # ratings for users/products
│   │   ├── notificationRoutes.js  # notification list / mark read
│   │   └── adminRoutes.js         # admin dashboard & moderation
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── createNotification.js
│   │   └── seed.js                # demo data seeder
│   ├── uploads/                   # uploaded images served at /uploads/*
│   ├── server.js                  # Express + Socket.io entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── api/axios.js           # Axios instance with JWT interceptor
    │   ├── context/
    │   │   ├── AuthContext.jsx    # auth state + socket connection
    │   │   └── CartContext.jsx    # cart state
    │   ├── components/
    │   │   ├── Navbar.jsx, Footer.jsx, Loader.jsx
    │   │   ├── ProtectedRoute.jsx # role-based route guarding
    │   │   ├── CropCard.jsx, ProductCard.jsx
    │   ├── pages/
    │   │   ├── Home.jsx, Login.jsx, Register.jsx
    │   │   ├── BrowseCrops.jsx, CropDetail.jsx      (Buyer: browse/search + make offer)
    │   │   ├── Store.jsx, ProductDetail.jsx, Cart.jsx, Orders.jsx
    │   │   ├── Advisory.jsx                          (Tips / Weather / Disease guide / Q&A)
    │   │   ├── Chat.jsx, Notifications.jsx, Profile.jsx
    │   │   ├── FarmerDashboard.jsx, UploadCrop.jsx, MyCrops.jsx, Offers.jsx
    │   │   ├── BuyerDashboard.jsx
    │   │   └── AdminDashboard.jsx                     (Users / Verify crops / Products / Orders / Analytics)
    │   ├── locales/en.json, hi.json  # English + Hindi translations
    │   ├── i18n.js
    │   ├── App.jsx                 # all routes
    │   ├── main.jsx
    │   └── index.css               # Tailwind + green agri theme
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+ and npm
- MongoDB running locally, or a free MongoDB Atlas cluster
- (Optional) A free [OpenWeatherMap](https://openweathermap.org/api) API key for live weather in the Advisory module

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set at minimum:
```
MONGO_URI=mongodb://127.0.0.1:27017/smart_agri_connect
JWT_SECRET=some_long_random_secret_string
CLIENT_URL=http://localhost:5173
```

Seed demo data (creates a demo admin, farmer, buyer, sample crops & products):
```bash
npm run seed
```
This prints demo login credentials in the console:
```
Admin login:  admin@smartagri.com / admin123
Farmer login: farmer@smartagri.com / farmer123
Buyer login:  buyer@smartagri.com / buyer123
```

Start the backend API:
```bash
npm run dev      # nodemon, auto-restarts on change
# or
npm start        # plain node
```
The API runs at **http://localhost:5000** (health check: `GET /api/health`).

### 2. Frontend Setup

In a new terminal:
```bash
cd frontend
npm install
cp .env.example .env
```

`.env` defaults are already correct for local dev:
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```
Open **http://localhost:5173** in your browser.

### 3. Try it out
1. Login with the seeded farmer account and upload a new crop (goes to "pending verification").
2. Login with the seeded admin account → Admin Dashboard → **Verify Crops** tab → approve it.
3. Login with the seeded buyer account → Browse Crops → open the crop → send an offer.
4. Back as the farmer → **Offers** → Accept the offer (crop is marked sold, all other pending offers auto-rejected).
5. Try the **Chat** icon on a crop's detail page to message the farmer in real time.
6. Visit **Agri Store** as any logged-in user, add products to cart, and checkout (Cash on Delivery or Online).
7. Visit **Crop Advisory** to see farming tips, disease/pest guidance, mock/live weather, and post a farmer question (answer it from the Admin Dashboard is not yet wired into the UI — use the API directly: `PUT /api/advisory/questions/:id/answer`).

---

## 🔑 Key Design Notes

- **Single `User` model, three roles** (`farmer`, `buyer`, `admin`) — simplifies auth and lets a buyer/company/trader all share one flexible schema via `buyerType`.
- **Crop verification workflow**: every new/edited crop listing starts as `pending-verification` and only appears in public search once an admin approves it — mirrors DeHaat's trust & quality model.
- **Offer lifecycle**: accepting one offer on a crop automatically marks the crop `sold` and rejects all other pending offers on it.
- **Real-time layer**: Socket.io rooms are keyed by user ID; both chat messages and system notifications (new offer, offer response, order status change) are pushed live if the user is online.
- **i18n-ready**: English and Hindi translations are wired up via `react-i18next`; add more languages by dropping a new JSON file in `frontend/src/locales`.
- **Weather API is optional**: without a `WEATHER_API_KEY`, the advisory page shows clearly-labeled placeholder data instead of failing.

## 🚧 Suggested Next Steps (not included, to keep this scaffold focused)

- Payment gateway integration (Razorpay/Stripe) for the "online" payment method (currently just marks `paymentStatus`).
- SMS/OTP-based login for low-literacy farmer users.
- Push notifications (web push / FCM) in addition to in-app + socket notifications.
- Admin UI screen for answering advisory questions (API already supports it).
- Image optimization/CDN for uploaded crop & product photos (currently served from local disk via `/uploads`).
- Automated tests (Jest/Supertest for backend, React Testing Library for frontend).
