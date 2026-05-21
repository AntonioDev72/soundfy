const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const musicRoutes = require('./routes/music');
const favoritesRoutes = require('./routes/favorites');
const playlistsRoutes = require('./routes/playlists');

dotenv.config();
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/playlists', playlistsRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', app: 'Soundfy API' }));
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

const PORT = process.env.PORT || 3001;
mongoose.connect(process.env.MONGO_URI)
  .then(() => { console.log('MongoDB connected'); app.listen(PORT, () => console.log(`Soundfy API running on port ${PORT}`)); })
  .catch(err => console.error('MongoDB error:', err));
