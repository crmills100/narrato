import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, StoryNode } from '../types/story';
import { IconSymbol } from '@/components/ui/IconSymbol';

type StoryScreenRouteProp = RouteProp<RootStackParamList, 'StoryScreen'>;

type Props = {
  route: StoryScreenRouteProp;
};

export default function StoryScreen({ route }: Props) {
  const { story } = route.params;
  const [currentNodeId, setCurrentNodeId] = useState<string>(story.start);
  const currentNode: StoryNode = story.nodes[currentNodeId];

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.text}>{currentNode.text}</Text>

        {currentNode.ending ? (
          <Text style={styles.text}>The End</Text>
        ) : (
          currentNode.options?.map((option, idx) => (
            <Button key={idx} title={option.description} onPress={() => setCurrentNodeId(option.target)} />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16
  },
  text: {
    fontSize: 18,
    marginBottom: 12
  }
});