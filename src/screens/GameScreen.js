// src/screens/GameScreen.js - Game engine and player
import React, { useState, useEffect } from 'react';
import {ActivityIndicator} from 'react-native';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGame } from '../context/GameContext';
import { gameEngine } from '../engine/GameEngine';

export default function GameScreen({ navigation }) {
  const { currentGame, gameState, saveGameProgress } = useGame();
  const [currentNode, setCurrentNode] = useState(null);
  const [variables, setVariables] = useState({});
  const [inventory, setInventory] = useState([]);
  const [gameHistory, setGameHistory] = useState([]);

  useEffect(() => {
    if (currentGame) {
      initializeGame();
    }
  }, [currentGame]);

  const initializeGame = () => {
    if (!currentGame?.story) return;

    const startNode = currentGame.story.start_node || 'start';
    const initialVars = gameEngine.initializeVariables(currentGame.story.game_state?.variables || {});
    
    setVariables({ ...initialVars, ...gameState.variables });
    setInventory(gameState.inventory || []);
    setGameHistory(gameState.history || []);
    loadNode(startNode);
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
            source={{ uri: currentNode.content.image }}
            style={styles.storyImage}
            resizeMode="cover"
          />
        )}

        <Text style={styles.storyText}>
          {processText(currentNode.content?.text || '')}
        </Text>

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
