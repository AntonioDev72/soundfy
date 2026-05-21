import { useState, useEffect } from 'react';
import api from '../services/api';
import { usePlayer } from '../context/PlayerContext';
import TrackCard from '../components/TrackCard';

export default function Playlists() {
  const { play, setQueue } = usePlayer();
  const [playlists, setPlaylists] = useState([]);
  const [selected, setSelected] = useState(null);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/playlists')
      .then(res => setPlaylists(res.data.playlists))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const createPlaylist = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      const res = await api.post('/playlists', { name: newName });
      setPlaylists(prev => [res.data.playlist, ...prev]);
      setNewName(''); setCreating(false);
    } catch (err) { console.error(err); }
  };

  const deletePlaylist = async (id) => {
    try {
      await api.delete(`/playlists/${id}`);
      setPlaylists(prev => prev.filter(p => p._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch (err) { console.error(err); }
  };

  const removeTrack = async (playlistId, deezerId) => {
    try {
      await api.delete(`/playlists/${playlistId}/tracks/${deezerId}`);
      setSelected(prev => ({ ...prev, tracks: prev.tracks.filter(t => t.deezerId !== deezerId) }));
      setPlaylists(prev => prev.map(p => p._id === playlistId ? { ...p, tracks: p.tracks.filter(t => t.deezerId !== deezerId) } : p));
    } catch (err) { console.error(err); }
  };

  if (selected) return (
    <div>
      <button onClick={() => setSelected(null)} style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 6 }}>← Back to playlists</button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: '2rem' }}>
        <div style={{ width: 60, height: 60, background: 'linear-gradient(135deg, #1db954, #191414)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🎵</div>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>{selected.name}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{selected.tracks.length} songs</p>
        </div>
      </div>
      {selected.tracks.length === 0 ? (
        <div style={{ textAlign: 'center', paddingTop: '3rem' }}>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>No songs yet. Search and add songs to this playlist!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
          {selected.tracks.map(track => (
            <TrackCard key={track.deezerId} track={track}
              onPlay={() => { setQueue(selected.tracks); play(track); }}
              onRemove={() => removeTrack(selected._id, track.deezerId)}
              isFavorite={true} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: -1 }}>Playlists</h1>
        <button onClick={() => setCreating(true)}
          style={{ padding: '10px 20px', background: 'var(--accent)', color: '#fff', borderRadius: 100, fontSize: 14, fontWeight: 700 }}>
          + New Playlist
        </button>
      </div>

      {creating && (
        <form onSubmit={createPlaylist} style={{ display: 'flex', gap: 10, marginBottom: '1.5rem' }}>
          <input autoFocus type="text" placeholder="Playlist name..." value={newName} onChange={e => setNewName(e.target.value)}
            style={{ flex: 1, padding: '10px 14px', background: 'var(--bg-card)', border: '1px solid var(--accent)', borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none' }} />
          <button type="submit" style={{ padding: '10px 20px', background: 'var(--accent)', color: '#fff', borderRadius: 8, fontSize: 14, fontWeight: 700 }}>Create</button>
          <button type="button" onClick={() => setCreating(false)} style={{ padding: '10px 20px', background: 'var(--bg-card)', color: 'var(--text-secondary)', borderRadius: 8, fontSize: 14 }}>Cancel</button>
        </form>
      )}

      {loading && <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Loading...</p>}

      {!loading && playlists.length === 0 && !creating && (
        <div style={{ textAlign: 'center', paddingTop: '4rem' }}>
          <div style={{ fontSize: 64, marginBottom: '1rem' }}>🎵</div>
          <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No playlists yet</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Create your first playlist!</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
        {playlists.map(playlist => (
          <div key={playlist._id} onClick={() => setSelected(playlist)}
            style={{ background: 'var(--bg-card)', borderRadius: 10, padding: '1rem', cursor: 'pointer', transition: 'background 0.2s', position: 'relative' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-card)'}>
            <div style={{ width: '100%', aspectRatio: '1', background: 'linear-gradient(135deg, #1db954, #191414)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, marginBottom: '0.75rem' }}>🎵</div>
            <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{playlist.name}</p>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{playlist.tracks.length} songs</p>
            <button onClick={e => { e.stopPropagation(); deletePlaylist(playlist._id); }}
              style={{ position: 'absolute', top: 8, right: 8, color: 'var(--text-muted)', fontSize: 16, opacity: 0, transition: 'opacity 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0'}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
}
