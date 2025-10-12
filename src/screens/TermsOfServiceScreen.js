// src/screens/AddStoryByURLScreen.js - Styled to match app design
import { StatusBar } from 'expo-status-bar';
import {
  ScrollView,
  View
} from 'react-native';
import Markdown from "react-native-markdown-display";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../components/styles';



export default function TermsOfServiceScreen({ navigation }) {

  const insets = useSafeAreaInsets();

  const tos3 = "Narrato Terms of Service\nFoo";
  
  const tos = "Narrato Terms of Service\nLast Updated: [Insert Date]_\nWelcome to **Narrato**, an interactive storytelling platform where players can explore, read, and experience branching narrative adventures. By using Narrato, you agree to these Terms of Service (“Terms”). Please read them carefully before accessing or using the app.\n";
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" backgroundColor="white" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        <Markdown style={styles}>
          {tos}
        </Markdown>

      </ScrollView>


    </View>
  );
}
