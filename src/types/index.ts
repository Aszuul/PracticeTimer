// Timer types
export interface TimerState {
  totalMinutes: number;
  elapsedSeconds: number;
  isPaused: boolean;
  isRunning: boolean;
  phase: 'skills' | 'target';
}

// Song/Piece types
export interface Song {
  id: string;
  name: string;
  type: 'skills' | 'target';
  createdAt: number;
}

// Settings types
export interface AppSettings {
  darkMode: boolean;
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

// Navigation types
export type RootTabParamList = {
  Timer: undefined;
  Songs: undefined;
  Tuner: undefined;
  Settings: undefined;
};

// Theme types
export interface Theme {
  isDark: boolean;
  colors: {
    background: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    error: string;
    warning: string;
  };
}
