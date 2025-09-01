// src/screens/LibraryScreen.js - Local game library
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGame } from '../context/GameContext';


export default function LibraryScreen({ navigation }) {
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

  const renderGameItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.gameCard}
      onPress={() => handleGameSelect(item)}
    >
      <Image 
        source={{ uri: item.thumbnail || 'https://via.placeholder.com/100x100' }}
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
    <View style={styles.container}>
      <View style={styles.header}>
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
