# CropsConnection

A full-stack agriculture social platform combining an Instagram-style crop feed with Facebook Messenger-style real-time chat, built for farmers to list crops and connect with buyers.

## Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, React Router, Axios, Socket.io-client
- **Backend:** Node.js, Express.js, Socket.io
- **Database:** MongoDB Atlas (Mongoose)
- **Auth:** JWT + bcryptjs
- **Uploads:** Multer (local `/uploads` storage)

## Project Structure
```
CropsConnection/
  backend/
    config/db.js
    models/            (User, Post, Message, Follower, Notification)
    controllers/
    routes/
    middleware/         (auth, upload)
    uploads/             (uploaded images served statically)
    server.js
  frontend/
    src/
      components/       (Navbar, PostCard, FarmerCard, SearchBar, ProtectedRoute)
      pages/            (Login, Register, Feed, Chats, Following, Profile, CreatePost, Notifications)
      context/AuthContext.jsx
      services/         (api.js, socket.js)
      App.jsx, main.jsx
```

## Setup

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI (MongoDB Atlas connection string) and JWT_SECRET
npm run dev
```
Backend runs on `http://localhost:5000`.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173` and proxies `/api` and `/uploads` requests to the backend (see `vite.config.js`).

### 3. MongoDB Atlas
Create a free cluster at mongodb.com/atlas, create a database user, whitelist your IP (or `0.0.0.0/0` for dev), and copy the connection string into `backend/.env` as `MONGO_URI`.

## API Reference

**Auth**
- `POST /api/register` — { name, email, password, location }
- `POST /api/login` — { email, password }

**Users**
- `GET /api/users?search=` — list/search users (auth required)
- `GET /api/profile` — current user's profile, post/following/follower counts, and posts (auth required)
- `PUT /api/profile` — update name/location/bio/profileImage (multipart, auth required)

**Posts**
- `GET /api/posts?search=` — list all posts, newest first, with `isFollowing` flag if authenticated
- `POST /api/posts` — create post (multipart: cropImage + fields, auth required)
- `PUT /api/posts/:id` — update own post (auth required)
- `DELETE /api/posts/:id` — delete own post (auth required)

**Messages**
- `GET /api/messages/conversations` — list of conversations for current user (auth required)
- `GET /api/messages/:userId` — full message thread with a user (auth required)
- `POST /api/messages` — send a message; emits via Socket.io to the receiver (auth required)

**Follow**
- `POST /api/follow/:userId` — toggle follow/unfollow (auth required)
- `GET /api/following` — list of farmers the current user follows (auth required)

**Notifications**
- `GET /api/notifications` — list notifications for current user (auth required)

## Real-time chat
The backend runs Socket.io alongside Express. On login, the frontend connects a socket and joins a room named after the user's ID (`socket.emit('join', userId)`). When a message is sent via `POST /api/messages`, the server emits `receiveMessage` to the receiver's room so the chat updates live without a page refresh.

## Notes / Next steps for production
- Swap local Multer disk storage for S3/Cloudinary if deploying to an ephemeral host (e.g. Heroku/Render), since local `/uploads` won't persist across deploys.
- Add refresh tokens / token expiry handling on the frontend (currently a 7-day JWT is stored in `localStorage`).
- Add pagination to `GET /api/posts` for large feeds.
- Add input validation (e.g. `express-validator`) and rate limiting on auth routes.
