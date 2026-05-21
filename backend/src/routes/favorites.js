const express = require('express');
const Track = require('../models/Track');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.get('/', async (req, res) => {
  try {
    const tracks = await Track.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ tracks });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { deezerId, title, artist, album, cover, preview, duration } = req.body;
    if (!deezerId || !title || !artist) return res.status(400).json({ message: 'Track data required.' });
    const existing = await Track.findOne({ user: req.user._id, deezerId });
    if (existing) return res.status(400).json({ message: 'Track already in favorites.' });
    const track = await Track.create({ user: req.user._id, deezerId, title, artist, album, cover, preview, duration });
    res.status(201).json({ track });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:deezerId', async (req, res) => {
  try {
    const track = await Track.findOneAndDelete({ user: req.user._id, deezerId: req.params.deezerId });
    if (!track) return res.status(404).json({ message: 'Track not found.' });
    res.json({ message: 'Removed from favorites.' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
