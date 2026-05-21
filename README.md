# Soundfy 🎵

A Spotify-inspired music streaming app built with React, Node.js, Express, MongoDB and the Deezer API. Search for songs, play previews, save your favorites, and build your own playlists.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react) ![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js) ![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat&logo=mongodb) ![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat&logo=jsonwebtokens) ![Deezer](https://img.shields.io/badge/API-Deezer-EF5466?style=flat)

## Features

- 🔐 JWT authentication — register, login, protected routes
- 🔍 Real-time music search powered by Deezer API
- ▶️ 30-second song previews with a full-featured player
- ❤️ Save favorite tracks to your account
- 📋 Create and manage personal playlists
- 📖 Listening history
- 🎨 Spotify-inspired dark UI

## Tech Stack

**Frontend:** React 18, Vite, CSS  
**Backend:** Node.js, Express.js, MongoDB, Mongoose  
**Auth:** JWT + bcryptjs  
**Music API:** Deezer (free, no account required)

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free) → [mongodb.com/atlas](https://mongodb.com/atlas)
- No Deezer account needed — API is free and open

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your MONGO_URI and JWT_SECRET
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

## Environment Variables

```env
PORT=3001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/auth/me` | Get current user |

### Music
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/music/search?q=query` | Search songs |
| GET | `/api/music/trending` | Get trending tracks |

### Favorites
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/favorites` | Get user favorites |
| POST | `/api/favorites` | Add to favorites |
| DELETE | `/api/favorites/:id` | Remove from favorites |

### Playlists
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/playlists` | Get user playlists |
| POST | `/api/playlists` | Create playlist |
| PUT | `/api/playlists/:id` | Add song to playlist |
| DELETE | `/api/playlists/:id` | Delete playlist |

## Project Structure

```
soundfy/
├── backend/
│   ├── src/
│   │   ├── models/        # User, Track, Playlist schemas
│   │   ├── routes/        # Auth, music, favorites, playlists
│   │   ├── middleware/    # JWT protection
│   │   └── server.js      # Express entry point
│   └── .env.example
└── frontend/
    └── src/
        ├── components/    # Player, Sidebar, TrackCard
        ├── pages/         # Home, Search, Favorites, Playlist
        ├── context/       # Auth + Player context
        └── App.jsx
```

## Deployment

- **Frontend** → [Vercel](https://vercel.com)
- **Backend** → [Render](https://render.com)
- **Database** → [MongoDB Atlas](https://mongodb.com/atlas)

## License

MIT
