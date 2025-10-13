// src/screens/AddStoryByURLScreen.js - Styled to match app design
import { log } from '@/util/log';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { File, Paths } from 'expo-file-system';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../components/styles';
import { useGame } from '../context/GameContext';

export default function AddStoryByURLScreen({ navigation }) {
  const { addGameToLibrary } = useGame();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  // Load saved URL when component mounts
  useEffect(() => {
    loadSavedUrl();
  }, []);

  // Save URL whenever it changes
  useEffect(() => {
    if (url.trim()) {
      saveUrl(url);
    }
  }, [url]);

  const loadSavedUrl = async () => {
    try {
      const savedUrl = await AsyncStorage.getItem('dev_story_url');
      if (savedUrl) {
        setUrl(savedUrl);
      }
    } catch (error) {
      log('Failed to load saved URL:', error);
    }
  };

  const saveUrl = async (urlToSave) => {
    try {
      await AsyncStorage.setItem('dev_story_url', urlToSave);
    } catch (error) {
      log('Failed to save URL:', error);
    }
  };

  const handleAdd = async () => {
    if (!url.trim()) {
      Alert.alert("Error", "Please enter a URL.");
      return;
    }

    try {
      setLoading(true);

      // Create a file path inside app's document directory
      const gameId = url.trim().split('/').pop().replace(/\.[^/.]+$/, "");
      const fileName = gameId + ".zip";

      // Download the file
      const localFile = new File(Paths.document, fileName);
      log("localFile: " + localFile.uri);
      if (localFile.exists) {
        log("deleting localFile");
        localFile.delete();
      }

      const myFile = await File.downloadFileAsync(url.trim(), Paths.document);
      log("myFile.exists: " + myFile.exists);
      log("myFile.uri: " + myFile.uri);

      // Add to library
      const success = await addGameToLibrary(myFile.uri, gameId);
      if (success) {
        Alert.alert(
          "Success", 
          "Game added to library successfully!",
          [
            {
              text: "OK",
              onPress: () => navigation.goBack()
            }
          ]
        );
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

  const handleSetDefault = () => {
    setUrl("http://192.168.1.196/basic_story.zip");
  };


  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const urlIsValid = url.trim() && isValidUrl(url.trim());

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" backgroundColor="white" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {/* Info Section */}
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color="#6366f1" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Developer Feature</Text>
              <Text style={styles.infoText}>
                Download and install CYOA games directly from a URL. The URL should point to a .zip file containing the game.
              </Text>
            </View>
          </View>

          {/* URL Input Section */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Game URL</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="link" size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={[styles.textInput, !urlIsValid && url.trim() && styles.inputError]}
                value={url}
                onChangeText={setUrl}
                placeholder="https://example.com/story.zip"
                placeholderTextColor="#9ca3af"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
                multiline={false}
                returnKeyType="done"
              />
            </View>
            {!urlIsValid && url.trim() && (
              <Text style={styles.errorText}>Please enter a valid URL</Text>
            )}
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={handleSetDefault}
              disabled={loading}
            >
              <Ionicons name="flash" size={20} color="#6366f1" />
              <View style={styles.quickActionContent}>
                <Text style={styles.quickActionTitle}>Use Default URL</Text>
                <Text style={styles.quickActionSubtitle}>Load test game URL</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>

          </View>

          {/* Action Buttons */}
          <View style={styles.buttonSection}>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                (!urlIsValid || loading) && styles.disabledButton
              ]}
              onPress={handleAdd}
              disabled={!urlIsValid || loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Ionicons name="download" size={20} color="white" />
                  <Text style={styles.primaryButtonText}>Download & Install Game</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {/* Status Indicator */}
          {loading && (
            <View style={styles.loadingIndicator}>
              <ActivityIndicator size="small" color="#6366f1" />
              <Text style={styles.loadingText}>Downloading game...</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
