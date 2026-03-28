import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useTimerStore } from '../store/timerStore';
import { useSongStore } from '../store/songStore';
import { formatTime, getSkillsTimeSeconds, getTargetTimeSeconds } from '../utils/timerHelpers';

const { width, height } = Dimensions.get('window');

export const TimerScreen: React.FC = () => {
  const { theme } = useTheme();
  const timerState = useTimerStore();
  const songState = useSongStore();
  const [inputMinutes, setInputMinutes] = useState('');
  const [intervalLoaded, setIntervalLoaded] = useState(false);

  // Load songs on mount
  useEffect(() => {
    const loadData = async () => {
      await songState.loadSongsFromStorage();
      setIntervalLoaded(true);
    };
    loadData();
  }, []);

  // Timer tick effect
  useEffect(() => {
    if (!timerState.isRunning || timerState.isPaused) {
      return;
    }

    const interval = setInterval(() => {
      const totalSeconds = timerState.totalMinutes * 60;
      if (timerState.elapsedSeconds < totalSeconds) {
        timerState.tick();

        // Update selected song when entering target phase
        if (timerState.elapsedSeconds === getSkillsTimeSeconds(timerState.totalMinutes)) {
          songState.setSelectedSkillsSong(null); // Clear skills song when moving to target
        }
      } else {
        // Timer completed
        timerState.reset();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timerState.isRunning, timerState.isPaused, timerState.elapsedSeconds, timerState.totalMinutes]);

  // Select random skills song when phase changes to skills
  useEffect(() => {
    if (timerState.phase === 'skills' && !timerState.selectedSkillsSong && intervalLoaded) {
      timerState.setSelectedSkillsSong(songState.getRandomSkillsSong());
    }
  }, [timerState.phase, intervalLoaded]);

  const handleSetTime = (minutes: string) => {
    const num = parseInt(minutes, 10);
    if (num > 0) {
      setInputMinutes(minutes);
      timerState.setTotalMinutes(num);
    }
  };

  const handleStart = () => {
    if (timerState.totalMinutes > 0) {
      timerState.start();
      if (!timerState.selectedSkillsSong && songState.skillsSongs.length > 0) {
        timerState.setSelectedSkillsSong(songState.getRandomSkillsSong());
      }
    }
  };

  const handlePause = () => {
    if (timerState.isRunning) {
      timerState.pause();
    }
  };

  const handleResume = () => {
    if (timerState.isPaused) {
      timerState.resume();
    }
  };

  const handleReset = () => {
    timerState.reset();
    setInputMinutes('');
  };

  // Calculate gradient colors based on progress
  const getGradientColors = (): [string, string] => {
    if (timerState.totalMinutes === 0 || timerState.elapsedSeconds === 0) {
      return ['#27AE60', '#27AE60']; // Green
    }

    const totalSeconds = timerState.totalMinutes * 60;
    const progress = timerState.elapsedSeconds / totalSeconds;

    // Green to yellow: 0% (green) to 50% (yellow transition starts), then yellow from 50-100%
    if (progress < 0.5) {
      // Interpolate from green to light yellow
      const localProgress = progress * 2; // 0 to 1 over first half
      const red = Math.floor(39 + (243 - 39) * localProgress); // 39 to 243
      const green = Math.floor(174 + (156 - 174) * localProgress); // 174 to 156
      const blue = Math.floor(96 + (77 - 96) * localProgress); // 96 to 77
      const color = `rgb(${red}, ${green}, ${blue})`;
      return [color, color];
    } else {
      // Yellow (stay at light yellow)
      return ['#F39C12', '#FDBF37'];
    }
  };

  const [gradientStart, gradientEnd] = getGradientColors();

  const skillsTimeSeconds = getSkillsTimeSeconds(timerState.totalMinutes);
  const targetTimeSeconds = getTargetTimeSeconds(timerState.totalMinutes);
  const timeRemainingInPhase =
    timerState.phase === 'skills'
      ? Math.max(0, skillsTimeSeconds - timerState.elapsedSeconds)
      : Math.max(0, skillsTimeSeconds + targetTimeSeconds - timerState.elapsedSeconds);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingVertical: 30,
      justifyContent: 'space-between',
    },
    header: {
      alignItems: 'center',
      marginBottom: 30,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 10,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      gap: 10,
    },
    input: {
      flex: 1,
      height: 50,
      borderColor: theme.colors.border,
      borderWidth: 2,
      borderRadius: 8,
      paddingHorizontal: 15,
      fontSize: 18,
      color: theme.colors.text,
    },
    inputLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    timerDisplayContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 40,
    },
    timerDisplay: {
      fontSize: 80,
      fontWeight: '700',
      color: '#FFFFFF',
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    phaseIndicator: {
      marginTop: 20,
      alignItems: 'center',
    },
    phaseLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
      marginBottom: 5,
    },
    phaseTime: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.8)',
    },
    songDisplay: {
      marginTop: 15,
      alignItems: 'center',
      paddingHorizontal: 15,
    },
    songLabel: {
      fontSize: 12,
      color: 'rgba(255, 255, 255, 0.6)',
      marginBottom: 5,
    },
    songName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
      textAlign: 'center',
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    controlsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 15,
      flexWrap: 'wrap',
    },
    button: {
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 10,
      minWidth: 100,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryButton: {
      backgroundColor: '#27AE60',
    },
    secondaryButton: {
      backgroundColor: '#3498DB',
    },
    dangerButton: {
      backgroundColor: '#E74C3C',
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    disabledButton: {
      opacity: 0.5,
    },
    infoText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: 15,
    },
  });

  const isTimerActive = timerState.isRunning;
  const canStart = timerState.totalMinutes > 0 && !timerState.isRunning;
  const canPause = timerState.isRunning && !timerState.isPaused;
  const canResume = timerState.isPaused;

  return (
    <LinearGradient
      colors={[gradientStart, gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Practice Timer</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Minutes"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="number-pad"
              value={inputMinutes}
              onChangeText={handleSetTime}
              editable={!isTimerActive}
              maxLength={3}
            />
            <Text style={styles.inputLabel}>min</Text>
          </View>
        </View>

        <View style={styles.timerDisplayContainer}>
          <Text style={styles.timerDisplay}>
            {formatTime(timerState.isRunning || timerState.isPaused ? timerState.elapsedSeconds : 0)}
          </Text>

          <View style={styles.phaseIndicator}>
            <Text style={styles.phaseLabel}>
              {timerState.phase === 'skills' ? '🎵 Skills Time' : '🎯 Target Practice'}
            </Text>
            <Text style={styles.phaseTime}>
              {formatTime(timeRemainingInPhase)} remaining
            </Text>

            {timerState.phase === 'skills' && timerState.selectedSkillsSong && (
              <View style={styles.songDisplay}>
                <Text style={styles.songLabel}>Current Piece</Text>
                <Text style={styles.songName}>{timerState.selectedSkillsSong.name}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.controlsContainer}>
          {!timerState.isRunning && (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton, !canStart && styles.disabledButton]}
              onPress={handleStart}
              disabled={!canStart}
            >
              <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
          )}

          {canPause && (
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handlePause}
            >
              <Text style={styles.buttonText}>Pause</Text>
            </TouchableOpacity>
          )}

          {canResume && (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleResume}
            >
              <Text style={styles.buttonText}>Resume</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.button, styles.dangerButton]}
            onPress={handleReset}
          >
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.infoText}>
          {timerState.totalMinutes > 0
            ? `Skills: ${Math.floor(skillsTimeSeconds / 60)}m | Target: ${Math.floor(targetTimeSeconds / 60)}m`
            : 'Enter practice time to begin'}
        </Text>
      </View>
    </LinearGradient>
  );
};
