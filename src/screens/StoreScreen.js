// src/screens/StoreScreen.js - Browse and download games from server
import { err, log } from '@/util/log';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { File, Paths } from 'expo-file-system';
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

// Server configuration
const DEFAULT_SERVER_URL = 'http://192.168.1.196/narrato/story_list.json';
const SERVER_URL_KEY = 'store_server_url';

export default function StoreScreen() {
  const { addGameToLibraryJSON, library, addGameToLibrary } = useGame();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [downloading, setDownloading] = useState({});
  const [serverUrl, setServerUrl] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [error, setError] = useState(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadServerUrl();
  }, []);

  useEffect(() => {
    if (serverUrl) {
      fetchGames();
    }
  }, [serverUrl]);

  const loadServerUrl = async () => {
    try {
      const savedUrl = await AsyncStorage.getItem(SERVER_URL_KEY);
      if (savedUrl) {
        setServerUrl(savedUrl);
      } else {
        // Use default URL
        setServerUrl(DEFAULT_SERVER_URL);
      }
    } catch (error) {
      log('Failed to load server URL:', error);
      setServerUrl(DEFAULT_SERVER_URL);
    }
  };

  const saveServerUrl = async (url) => {
    try {
      await AsyncStorage.setItem(SERVER_URL_KEY, url);
      setServerUrl(url);
    } catch (error) {
      err('Failed to save server URL:', error);
    }
  };

  const extractBaseUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return `${urlObj.protocol}//${urlObj.host}`;
    } catch (error) {
      log('Failed to extract base URL:', error);
      return '';
    }
  };

  const resolveUrl = (relativeUrl, currentBaseUrl = null) => {
    if (!relativeUrl) return null;
    
    // If it's already an absolute URL, return as is
    if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
      return relativeUrl;
    }
    
    // Use provided baseUrl or the state baseUrl
    const urlBase = currentBaseUrl || baseUrl;
    
    // Handle relative URLs
    if (urlBase) {
      // Remove leading slash if present
      const cleanRelativeUrl = relativeUrl.startsWith('/') 
        ? relativeUrl.substring(1) 
        : relativeUrl;
      return `${urlBase}/${cleanRelativeUrl}`;
    }
    
    return relativeUrl;
  };

  const fetchGames = async () => {
    setLoading(true);
    setError(null);

    try {
      log(`Fetching games from: ${serverUrl}`);
      
      const response = await fetch(serverUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      log(`Received ${data.length} games from server`);
      
      // Extract base URL for resolving relative URLs
      const base = extractBaseUrl(serverUrl);
      setBaseUrl(base);
      log(`Base URL set to: ${base}`);
      
      // Process games to resolve URLs - pass base directly to resolveUrl
      const processedGames = data.map(game => ({
        ...game,
        // Resolve thumbnail URL with base URL
        thumbnail: game.thumbnail ? resolveUrl(game.thumbnail, base) : 'https://via.placeholder.com/150',
        // Resolve download URL if present
        downloadUrl: game.downloadUrl ? resolveUrl(game.downloadUrl, base) : null,
        // Ensure all required fields exist with defaults
        id: game.id || `game_${Date.now()}_${Math.random()}`,
        title: game.title || 'Untitled Game',
        author: game.author || 'Unknown Author',
        description: game.description || 'No description available',
        rating: game.rating || 0,
        downloads: game.downloads || 0,
        size_mb: game.size_mb || 0,
        estimated_play_time: game.estimated_play_time || 30,
        tags: game.tags || [],
        price: game.price || 0,
        featured: (game.featured && game.featured == 'true') || false,
      }));
      
      setGames(processedGames);
      
    } catch (error) {
      err('Failed to fetch games from server:', error);
      setError(error.message || 'Failed to load games from server');
      Alert.alert(
        'Connection Error',
        `Unable to load games from server.\n\n${error.message}\n\nPlease check your server configuration.`,
        [
          { text: 'OK' },
          { 
            text: 'Configure Server', 
            onPress: () => showServerUrlDialog() 
          }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGames();
    setRefreshing(false);
  };

  const showServerUrlDialog = () => {
    Alert.prompt(
      'Configure Server URL',
      'Enter the URL of your game server:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: (url) => {
            if (url && url.trim()) {
              saveServerUrl(url.trim());
            }
          }
        }
      ],
      'plain-text',
      serverUrl
    );
  };

  const isGameOwned = (gameId) => {
    return library.some(game => game.id === gameId);
  };

  const downloadGame = async (game) => {
    if (isGameOwned(game.id)) {
      Alert.alert('Already Owned', 'You already have this story in your library!');
      return;
    }

    setDownloading(prev => ({ ...prev, [game.id]: true }));

    try {
      // Check if game has a downloadUrl (zip file) or should use JSON format
      if (game.downloadUrl) {
        // Download zip file from server
        log(`Downloading game from: ${game.downloadUrl}`);

              // Create a file path inside app's document directory
      const gameId = game.downloadUrl.trim().split('/').pop().replace(/\.[^/.]+$/, "");
      const fileName = gameId + ".zip";
      log('fileName: ' + fileName);
      // Download the file
      const localFile = new File(Paths.document, fileName);
      log("localFile: " + localFile.uri);
      if (localFile.exists) {
        log("deleting localFile");
        localFile.delete();
      }

        // Download the file
        log(`Downloading to: ${localFile.uri}`);
        const downloadedFile = await File.downloadFileAsync(
          game.downloadUrl, 
          Paths.document
        );
        
        log(`Download complete: ${downloadedFile.uri}`);

        // Add to library as zip file
        const success = await addGameToLibrary(downloadedFile.uri, game.id);
        
        if (success) {
          Alert.alert('Downloaded!', `${game.title} has been added to your library.`);
        } else {
          Alert.alert('Error', 'Failed to add game to library');
        }
        
      } else {
        // Use embedded story data or create demo content
        const gameData = {
          ...game,
          story: game.story || {
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
      }
      
    } catch (error) {
      err('Download Failed:', error);
      Alert.alert('Download Failed', error.message || 'Could not download the game. Please try again.');
    } finally {
      setDownloading(prev => ({ ...prev, [game.id]: false }));
    }
  };

  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (game.tags && game.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
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
          {item.rating > 0 && (
            <View style={styles.metric}>
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Text style={styles.metricText}>{item.rating}</Text>
            </View>
          )}
          {item.downloads > 0 && (
            <View style={styles.metric}>
              <Ionicons name="download-outline" size={14} color="#666" />
              <Text style={styles.metricText}>{item.downloads.toLocaleString()}</Text>
            </View>
          )}
          <View style={styles.metric}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <Text style={styles.metricText}>{item.estimated_play_time}min</Text>
          </View>
        </View>

        {item.tags && item.tags.length > 0 && (
          <View style={styles.tags}>
            {item.tags.slice(0, 3).map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
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
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar style="dark" backgroundColor="white" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Discover Stories</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Loading games from server...</Text>
        </View>
      </View>
    );
  }

  if (error && games.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar style="dark" backgroundColor="white" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Discover Stories</Text>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="cloud-offline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>Connection Error</Text>
          <Text style={styles.emptySubtitle}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchGames}
          >
            <Ionicons name="refresh" size={20} color="white" />
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" backgroundColor="white" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover Stories</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search titles, authors, tags..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {filteredGames.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="search" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No Games Found</Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery 
              ? `No games match "${searchQuery}"`
              : 'No games available on the server'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredGames}
          renderItem={renderStoreGame}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={['#6366f1']}
              tintColor="#6366f1"
            />
          }
          style={styles.gameList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}