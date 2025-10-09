// src/screens/ConfigureServerScreen.js - Configure game server URL
import { log } from '@/util/log';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../components/styles';

// Server configuration
const DEFAULT_SERVER_URL = 'http://192.168.0.157:3000/api/games';
const SERVER_URL_KEY = 'store_server_url';

export default function ConfigureServerScreen({ navigation }) {
  const [url, setUrl] = useState('');
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
      const savedUrl = await AsyncStorage.getItem(SERVER_URL_KEY);
      if (savedUrl) {
        setUrl(savedUrl);
      } else {
        setUrl(DEFAULT_SERVER_URL);
      }
    } catch (error) {
      log('Failed to load saved URL:', error);
      setUrl(DEFAULT_SERVER_URL);
    }
  };

  const saveUrl = async (urlToSave) => {
    try {
      await AsyncStorage.setItem(SERVER_URL_KEY, urlToSave);
    } catch (error) {
      log('Failed to save URL:', error);
    }
  };

  const handleSave = async () => {
    if (!url.trim()) {
      Alert.alert("Error", "Please enter a URL.");
      return;
    }

    try {
      await AsyncStorage.setItem(SERVER_URL_KEY, url.trim());
      Alert.alert(
        "Success",
        "Server URL updated successfully!\n\nPull to refresh the store to load games from the new server.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error("Error saving URL:", error);
      Alert.alert("Error", error.message || "Could not save server URL.");
    }
  };

  const handleResetToDefault = () => {
    Alert.alert(
      "Reset to Default",
      `Reset server URL to:\n${DEFAULT_SERVER_URL}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          onPress: () => setUrl(DEFAULT_SERVER_URL)
        }
      ]
    );
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
            <Ionicons name="server" size={24} color="#6366f1" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Server Configuration</Text>
              <Text style={styles.infoText}>
                Configure the URL where Narrato will fetch available games. The URL should point to an API endpoint that returns a JSON array of games.
              </Text>
            </View>
          </View>

          {/* URL Input Section */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Server API URL</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="link" size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={[styles.textInput, !urlIsValid && url.trim() && styles.inputError]}
                value={url}
                onChangeText={setUrl}
                placeholder="http://example.com/api/games"
                placeholderTextColor="#9ca3af"
                autoCapitalize="none"
                autoCorrect={false}
                multiline={false}
                returnKeyType="done"
                keyboardType="url"
              />
            </View>
            {!urlIsValid && url.trim() && (
              <Text style={styles.errorText}>Please enter a valid URL</Text>
            )}
          </View>

          {/* Current Configuration */}
          <View style={styles.configInfoSection}>
            <Text style={styles.configInfoTitle}>Current Configuration</Text>
            <View style={styles.configInfoBox}>
              <View style={styles.configInfoRow}>
                <Text style={styles.configInfoLabel}>Server URL:</Text>
                <Text style={styles.configInfoValue} numberOfLines={2}>
                  {url || 'Not set'}
                </Text>
              </View>
              <View style={styles.configInfoRow}>
                <Text style={styles.configInfoLabel}>Default URL:</Text>
                <Text style={styles.configInfoValue} numberOfLines={2}>
                  {DEFAULT_SERVER_URL}
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={handleResetToDefault}
            >
              <Ionicons name="refresh" size={20} color="#f59e0b" />
              <View style={styles.quickActionContent}>
                <Text style={styles.quickActionTitle}>Reset to Default</Text>
                <Text style={styles.quickActionSubtitle}>Restore default server URL</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonSection}>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                !urlIsValid && styles.disabledButton
              ]}
              onPress={handleSave}
              disabled={!urlIsValid}
            >
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text style={styles.primaryButtonText}>Save Configuration</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {/* Help Section */}
          <View style={styles.helpSection}>
            <Ionicons name="help-circle" size={20} color="#6b7280" />
            <Text style={styles.helpText}>
              The server should return a JSON array with game objects. Changes will take effect after refreshing the store.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}