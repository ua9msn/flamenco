import React, { useState } from 'react';
import { FlamencoPattern } from "../../types";
import style from "./styleSelector.module.less";


interface Props {
    flamencoPatterns: FlamencoPattern[];
    selectedPatternIndex: number;
    setSelectedPattern: (patternIndex: number) => void;
}

export const StyleSelector = ({flamencoPatterns, selectedPatternIndex, setSelectedPattern}: Props) => {

    const [isSelectOpen, setIsSelectOpen] = useState(false);

    const selectedPattern = flamencoPatterns[selectedPatternIndex];


    return (
        <div className={style.styleSelector}>
            <div className={style.selectContainer}>
                <button
                    className={style.button}
                    onClick={() => setIsSelectOpen(!isSelectOpen)}
                >
                    <span>{selectedPattern.name} ({selectedPattern.beats})</span>
                    <span>▼</span>
                </button>
                {isSelectOpen && (
                    <div className={style.selectDropdown}>
                        {flamencoPatterns.map((pattern, index) => (
                            <div
                                key={pattern.name}
                                className={style.option}
                                onClick={() => {
                                    setSelectedPattern(index);
                                    setIsSelectOpen(false);
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
};