import React from 'react';

interface PatternInfoProps {
  beats: number;
  accents: number[];
}

export function PatternInfo({ beats, accents }: PatternInfoProps) {
  return (
    <div className="metronome-info">
      {beats} beats • Accents on {accents.join(', ')}
    </div>
  );
}

