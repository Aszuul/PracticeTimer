import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useSongStore } from '../store/songStore';
import { Song } from '../types';

export const SongListScreen: React.FC = () => {
  const { theme } = useTheme();
  const songStore = useSongStore();
  const [newSkillsSongName, setNewSkillsSongName] = useState('');
  const [newTargetSongName, setNewTargetSongName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load songs from storage on mount
  useEffect(() => {
    const loadSongs = async () => {
      await songStore.loadSongsFromStorage();
      setIsLoading(false);
    };
    loadSongs();
  }, []);

  const handleAddSkillsSong = async () => {
    if (!newSkillsSongName.trim()) {
      Alert.alert('Error', 'Please enter a song name');
      return;
    }
    await songStore.addSong('skills', newSkillsSongName.trim());
    setNewSkillsSongName('');
  };

  const handleAddTargetSong = async () => {
    if (!newTargetSongName.trim()) {
      Alert.alert('Error', 'Please enter a song name');
      return;
    }
    await songStore.addSong('target', newTargetSongName.trim());
    setNewTargetSongName('');
  };

  const handleRemoveSong = async (type: 'skills' | 'target', id: string) => {
    Alert.alert(
      'Remove Song',
      'Are you sure you want to remove this song?',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Remove',
          onPress: async () => {
            await songStore.removeSong(type, id);
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderSongItem = ({ item }: { item: Song }) => (
    <View style={[styles.songItem, { borderBottomColor: theme.colors.border }]}>
      <Text style={[styles.songName, { color: theme.colors.text }]}>{item.name}</Text>
      <TouchableOpacity
        onPress={() => handleRemoveSong(item.type, item.id)}
        style={[styles.deleteButton, { backgroundColor: theme.colors.error }]}
      >
        <Text style={styles.deleteButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    safeArea: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 20,
    },
    section: {
      marginTop: 20,
      marginHorizontal: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 12,
    },
    inputContainer: {
      flexDirection: 'row',
      marginBottom: 16,
      gap: 8,
    },
    input: {
      flex: 1,
      height: 48,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      color: theme.colors.text,
      fontSize: 14,
    },
    addButton: {
      height: 48,
      paddingHorizontal: 16,
      backgroundColor: theme.colors.success,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    addButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 14,
    },
    listContainer: {
      maxHeight: 250,
    },
    songItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 0,
      borderBottomWidth: 1,
    },
    songName: {
      flex: 1,
      fontSize: 16,
    },
    deleteButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 4,
    },
    deleteButtonText: {
      color: '#FFFFFF',
      fontWeight: '500',
      fontSize: 12,
    },
    emptyText: {
      color: theme.colors.textSecondary,
      fontSize: 14,
      fontStyle: 'italic',
      paddingVertical: 20,
      textAlign: 'center',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      color: theme.colors.text,
      fontSize: 16,
    },
  });

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading songs...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Skills Songs Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Practice Skills</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Add new skill..."
              placeholderTextColor={theme.colors.textSecondary}
              value={newSkillsSongName}
              onChangeText={setNewSkillsSongName}
              onSubmitEditing={handleAddSkillsSong}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddSkillsSong}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listContainer}>
            {songStore.skillsSongs.length > 0 ? (
              <FlatList
                data={songStore.skillsSongs}
                renderItem={renderSongItem}
                keyExtractor={item => item.id}
                scrollEnabled={false}
              />
            ) : (
              <Text style={styles.emptyText}>No skills added yet</Text>
            )}
          </View>
        </View>

        {/* Target Songs Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Target Pieces</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Add new target piece..."
              placeholderTextColor={theme.colors.textSecondary}
              value={newTargetSongName}
              onChangeText={setNewTargetSongName}
              onSubmitEditing={handleAddTargetSong}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddTargetSong}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listContainer}>
            {songStore.targetSongs.length > 0 ? (
              <FlatList
                data={songStore.targetSongs}
                renderItem={renderSongItem}
                keyExtractor={item => item.id}
                scrollEnabled={false}
              />
            ) : (
              <Text style={styles.emptyText}>No target pieces added yet</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
