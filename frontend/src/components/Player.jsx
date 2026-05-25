import { usePlayer } from '../context/PlayerContext';

const PlayIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7.05 3.606l13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"/></svg>;
const PauseIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M5.7 3a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7H5.7zm10 0a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7h-2.6z"/></svg>;
const PrevIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3.3 1a.7.7 0 0 1 .7.7v8.81l17.408-9.84a.7.7 0 0 1 1.046.606v19.446a.7.7 0 0 1-1.048.606L4 11.495V20.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z"/></svg>;
const NextIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.7 1a.7.7 0 0 0-.7.7v8.81L2.592.67A.7.7 0 0 0 1.546 1.276v19.446a.7.7 0 0 0 1.048.606L20 12.505V20.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H20.7z"/></svg>;

function formatTime(seconds) {
  if (!seconds) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function Player() {
  const { currentTrack, isPlaying, progress, volume, togglePlay, seek, changeVolume, playNext, playPrev } = usePlayer();

  if (!currentTrack) return (
    <>
      <div className="player-bar" style={{ height: 'var(--player-height)', background: 'var(--player-bg)', borderTop: '1px solid var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Select a song to play</span>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .player-bar { position: fixed; bottom: 56px; left: 0; right: 0; z-index: 40; }
        }
      `}</style>
    </>
  );

  const elapsed = currentTrack.duration ? (progress / 100) * 30 : 0;

  return (
    <>
      <div className="player-bar" style={{ height: 'var(--player-height)', background: 'var(--player-bg)', borderTop: '1px solid var(--bg-hover)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', alignItems: 'center', padding: '0 1.5rem', gap: '1rem' }}>

        {/* Track info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, overflow: 'hidden' }}>
          <img src={currentTrack.cover} alt={currentTrack.title} style={{ width: 48, height: 48, borderRadius: 4, objectFit: 'cover', flexShrink: 0 }} />
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentTrack.title}</p>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentTrack.artist}</p>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={playPrev} style={{ color: 'var(--text-secondary)' }}><PrevIcon /></button>
            <button onClick={togglePlay} style={{ width: 34, height: 34, borderRadius: '50%', background: '#fff', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button onClick={playNext} style={{ color: 'var(--text-secondary)' }}><NextIcon /></button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%' }}>
            <span style={{ fontSize: 10, color: 'var(--text-secondary)', width: 28, textAlign: 'right' }}>{formatTime(elapsed)}</span>
            <input type="range" min="0" max="100" value={progress} onChange={e => seek(Number(e.target.value))}
              style={{ flex: 1, height: 3, accentColor: 'var(--accent)', cursor: 'pointer' }} />
            <span style={{ fontSize: 10, color: 'var(--text-secondary)', width: 28 }}>0:30</span>
          </div>
        </div>

        {/* Volume - hidden on mobile */}
        <div className="volume-control" style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
          <span style={{ fontSize: 14 }}>{volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}</span>
          <input type="range" min="0" max="1" step="0.01" value={volume} onChange={e => changeVolume(Number(e.target.value))}
            style={{ width: 80, height: 3, accentColor: 'var(--accent)', cursor: 'pointer' }} />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .player-bar {
            position: fixed;
            bottom: 56px;
            left: 0;
            right: 0;
            z-index: 40;
            grid-template-columns: 1fr 1fr !important;
            padding: 0 1rem !important;
          }
          .volume-control { display: none !important; }
        }
      `}</style>
    </>
  );
}
