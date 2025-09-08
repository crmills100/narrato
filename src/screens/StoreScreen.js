// src/screens/StoreScreen.js - Browse and download games
import { log } from '@/util/log';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../components/styles';
import { useGame } from '../context/GameContext';

export default function StoreScreen() {
  const { addGameToLibraryJSON, library } = useGame();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [downloading, setDownloading] = useState({});
  const insets = useSafeAreaInsets();

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
                { id: "choice1", text: "Continue the adventure", target: "chapter1" },
                { id: "choice2", text: "Learn about the world", target: "lore" }
              ]
            },
            chapter1: {
              content: {
                text: "## Chapter 1\n\nYour journey continues deeper into the story...",
              },
              choices: [
                { id: "return", text: "Return to start", target: "start" }
              ]
            },
            lore: {
              content: {
                text: "## About This World\n\nThis is background information about the game world and its inhabitants...",
              },
              choices: [
                { id: "back", text: "Back to adventure", target: "start" }
              ]
            }
          },
          start_node: "start"
        }
      };

      // Save gameData to filesystem
      const fileName = `game_${game.id || Date.now()}.json`;
      const filePath = FileSystem.documentDirectory + fileName;
      await FileSystem.writeAsStringAsync(filePath, JSON.stringify(gameData));

      log("call addGameToLibraryJSON()");
      const success = await addGameToLibraryJSON(filePath);

      if (success) {
        Alert.alert('Downloaded!', `${game.title} has been added to your library.`);
      } else {
        Alert.alert('Error', 'Failed to add game to library');
      }
    } catch (error) {
      log('Download Failed');
      console.error(error);
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

    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" backgroundColor="white" />
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
