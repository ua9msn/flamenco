# Flamenco Metronome Audio Files

This directory should contain the WAV audio files for the metronome sounds.

## Required Files

Place the following WAV files in this directory:

### Palo (Traditional Metronome)
- `palo-accent.wav` - High-pitched click for accented beats
- `palo-regular.wav` - Mid-pitched click for regular beats

### Jaleo (Vocal Shouts)
- `jaleo-accent.wav` - Vocal "olé" or clap sound for accents
- `jaleo-regular.wav` - Lighter vocal sound for regular beats

### Castanets
- `castanets-accent.wav` - Louder castanet click for accents
- `castanets-regular.wav` - Softer castanet click for regular beats

### Cajón (Flamenco Box Drum)
- `cajon-accent.wav` - Strong bass cajón hit for accents
- `cajon-regular.wav` - Lighter cajón tap for regular beats

## Audio File Specifications

- **Format**: WAV (recommended) or MP3
- **Sample Rate**: 44.1 kHz or 48 kHz
- **Bit Depth**: 16-bit or 24-bit
- **Length**: 0.1 - 0.5 seconds (short, percussive sounds work best)
- **Volume**: Normalized to prevent clipping

## Finding/Creating Sounds

You can:
1. Record your own flamenco sounds
2. Use royalty-free sound libraries (freesound.org, etc.)
3. Extract sounds from existing flamenco recordings
4. Generate sounds using audio software (Audacity, GarageBand, etc.)

## Fallback

If audio files are not found, the app will fail silently. Consider adding fallback synthesized sounds or error messages in the future.
