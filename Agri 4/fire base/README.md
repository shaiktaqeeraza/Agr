# CropsConnection 🌱

A social marketplace connecting farmers and buyers — like Instagram, but for crops. Post a crop for sale, get discovered by location or crop name, follow farmers, and negotiate directly in chat.

No sign-up form: opening the app instantly logs you in as a guest (Firebase Anonymous Auth) with a friendly auto-generated name like "SunnyFarmer4821". You can rename yourself any time from **Profile → Edit profile**.

## Tech stack
- **Frontend:** React + Vite, React Router
- **Backend:** Firebase — Authentication (Anonymous), Firestore (database), Storage (images)
- **Location:** Browser Geolocation API + OpenStreetMap Nominatim (free, no API key) for reverse geocoding lat/lng → "City, State"

## 1. Create your Firebase project (one-time, ~5 minutes)

1. Go to https://console.firebase.google.com → **Add project** → give it a name (e.g. `cropsconnection`).
2. **Build → Authentication → Get started → Sign-in method → Anonymous → Enable**.
3. **Build → Firestore Database → Create database** → start in production mode → pick a region close to your users.
4. **Build → Storage → Get started** → same region.
5. In **Project settings (gear icon) → General → Your apps**, click the **Web (`</>`)** icon to register a web app. Copy the config object it gives you.
6. In this project, copy `.env.example` to `.env` and paste the values in:

   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

7. Deploy the security rules included in this project (protects your data — only the right people can write to the right documents):

   ```bash
   npm install -g firebase-tools
   firebase login
   firebase deploy --only firestore:rules,storage:rules
   ```
   (When prompted, or via `firebase use --add`, connect it to the project you just created — or copy `.firebaserc.example` to `.firebaserc` and put your project ID in it first.)

## 2. Run it locally

```bash
npm install
npm run dev
```

Open the printed **http://localhost:5173** — the app works immediately, no login screen. Open it in a second browser tab/incognito window to simulate a second user and test follow/chat.

> Note: the "Use current location" button and camera access need a secure context. `localhost` counts as secure, so this works fine in dev. If you later access it via a plain IP address instead of localhost, browsers may block geolocation — use HTTPS (see deployment below) for that case.

## 3. Put it online so anyone can open it (like instagram.com)

This uses Firebase Hosting, which gives you a free public URL — anyone can open it in Chrome (or any browser) on any device, no install required.

```bash
npm run build
firebase deploy --only hosting
```

Firebase will print a live URL like `https://cropsconnection-xxxx.web.app`. Share that link with anyone.

**Optional — installable like an app:** if you want people to be able to "Add to Home Screen" so it behaves like a downloaded app icon (a Progressive Web App), let me know and I'll add a manifest + service worker — it's a small addition on top of this.

## Project structure

```
src/
  main.jsx              # app entry, wraps everything in AuthProvider
  App.jsx               # routes + top bar + bottom nav
  firebase.js           # Firebase init (reads .env)
  context/AuthContext.jsx   # anonymous sign-in + guest profile creation
  utils/
    timeAgo.js           # "2h ago" formatting
    geolocation.js        # GPS -> lat/lng -> "City, State"
    analyzer.js           # rule-based crop tips (swap in a real AI model later)
  components/
    icons.jsx, SearchBar.jsx, PostCard.jsx, CreatePostModal.jsx
  pages/
    Feed.jsx, Chats.jsx, ChatWindow.jsx, Following.jsx, Profile.jsx, Saved.jsx
firestore.rules          # who can read/write what in the database
storage.rules            # who can upload images
firebase.json            # hosting + rules deploy config
```

## Data model (Firestore)

- `users/{uid}` — name, initials, photoURL, location, bio, followersCount, followingCount
- `users/{uid}/saved/{postId}` — bookmarked posts
- `posts/{postId}` — crop listing: userId, cropName, price, unit, priceType, totalQuantity, availableQuantity, imageURL, status, locationLabel, lat/lng
- `follows/{followerId_followingId}` — a follow relationship
- `chats/{sortedUidPair}` — participants, lastMessage, lastMessageAt
- `chats/{chatId}/messages/{messageId}` — senderId, text, createdAt

## What's already working

✅ Feed with live posts, search by crop/location/name
✅ Create post with image upload + GPS location detection
✅ Follow / unfollow (live follower counts)
✅ Mark crop as sold / available
✅ Analyzer button (rule-based crop tips)
✅ Save / bookmark posts
✅ Share post (native share sheet or copy link)
✅ Real-time 1:1 chat, started directly from a post
✅ Editable profile with photo, bio, location
✅ Guest accounts — zero-friction, no signup

## Ideas for later
- Real AI-based crop image analysis (swap `utils/analyzer.js`)
- Push notifications for new messages/followers
- PWA support so it installs like a native app
- Pagination/infinite scroll once the feed grows large
