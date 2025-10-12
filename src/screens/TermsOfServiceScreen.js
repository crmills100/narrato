// src/screens/TermsOfServiceScreen.js - Terms of Service
import { StatusBar } from 'expo-status-bar';
import {
  ScrollView,
  View
} from 'react-native';
import Markdown from "react-native-markdown-display";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../components/styles';
import { termsOfServiceContent } from '../components/TermsOfService';

export default function TermsOfServiceScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" backgroundColor="white" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Markdown style={styles}>
          {termsOfServiceContent}
        </Markdown>
      </ScrollView>
    </View>
  );
}