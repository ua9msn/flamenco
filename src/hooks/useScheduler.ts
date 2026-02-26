import { useRef, useCallback, useState } from 'react';

interface FlamencoPattern {
  name: string;
  beats: number;
  accents: number[];
  subdivision: number;
}

interface UseSchedulerParams {
  audioContextRef: React.MutableRefObject<AudioContext | null>;
  bpm: number;
  selectedPattern: FlamencoPattern;
  onScheduleNote: (beatNumber: number, time: number) => void;
}

export function useScheduler({
  audioContextRef,
  bpm,
  selectedPattern,
  onScheduleNote,
}: UseSchedulerParams) {
  const nextNoteTimeRef = useRef(0);
  const [currentBeatRef, setCurrentBeat] = useState(selectedPattern.beats);
  const displayBeatRef = useRef(0);
  const timerIdRef = useRef<number | null>(null);
  const schedulerCallbackRef = useRef<(() => void) | null>(null);
  const startTimeRef = useRef(0);

  const lookahead = 25.0; // ms
  const scheduleAheadTime = 0.1; // sec

  // Store the scheduler callback in a ref to avoid dependency issues
  schedulerCallbackRef.current = () => {
    if (!audioContextRef.current) return;

    const secondsPerBeat = 60.0 / bpm;
    const ctx = audioContextRef.current;

    // Calculate which beat is actually playing RIGHT NOW
    const elapsedTime = ctx.currentTime - startTimeRef.current;
    const beatNumber = Math.floor(elapsedTime / secondsPerBeat);
    displayBeatRef.current = (beatNumber % selectedPattern.beats) + 1;

    // Schedule beats in advance
    while (nextNoteTimeRef.current < ctx.currentTime + scheduleAheadTime) {
      // Increment beat FIRST so currentBeatRef matches the beat being scheduled
      const bit = (currentBeatRef % selectedPattern.beats) + 1;
      setCurrentBeat(bit);
      onScheduleNote(bit, nextNoteTimeRef.current);

      // Advance time after scheduling
      nextNoteTimeRef.current += secondsPerBeat;
    }

    // Reschedule the next check
    if (timerIdRef.current !== null) {
      timerIdRef.current = window.setTimeout(schedulerCallbackRef.current!, lookahead);
    }
  };

  const start = useCallback(() => {
    if (!audioContextRef.current) return;

    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    // Clear any existing timer
    if (timerIdRef.current !== null) {
      clearTimeout(timerIdRef.current);
    }

    // Start with the last beat so that first increment gives beat 1
    displayBeatRef.current = 0;
    startTimeRef.current = audioContextRef.current.currentTime;
    nextNoteTimeRef.current = audioContextRef.current.currentTime;

    // Start the scheduler
    if (schedulerCallbackRef.current) {
      timerIdRef.current = 1; // Mark as active (using 1 instead of actual ID to avoid null checks)
      schedulerCallbackRef.current();
    }
  }, [audioContextRef, selectedPattern.beats]);

  const stop = useCallback(() => {
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
      timerIdRef.current = null;
    }
    displayBeatRef.current = 0;
  }, []);

  return {
    nextNoteTimeRef,
    currentBeatRef,
    displayBeatRef,
    start,
    stop,
  };
}

