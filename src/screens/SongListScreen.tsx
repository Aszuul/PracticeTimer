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

type SongType = 'skills' | 'target';

export const SongListScreen: React.FC = () => {
  const { theme } = useTheme();
  const songStore = useSongStore();
  const [newSkillsSongName, setNewSkillsSongName] = useState('');
  const [newTargetSongName, setNewTargetSongName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Edit mode and selection states
  const [skillsEditMode, setSkillsEditMode] = useState(false);
  const [targetEditMode, setTargetEditMode] = useState(false);
  const [skillsSelected, setSkillsSelected] = useState<Set<string>>(new Set());
  const [targetSelected, setTargetSelected] = useState<Set<string>>(new Set());

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

  // Handle single song long-press (quick delete)
  const handleSongLongPress = (type: SongType, id: string) => {
    if (type === 'skills' && !skillsEditMode) {
      setSkillsSelected(prev => {
        const newSet = new Set(prev);
        newSet.has(id) ? newSet.delete(id) : newSet.add(id);
        return newSet;
      });
    } else if (type === 'target' && !targetEditMode) {
      setTargetSelected(prev => {
        const newSet = new Set(prev);
        newSet.has(id) ? newSet.delete(id) : newSet.add(id);
        return newSet;
      });
    }
  };

  // Handle checkbox press in edit mode
  const handleCheckboxPress = (type: SongType, id: string) => {
    if (type === 'skills') {
      setSkillsSelected(prev => {
        const newSet = new Set(prev);
        newSet.has(id) ? newSet.delete(id) : newSet.add(id);
        return newSet;
      });
    } else {
      setTargetSelected(prev => {
        const newSet = new Set(prev);
        newSet.has(id) ? newSet.delete(id) : newSet.add(id);
        return newSet;
      });
    }
  };

  // Handle direct single song delete (from Remove button)
  const handleRemoveSong = async (type: SongType, id: string) => {
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

  // Handle bulk delete
  const handleBulkDelete = (type: SongType) => {
    const selectedSet = type === 'skills' ? skillsSelected : targetSelected;
    const selectedCount = selectedSet.size;

    if (selectedCount === 0) {
      Alert.alert('No Selection', 'Please select at least one song to delete');
      return;
    }

    Alert.alert(
      'Delete Selected',
      `Delete ${selectedCount} song${selectedCount !== 1 ? 's' : ''}?`,
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Delete',
          onPress: async () => {
            for (const id of selectedSet) {
              await songStore.removeSong(type, id);
            }
            if (type === 'skills') {
              setSkillsSelected(new Set());
              setSkillsEditMode(false);
            } else {
              setTargetSelected(new Set());
              setTargetEditMode(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  // Cancel edit mode and clear selections
  const handleCancelEditMode = (type: SongType) => {
    if (type === 'skills') {
      setSkillsEditMode(false);
      setSkillsSelected(new Set());
    } else {
      setTargetEditMode(false);
      setTargetSelected(new Set());
    }
  };

  const renderSongItem = ({ item, index }: { item: Song; index: number }) => {
    const isSkills = item.type === 'skills';
    const isEditMode = isSkills ? skillsEditMode : targetEditMode;
    const selectedSet = isSkills ? skillsSelected : targetSelected;
    const isSelected = selectedSet.has(item.id);

    return (
      <TouchableOpacity
        onLongPress={() => handleSongLongPress(item.type, item.id)}
        onPress={() => isEditMode && handleCheckboxPress(item.type, item.id)}
        style={[
          styles.songItem,
          { borderBottomColor: theme.colors.border },
          isSelected && styles.songItemSelected,
        ]}
      >
        {isEditMode && (
          <View style={styles.checkbox}>
            <View
              style={[
                styles.checkboxBox,
                isSelected && styles.checkboxBoxChecked,
              ]}
            >
              {isSelected && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </View>
        )}

        <Text style={[styles.songName, { color: theme.colors.text }]} numberOfLines={1}>
          {item.name}
        </Text>

        {!isEditMode && (
          <TouchableOpacity
            onPress={() => handleRemoveSong(item.type, item.id)}
            style={[styles.deleteButton, { backgroundColor: theme.colors.error }]}
          >
            <Text style={styles.deleteButtonText}>Remove</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const SectionHeader: React.FC<{
    title: string;
    type: SongType;
    editMode: boolean;
    selectedCount: number;
  }> = ({ title, type, editMode, selectedCount }) => {
    return (
      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{title}</Text>
        {selectedCount > 0 && (
          <Text style={[styles.selectedCountText, { color: theme.colors.textSecondary }]}>
            {selectedCount} selected
          </Text>
        )}
        <TouchableOpacity
          onPress={() => {
            if (type === 'skills') {
              setSkillsEditMode(!editMode);
              if (editMode) setSkillsSelected(new Set());
            } else {
              setTargetEditMode(!editMode);
              if (editMode) setTargetSelected(new Set());
            }
          }}
          style={[styles.editButton, editMode && styles.editButtonActive]}
        >
          <Text style={[styles.editButtonText, editMode && styles.editButtonTextActive]}>
            {editMode ? 'Done' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

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
    sectionHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      gap: 8,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      flex: 1,
    },
    selectedCountText: {
      fontSize: 12,
      fontStyle: 'italic',
    },
    editButton: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 4,
      backgroundColor: theme.colors.border,
    },
    editButtonActive: {
      backgroundColor: theme.colors.success,
    },
    editButtonText: {
      color: theme.colors.text,
      fontWeight: '600',
      fontSize: 12,
    },
    editButtonTextActive: {
      color: '#FFFFFF',
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
    songItemSelected: {
      backgroundColor: `${theme.colors.success}15`,
    },
    checkbox: {
      marginRight: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxBox: {
      width: 20,
      height: 20,
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    checkboxBoxChecked: {
      backgroundColor: theme.colors.success,
      borderColor: theme.colors.success,
    },
    checkmark: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize: 12,
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
    bulkDeleteButton: {
      backgroundColor: theme.colors.error,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 6,
      marginBottom: 8,
    },
    bulkDeleteButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 14,
      textAlign: 'center',
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
          <SectionHeader
            title="Practice Skills"
            type="skills"
            editMode={skillsEditMode}
            selectedCount={skillsSelected.size}
          />

          {skillsEditMode && skillsSelected.size > 0 && (
            <View style={styles.bulkDeleteButton}>
              <TouchableOpacity onPress={() => handleBulkDelete('skills')}>
                <Text style={styles.bulkDeleteButtonText}>
                  Delete {skillsSelected.size} song{skillsSelected.size !== 1 ? 's' : ''}
                </Text>
              </TouchableOpacity>
            </View>
          )}

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
                renderItem={({ item, index }) => renderSongItem({ item, index })}
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
          <SectionHeader
            title="Target Pieces"
            type="target"
            editMode={targetEditMode}
            selectedCount={targetSelected.size}
          />

          {targetEditMode && targetSelected.size > 0 && (
            <View style={styles.bulkDeleteButton}>
              <TouchableOpacity onPress={() => handleBulkDelete('target')}>
                <Text style={styles.bulkDeleteButtonText}>
                  Delete {targetSelected.size} song{targetSelected.size !== 1 ? 's' : ''}
                </Text>
              </TouchableOpacity>
            </View>
          )}

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
                renderItem={({ item, index }) => renderSongItem({ item, index })}
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
