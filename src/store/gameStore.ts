import { create } from 'zustand';

interface GameState {
  score: number;
  lives: number;
  level: number;
  gravityDir: number; // 1 for down, -1 for up
  combo: number;
  lastFlipTime: number;
  setScore: (score: number | ((s: number) => number)) => void;
  setLives: (lives: number | ((l: number) => number)) => void;
  setLevel: (level: number | ((l: number) => number)) => void;
  setGravityDir: (dir: number) => void;
  setCombo: (combo: number) => void;
  setLastFlipTime: (time: number) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  lives: 3,
  level: 1,
  gravityDir: 1,
  combo: 0,
  lastFlipTime: 0,
  setScore: (score) => set((state) => ({ score: typeof score === 'function' ? score(state.score) : score })),
  setLives: (lives) => set((state) => ({ lives: typeof lives === 'function' ? lives(state.lives) : lives })),
  setLevel: (level) => set((state) => ({ level: typeof level === 'function' ? level(state.level) : level })),
  setGravityDir: (dir) => set({ gravityDir: dir }),
  setCombo: (combo) => set({ combo }),
  setLastFlipTime: (time) => set({ lastFlipTime: time }),
  resetGame: () => set({ score: 0, lives: 3, level: 1, gravityDir: 1, combo: 0, lastFlipTime: 0 }),
}));
