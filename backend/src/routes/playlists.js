const express = require('express');
const Playlist = require('../models/Playlist');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.get('/', async (req, res) => {
  try {
    const playlists = await Playlist.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ playlists });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Playlist name required.' });
    const playlist = await Playlist.create({ user: req.user._id, name, description });
    res.status(201).json({ playlist });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id/tracks', async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ _id: req.params.id, user: req.user._id });
    if (!playlist) return res.status(404).json({ message: 'Playlist not found.' });
    const { deezerId, title, artist, album, cover, preview, duration } = req.body;
    const exists = playlist.tracks.find(t => t.deezerId === deezerId);
    if (exists) return res.status(400).json({ message: 'Track already in playlist.' });
    playlist.tracks.push({ deezerId, title, artist, album, cover, preview, duration });
    await playlist.save();
    res.json({ playlist });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id/tracks/:deezerId', async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ _id: req.params.id, user: req.user._id });
    if (!playlist) return res.status(404).json({ message: 'Playlist not found.' });
    playlist.tracks = playlist.tracks.filter(t => t.deezerId !== req.params.deezerId);
    await playlist.save();
    res.json({ playlist });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const playlist = await Playlist.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!playlist) return res.status(404).json({ message: 'Playlist not found.' });
    res.json({ message: 'Playlist deleted.' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
