import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface TempoControlProps {
  bpm: number;
  onBpmChange: (bpm: number) => void;
  minBpm?: number;
  maxBpm?: number;
}

export function TempoControl({
  bpm,
  onBpmChange,
  minBpm = 40,
  maxBpm = 240,
}: TempoControlProps) {
  const sliderRef = React.useRef<HTMLDivElement>(null);

  const handleSliderChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newBpm = Math.round(minBpm + percentage * (maxBpm - minBpm));
    onBpmChange(newBpm);
  };

  const handleSliderDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.buttons === 1) {
      handleSliderChange(e);
    }
  };

  const sliderPercentage = ((bpm - minBpm) / (maxBpm - minBpm)) * 100;

  const incrementBpm = () => {
    onBpmChange(Math.min(maxBpm, bpm + 1));
  };

  const decrementBpm = () => {
    onBpmChange(Math.max(minBpm, bpm - 1));
  };

  return (
    <div className="bpm-control">
      <div className="bpm-header">
        <label className="control-label" style={{ marginBottom: 0 }}>Tempo</label>
        <span className="bpm-value">{bpm} BPM</span>
      </div>
      <div className="bpm-slider-row">
        <button
          onClick={decrementBpm}
          className="bpm-button"
          aria-label="Decrease tempo"
        >
          <Minus size={16} />
        </button>
        <div
          ref={sliderRef}
          className="slider-container"
          onClick={handleSliderChange}
          onMouseMove={handleSliderDrag}
        >
          <div className="slider-track" style={{ width: `${sliderPercentage}%` }}>
            <div className="slider-thumb" />
          </div>
        </div>
        <button
          onClick={incrementBpm}
          className="bpm-button"
          aria-label="Increase tempo"
        >
          <Plus size={16} />
        </button>
      </div>
      <div className="slider-labels">
        <span>{minBpm}</span>
        <span>{maxBpm}</span>
      </div>
    </div>
  );
}

