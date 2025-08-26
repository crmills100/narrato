import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
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

const defaultStories: Story[] = [ story1, story2, story3 ];

export default function StoryList({ navigation }: Props) {
  const [stories, setStories] = useState<Story[]>(defaultStories);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('stories');
      if (saved) setStories(JSON.parse(saved));
    })();
  }, []);

  const openStory = (story: Story) => {
    navigation.navigate('StoryScreen', { story });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={stories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Button title={item.title} onPress={() => openStory(item)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16
  }
});