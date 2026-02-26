export interface SoundTypes {
  palo: boolean;
  jaleo: boolean;
  castanets: boolean;
  cajon: boolean;
}

export interface AudioSample {
  accent: AudioBuffer;
  regular: AudioBuffer;
}

export interface AudioSamples {
  palo: AudioSample;
  jaleo: AudioSample;
  castanets: AudioSample;
  cajon: AudioSample;
}

