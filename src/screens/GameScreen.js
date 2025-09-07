// src/screens/GameScreen.js - Game engine and player with audio support
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import Markdown from "react-native-markdown-display";

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import styles from '../components/styles';
import { useGame } from '../context/GameContext';
import { gameEngine } from '../engine/GameEngine';


export default function GameScreen({ navigation }) {
  const { currentGame, gameState, saveGameProgress, getImageAssetUri, getAudioAssetUri } = useGame();
  const [currentNode, setCurrentNode] = useState(null);
  const [variables, setVariables] = useState({});
  const [inventory, setInventory] = useState([]);
  const [gameHistory, setGameHistory] = useState([]);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);

  useEffect(() => {
    if (currentGame) {
      initializeGame();
    }
  }, [currentGame]);

  // Cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  // Effect to cleanup the audio when screen focus lost
  useFocusEffect(
    useCallback(() => {
      // This runs when the screen comes into focus
      return () => {
        // This cleanup runs when the screen loses focus (user navigates away)
        if (sound && isPlaying) {
          sound.pauseAsync().catch(console.warn);
          setIsPlaying(false);
        }
      };
    }, [sound])
  );


  const initializeGame = () => {
    if (!currentGame?.story) return;

    const startNode = currentGame.story.start_node || 'start';
    const initialVars = gameEngine.initializeVariables(currentGame.story.game_state?.variables || {});
    
    setVariables({ ...initialVars, ...gameState.variables });
    setInventory(gameState.inventory || []);
    setGameHistory(gameState.history || []);
    loadNode(startNode);
  };

  const loadAudio = async (audioId) => {
    try {
      setAudioLoading(true);
      
      // Unload previous audio
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false);
      }

      if (!audioId) {
        setAudioLoading(false);
        return;
      }

      const audioUri = getAudioAssetUri(audioId);
      if (!audioUri) {
        setAudioLoading(false);
        return;
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true, isLooping: false }
      );

      setSound(newSound);
      setIsPlaying(true);
      setAudioLoading(false);

      // Set up playback status listener
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setIsPlaying(status.isPlaying);
          if (status.didJustFinish) {
            setIsPlaying(false);
          }
        }
      });

    } catch (error) {
      console.warn('Audio loading failed:', error);
      setAudioLoading(false);
      setIsPlaying(false);
    }
  };

  const toggleAudio = async () => {
    if (!sound) return;

    try {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    } catch (error) {
      console.warn('Audio playback error:', error);
    }
  };

  const stopAudio = async () => {
    if (!sound) return;

    try {
      await sound.stopAsync();
      setIsPlaying(false);
    } catch (error) {
      console.warn('Audio stop error:', error);
    }
  };

  const loadNode = (nodeId) => {
    const node = currentGame.story.nodes[nodeId];
    if (!node) {
      Alert.alert('Error', 'Story node not found');
      return;
    }

    // Process node effects
    if (node.effects) {
      const { newVars, newInventory } = gameEngine.processEffects(
        node.effects, 
        variables, 
        inventory
      );
      setVariables(newVars);
      setInventory(newInventory);
    }

    setCurrentNode({ id: nodeId, ...node });
    
    // Load audio if available
    if (node.content?.audio) {
      loadAudio(node.content.audio);
    } else {
      // Stop current audio if no audio for this node
      stopAudio();
    }
    
    // Add to history
    setGameHistory(prev => [...prev, nodeId]);

    // Auto-save progress
    const saveData = {
      currentNode: nodeId,
      variables,
      inventory,
      history: gameHistory,
      timestamp: new Date().toISOString(),
    };
    saveGameProgress(currentGame.id, saveData);
  };

  const handleChoice = (choice) => {
    // Check choice conditions
    if (choice.conditions && !gameEngine.evaluateConditions(choice.conditions, variables, inventory)) {
      Alert.alert('Cannot Choose', 'This choice is not available right now.');
      return;
    }

    // Process choice effects
    if (choice.effects) {
      const { newVars, newInventory } = gameEngine.processEffects(
        choice.effects, 
        variables, 
        inventory
      );
      setVariables(newVars);
      setInventory(newInventory);
    }

    // Navigate to target node
    loadNode(choice.target);
  };

  const processText = (text) => {
    if (!text) return '';
    
    // Replace variable placeholders
    let processedText = text.replace(/\{(\w+)\}/g, (match, varName) => {
      return variables[varName] !== undefined ? variables[varName] : match;
    });

    return processedText;
  };

  const renderChoice = (choice, index) => {
    const isEnabled = !choice.conditions || 
      gameEngine.evaluateConditions(choice.conditions, variables, inventory);
    
    return (
      <TouchableOpacity
        key={choice.id}
        style={[styles.choice, !isEnabled && styles.disabledChoice]}
        onPress={() => handleChoice(choice)}
        disabled={!isEnabled}
      >
        <Text style={[styles.choiceText, !isEnabled && styles.disabledChoiceText]}>
          {processText(choice.text)}
        </Text>
        <Ionicons 
          name="chevron-forward" 
          size={16} 
          color={isEnabled ? "#6366f1" : "#ccc"} 
        />
      </TouchableOpacity>
    );
  };

  const renderAudioControls = () => {
    if (!currentNode?.content?.audio) return null;

    return (
      <View style={styles.audioControls}>
        <TouchableOpacity
          style={styles.audioButton}
          onPress={toggleAudio}
          disabled={audioLoading}
        >
          {audioLoading ? (
            <ActivityIndicator size="small" color="#6366f1" />
          ) : (
            <Ionicons 
              name={isPlaying ? "pause" : "play"} 
              size={20} 
              color="#6366f1" 
            />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.audioButton}
          onPress={stopAudio}
          disabled={!sound || audioLoading}
        >
          <Ionicons 
            name="stop" 
            size={20} 
            color={sound && !audioLoading ? "#6366f1" : "#ccc"} 
          />
        </TouchableOpacity>
        
        <Text style={styles.audioStatus}>
          {audioLoading ? 'Loading...' : isPlaying ? 'Playing' : 'Paused'}
        </Text>
      </View>
    );
  };

  if (!currentGame) {
    return (
      <View style={styles.container}>
        <Text>No game loaded</Text>
      </View>
    );
  }

  if (!currentNode) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading story...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gameHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.gameTitle}>{currentGame.title}</Text>
        <TouchableOpacity onPress={() => Alert.alert('Game Menu', 'Settings and save options would go here')}>
          <Ionicons name="menu" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentNode.title && (
          <Text style={styles.nodeTitle}>{currentNode.title}</Text>
        )}
        
        {currentNode.content?.image && (
          <Image
            source={{ uri: getImageAssetUri(currentNode.content.image) }}
            style={styles.storyImage}
            resizeMode="cover"
          />
        )}

        {renderAudioControls()}

        <Markdown style={styles}>
          {processText(currentNode.content?.text || '')}
        </Markdown>

        {inventory.length > 0 && (
          <View style={styles.inventorySection}>
            <Text style={styles.sectionTitle}>Inventory:</Text>
            <Text style={styles.inventoryText}>{inventory.join(', ')}</Text>
          </View>
        )}

        <View style={styles.choicesContainer}>
          <Text style={styles.choicesTitle}>What do you do?</Text>
          {currentNode.choices?.map((choice, index) => renderChoice(choice, index))}
        </View>
      </ScrollView>

      <View style={styles.gameStats}>
        <Text style={styles.statText}>Node: {currentNode.id}</Text>
        <Text style={styles.statText}>History: {gameHistory.length} steps</Text>
      </View>
    </SafeAreaView>
  );
}