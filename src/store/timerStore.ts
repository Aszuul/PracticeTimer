// State store for timer using Zustand
import { create } from 'zustand';
import { TimerState, Song } from '../types';

interface TimerStateExtended extends TimerState {
  selectedSkillsSong: Song | null;
  selectedTargetPiece: Song | null;
}

interface TimerActions {
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  setTotalMinutes: (minutes: number) => void;
  setElapsedSeconds: (seconds: number) => void;
  tick: () => void;
  setPhase: (phase: 'skills' | 'target') => void;
  setSelectedSkillsSong: (song: Song | null) => void;
  setSelectedTargetPiece: (song: Song | null) => void;
}

export const useTimerStore = create<TimerStateExtended & TimerActions>(set => ({
  totalMinutes: 0,
  elapsedSeconds: 0,
  isPaused: false,
  isRunning: false,
  phase: 'skills',
  selectedSkillsSong: null,
  selectedTargetPiece: null,

  start: () =>
    set({
      isRunning: true,
      isPaused: false,
      elapsedSeconds: 0,
    }),

  pause: () =>
    set({
      isPaused: true,
    }),

  resume: () =>
    set({
      isPaused: false,
    }),

  reset: () =>
    set({
      totalMinutes: 0,
      elapsedSeconds: 0,
      isPaused: false,
      isRunning: false,
      phase: 'skills',
      selectedSkillsSong: null,
    }),

  setTotalMinutes: (minutes: number) =>
    set({
      totalMinutes: minutes,
    }),

  setElapsedSeconds: (seconds: number) =>
    set({
      elapsedSeconds: seconds,
    }),

  tick: () =>
    set(state => {
      const newElapsed = state.elapsedSeconds + 1;
      const newPhase = newElapsed < (state.totalMinutes * 60) / 2 ? 'skills' : 'target';
      return {
        elapsedSeconds: newElapsed,
        phase: newPhase,
      };
    }),

  setPhase: (phase: 'skills' | 'target') =>
    set({
      phase,
    }),

  setSelectedSkillsSong: (song: Song | null) =>
    set({
      selectedSkillsSong: song,
    }),

  setSelectedTargetPiece: (song: Song | null) =>
    set({
      selectedTargetPiece: song,
    })
}));
