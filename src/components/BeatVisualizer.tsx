import React, { useEffect, useState } from "react";

interface BeatVisualizerProps {
  currentBeat: number;
  totalBeats: number;
  accents: number[];
  isPlaying: boolean;
}

export function BeatVisualizer({
  currentBeat,
  totalBeats,
  accents,
  isPlaying,
}: BeatVisualizerProps) {
  // Rearrange beats to start with the last beat at the top (e.g., 12, 1, 2, 3... for 12-beat patterns)
  const beats = Array.from({ length: totalBeats }, (_, i) => {
    if (i === 0) return totalBeats; // First position gets the last beat number
    return i; // Subsequent positions get beats 1, 2, 3...
  });

  // Responsive circle radius based on viewport width
  const getCircleRadius = () => {
    if (typeof window !== "undefined") {
      // Smaller radius for mobile to prevent overlapping
      if (window.innerWidth < 640) {
        return 75; // Reduced from 95
      }
      return 110; // Adjusted for larger screens
    }
    return 110;
  };

  const [circleRadius, setCircleRadius] = useState(
    getCircleRadius(),
  );

  useEffect(() => {
    const handleResize = () => {
      setCircleRadius(getCircleRadius());
    };

    window.addEventListener("resize", handleResize);
    return () =>
      window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate angle for each beat position (starting from top, going clockwise)
  const getAngle = (beatIndex: number) => {
    return (beatIndex * 360) / totalBeats - 90; // -90 to start from top
  };

  // Calculate position for beat indicators on the circle
  const getPosition = (beatIndex: number, radius: number) => {
    const angle = getAngle(beatIndex);
    const radian = (angle * Math.PI) / 180;
    return {
      x: Math.cos(radian) * radius,
      y: Math.sin(radian) * radius,
    };
  };

  // Map current beat number to its visual position index
  const getBeatPositionIndex = (beatNumber: number) => {
    if (beatNumber === 0) return -1; // No beat
    if (beatNumber === totalBeats) return 0; // Last beat is at top (position 0)
    return beatNumber; // Beats 1-11 are at positions 1-11
  };

  // Calculate pointer angle - normalized to 0-360 to prevent overflow
  const getPointerAngle = () => {
    if (currentBeat === 0) return -90;
    const beatAngle = getAngle(getBeatPositionIndex(currentBeat));
    // Normalize to 0-360 range to prevent integer overflow
    return ((beatAngle + 90) % 360 + 360) % 360 - 90;
  };

  return (
    <div className="beat-visualizer">
      <div className="circle-container">
        <div className="circle-wrapper">
          {/* Beat Indicators in Circle */}
          {beats.map((beat, index) => {
            const position = getPosition(index, circleRadius);
            const isAccent = accents.includes(beat);
            const isCurrent = currentBeat === beat;

            let className = "beat-indicator ";
            if (isCurrent && isPlaying) {
              className += isAccent
                ? "current-accent"
                : "current-regular";
            } else {
              className += isAccent ? "accent" : "regular";
            }

            const beatScale = isCurrent && isPlaying ? 1.3 : 1;

            return (
              <div
                key={beat}
                className={className}
                style={{
                  left: `calc(50% + ${position.x}px)`,
                  top: `calc(50% + ${position.y}px)`,
                  transform: `translate(-50%, -50%) scale(${beatScale})`,
                }}
              >
                <span>{beat}</span>
              </div>
            );
          })}

          {/* Center Circle with Current Beat */}
          <div
            className="center-circle"
          >
            <div
              className={`center-display ${accents.includes(currentBeat) ? "accent" : "regular"}`}
            >
              <span>{currentBeat || "—"}</span>
            </div>
          </div>

          {/* Rotating Pointer */}
          {isPlaying && (
            <div
              className="pointer-container"
              style={{
                transform: `translate(-50%, -100%) rotate(${getPointerAngle() + 90}deg)`,
              }}
            >
              <div
                style={{
                  position: "relative",
                  height: `${circleRadius - 20}px`,
                }}
              >
                <div
                  className="pointer-line"
                  style={{ height: `${circleRadius - 20}px` }}
                />
                <div className="pointer-tip" />
              </div>
            </div>
          )}

          {/* Center dot for pointer pivot */}
          <div className="center-dot" />
        </div>
      </div>
    </div>
  );
}