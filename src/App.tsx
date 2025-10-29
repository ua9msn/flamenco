import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Plus, Minus } from 'lucide-react';
import { CustomCheckbox } from './components/CustomCheckbox';
import { audioManager } from './utils/audioManager';
import './styles/metronome.css';
import { Header, BitVisualizer } from "./components";

interface FlamencoPattern {
  name: string;
  beats: number;
  accents: number[];
  subdivision: number;
}

const flamencoPatterns: FlamencoPattern[] = [
  { name: 'Soleá', beats: 12, accents: [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0], subdivision: 2 },
  { name: 'Bulería', beats: 12, accents: [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0], subdivision: 3 },
  { name: 'Alegría', beats: 12, accents: [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0], subdivision: 2 },
  { name: 'Tangos', beats: 4, accents: [0, 1, 0, 1], subdivision: 2 },
  { name: 'Seguiriya', beats: 12, accents: [0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1], subdivision: 2 },
  { name: 'Fandango', beats: 12, accents: [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0], subdivision: 3 },
  { name: 'Rumba', beats: 4, accents: [1, 1, 0, 1], subdivision: 2 },
];

interface SoundTypes {
  palo: boolean;
  jaleo: boolean;
  castanets: boolean;
  cajon: boolean;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState(flamencoPatterns[0]);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [soundTypes, setSoundTypes] = useState<SoundTypes>({
    palo: true,
    jaleo: false,
    castanets: false,
    cajon: false,
  });
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef(0);
  const currentBeatRef = useRef(0);
  const timerIdRef = useRef<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const lookahead = 25.0; // ms
  const scheduleAheadTime = 0.1; // sec

    useEffect(() => {
        audioManager.loadSamples();
    }, []);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playClick = (time: number, isAccent: boolean) => {
    if (!audioContextRef.current) return;

    // Calculate delay from scheduled time
    const currentTime = audioContextRef.current.currentTime;
    const delay = Math.max(0, (time - currentTime) * 1000); // Convert to ms

    // Play each enabled sound type
    setTimeout(() => {
      if (soundTypes.palo) {
        audioManager.play('palo', isAccent);
      }
      if (soundTypes.jaleo && isAccent) {
        audioManager.play('jaleo', isAccent);
      }
      if (soundTypes.castanets) {
        audioManager.play('castanets', isAccent);
      }
      if (soundTypes.cajon && isAccent) {
        audioManager.play('cajon', isAccent);
      }
    }, delay);
  };

  const nextNote = () => {
    const secondsPerBeat = 60.0 / bpm;
    nextNoteTimeRef.current += secondsPerBeat;
    currentBeatRef.current = (currentBeatRef.current % selectedPattern.beats) + 1;
  };

  const scheduleNote = (beatNumber: number, time: number) => {
    const isAccent = selectedPattern.accents.includes(beatNumber);
    playClick(time, isAccent);
    setCurrentBeat(beatNumber);
  };

  const scheduler = () => {
    if (!audioContextRef.current) return;
    
    while (nextNoteTimeRef.current < (audioContextRef.current.currentTime + scheduleAheadTime)) {
        console.log('in while', nextNoteTimeRef.current, audioContextRef.current.currentTime)
      scheduleNote(currentBeatRef.current, nextNoteTimeRef.current);
      nextNote();
    }

    console.log('in scheduler', nextNoteTimeRef.current,  audioContextRef.current.currentTime)

    timerIdRef.current = window.setTimeout(scheduler, lookahead);
  };

  const startMetronome = () => {
    if (!audioContextRef.current) return;
    
    setIsPlaying(true);
    currentBeatRef.current = 0;
    nextNoteTimeRef.current = audioContextRef.current.currentTime;
    audioContextRef.current.resume();
    scheduler();
  };

  const stopMetronome = () => {
    setIsPlaying(false);
    audioContextRef.current?.suspend();
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
      timerIdRef.current = null;
    }
    setCurrentBeat(0);
    currentBeatRef.current = 0;
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopMetronome();
    } else {
      startMetronome();
    }
  };

  useEffect(() => {
    if (isPlaying) {
      stopMetronome();
      setTimeout(() => startMetronome(), 50);
    }
  }, [bpm, selectedPattern]);

  const handleSliderChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newBpm = Math.round(40 + percentage * (240 - 40));
    setBpm(newBpm);
  };

  const handleSliderDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.buttons === 1) {
      handleSliderChange(e);
    }
  };

  const sliderPercentage = ((bpm - 40) / (240 - 40)) * 100;

  const incrementBpm = () => {
    setBpm((prev) => Math.min(240, prev + 1));
  };

  const decrementBpm = () => {
    setBpm((prev) => Math.max(40, prev - 1));
  };

  const bitInfo = selectedPattern.accents.reduce( (acc, bit, index) => bit ? acc.concat(index) : acc, []);

  return (
    <div className="metronome-container">
      <div className="metronome-card">
        <Header title="Flamenco Metronome" subtitle="Compás Perfecto" />

        <BitVisualizer
          currentBeat={currentBeat}
          beats={selectedPattern.accents}
          isPlaying={isPlaying}
        />

        {/* Sound Types Selection */}
        <div className="sound-types-group">
          <label className="control-label">Sound Types</label>
          <div className="sound-types-grid">
            <CustomCheckbox
              id="palo"
              checked={soundTypes.palo}
              onChange={(checked) => 
                setSoundTypes(prev => ({ ...prev, palo: checked }))
              }
              label="Palo"
            />
            <CustomCheckbox
              id="jaleo"
              checked={soundTypes.jaleo}
              onChange={(checked) => 
                setSoundTypes(prev => ({ ...prev, jaleo: checked }))
              }
              label="Jaleo"
            />
            <CustomCheckbox
              id="castanets"
              checked={soundTypes.castanets}
              onChange={(checked) => 
                setSoundTypes(prev => ({ ...prev, castanets: checked }))
              }
              label="Castanets"
            />
            <CustomCheckbox
              id="cajon"
              checked={soundTypes.cajon}
              onChange={(checked) => 
                setSoundTypes(prev => ({ ...prev, cajon: checked }))
              }
              label="Cajón"
            />
          </div>
        </div>

        {/* Pattern Selection */}
        <div className="control-group">
          <label className="control-label">Palo</label>
          <div className="select-container">
            <button
              className="select-button"
              onClick={() => setIsSelectOpen(!isSelectOpen)}
            >
              <span>{selectedPattern.name} ({selectedPattern.beats})</span>
              <span style={{ fontSize: '0.75rem' }}>▼</span>
            </button>
            {isSelectOpen && (
              <div className="select-dropdown">
                {flamencoPatterns.map((pattern) => (
                  <div
                    key={pattern.name}
                    className="select-option"
                    onClick={() => {
                      setSelectedPattern(pattern);
                      setIsSelectOpen(false);
                    }}
                  >
                    {pattern.name} ({pattern.beats})
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* BPM Control */}
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
            <span>40</span>
            <span>240</span>
          </div>
        </div>

        {/* Play/Pause Button */}
        <button onClick={togglePlay} className="play-button">
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

        {/* Info */}
        <div className="metronome-info">
          {selectedPattern.beats} beats • Accents on {selectedPattern.accents.join(', ')}
        </div>
      </div>
    </div>
  );
}