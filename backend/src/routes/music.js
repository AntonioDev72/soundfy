const express = require('express');
const axios = require('axios');

const router = express.Router();

const deezer = axios.create({ baseURL: 'https://api.deezer.com' });

router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'Query required.' });
    const { data } = await deezer.get(`/search?q=${encodeURIComponent(q)}&limit=20`);
    const tracks = data.data.map(t => ({
      deezerId: String(t.id),
      title: t.title,
      artist: t.artist.name,
      album: t.album.title,
      cover: t.album.cover_medium,
      preview: t.preview,
      duration: t.duration,
    }));
    res.json({ tracks });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/trending', async (req, res) => {
  try {
    const { data } = await deezer.get('/chart/0/tracks?limit=20');
    const tracks = data.data.map(t => ({
      deezerId: String(t.id),
      title: t.title,
      artist: t.artist.name,
      album: t.album.title,
      cover: t.album.cover_medium,
      preview: t.preview,
      duration: t.duration,
    }));
    res.json({ tracks });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/artist/:id', async (req, res) => {
  try {
    const { data } = await deezer.get(`/artist/${req.params.id}/top?limit=10`);
    const tracks = data.data.map(t => ({
      deezerId: String(t.id),
      title: t.title,
      artist: t.artist.name,
      album: t.album.title,
      cover: t.album.cover_medium,
      preview: t.preview,
      duration: t.duration,
    }));
    res.json({ tracks });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
