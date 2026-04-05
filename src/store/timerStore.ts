// State store for timer using Zustand
import { create } from 'zustand';
import { TimerState, Song, SessionSong } from '../types';

interface TimerStateExtended extends TimerState {
  selectedSkillsSong: Song | null;
  selectedTargetPiece: Song | null;
  isComplete: boolean;
  sessionSongs: SessionSong[];
  lastSelectedSkillsSongId: string | null; // Track ID to prevent back-to-back
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
  addSessionSong: (song: SessionSong) => void;
  updateLastSessionSong: (duration: number) => void;
  setLastSelectedSkillsSongId: (id: string | null) => void;
  completeSession: () => void;
}

export const useTimerStore = create<TimerStateExtended & TimerActions>(set => ({
  totalMinutes: 0,
  elapsedSeconds: 0,
  isPaused: false,
  isRunning: false,
  phase: 'skills',
  selectedSkillsSong: null,
  selectedTargetPiece: null,
  isComplete: false,
  sessionSongs: [],
  lastSelectedSkillsSongId: null,

  start: () =>
    set({
      isRunning: true,
      isPaused: false,
      elapsedSeconds: 0,
      isComplete: false,
      sessionSongs: [],
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
      selectedTargetPiece: null,
      isComplete: false,
      sessionSongs: [],
      lastSelectedSkillsSongId: null,
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
      lastSelectedSkillsSongId: song?.id || null,
    }),

  setSelectedTargetPiece: (song: Song | null) =>
    set({
      selectedTargetPiece: song,
    }),

  addSessionSong: (song: SessionSong) =>
    set(state => ({
      sessionSongs: [...state.sessionSongs, song],
    })),

  updateLastSessionSong: (duration: number) =>
    set(state => {
      if (state.sessionSongs.length === 0) return state;
      const updated = [...state.sessionSongs];
      const lastSong = updated[updated.length - 1];
      updated[updated.length - 1] = {
        ...lastSong,
        endTime: Date.now(),
        duration,
      };
      return { sessionSongs: updated };
    }),

  setLastSelectedSkillsSongId: (id: string | null) =>
    set({
      lastSelectedSkillsSongId: id,
    }),

  completeSession: () =>
    set({
      isComplete: true,
      isRunning: false,
      isPaused: false,
    }),
}));
