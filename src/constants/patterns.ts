import React from 'react';

// Define flamenco patterns
export interface FlamencoPattern {
  name: string;
  beats: number;
  accents: number[];
  subdivision: number;
}

export const flamencoPatterns: FlamencoPattern[] = [
  { name: 'Soleá', beats: 12, accents: [3, 6, 8, 10, 12], subdivision: 2 },
  { name: 'Bulería', beats: 12, accents: [3, 6, 8, 10, 12], subdivision: 3 },
  { name: 'Alegría', beats: 12, accents: [3, 6, 8, 10, 12], subdivision: 2 },
  { name: 'Tangos', beats: 4, accents: [1, 3], subdivision: 2 },
  { name: 'Seguiriya', beats: 12, accents: [1, 3, 5, 8, 11], subdivision: 2 },
  { name: 'Fandango', beats: 12, accents: [1, 4, 7, 10], subdivision: 3 },
  { name: 'Rumba', beats: 4, accents: [1, 3, 4], subdivision: 2 },
];

