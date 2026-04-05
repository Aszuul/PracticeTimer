import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useTimerStore } from '../store/timerStore';
import { useSongStore } from '../store/songStore';
import { formatTime, getSkillsTimeSeconds, getTargetTimeSeconds } from '../utils/timerHelpers';

export const TimerScreen: React.FC = () => {
  const { theme } = useTheme();
  const timerState = useTimerStore();
  const songState = useSongStore();
  const [inputMinutes, setInputMinutes] = useState('');
  const [intervalLoaded, setIntervalLoaded] = useState(false);
  const [songStartTime, setSongStartTime] = useState<number | null>(null);

  // Load songs on mount
  useEffect(() => {
    const loadData = async () => {
      await songState.loadSongsFromStorage();
      setIntervalLoaded(true);
    };
    loadData();
  }, []);

  // Timer tick effect - handles countdown and completion
  useEffect(() => {
    if (!timerState.isRunning || timerState.isPaused) {
      return;
    }

    const interval = setInterval(() => {
      const totalSeconds = timerState.totalMinutes * 60;
      const currentElapsed = timerState.elapsedSeconds;
      
      if (currentElapsed < totalSeconds - 1) {
        timerState.tick();
      } else {
        // Timer completed - finalize and show summary
        if (timerState.selectedSkillsSong || timerState.selectedTargetPiece) {
          const duration = songStartTime ? Math.floor((Date.now() - songStartTime) / 1000) : 0;
          timerState.updateLastSessionSong(duration);
        }
        timerState.completeSession();
        setSongStartTime(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timerState.isRunning, timerState.isPaused, timerState.elapsedSeconds, timerState.totalMinutes, songStartTime]);

  // Handle skills song selection with back-to-back prevention
  useEffect(() => {
    if (timerState.phase === 'skills' && !timerState.selectedSkillsSong && intervalLoaded && timerState.isRunning) {
      const randomSong = songState.getRandomSkillsSong(timerState.lastSelectedSkillsSongId || undefined);
      if (randomSong) {
        timerState.setSelectedSkillsSong(randomSong);
        setSongStartTime(Date.now());
        
        // Track this song in session songs
        timerState.addSessionSong({
          name: randomSong.name,
          type: 'skills',
          startTime: Date.now(),
          endTime: 0,
          duration: 0,
        });
      }
    }
  }, [timerState.phase, timerState.selectedSkillsSong, intervalLoaded, timerState.isRunning]);

  // Handle target piece selection
  useEffect(() => {
    if (timerState.phase === 'target' && !timerState.selectedTargetPiece && intervalLoaded && timerState.isRunning) {
      // When transitioning to target, finalize the last skills song
      if (timerState.sessionSongs.length > 0 && songStartTime) {
        const duration = Math.floor((Date.now() - songStartTime) / 1000);
        timerState.updateLastSessionSong(duration);
      }
      
      const randomPiece = songState.getRandomTargetPiece();
      if (randomPiece) {
        timerState.setSelectedTargetPiece(randomPiece);
        setSongStartTime(Date.now());
        
        // Track this song in session songs
        timerState.addSessionSong({
          name: randomPiece.name,
          type: 'target',
          startTime: Date.now(),
          endTime: 0,
          duration: 0,
        });
      }
    }
  }, [timerState.phase, timerState.selectedTargetPiece, intervalLoaded, timerState.isRunning]);

  // Handle TextInput changes - allow empty input with placeholder
  const handleSetTime = (text: string) => {
    // Allow only digits
    const numericText = text.replace(/[^0-9]/g, '');
    setInputMinutes(numericText);
    
    // Only update store if valid number >= 1
    const num = parseInt(numericText, 10);
    if (num >= 1) {
      timerState.setTotalMinutes(num);
    } else if (numericText === '') {
      // Reset store when empty
      timerState.setTotalMinutes(0);
    }
  };

  const handleStart = () => {
    const minutes = parseInt(inputMinutes, 10);
    if (minutes >= 1) {
      timerState.start();
      // Don't select song here - let the effect handle it
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
    setSongStartTime(null);
  };

  // Calculate gradient colors based on progress
  const getGradientColors = (): [string, string] => {
    if (timerState.totalMinutes === 0 || timerState.elapsedSeconds === 0) {
      return ['#27AE60', '#27AE60']; // Green
    }

    const totalSeconds = timerState.totalMinutes * 60;
    const progress = timerState.elapsedSeconds / totalSeconds;

    // Green to yellow gradient
    if (progress < 0.5) {
      const localProgress = progress * 2;
      const red = Math.floor(39 + (243 - 39) * localProgress);
      const green = Math.floor(174 + (156 - 174) * localProgress);
      const blue = Math.floor(96 + (77 - 96) * localProgress);
      const color = `rgb(${red}, ${green}, ${blue})`;
      return [color, color];
    } else {
      return ['#3EC961', '#6AD37E'];
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
    safeArea: {
      flex: 1,
    },
    contentContainer: {
      flex: 1,
      flexDirection: 'column',
    },
    scrollableContent: {
      flex: 1,
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
    header: {
      alignItems: 'center',
      marginBottom: 10,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: '#FFFFFF',
      marginBottom: 10,
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      gap: 10,
    },
    inputHidden: {
      height: 70,
      opacity: 0,
    },
    input: {
      flex: 1,
      height: 50,
      borderColor: 'rgba(255,255,255,0.3)',
      borderWidth: 2,
      borderRadius: 8,
      paddingHorizontal: 15,
      fontSize: 18,
      color: '#FFFFFF',
      backgroundColor: 'rgba(0,0,0,0.1)',
    },
    inputLabel: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.7)',
      fontWeight: '600',
    },
    timerDisplay: {
      fontSize: 80,
      fontWeight: '700',
      color: '#FFFFFF',
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
      marginBottom: 10,
      textAlign: 'center',
    },
    phaseIndicator: {
      alignItems: 'center',
      marginBottom: 20,
    },
    phaseLabel: {
      fontSize: 20,
      fontWeight: '600',
      color: '#FFFFFF',
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
      marginBottom: 5,
    },
    phaseTime: {
      fontSize: 16,
      color: 'rgba(255, 255, 255, 0.8)',
    },
    songDisplayContainer: {
      flex: 1,
      maxHeight: 250,
      marginBottom: 20,
      paddingHorizontal: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    songDisplay: {
      alignItems: 'center',
      paddingHorizontal: 15,
    },
    songLabel: {
      fontSize: 16,
      color: 'rgba(255, 255, 255, 0.6)',
      marginBottom: 10,
    },
    songName: {
      fontSize: 40,
      fontWeight: '600',
      color: '#FFFFFF',
      textAlign: 'center',
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    // Completion Summary Styles
    summaryContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    summaryTitle: {
      fontSize: 32,
      fontWeight: '700',
      color: '#FFFFFF',
      marginBottom: 20,
      textAlign: 'center',
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    summaryList: {
      width: '100%',
      marginBottom: 20,
    },
    summaryItem: {
      backgroundColor: 'rgba(0,0,0,0.2)',
      paddingVertical: 12,
      paddingHorizontal: 15,
      borderRadius: 8,
      marginBottom: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    summaryItemName: {
      fontSize: 18,
      fontWeight: '600',
      color: '#FFFFFF',
      flex: 1,
    },
    summaryItemTime: {
      fontSize: 16,
      color: 'rgba(255, 255, 255, 0.7)',
      fontWeight: '600',
    },
    summaryTotal: {
      fontSize: 18,
      fontWeight: '700',
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: 20,
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    // Bottom Controls Bar
    controlsBar: {
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: 'rgba(0,0,0,0.15)',
      borderTopWidth: 1,
      borderTopColor: 'rgba(255,255,255,0.1)',
    },
    controlsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 10,
      flexWrap: 'wrap',
    },
    button: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      minWidth: 90,
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
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    disabledButton: {
      opacity: 0.5,
    },
    infoText: {
      fontSize: 16,
      color: 'rgba(255, 255, 255, 0.6)',
      textAlign: 'center',
      marginBottom: 10,
    },
  });

  const isTimerActive = timerState.isRunning;
  const canStart = (parseInt(inputMinutes, 10) || 0) >= 1 && !timerState.isRunning;
  const canPause = timerState.isRunning && !timerState.isPaused;
  const canResume = timerState.isPaused;

  // Completion Summary Component
  if (timerState.isComplete) {
    const totalDuration = timerState.sessionSongs.reduce((sum, song) => sum + song.duration, 0);
    
    return (
      <LinearGradient
        colors={['#3EC961', '#6AD37E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.summaryContainer}
            scrollEnabled={timerState.sessionSongs.length > 4}
          >
            <Text style={styles.summaryTitle}>Practice Complete!</Text>
            
            <View style={styles.summaryList}>
              {timerState.sessionSongs.map((song, index) => (
                <View key={index} style={styles.summaryItem}>
                  <Text style={styles.summaryItemName}>{song.name}</Text>
                  <Text style={styles.summaryItemTime}>{formatTime(song.duration)}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.summaryTotal}>
              Total: {formatTime(totalDuration)}
            </Text>

            <TouchableOpacity
              style={[styles.button, styles.dangerButton, { width: '80%', paddingVertical: 16 }]}
              onPress={handleReset}
            >
              <Text style={[styles.buttonText, { fontSize: 16 }]}>Start New Session</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Normal Timer View
  return (
    <LinearGradient
      colors={[gradientStart, gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          {/* Scrollable Content */}
          <ScrollView
            style={styles.scrollableContent}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
          >
            {/* Timer Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Practice Timer</Text>
              <View style={isTimerActive ? styles.inputHidden : styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Minutes"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  keyboardType="number-pad"
                  value={inputMinutes}
                  onChangeText={handleSetTime}
                  editable={!isTimerActive}
                  maxLength={3}
                />
                <Text style={styles.inputLabel}>min</Text>
              </View>
              {/* Info text */}
              <Text style={styles.infoText}>
                {timerState.totalMinutes > 0
                  ? `Skills: ${Math.floor(skillsTimeSeconds / 60)}m | Target: ${Math.floor(targetTimeSeconds / 60)}m`
                  : 'Enter practice time to begin'}
              </Text>
            </View>

            {/* Timer Display */}
            <Text style={styles.timerDisplay}>
              {formatTime(timerState.isRunning || timerState.isPaused ? timerState.elapsedSeconds : 0)}
            </Text>

            {/* Phase Information */}
            <View style={styles.phaseIndicator}>
              <Text style={styles.phaseLabel}>
                {timerState.phase === 'skills' ? '🎵 Skills Time' : '🎯 Target Practice'}
              </Text>
              <Text style={styles.phaseTime}>
                {formatTime(timeRemainingInPhase)} remaining
              </Text>
            </View>

            {/* Current Song Display - Scrollable */}
            <View style={styles.songDisplayContainer}>
              {timerState.phase === 'skills' && timerState.selectedSkillsSong ? (
                <View style={styles.songDisplay}>
                  <Text style={styles.songLabel}>Current Piece</Text>
                  <Text style={styles.songName} numberOfLines={6} ellipsizeMode="tail">
                    {timerState.selectedSkillsSong.name}
                  </Text>
                </View>
              ) : timerState.phase === 'target' && timerState.selectedTargetPiece ? (
                <View style={styles.songDisplay}>
                  <Text style={styles.songLabel}>Current Piece</Text>
                  <Text style={styles.songName} numberOfLines={6} ellipsizeMode="tail">
                    {timerState.selectedTargetPiece.name}
                  </Text>
                </View>
              ) : null}
            </View>

            
          </ScrollView>

          {/* Fixed Bottom Controls Bar */}
          <View style={styles.controlsBar}>
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
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};
