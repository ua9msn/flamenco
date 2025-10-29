import { useEffect, useState } from 'react';

import style from './bitVisualizer.module.less';
import { Bit } from "../Bit/Bit";

interface BeatVisualizerProps {
    currentBeat: number;
    beats: boolean[];
    isPlaying: boolean;
}

export function BitVisualizer({currentBeat, beats}: BeatVisualizerProps) {

    const totalBeats = beats.length;

    const [scale, setScale] = useState(1);

    // Calculate angle for each beat position (starting from top, going clockwise)
    const getAngle = (beatIndex: number) => {
        return (beatIndex * 360 / totalBeats) - 90; // -90 to start from top
    };

    // Map current beat number to its visual position index
    const getBeatPositionIndex = (beatNumber: number) => {
        if (beatNumber === 0) return -1; // No beat
        if (beatNumber === totalBeats) return 0; // Last beat is at top (position 0)
        return beatNumber; // Beats 1-11 are at positions 1-11
    };

    const pointerAngle = currentBeat > 0 ? getAngle(getBeatPositionIndex(currentBeat)) : -90;

    // Pulse animation for current beat
    useEffect(() => {
        if (currentBeat) {
            setScale(1.05);
            const timer = setTimeout(() => setScale(1), 150);
            return () => clearTimeout(timer);
        }
    }, [currentBeat]);

    return (
        <div className={style.bitVisualizer}>
            <div className={style.circleContainer}>
                {beats.map((beat, index) => {
                    const isAccent = !!beat;
                    const isCurrent = currentBeat === index;
                    const angle = (index * 360 / totalBeats);

                    return <Bit key={angle} angle={angle} isAccent={isAccent} isPlaying={isCurrent} index={index}/>
                })}

                <div className={style.center} style={{transform: `scale(${scale})`}}>
                    <div className={`center-display ${beats[currentBeat] ? 'accent' : 'regular'}`}>
                        <span>{currentBeat || ''}</span>
                    </div>
                </div>

                <div className={style.pointer} style={{transform: `rotate(${pointerAngle + 90}deg)`}}>
                    <div className={style.tip}/>
                    <div className={style.line}/>
                </div>

            </div>
        </div>
    );
}