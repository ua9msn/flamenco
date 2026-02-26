import React from 'react';
import { Play, Pause } from 'lucide-react';

interface PlayControlProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export function PlayControl({ isPlaying, onTogglePlay }: PlayControlProps) {
  return (
    <button onClick={onTogglePlay} className="play-button">
      {isPlaying ? (
        <>
          <Pause size={20} />
          Pause
        </>
      ) : (
        <>
          <Play size={20} />
          Play
        </>
      )}
    </button>
  );
}

