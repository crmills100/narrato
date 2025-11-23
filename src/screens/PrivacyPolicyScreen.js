// src/screens/PrivacyPolicyScreen.js - Terms of Service
import { StatusBar } from 'expo-status-bar';
import {
  ScrollView,
  View
} from 'react-native';
import Markdown from "react-native-markdown-display";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { privacyPolicyContent } from '../components/PrivacyPolicy';
import styles from '../components/styles';

export default function PrivacyPolicyScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" backgroundColor="white" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Markdown style={styles}>
          {privacyPolicyContent}
        </Markdown>
      </ScrollView>
    </View>
  );
}