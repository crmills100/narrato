import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TextInput, Alert } from 'react-native';
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
const defaultStories: Story[] = [ story1, story2, story3 ];


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

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Available Stories</Text>
      <FlatList
        data={stories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Button title={item.title} onPress={() => openStory(item)} />
        )}
      />
      <View style={styles.addContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter story URL..."
          value={url}
          onChangeText={setUrl}
        />
        <Button title="Add" onPress={addStoryFromUrl} />
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
});
