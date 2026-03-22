// Storage utilities for AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Song } from '../types';
import { getDefaultSongs } from './defaultSongs';

const SKILLS_SONGS_KEY = '@practiceTimer:skillsSongs';
const TARGET_SONGS_KEY = '@practiceTimer:targetSongs';
const INITIALIZED_KEY = '@practiceTimer:initialized';

export const saveSongs = async (type: 'skills' | 'target', songs: Song[]): Promise<void> => {
  const key = type === 'skills' ? SKILLS_SONGS_KEY : TARGET_SONGS_KEY;
  try {
    await AsyncStorage.setItem(key, JSON.stringify(songs));
  } catch (error) {
    console.error(`Error saving ${type} songs:`, error);
    throw error;
  }
};

export const loadSongs = async (type: 'skills' | 'target'): Promise<Song[]> => {
  const key = type === 'skills' ? SKILLS_SONGS_KEY : TARGET_SONGS_KEY;
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error loading ${type} songs:`, error);
    return [];
  }
};

export const initializeDefaultSongs = async (): Promise<void> => {
  try {
    const isInitialized = await AsyncStorage.getItem(INITIALIZED_KEY);
    if (isInitialized) {
      return;
    }

    const defaultSongs = getDefaultSongs();
    const skillsSongs = defaultSongs.filter(song => song.type === 'skills');
    const targetSongs = defaultSongs.filter(song => song.type === 'target');

    await saveSongs('skills', skillsSongs);
    await saveSongs('target', targetSongs);
    await AsyncStorage.setItem(INITIALIZED_KEY, 'true');
  } catch (error) {
    console.error('Error initializing default songs:', error);
    throw error;
  }
};

export const clearAllSongs = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(SKILLS_SONGS_KEY);
    await AsyncStorage.removeItem(TARGET_SONGS_KEY);
    await AsyncStorage.removeItem(INITIALIZED_KEY);
  } catch (error) {
    console.error('Error clearing songs:', error);
    throw error;
  }
};
