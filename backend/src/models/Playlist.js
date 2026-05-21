const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  cover: { type: String, default: '' },
  tracks: [{
    deezerId: String,
    title: String,
    artist: String,
    album: String,
    cover: String,
    preview: String,
    duration: Number,
  }],
}, { timestamps: true });

module.exports = mongoose.model('Playlist', playlistSchema);
