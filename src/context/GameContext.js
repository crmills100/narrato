// src/context/GameContext.js - Game state management
import { err, log, warn } from '@/util/log';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { File, Paths } from 'expo-file-system';
import { createContext, useContext, useEffect, useReducer } from 'react';
import RNFS from 'react-native-fs';
import { unzip } from 'react-native-zip-archive';

const GameContext = createContext();

const initialState = {
  library: [],
  currentGame: null,
  gameState: {},
  loading: false,
  error: null,
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_LIBRARY':
      return { ...state, library: action.payload };
    case 'ADD_TO_LIBRARY':
      return { ...state, library: [...state.library, action.payload] };
    case 'LOAD_GAME':
      return { ...state, currentGame: action.payload, gameState: {} };
    case 'UPDATE_GAME_STATE':
      return { ...state, gameState: { ...state.gameState, ...action.payload } };
    case 'SAVE_GAME_PROGRESS':
      return { ...state };
    case 'RESET_CONTEXT':
      return { ...initialState };

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    loadLibrary();
  }, []);

  const loadLibrary = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const stored = await AsyncStorage.getItem('cyoa_library3');
      const library = stored ? JSON.parse(stored) : [];
      dispatch({ type: 'SET_LIBRARY', payload: library });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load library' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const isGameOwned = (gameId) => {
    return state.library.some(game => game.id === gameId);
  };

  const getImageAssetUri = (imageId) => {
    try {
      log("getImageAssetUri: " + imageId);
      log("state.currentGame: " + JSON.stringify(state.currentGame));
      
      
      if (!imageId || !state.currentGame?.story?.assets?.images) {
        log("getAudioAssetUri: Invalid input or missing image assets");
        return null;
      }

      // Get the assets from the current game
      const assets = state.currentGame.story.assets;
            
      const asset = assets.images[imageId];
      if (!asset || !asset.path) {
        log(`getImageAssetUri: Image '${imageId}' not found`);
        const availableIds = Object.keys(assets.images);
        log(`getImageAssetUri: Available image IDs: ${availableIds.join(', ')}`);
        return null;
      }

      const gameId = state.currentGame.id;
      const rootDir = getRootStorageDirectory();
      const cleanAssetPath = asset.path.startsWith('/') ? asset.path.substring(1) : asset.path;
      const fullPath = `${rootDir}${gameId}/${cleanAssetPath}`;
      const fileUri = fullPath.startsWith('file://') ? fullPath : `file://${fullPath}`;
      
      log(`getImageAssetUri: Resolved '${imageId}' to '${fileUri}'`);
      return fileUri;
      
    } catch (error) {
      err(`getImageAssetUri: Error for '${imageId}', ${error.message}`, error);
      return null;
    }
  };

  // Utility function to get image asset metadata
  const getImageAssetMetadata = (imageId) => {
    try {
      if (!state.currentGame?.story?.assets?.images?.[imageId]) {
        return null;
      }
      
      const asset = state.currentGame.story.assets.images[imageId];
      return {
        path: asset.path,
        altText: asset.alt_text,
        width: asset.width,
        height: asset.height,
        format: asset.format,
        uri: getImageAssetUri(imageId)
      };
      
    } catch (error) {
      err(`getImageAssetMetadata: Error for '${imageId}', ${error.message}`, error);
      return null;
    }
  };

  // Audio asset URI resolver
  const getAudioAssetUri = (audioId) => {
    try {
      log("getAudioAssetUri: " + audioId);
      
      if (!audioId || !state.currentGame?.story?.assets?.audio) {
        log("getAudioAssetUri: Invalid input or missing audio assets");
        return null;
      }
      
      // Get the assets from the current game
      const assets = state.currentGame.story.assets;
            
      const asset = assets.audio[audioId];
      if (!asset || !asset.path) {
        log(`getAudioAssetUri: Audio '${audioId}' not found`);
        const availableIds = Object.keys(assets.audio);
        log(`getAudioAssetUri: Available audio IDs: ${availableIds.join(', ')}`);
        return null;
      }
      
      const gameId = state.currentGame.id;
      const rootDir = getRootStorageDirectory();
      const cleanAssetPath = asset.path.startsWith('/') ? asset.path.substring(1) : asset.path;
      const fullPath = `${rootDir}${gameId}/${cleanAssetPath}`;
      const fileUri = fullPath.startsWith('file://') ? fullPath : `file://${fullPath}`;
      
      log(`getAudioAssetUri: Resolved '${audioId}' to '${fileUri}'`);
      return fileUri;
      
    } catch (error) {
      err(`getAudioAssetUri: Error for '${audioId}', ${error.message}`, error);
      return null;
    }
  };


  const getRootStorageDirectory = () => {
    return Paths.document.uri;
  }

  const addGameToLibraryJSON = async (filePath) => {
    try {
      log("addGameToLibrary: " + filePath);
      // Read the file contents
      const fileContents = await FileSystem.readAsStringAsync(filePath);
      const gameData = JSON.parse(fileContents);

      if (isGameOwned(gameData.id)) {
        log('Already Owned', 'You already have this game in your library!');
        return;
      }

      // Create new game object
      const newGame = {
        id: gameData.id || Date.now().toString(),
        ...gameData,
        dateAdded: new Date().toISOString(),
        filePath: null, // only JSON without assets, no need to store path
      };

      // Update library and persist
      const updatedLibrary = [...state.library, newGame];
      await AsyncStorage.setItem('cyoa_library3', JSON.stringify(updatedLibrary));
      dispatch({ type: 'ADD_TO_LIBRARY', payload: newGame });
      return true;
    } catch (error) {
      console.error("Failed to add game:", error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add game to library' });
      return false;
    }
  };


  const addGameToLibrary = async (zipFilePath, gameId) => {
    try {
      log("addGameToLibrary: " + zipFilePath);

      // Define extraction path
      const extractPath = `${getRootStorageDirectory()}${gameId}`;

      log("call unzip: " + zipFilePath + ", " + extractPath);

      await unzip(zipFilePath, extractPath)
        .then((path) => {
          log(`Unzip completed at ${path}`);
        })
        .catch((error) => {
          err("Could not unzip", error);
      });

      const path = extractPath
      RNFS.readdir(path)
      .then(files => {
        log("entries in: " + path);
        log(files);
      })
      .catch(error => {
        err('Error reading directory:', error);
      });

      // Load story.json from inside the extracted directory
      //const storyPath = `${extractPath}/story.json`;
      log("before storyPathFile");
      log("Constructing storyPathFile: " + getRootStorageDirectory() + " " + gameId + " " + "story.json")
      
      const storyPathFile = new File(getRootStorageDirectory(), gameId, "story.json");

      log("storyPathFile.uri: " + storyPathFile.uri);
      const fileContents = await storyPathFile.text();
      const gameData = JSON.parse(fileContents);
      gameData.id = gameId;

      if (isGameOwned(gameId)) {
        log('Already Owned', 'You already have this game in your library!');
        return;
      }

      // Create new game object
      const newGame = {
        ...gameData,
        dateAdded: new Date().toISOString(),
        filePath: extractPath, // store path of extracted folder
      };

      // Update library and persist
      const updatedLibrary = [...state.library, newGame];
      await AsyncStorage.setItem('cyoa_library3', JSON.stringify(updatedLibrary));
      dispatch({ type: 'ADD_TO_LIBRARY', payload: newGame });

      return true;
    } catch (error) {
      err("Failed to add game:", error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add game to library' });
      return false;
    }
  };

  // Reset state variables
const resetGameContext = async () => {
  dispatch({ type: 'RESET_CONTEXT' });
};

const loadGame = async (gameId) => {
  try {
    dispatch({ type: 'SET_LOADING', payload: true });
    const game = state.library.find(g => g.id === gameId);
    if (!game) throw new Error('Game not found');

    let fullGameData = game;

    // If the game was added from a file, reload it fresh
    if (game.filePath) {
      try {
        log("loadGame from directory:" + game.filePath);
        const storyFile = new File(game.filePath + "/story.json");
        const fileContents = await storyFile.text();
        const parsedData = JSON.parse(fileContents);
        parsedData.id = gameId;
        fullGameData = {
          ...game,
          ...parsedData, // overwrite with latest contents
        };
      } catch (fileError) {
        warn(`Could not reload game file: ${fileError.message}`);
      }
    }

    // Load saved progress if exists
    const savedState = await AsyncStorage.getItem(`cyoa_save_${gameId}`);
    const gameState = savedState ? JSON.parse(savedState) : {};

    dispatch({ type: 'LOAD_GAME', payload: fullGameData });
    dispatch({ type: 'UPDATE_GAME_STATE', payload: gameState });
  } catch (error) {
    err("Failed to load game:", error);
    dispatch({ type: 'SET_ERROR', payload: 'Failed to load game' });
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
};

  const saveGameProgress = async (gameId, state) => {
    try {
      await AsyncStorage.setItem(`cyoa_save_${gameId}`, JSON.stringify(state));
      dispatch({ type: 'SAVE_GAME_PROGRESS' });
    } catch (error) {
      err('Failed to save game progress:', error);
    }
  };

  const value = {
    ...state,
    addGameToLibrary,
    addGameToLibraryJSON,
    loadGame,
    resetGameContext,
    saveGameProgress,
    loadLibrary,
    getImageAssetUri,
    getAudioAssetUri,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};