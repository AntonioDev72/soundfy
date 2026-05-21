import { createContext, useContext, useState, useRef, useEffect } from 'react';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [queue, setQueue] = useState([]);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;

    const updateProgress = () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      playNext();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [queue]);

  const play = (track) => {
    const audio = audioRef.current;
    if (currentTrack?.deezerId === track.deezerId) {
      if (isPlaying) { audio.pause(); setIsPlaying(false); }
      else { audio.play(); setIsPlaying(true); }
      return;
    }
    if (!track.preview) return;
    audio.src = track.preview;
    audio.play();
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) { audio.pause(); setIsPlaying(false); }
    else { audio.play(); setIsPlaying(true); }
  };

  const seek = (value) => {
    const audio = audioRef.current;
    audio.currentTime = (value / 100) * audio.duration;
    setProgress(value);
  };

  const changeVolume = (value) => {
    audioRef.current.volume = value;
    setVolume(value);
  };

  const playNext = () => {
    if (!queue.length || !currentTrack) return;
    const idx = queue.findIndex(t => t.deezerId === currentTrack.deezerId);
    if (idx < queue.length - 1) play(queue[idx + 1]);
  };

  const playPrev = () => {
    if (!queue.length || !currentTrack) return;
    const idx = queue.findIndex(t => t.deezerId === currentTrack.deezerId);
    if (idx > 0) play(queue[idx - 1]);
  };

  return (
    <PlayerContext.Provider value={{ currentTrack, isPlaying, progress, volume, queue, setQueue, play, togglePlay, seek, changeVolume, playNext, playPrev }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);
