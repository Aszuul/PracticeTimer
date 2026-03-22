// State store for timer using Zustand
import { create } from 'zustand';
import { TimerState } from '../types';

interface TimerActions {
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  setTotalMinutes: (minutes: number) => void;
  setElapsedSeconds: (seconds: number) => void;
  tick: () => void;
  setPhase: (phase: 'skills' | 'target') => void;
}

export const useTimerStore = create<TimerState & TimerActions>(set => ({
  totalMinutes: 0,
  elapsedSeconds: 0,
  isPaused: false,
  isRunning: false,
  phase: 'skills',

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
}));
