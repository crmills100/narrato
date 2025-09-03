// src/screens/SettingsScreen.js - App settings and preferences
import { getLog } from '@/util/log';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import styles from '../components/styles';

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
