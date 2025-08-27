import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Story } from '../types/story';

import story1 from '../assets/simple_story.json';
import story2 from '../assets/mf_adventure.json';
import story3 from '../assets/crossroads.json';

type StoryListNavigationProp = StackNavigationProp<RootStackParamList, 'StoryList'>;

type Props = {
  navigation: StoryListNavigationProp;
};

// Default stories 
const defaultStories: Story[] = [story1, story2, story3].map((s, idx) => ({
  id: (s as Story).id ?? `default-${idx}`,
  title: (s as Story).title ?? `Story ${idx + 1}`,
  author: (s as Story).author,
  start: (s as Story).start,
  nodes: (s as Story).nodes
}));

export default function StoryList({ navigation }: Props) {
  const [stories, setStories] = useState<Story[]>(defaultStories);
  const [url, setUrl] = useState('');

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('stories');
      if (saved) {
        setStories(JSON.parse(saved));
      }
    })();
  }, []);

  const saveStories = async (newStories: Story[]) => {
    setStories(newStories);
    await AsyncStorage.setItem('stories', JSON.stringify(newStories));
  };

  const addStoryFromUrl = async () => {
    if (!url.trim()) return;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch story');
      const json = await response.json();

      const newStory: Story = {
        ...json,
        id: Date.now().toString(),
        title: json.title || 'Untitled Story',
      };

      const newStories = [...stories, newStory];
      await saveStories(newStories);
      setUrl('');
    } catch (err) {
      Alert.alert('Error', 'Unable to fetch story from URL.');
    }
  };

  const openStory = (story: Story) => {
    navigation.navigate('StoryScreen', { story });
  };

  const confirmDelete = (story: Story) => {
    Alert.alert(
      'Delete Story',
      `Are you sure you want to delete "${story.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updated = stories.filter((s) => s.id !== story.id);
            saveStories(updated);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Available Stories</Text>
      <FlatList
        data={stories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.storyItem}
            onPress={() => openStory(item)}
            onLongPress={() => confirmDelete(item)}
          >
            <Text style={styles.storyText}>{`${item.title} by ${item.author}`}</Text>
          </TouchableOpacity>
        )}
      />
      <View style={styles.addContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter story URL..."
          value={url}
          onChangeText={setUrl}
        />
        <TouchableOpacity style={styles.addButton} onPress={addStoryFromUrl}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  storyItem: {
    padding: 12,
    marginVertical: 4,
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  storyText: {
    color: '#fff',
    fontSize: 16,
  },
  addContainer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    marginRight: 8,
    borderRadius: 4,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
