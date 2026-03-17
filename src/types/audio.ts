export interface SoundTypes {
  palmas: boolean;
  jaleo: boolean;
  castanets: boolean;
  cajon: boolean;
}

export interface AudioSample {
  accent: AudioBuffer;
  regular: AudioBuffer;
}

export interface AudioSamples {
  palmas: AudioSample;
  jaleo: AudioSample;
  castanets: AudioSample;
  cajon: AudioSample;
}

