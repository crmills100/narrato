// src/context/GameContext.js - Game state management
import { log } from '@/util/log';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { createContext, useContext, useEffect, useReducer } from 'react';

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

  const getAssetUri = (imageId) => {

    //TODO: use the imageId to resove the relative path for the image
    //TODO: append the path to the base filesystem
    //TODO: handle error
    // const fileUri = FileSystem.documentDirectory + fileName;

    log("getAssetUri: " + imageId);

    log(JSON.stringify(state.currentGame));

    // lookup the path game's assets
    return "file:///data/user/0/host.exp.exponent/files/2671807.jpg";
  }

  const addGameToLibrary = async (filePath) => {
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
      filePath, // store path in case you want to re-read later
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

const loadGame = async (gameId) => {
  try {
    dispatch({ type: 'SET_LOADING', payload: true });
    const game = state.library.find(g => g.id === gameId);
    if (!game) throw new Error('Game not found');

    let fullGameData = game;

    // If the game was added from a file, reload it fresh
    if (game.filePath) {
      try {
        const fileContents = await FileSystem.readAsStringAsync(game.filePath);
        const parsedData = JSON.parse(fileContents);
        fullGameData = {
          ...game,
          ...parsedData, // overwrite with latest contents
        };
      } catch (fileError) {
        console.warn(`Could not reload game file: ${fileError.message}`);
      }
    }

    // Load saved progress if exists
    const savedState = await AsyncStorage.getItem(`cyoa_save_${gameId}`);
    const gameState = savedState ? JSON.parse(savedState) : {};

    dispatch({ type: 'LOAD_GAME', payload: fullGameData });
    dispatch({ type: 'UPDATE_GAME_STATE', payload: gameState });
  } catch (error) {
    console.error("Failed to load game:", error);
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
      console.error('Failed to save game progress:', error);
    }
  };

  const value = {
    ...state,
    addGameToLibrary,
    loadGame,
    saveGameProgress,
    loadLibrary,
    getAssetUri
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