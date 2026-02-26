import React, { useState, useEffect, useCallback } from 'react';
import { BeatVisualizer } from './components/BeatVisualizer';
import { Header } from './components/Header';
import { SoundTypesControl } from './components/SoundTypesControl';
import { PatternSelect } from './components/PatternSelect';
import { TempoControl } from './components/TempoControl';
import { PlayControl } from './components/PlayControl';
import { PatternInfo } from './components/PatternInfo';
import { useAudioContext } from './hooks/useAudioContext';
import { useAudioPlayback } from './hooks/useAudioPlayback';
import { useScheduler } from './hooks/useScheduler';
import { flamencoPatterns } from './constants/patterns';
import { SoundTypes } from './types/audio';
import './styles/metronome.css';


export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [selectedPattern, setSelectedPattern] = useState(flamencoPatterns[0]);
  const [soundTypes, setSoundTypes] = useState<SoundTypes>({
    palo: true,
    jaleo: false,
    castanets: false,
    cajon: false,
  });

  // Initialize audio
  const { audioContextRef, audioSamplesRef, useFallbackAudioRef, resumeAudioContext } = useAudioContext();
  const { playClick, playFallbackTone } = useAudioPlayback({
    audioContextRef,
    audioSamplesRef,
    useFallbackAudioRef,
    soundTypes,
  });

  // Initialize scheduler
  const handleScheduleNote = useCallback((beatNumber: number, time: number) => {
    const isAccent = selectedPattern.accents.includes(beatNumber);
    if (useFallbackAudioRef.current) {
      playFallbackTone(isAccent, 'palo');
      if (soundTypes.jaleo && isAccent) {
        playFallbackTone(isAccent, 'jaleo');
      }
      if (soundTypes.castanets) {
        playFallbackTone(isAccent, 'castanets');
      }
      if (soundTypes.cajon && isAccent) {
        playFallbackTone(isAccent, 'cajon');
      }
    } else {
      playClick(time, isAccent);
    }
    // Note: Don't update display here - we'll use displayBeatRef instead
  }, [selectedPattern.accents, soundTypes, useFallbackAudioRef, playFallbackTone, playClick]);

  const { start: startScheduler, stop: stopScheduler, currentBeatRef } = useScheduler({
    audioContextRef,
    bpm,
    selectedPattern,
    onScheduleNote: handleScheduleNote,
  });

  // Handle play/pause toggle
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
      stopScheduler();
    } else {
      resumeAudioContext();
      setIsPlaying(true);
      startScheduler();
    }
  }, [isPlaying, startScheduler, stopScheduler, resumeAudioContext]);

  // Restart scheduler when BPM or pattern changes while playing
  useEffect(() => {
    if (isPlaying) {
      stopScheduler();
      setTimeout(() => startScheduler(), 50);
    }
  }, [bpm, selectedPattern.beats, isPlaying, startScheduler, stopScheduler]);

  // Handle sound type changes
  const handleSoundTypeChange = useCallback((key: keyof SoundTypes, value: boolean) => {
    setSoundTypes(prev => ({ ...prev, [key]: value }));
  }, []);

  // Handle BPM changes
  const handleBpmChange = useCallback((newBpm: number) => {
    setBpm(newBpm);
  }, []);

  // Handle pattern changes
  const handlePatternChange = useCallback((pattern: typeof flamencoPatterns[0]) => {
    setSelectedPattern(pattern);
  }, []);

  return (
    <div className="metronome-container">
      <div className="metronome-card">
        <Header />

        <BeatVisualizer
          currentBeat={currentBeatRef - 1}
          totalBeats={selectedPattern.beats}
          accents={selectedPattern.accents}
          isPlaying={isPlaying}
        />

        <SoundTypesControl
          soundTypes={soundTypes}
          onSoundTypeChange={handleSoundTypeChange}
        />

        <PatternSelect
          selectedPattern={selectedPattern}
          patterns={flamencoPatterns}
          onPatternChange={handlePatternChange}
        />

        <TempoControl
          bpm={bpm}
          onBpmChange={handleBpmChange}
        />

        <PlayControl
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
        />

        <PatternInfo
          beats={selectedPattern.beats}
          accents={selectedPattern.accents}
        />
      </div>
    </div>
  );
}