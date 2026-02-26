import { useRef, useEffect } from 'react';
import audioSamplesConfig from '../config/audioSamples.json';

interface AudioSample {
  accent: AudioBuffer;
  regular: AudioBuffer;
}

interface AudioSamples {
  palo: AudioSample;
  jaleo: AudioSample;
  castanets: AudioSample;
  cajon: AudioSample;
}

interface AudioSamplesConfig {
  palo: { accent: string; regular: string };
  jaleo: { accent: string; regular: string };
  castanets: { accent: string; regular: string };
  cajon: { accent: string; regular: string };
}

export function useAudioContext() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSamplesRef = useRef<AudioSamples | null>(null);
  const useFallbackAudioRef = useRef<boolean>(false);

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Load audio files as AudioBuffers from config
  useEffect(() => {
    const loadAudioFile = async (url: string): Promise<AudioBuffer | null> => {
      if (!audioContextRef.current) return null;
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        return await audioContextRef.current.decodeAudioData(arrayBuffer);
      } catch (error) {
        console.error(`Failed to load audio file: ${url}`, error);
        useFallbackAudioRef.current = true;
        return null;
      }
    };

    const initializeAudioSamples = async () => {
      const config = audioSamplesConfig as AudioSamplesConfig;

      const samples = await Promise.all([
        loadAudioFile(config.palo.accent),
        loadAudioFile(config.palo.regular),
        loadAudioFile(config.jaleo.accent),
        loadAudioFile(config.jaleo.regular),
        loadAudioFile(config.castanets.accent),
        loadAudioFile(config.castanets.regular),
        loadAudioFile(config.cajon.accent),
        loadAudioFile(config.cajon.regular),
      ]);

      if (samples.every(sample => sample !== null)) {
        audioSamplesRef.current = {
          palo: { accent: samples[0]!, regular: samples[1]! },
          jaleo: { accent: samples[2]!, regular: samples[3]! },
          castanets: { accent: samples[4]!, regular: samples[5]! },
          cajon: { accent: samples[6]!, regular: samples[7]! },
        };
      } else {
        useFallbackAudioRef.current = true;
      }
    };

    initializeAudioSamples();
  }, []);

  const resumeAudioContext = () => {
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  return {
    audioContextRef,
    audioSamplesRef,
    useFallbackAudioRef,
    resumeAudioContext,
  };
}

