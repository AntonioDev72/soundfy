import { useState } from 'react';
import api from '../services/api';
import TrackCard from '../components/TrackCard';
import { usePlayer } from '../context/PlayerContext';

export default function Search() {
  const { play, setQueue } = usePlayer();
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true); setSearched(true);
    try {
      const res = await api.get(`/music/search?q=${encodeURIComponent(query)}`);
      setTracks(res.data.tracks);
      setQueue(res.data.tracks);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: '1.5rem', letterSpacing: -1 }}>Search</h1>

      <form onSubmit={search} style={{ display: 'flex', gap: 12, marginBottom: '2rem' }}>
        <input
          type="text" placeholder="Artists, songs, albums..."
          value={query} onChange={e => setQuery(e.target.value)}
          style={{ flex: 1, padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--bg-hover)', borderRadius: 100, color: '#fff', fontSize: 15, outline: 'none' }}
        />
        <button type="submit"
          style={{ padding: '12px 28px', background: 'var(--accent)', color: '#fff', borderRadius: 100, fontSize: 14, fontWeight: 700 }}>
          Search
        </button>
      </form>

      {loading && <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Searching...</p>}

      {!loading && searched && tracks.length === 0 && (
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>No results found for "{query}"</p>
      )}

      {tracks.length > 0 && (
        <div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: '1rem' }}>{tracks.length} results for "{query}"</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
            {tracks.map(track => (
              <TrackCard key={track.deezerId} track={track} onPlay={() => { setQueue(tracks); play(track); }} />
            ))}
          </div>
        </div>
      )}

      {!searched && (
        <div style={{ textAlign: 'center', paddingTop: '4rem' }}>
          <div style={{ fontSize: 64, marginBottom: '1rem' }}>🎵</div>
          <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Search for your favorite music</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Find songs, artists and albums</p>
        </div>
      )}
    </div>
  );
}
