interface AudioSample {
  accent: HTMLAudioElement;
  regular: HTMLAudioElement;
}

interface AudioSamples {
  palo: AudioSample;
  jaleo: AudioSample;
  castanets: AudioSample;
  cajon: AudioSample;
}

class AudioManager {
  private samples: AudioSamples | null = null;
  private isLoaded = false;

  async loadSamples(): Promise<void> {
    if (this.isLoaded) return;

    try {
      // Create audio elements for each sound type
      this.samples = {
        palo: {
          accent: this.createAudio('/sounds/palo-accent.wav'),
          regular: this.createAudio('/sounds/palo-regular.wav'),
        },
        jaleo: {
          accent: this.createAudio('/sounds/jaleo-accent.wav'),
          regular: this.createAudio('/sounds/jaleo-regular.wav'),
        },
        castanets: {
          accent: this.createAudio('/sounds/castanets-accent.wav'),
          regular: this.createAudio('/sounds/castanets-regular.wav'),
        },
        cajon: {
          accent: this.createAudio('/sounds/cajon-accent.wav'),
          regular: this.createAudio('/sounds/cajon-regular.wav'),
        },
      };

      this.isLoaded = true;
    } catch (error) {
      console.error('Error loading audio samples:', error);
    }
  }

  private createAudio(src: string): HTMLAudioElement {
    const audio = new Audio(src);
    audio.preload = 'auto';
    audio.volume = 0.7;
    return audio;
  }

  play(soundType: 'palo' | 'jaleo' | 'castanets' | 'cajon', isAccent: boolean): void {
    if (!this.samples) return;

    const sample = this.samples[soundType];
    const audio = isAccent ? sample.accent : sample.regular;

    // Clone and play to allow overlapping sounds
    const clone = audio.cloneNode(true) as HTMLAudioElement;
    clone.volume = audio.volume;
    clone.play().catch(err => console.error('Error playing sound:', err));
  }

  setVolume(soundType: 'palo' | 'jaleo' | 'castanets' | 'cajon', volume: number): void {
    if (!this.samples) return;
    this.samples[soundType].accent.volume = volume;
    this.samples[soundType].regular.volume = volume;
  }
}

export const audioManager = new AudioManager();
