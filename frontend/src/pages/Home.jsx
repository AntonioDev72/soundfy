import { useState, useEffect } from 'react';
import api from '../services/api';
import TrackCard from '../components/TrackCard';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';

export default function Home() {
  const { user } = useAuth();
  const { play, setQueue } = usePlayer();
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/music/trending')
      .then(res => { setTrending(res.data.tracks); setQueue(res.data.tracks); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const timeOfDay = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: '0.5rem', letterSpacing: -1 }}>
        {user ? `${timeOfDay()}, ${user.name.split(' ')[0]} 👋` : `${timeOfDay()} 👋`}
      </h1>
      {!user && (
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: '2rem' }}>
          Sign up to save your favorite tracks and create playlists.
        </p>
      )}
      {user && <div style={{ marginBottom: '2rem' }} />}

      <section>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: '1.25rem' }}>🔥 Trending Now</h2>
        {loading ? (
          <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Loading trending tracks...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
            {trending.map(track => (
              <TrackCard key={track.deezerId} track={track} onPlay={() => { setQueue(trending); play(track); }} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
