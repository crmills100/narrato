// src/screens/LibraryScreen.js - Local game library with simple delete functionality
import { log } from '@/util/log';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../components/styles';
import { useGame } from '../context/GameContext';

export default function LibraryScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { library, loadGame, loading, removeGameFromLibrary } = useGame();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGames = library.filter(game =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGameSelect = async (game) => {
    Alert.alert(
      game.title,
      game.description,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Play',
          onPress: async () => {
            await loadGame(game.id);
            navigation.navigate('Game');
          },
        },
      ]
    );
  };

  const handleLongPress = (game) => {
    Alert.alert(
      game.title,
      'What would you like to do?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Play',
          onPress: async () => {
            await loadGame(game.id);
            navigation.navigate('Game');
          },
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDeleteGame(game),
        },
      ]
    );
  };

  const handleDeleteGame = (game) => {
    Alert.alert(
      'Delete Game',
      `Are you sure you want to delete "${game.title}"? This will permanently remove the game and all save data.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await removeGameFromLibrary(game.id);
            if (success) {
              Alert.alert('Game Deleted', `"${game.title}" has been removed from your library.`);
            } else {
              Alert.alert('Error', 'Failed to delete the game. Please try again.');
            }
          },
        },
      ]
    );
  };

  const getThumbnail = (gameId) => {
    log("getThumbnail(): gameId: " + gameId + ", " + FileSystem.Paths.document.uri + gameId + "/thumbnail.jpg")
    return FileSystem.Paths.document.uri + gameId + "/thumbnail.jpg";
  };

  const renderGameItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.gameCard}
      onPress={() => handleGameSelect(item)}
      onLongPress={() => handleLongPress(item)}
    >
      <Image 
        source={{ uri: getThumbnail(item.id) }}
        style={styles.thumbnail}
      />
      <View style={styles.gameInfo}>
        <Text style={styles.gameTitle}>{item.title}</Text>
        <Text style={styles.gameAuthor}>by {item.author}</Text>
        <Text style={styles.gameDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.gameStats}>
          <Ionicons name="time-outline" size={14} color="#666" />
          <Text style={styles.statText}>{item.estimated_play_time || 30} min</Text>
          {item.progress && (
            <>
              <Ionicons name="bookmark-outline" size={14} color="#666" style={styles.statIcon} />
              <Text style={styles.statText}>{Math.round(item.progress)}% complete</Text>
            </>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" backgroundColor="white" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Stories</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your stories..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {filteredGames.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="library-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No Games Yet</Text>
          <Text style={styles.emptySubtitle}>
            {library.length === 0 
              ? "Browse the store to download your first adventure!"
              : "No games match your search."}
          </Text>
          {library.length === 0 && (
            <TouchableOpacity 
              style={styles.browseButton}
              onPress={() => navigation.navigate('StoreTab')}
            >
              <Text style={styles.browseButtonText}>Browse Store</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredGames}
          renderItem={renderGameItem}
          keyExtractor={item => item.id}
          style={styles.gameList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}