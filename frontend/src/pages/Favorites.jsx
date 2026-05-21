import { useState, useEffect } from 'react';
import api from '../services/api';
import TrackCard from '../components/TrackCard';
import { usePlayer } from '../context/PlayerContext';

export default function Favorites() {
  const { play, setQueue } = usePlayer();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/favorites')
      .then(res => { setTracks(res.data.tracks); setQueue(res.data.tracks); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const removeFavorite = async (deezerId) => {
    try {
      await api.delete(`/favorites/${deezerId}`);
      setTracks(prev => prev.filter(t => t.deezerId !== deezerId));
    } catch (err) { console.error(err); }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: '2rem' }}>
        <div style={{ width: 60, height: 60, background: 'linear-gradient(135deg, #e91e8c, #7b2ff7)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>❤️</div>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: -1 }}>Favorites</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{tracks.length} songs</p>
        </div>
      </div>

      {loading && <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Loading...</p>}

      {!loading && tracks.length === 0 && (
        <div style={{ textAlign: 'center', paddingTop: '4rem' }}>
          <div style={{ fontSize: 64, marginBottom: '1rem' }}>💔</div>
          <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No favorites yet</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Search for songs and click the heart to save them</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
        {tracks.map(track => (
          <TrackCard
            key={track.deezerId}
            track={track}
            onPlay={() => { setQueue(tracks); play(track); }}
            onRemove={() => removeFavorite(track.deezerId)}
            isFavorite={true}
          />
        ))}
      </div>
    </div>
  );
}
