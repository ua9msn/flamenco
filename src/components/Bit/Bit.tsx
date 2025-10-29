import React from 'react';
import styles from './bit.module.less';
import { cva } from "class-variance-authority";


interface Props {
    index: number;
    angle: number;
    isAccent: boolean;
    isPlaying: boolean;
}

const bit = cva(styles.bitIndicator, {
    variants: {
        accent: {
            accented: styles.accent,
            normal: styles.regular
        },
    }
});


export const Bit = ({index, angle, isAccent, isPlaying}: Props) => {


    const beatScale = isPlaying ? 1.3 : 1;

    return (
        <div className={styles.bit} style={{transform: `rotate(${angle}deg)`}}>
            <div
                className={bit({accent: isAccent ? 'accented' : 'normal'})}
                style={{
                    transform: `scale(${beatScale})`,
                }}
            >
                <span style={{transform: `rotate(${-angle}deg)`}}>{index}</span>
            </div>
        </div>
    );
};