/**
 * PracticeTimer App
 * A React Native music practice timer app
 *
 * @format
 */

import React, { useState } from 'react';
import { StatusBar, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { TimerScreen } from './src/screens/TimerScreen';
import { SongListScreen } from './src/screens/SongListScreen';
import { TunerScreen } from './src/screens/TunerScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

type TabType = 'timer' | 'songs' | 'tuner' | 'settings';

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('timer');
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
    },
    tabBar: {
      flexDirection: 'row',
      backgroundColor: theme.colors.background,
      borderTopColor: theme.colors.border,
      borderTopWidth: 1,
      paddingBottom: insets.bottom,
    },
    tabItem: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabLabel: {
      fontSize: 12,
      fontWeight: '500',
      marginTop: 4,
    },
  });

  const renderScreen = () => {
    switch (activeTab) {
      case 'timer':
        return <TimerScreen />;
      case 'songs':
        return <SongListScreen />;
      case 'tuner':
        return <TunerScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <TimerScreen />;
    }
  };

  const tabs: Array<{ id: TabType; label: string }> = [
    { id: 'timer', label: 'Timer' },
    { id: 'songs', label: 'Pieces' },
    { id: 'tuner', label: 'Tuner' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <View style={styles.content}>{renderScreen()}</View>
      <View style={styles.tabBar}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabItem}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text
              style={[
                styles.tabLabel,
                {
                  color:
                    activeTab === tab.id ? '#27AE60' : theme.colors.textSecondary,
                },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
