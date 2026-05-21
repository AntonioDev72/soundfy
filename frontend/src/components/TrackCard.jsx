import { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import api from '../services/api';

export default function TrackCard({ track, onPlay, onRemove, isFavorite: initialFav = false }) {
  const { currentTrack, isPlaying } = usePlayer();
  const [fav, setFav] = useState(initialFav);
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);

  const isActive = currentTrack?.deezerId === track.deezerId;

  const toggleFav = async (e) => {
    e.stopPropagation();
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

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: isActive ? 'var(--bg-hover)' : 'var(--bg-card)', borderRadius: 10, padding: '0.75rem', cursor: 'pointer', transition: 'all 0.2s', border: isActive ? '1px solid var(--accent)' : '1px solid transparent', position: 'relative' }}
    >
      {/* Cover */}
      <div style={{ position: 'relative', marginBottom: '0.75rem' }} onClick={onPlay}>
        <img src={track.cover} alt={track.title} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 8, display: 'block' }} />
        {/* Play overlay */}
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatDuration(track.duration)}</span>
        <button onClick={toggleFav} style={{ fontSize: 16, transition: 'transform 0.15s', color: fav ? '#e85d5d' : 'var(--text-muted)' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
          {fav ? '❤️' : '🤍'}
        </button>
      </div>
    </div>
  );
}
