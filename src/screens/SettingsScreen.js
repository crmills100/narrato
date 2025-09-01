// src/screens/SettingsScreen.js - App settings and preferences
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getLog } from '../../util/log';

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    soundEnabled: true,
    autoSave: true,
    textSize: 'medium',
    darkMode: false,
    vibration: true,
    notifications: false,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem('narrato_settings');
      if (stored) {
        setSettings({ ...settings, ...JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const updateSetting = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    try {
      await AsyncStorage.setItem('cyoa_settings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const clearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all downloaded games and save data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Success', 'All data has been cleared.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data.');
            }
          },
        },
      ]
    );
  };

  const SettingRow = ({ title, description, icon, onPress, rightElement }) => (
    <TouchableOpacity style={styles.settingRow} onPress={onPress}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={20} color="#6366f1" style={styles.settingIcon} />
        <View>
          <Text style={styles.settingTitle}>{title}</Text>
          {description && <Text style={styles.settingDescription}>{description}</Text>}
        </View>
      </View>
      {rightElement || <Ionicons name="chevron-forward" size={16} color="#ccc" />}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      <Text style={styles.section}>Log: {getLog()}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gameplay</Text>
        
        <SettingRow
          title="Sound Effects"
          description="Play audio during games"
          icon="volume-high-outline"
          rightElement={
            <Switch
              value={settings.soundEnabled}
              onValueChange={(value) => updateSetting('soundEnabled', value)}
              trackColor={{ false: '#ccc', true: '#6366f1' }}
            />
          }
        />

        <SettingRow
          title="Auto Save"
          description="Automatically save progress"
          icon="save-outline"
          rightElement={
            <Switch
              value={settings.autoSave}
              onValueChange={(value) => updateSetting('autoSave', value)}
              trackColor={{ false: '#ccc', true: '#6366f1' }}
            />
          }
        />

        <SettingRow
          title="Haptic Feedback"
          description="Vibrate on choices and events"
          icon="phone-portrait-outline"
          rightElement={
            <Switch
              value={settings.vibration}
              onValueChange={(value) => updateSetting('vibration', value)}
              trackColor={{ false: '#ccc', true: '#6366f1' }}
            />
          }
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        
        <SettingRow
          title="Text Size"
          description={`Current: ${settings.textSize}`}
          icon="text-outline"
          onPress={() => {
            Alert.alert(
              'Text Size',
              'Choose your preferred text size',
              [
                { text: 'Small', onPress: () => updateSetting('textSize', 'small') },
                { text: 'Medium', onPress: () => updateSetting('textSize', 'medium') },
                { text: 'Large', onPress: () => updateSetting('textSize', 'large') },
                { text: 'Cancel', style: 'cancel' },
              ]
            );
          }}
        />

        <SettingRow
          title="Dark Mode"
          description="Use dark theme"
          icon="moon-outline"
          rightElement={
            <Switch
              value={settings.darkMode}
              onValueChange={(value) => updateSetting('darkMode', value)}
              trackColor={{ false: '#ccc', true: '#6366f1' }}
            />
          }
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data & Storage</Text>
        
        <SettingRow
          title="Clear All Data"
          description="Delete all games and saves"
          icon="trash-outline"
          onPress={clearAllData}
        />

        <SettingRow
          title="Export Save Data"
          description="Backup your progress"
          icon="cloud-upload-outline"
          onPress={() => Alert.alert('Coming Soon', 'Save export feature will be available in a future update.')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <SettingRow
          title="App Version"
          description="1.0.0"
          icon="information-circle-outline"
        />

        <SettingRow
          title="Privacy Policy"
          icon="shield-checkmark-outline"
          onPress={() => Alert.alert('Privacy Policy', 'Your privacy policy content would go here.')}
        />

        <SettingRow
          title="Terms of Service"
          icon="document-text-outline"
          onPress={() => Alert.alert('Terms of Service', 'Your terms of service content would go here.')}
        />
      </View>
    </ScrollView>
  );
}

// Styles for all components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  
  // Library Screen Styles
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  gameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  gameInfo: {
    flex: 1,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  gameAuthor: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  gameDescription: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 18,
  },
  gameStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  statIcon: {
    marginLeft: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#9ca3af',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  browseButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  browseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  // Store Screen Styles
  storeCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  storeThumbnail: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  storeGameInfo: {
    marginBottom: 12,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  storeGameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  featuredBadge: {
    backgroundColor: '#fbbf24',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  featuredText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  storeGameAuthor: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 6,
  },
  storeGameDescription: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  gameMetrics: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metricText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#4b5563',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  downloadButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  ownedButton: {
    backgroundColor: '#10b981',
  },
  downloadingButton: {
    backgroundColor: '#9ca3af',
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },

  // Game Screen Styles
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  nodeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  storyImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  storyText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
    marginBottom: 20,
  },
  inventorySection: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
    marginBottom: 4,
  },
  inventoryText: {
    fontSize: 14,
    color: '#4b5563',
  },
  choicesContainer: {
    marginTop: 20,
  },
  choicesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  choice: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  disabledChoice: {
    backgroundColor: '#f9fafb',
    opacity: 0.6,
  },
  choiceText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
    lineHeight: 22,
  },
  disabledChoiceText: {
    color: '#9ca3af',
  },
  gameStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
    backgroundColor: '#f3f4f6',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },

  // Settings Screen Styles
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 16,
  },

  // Common Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  gameList: {
    flex: 1,
  },
});
