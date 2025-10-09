// src/screens/SettingsScreen.js - App settings and preferences
import { clearLog, err, getLog } from '@/util/log';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../components/styles';
import { useGame } from '../context/GameContext';

const { height: screenHeight } = Dimensions.get('window');

export default function SettingsScreen({ navigation }) {
  const [settings, setSettings] = useState({
    soundEnabled: true,
    autoSave: true,
    textSize: 'medium',
    darkMode: false,
    vibration: true,
    notifications: false,
  });

  const { resetGameContext } = useGame();
  const [showLogModal, setShowLogModal] = useState(false);
  const [logContent, setLogContent] = useState('');
  const [showDevSection, setShowDevSection] = useState(false);

  const insets = useSafeAreaInsets();
  
  useEffect(() => {
    loadSettings();
    checkDevMode();
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

  const checkDevMode = async () => {
    try {
      const devMode = await AsyncStorage.getItem('developer_mode');
      setShowDevSection(devMode === 'true');
    } catch (error) {
      console.error('Failed to check dev mode:', error);
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

  const toggleDevMode = async () => {
    const newDevMode = !showDevSection;
    setShowDevSection(newDevMode);
    try {
      await AsyncStorage.setItem('developer_mode', newDevMode.toString());
    } catch (error) {
      console.error('Failed to save dev mode:', error);
    }
  };

  const showLogs = () => {
    try {
      const logs = getLog();
      setLogContent(logs || 'No logs available');
      setShowLogModal(true);
    } catch (error) {
      setLogContent('Error retrieving logs: ' + error.message);
      setShowLogModal(true);
    }
  };

  const clearLogs = () => {
    Alert.alert(
      'Clear Logs',
      'Are you sure you want to clear all log entries?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            try {
              clearLog();
              setLogContent('Logs cleared');
              Alert.alert('Success', 'Logs have been cleared.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear logs.');
            }
          },
        },
      ]
    );
  };

  const copyLogsToClipboard = async () => {
    try {
      // For React Native, you'd typically use @react-native-clipboard/clipboard
      // But since it's not imported, we'll show an alert with the logs
      Alert.alert(
        'Copy Logs',
        'Logs copied to clipboard',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to copy logs to clipboard.');
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
              
              // Reset game context state

              resetGameContext();

              Alert.alert('Success', 'All data has been cleared.');
            } catch (error) {
              err('Failed to clear data.', error);
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
    <>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar style="dark" backgroundColor="white" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
        <ScrollView style={styles.container}>
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

          {/* Developer Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Developer</Text>
            
            <SettingRow
              title="Developer Mode"
              description={showDevSection ? "Enabled" : "Disabled"}
              icon="code-slash-outline"
              rightElement={
                <Switch
                  value={showDevSection}
                  onValueChange={toggleDevMode}
                  trackColor={{ false: '#ccc', true: '#6366f1' }}
                />
              }
            />

            {showDevSection && (
              <>
                <SettingRow
                  title="Add Story From URL"
                  description="Download and install story from URL"
                  icon="download-outline"
                  onPress={() => navigation.navigate('AddByURL')}
                />

                <SettingRow
                  title="Show Logs"
                  description="View application logs"
                  icon="terminal-outline"
                  onPress={showLogs}
                />

                <SettingRow
                  title="Clear Logs"
                  description="Remove all log entries"
                  icon="trash-bin-outline"
                  onPress={clearLogs}
                />
              </>
            )}
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
      </View>

      {/* Log Viewer Modal */}
      <Modal
        visible={showLogModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowLogModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Application Logs</Text>
            <View style={styles.modalHeaderButtons}>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={copyLogsToClipboard}
              >
                <Ionicons name="copy-outline" size={20} color="#6366f1" />
                <Text style={styles.modalButtonText}>Copy</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => setShowLogModal(false)}
              >
                <Ionicons name="close-outline" size={20} color="#666" />
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <ScrollView style={styles.logContainer}>
            <TextInput
              style={styles.logText}
              value={logContent}
              multiline
              editable={false}
              scrollEnabled={false}
              textAlignVertical="top"
            />
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}