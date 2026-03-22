import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export const TunerScreen: React.FC = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    text: {
      color: theme.colors.text,
      fontSize: 18,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tuner Screen</Text>
    </View>
  );
};
