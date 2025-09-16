// src/screens/LibraryScreen.js - Local game library
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
  const { library, loadGame, loading } = useGame();
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

  const getThumbnail = (gameId) => {
    log("getThumbnail(): gameId: " + gameId + ", " + FileSystem.documentDirectory + gameId + "/thumbnail.jpg")
    return FileSystem.Paths.document.uri + gameId + "/thumbnail.jpg";
  }
  

  const renderGameItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.gameCard}
      onPress={() => handleGameSelect(item)}
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
          <Text style={styles.statText}>{item.estimated_play_time || 30}min</Text>
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
        <Text style={styles.headerTitle}>My Games</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your games..."
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