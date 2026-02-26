import React from 'react';
import { CustomCheckbox } from './CustomCheckbox';

interface SoundTypes {
  palo: boolean;
  jaleo: boolean;
  castanets: boolean;
  cajon: boolean;
}

interface SoundTypesControlProps {
  soundTypes: SoundTypes;
  onSoundTypeChange: (key: keyof SoundTypes, value: boolean) => void;
}

export function SoundTypesControl({
  soundTypes,
  onSoundTypeChange,
}: SoundTypesControlProps) {
  return (
    <div className="sound-types-group">
      <label className="control-label">Sound Types</label>
      <div className="sound-types-grid">
        <CustomCheckbox
          id="palo"
          checked={soundTypes.palo}
          onChange={(checked) => onSoundTypeChange('palo', checked)}
          label="Palo"
        />
        <CustomCheckbox
          id="jaleo"
          checked={soundTypes.jaleo}
          onChange={(checked) => onSoundTypeChange('jaleo', checked)}
          label="Jaleo"
        />
        <CustomCheckbox
          id="castanets"
          checked={soundTypes.castanets}
          onChange={(checked) => onSoundTypeChange('castanets', checked)}
          label="Castanets"
        />
        <CustomCheckbox
          id="cajon"
          checked={soundTypes.cajon}
          onChange={(checked) => onSoundTypeChange('cajon', checked)}
          label="Cajón"
        />
      </div>
    </div>
  );
}

