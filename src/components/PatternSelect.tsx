import React from 'react';

interface FlamencoPattern {
  name: string;
  beats: number;
  accents: number[];
  subdivision: number;
}

interface PatternSelectProps {
  selectedPattern: FlamencoPattern;
  patterns: FlamencoPattern[];
  onPatternChange: (pattern: FlamencoPattern) => void;
}

export function PatternSelect({
  selectedPattern,
  patterns,
  onPatternChange,
}: PatternSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="control-group">
      <label className="control-label">Palo</label>
      <div className="select-container">
        <button
          className="select-button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{selectedPattern.name} ({selectedPattern.beats})</span>
          <span style={{ fontSize: '0.75rem' }}>▼</span>
        </button>
        {isOpen && (
          <div className="select-dropdown">
            {patterns.map((pattern) => (
              <div
                key={pattern.name}
                className="select-option"
                onClick={() => {
                  onPatternChange(pattern);
                  setIsOpen(false);
                }}
              >
                {pattern.name} ({pattern.beats})
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

