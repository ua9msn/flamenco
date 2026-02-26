import { AudioSamples, SoundTypes } from '../types/audio';

interface UseAudioPlaybackParams {
  audioContextRef: React.MutableRefObject<AudioContext | null>;
  audioSamplesRef: React.MutableRefObject<AudioSamples | null>;
  useFallbackAudioRef: React.MutableRefObject<boolean>;
  soundTypes: SoundTypes;
}

export function useAudioPlayback({
  audioContextRef,
  audioSamplesRef,
  useFallbackAudioRef,
  soundTypes,
}: UseAudioPlaybackParams) {
  const playFallbackTone = (isAccent: boolean, soundType: keyof AudioSamples) => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    const frequencies: Record<keyof AudioSamples, { accent: number; regular: number }> = {
      palo: { accent: 1200, regular: 800 },
      jaleo: { accent: 600, regular: 400 },
      castanets: { accent: 2000, regular: 1500 },
      cajon: { accent: 150, regular: 100 },
    };

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = isAccent
      ? frequencies[soundType].accent
      : frequencies[soundType].regular;

    oscillator.type = soundType === 'cajon' ? 'sine' : 'square';

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  };

  const playClick = (time: number, isAccent: boolean) => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const gain = ctx.createGain();
    gain.gain.value = 0.7;
    gain.connect(ctx.destination);

    const playSample = (soundType: keyof AudioSamples) => {
      if (useFallbackAudioRef.current) {
        // Play fallback immediately (timing will be approximate)
        playFallbackTone(isAccent, soundType);
        return;
      }

      if (!audioSamplesRef.current) return;
      const sample = audioSamplesRef.current[soundType];
      const buffer = isAccent ? sample.accent : sample.regular;
      if (!buffer) return;

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(gain);
      // Use the provided absolute AudioContext time for sample-accurate scheduling
      try {
        source.start(time);
      } catch (err) {
        // If scheduling fails, fall back to immediate playback
        source.start();
      }
    };

    if (soundTypes.palo) playSample('palo');
    if (soundTypes.jaleo) playSample('jaleo');
    if (soundTypes.castanets) playSample('castanets');
    if (soundTypes.cajon) playSample('cajon');
  };

  return { playClick, playFallbackTone };
}

