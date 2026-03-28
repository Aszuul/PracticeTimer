// State store for songs using Zustand
import { create } from 'zustand';
import { Song } from '../types';
import { loadSongs, saveSongs } from '../utils/storage';

interface SongStoreState {
  skillsSongs: Song[];
  targetSongs: Song[];
  selectedSkillsSong: Song | null;
  selectedTargetPiece: Song | null;
}

interface SongStoreActions {
  loadSongsFromStorage: () => Promise<void>;
  addSong: (type: 'skills' | 'target', name: string) => Promise<void>;
  removeSong: (type: 'skills' | 'target', id: string) => Promise<void>;
  getRandomSkillsSong: () => Song | null;
  setSelectedSkillsSong: (song: Song | null) => void;
  getRandomTargetPiece: () => Song | null;
  setSelectedTargetPiece: (song: Song | null) => void;
}

export const useSongStore = create<SongStoreState & SongStoreActions>((set, get) => ({
  skillsSongs: [],
  targetSongs: [],
  selectedSkillsSong: null,
  selectedTargetPiece: null,

  loadSongsFromStorage: async () => {
    try {
      const skills = await loadSongs('skills');
      const target = await loadSongs('target');
      set({
        skillsSongs: skills,
        targetSongs: target,
      });
    } catch (error) {
      console.error('Error loading songs from storage:', error);
    }
  },

  addSong: async (type: 'skills' | 'target', name: string) => {
    set(state => {
      const newSong: Song = {
        id: Date.now().toString(),
        name,
        type,
        createdAt: Date.now(),
      };

      const songs = type === 'skills' ? state.skillsSongs : state.targetSongs;
      const updatedSongs = [...songs, newSong];

      saveSongs(type, updatedSongs).catch(err => console.error('Error saving song:', err));

      if (type === 'skills') {
        return { skillsSongs: updatedSongs };
      } else {
        return { targetSongs: updatedSongs };
      }
    });
  },

  removeSong: async (type: 'skills' | 'target', id: string) => {
    set(state => {
      const songs = type === 'skills' ? state.skillsSongs : state.targetSongs;
      const updatedSongs = songs.filter(song => song.id !== id);

      saveSongs(type, updatedSongs).catch(err => console.error('Error saving song:', err));

      if (type === 'skills') {
        return { skillsSongs: updatedSongs };
      } else {
        return { targetSongs: updatedSongs };
      }
    });
  },

  getRandomSkillsSong: () => {
    const state = get();
    if (state.skillsSongs.length === 0) return null;
    return state.skillsSongs[Math.floor(Math.random() * state.skillsSongs.length)];
  },

  getRandomTargetPiece: () => {
    const state = get();
    if (state.targetSongs.length === 0) return null;
    return state.targetSongs[Math.floor(Math.random() * state.targetSongs.length)];
  },

  setSelectedSkillsSong: (song: Song | null) => {
    set({ selectedSkillsSong: song });
  },

  setSelectedTargetPiece: (song: Song | null) => {
    set({ selectedTargetPiece: song });
  }
}));
