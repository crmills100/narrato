// src/screens/StoreScreen.js - Browse and download games
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  RefreshControl,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGame } from '../context/GameContext';

import { log, getLog } from '@/util/log';

export default function StoreScreen() {
  const { addGameToLibrary, library } = useGame();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [downloading, setDownloading] = useState({});

  // Mock server data - in real app, this would fetch from API
  const mockServerGames = [
    {
      id: 'forest_adventure',
      title: 'The Enchanted Forest',
      author: 'Jane Storyteller',
      description: 'A magical adventure through mysterious woods filled with ancient secrets.',
      thumbnail: 'https://via.placeholder.com/150x150/4ade80/ffffff?text=Forest',
      rating: 4.8,
      downloads: 15420,
      size_mb: 25.3,
      estimated_play_time: 45,
      tags: ['fantasy', 'magic', 'adventure'],
      price: 0,
      featured: true,
    },
    {
      id: 'space_odyssey',
      title: 'Stellar Odyssey',
      author: 'Cosmic Games',
      description: 'Navigate the dangers of deep space in this thrilling sci-fi adventure.',
      thumbnail: 'https://via.placeholder.com/150x150/3b82f6/ffffff?text=Space',
      rating: 4.6,
      downloads: 8930,
      size_mb: 32.1,
      estimated_play_time: 60,
      tags: ['sci-fi', 'space', 'exploration'],
      price: 2.99,
      featured: false,
    },
    {
      id: 'mystery_manor',
      title: 'Mystery at Blackwood Manor',
      author: 'Detective Stories Inc',
      description: 'Solve a murder mystery in this atmospheric Victorian-era thriller.',
      thumbnail: 'https://via.placeholder.com/150x150/7c3aed/ffffff?text=Manor',
      rating: 4.9,
      downloads: 23100,
      size_mb: 18.7,
      estimated_play_time: 35,
      tags: ['mystery', 'detective', 'victorian'],
      price: 1.99,
      featured: true,
    },
  ];

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    setLoading(true);

    try {
      // Simulate API call
      log("fetchGames()");
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGames(mockServerGames);
    } catch (error) {
      Alert.alert('Error', 'Failed to load games from server');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGames();
    setRefreshing(false);
  };

  const isGameOwned = (gameId) => {
    return library.some(game => game.id === gameId);
  };

  const downloadGame = async (game) => {
    if (isGameOwned(game.id)) {
      Alert.alert('Already Owned', 'You already have this game in your library!');
      return;
    }

    setDownloading(prev => ({ ...prev, [game.id]: true }));

    try {
      // Simulate download process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create game data with story content
      const gameData = {
        ...game,
        story: {
          meta: {
            title: game.title,
            author: game.author,
            description: game.description,
          },
          nodes: {
            start: {
              title: "Beginning",
              content: {
                text: `# ${game.title}\n\nWelcome to ${game.title}! This is a demo of the story content.\n\nYour adventure begins here...`,
              },
              choices: [
                {
                  id: "choice1",
                  text: "Continue the adventure",
                  target: "chapter1"
                },
                {
                  id: "choice2", 
                  text: "Learn about the world",
                  target: "lore"
                }
              ]
            },
            chapter1: {
              content: {
                text: "## Chapter 1\n\nYour journey continues deeper into the story...",
              },
              choices: [
                {
                  id: "return",
                  text: "Return to start",
                  target: "start"
                }
              ]
            },
            lore: {
              content: {
                text: "## About This World\n\nThis is background information about the game world and its inhabitants...",
              },
              choices: [
                {
                  id: "back",
                  text: "Back to adventure",
                  target: "start"
                }
              ]
            }
          },
          start_node: "start"
        }
      };

      log("call addGameToLibary()");
      const success = await addGameToLibrary(gameData);
      if (success) {
        Alert.alert('Downloaded!', `${game.title} has been added to your library.`);
      } else {
        Alert.alert('Error', 'Failed to add game to library');
      }
    } catch (error) {
      log('Download Failed');
      log(error);
      console.log(error);
      Alert.alert('Download Failed', 'Could not download the game. Please try again.');
    } finally {
      setDownloading(prev => ({ ...prev, [game.id]: false }));
    }
  };

  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderStoreGame = ({ item }) => (
    <View style={styles.storeCard}>
      <Image source={{ uri: item.thumbnail }} style={styles.storeThumbnail} />
      <View style={styles.storeGameInfo}>
        <View style={styles.gameHeader}>
          <Text style={styles.storeGameTitle}>{item.title}</Text>
          {item.featured && (
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredText}>Featured</Text>
            </View>
          )}
        </View>
        <Text style={styles.storeGameAuthor}>by {item.author}</Text>
        <Text style={styles.storeGameDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.gameMetrics}>
          <View style={styles.metric}>
            <Ionicons name="star" size={14} color="#fbbf24" />
            <Text style={styles.metricText}>{item.rating}</Text>
          </View>
          <View style={styles.metric}>
            <Ionicons name="download-outline" size={14} color="#666" />
            <Text style={styles.metricText}>{item.downloads.toLocaleString()}</Text>
          </View>
          <View style={styles.metric}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <Text style={styles.metricText}>{item.estimated_play_time}min</Text>
          </View>
        </View>

        <View style={styles.tags}>
          {item.tags.slice(0, 3).map(tag => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actionContainer}>
        <Text style={styles.priceText}>
          {item.price === 0 ? 'FREE' : `$${item.price}`}
        </Text>
        <TouchableOpacity
          style={[
            styles.downloadButton,
            isGameOwned(item.id) && styles.ownedButton,
            downloading[item.id] && styles.downloadingButton,
          ]}
          onPress={() => downloadGame(item)}
          disabled={isGameOwned(item.id) || downloading[item.id]}
        >
          {downloading[item.id] ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.downloadButtonText}>
              {isGameOwned(item.id) ? 'OWNED' : 'GET'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && games.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading games...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover Games</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search games, authors, tags..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filteredGames}
        renderItem={renderStoreGame}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.gameList}
        showsVerticalScrollIndicator={false}
      />
    </View>
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
