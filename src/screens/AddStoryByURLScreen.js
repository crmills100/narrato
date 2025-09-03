// src/screens/AddStoryByURLScreen.js
import * as FileSystem from 'expo-file-system';
import { useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useGame } from '../context/GameContext';

export default function AddStoryByURLScreen({ navigation }) {
  const { addGameToLibrary } = useGame();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!url.trim()) {
      Alert.alert("Error", "Please enter a URL.");
      return;
    }

    try {
      setLoading(true);

      // Create a file path inside app's document directory
      const fileName = `game_${Date.now()}.json`;
      const fileUri = FileSystem.documentDirectory + fileName;

      // Download the file
      const result = await FileSystem.downloadAsync(url.trim(), fileUri);

      if (result.status !== 200) {
        throw new Error(`Failed to download file: ${result.status}`);
      }

      // Add to library
      const success = await addGameToLibrary(result.uri);
      if (success) {
        Alert.alert("Success", "Game added to library.");
        navigation.goBack();
      } else {
        Alert.alert("Error", "Failed to add game to library.");
      }

    } catch (error) {
      console.error("Error adding game:", error);
      Alert.alert("Error", error.message || "Could not add game.");
    } finally {
      setLoading(false);
    }
  };

  const handleDefault = () => {
    setUrl("http://192.168.0.157/story.json");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Story URL</Text>
      <TextInput
        style={styles.input}
        value={url}
        onChangeText={setUrl}
        placeholder="https://example.com/story.json"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <View style={styles.buttonRow}>
        <Button title="Default" onPress={handleDefault} />
        {loading ? (
          <ActivityIndicator size="small" color="#000" style={styles.spinner} />
        ) : (
          <Button title="Add" onPress={handleAdd} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  spinner: {
    alignSelf: 'center',
    marginLeft: 8,
  },
});
