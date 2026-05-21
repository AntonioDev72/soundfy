import { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import api from '../services/api';

export default function TrackCard({ track, onPlay, onRemove, isFavorite: initialFav = false }) {
  const { currentTrack, isPlaying } = usePlayer();
  const { user } = useAuth();
  const [fav, setFav] = useState(initialFav);
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [adding, setAdding] = useState(null);
  const [added, setAdded] = useState(null);

  const isActive = currentTrack?.deezerId === track.deezerId;

  const toggleFav = async (e) => {
    e.stopPropagation();
    if (!user) { setShowAuth(true); return; }
    if (loading) return;
    setLoading(true);
    try {
      if (fav) {
        await api.delete(`/favorites/${track.deezerId}`);
        setFav(false);
        if (onRemove) onRemove();
      } else {
        await api.post('/favorites', track);
        setFav(true);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const openPlaylists = async (e) => {
    e.stopPropagation();
    if (!user) { setShowAuth(true); return; }
    const res = await api.get('/playlists');
    setPlaylists(res.data.playlists);
    setShowPlaylists(true);
  };

  const addToPlaylist = async (playlistId) => {
    if (adding) return;
    setAdding(playlistId);
    try {
      await api.put(`/playlists/${playlistId}/tracks`, track);
      setAdded(playlistId);
      setTimeout(() => { setShowPlaylists(false); setAdded(null); }, 800);
    } catch (err) {
      if (err.response?.data?.message === 'Track already in playlist.') {
        setAdded(playlistId);
        setTimeout(() => { setShowPlaylists(false); setAdded(null); }, 800);
      }
    } finally { setAdding(null); }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  };

  return (
    <>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setShowPlaylists(false); }}
        style={{ background: isActive ? 'var(--bg-hover)' : 'var(--bg-card)', borderRadius: 10, padding: '0.75rem', cursor: 'pointer', transition: 'all 0.2s', border: isActive ? '1px solid var(--accent)' : '1px solid transparent', position: 'relative' }}
      >
        {/* Cover */}
        <div style={{ position: 'relative', marginBottom: '0.75rem' }} onClick={onPlay}>
          <img src={track.cover} alt={track.title} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 8, display: 'block' }} />
          {(hovered || isActive) && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 44, height: 44, background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                {isActive && isPlaying ? '⏸' : '▶'}
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <p style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: isActive ? 'var(--accent)' : '#fff', marginBottom: 2 }}>{track.title}</p>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 4 }}>{track.artist}</p>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatDuration(track.duration)}</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {/* Add to playlist */}
            <div style={{ position: 'relative' }}>
              <button onClick={openPlaylists} title="Add to playlist"
                style={{ fontSize: 14, color: 'var(--text-muted)', transition: 'all 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                ➕
              </button>

              {/* Playlist dropdown */}
              {showPlaylists && (
                <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', bottom: '100%', right: 0, background: '#282828', border: '1px solid var(--bg-hover)', borderRadius: 8, padding: '0.5rem', minWidth: 180, zIndex: 50, marginBottom: 4 }}>
                  <p style={{ fontSize: 11, color: 'var(--text-secondary)', padding: '4px 8px', marginBottom: 4 }}>Add to playlist</p>
                  {playlists.length === 0 ? (
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', padding: '4px 8px' }}>No playlists yet</p>
                  ) : (
                    playlists.map(p => (
                      <button key={p._id} onClick={() => addToPlaylist(p._id)}
                        style={{ width: '100%', textAlign: 'left', padding: '6px 8px', fontSize: 13, borderRadius: 6, color: added === p._id ? 'var(--accent)' : '#fff', background: added === p._id ? 'rgba(29,185,84,0.1)' : 'transparent', transition: 'all 0.15s' }}
                        onMouseEnter={e => { if (added !== p._id) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                        onMouseLeave={e => { if (added !== p._id) e.currentTarget.style.background = 'transparent'; }}>
                        {added === p._id ? '✓ ' : ''}{p.name}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Favorite */}
            <button onClick={toggleFav} style={{ fontSize: 16, transition: 'transform 0.15s', color: fav ? '#e85d5d' : 'var(--text-muted)' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              {fav ? '❤️' : '🤍'}
            </button>
          </div>
        </div>
      </div>

      {showAuth && <AuthModal tab="register" onClose={() => setShowAuth(false)} />}
    </>
  );
}
