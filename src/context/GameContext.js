// src/context/GameContext.js - Game state management
import { err, log, warn } from '@/util/log';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
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
    return "file:///data/user/0/com.cyoa.adventureengine/files/basic_story/images/car.jpg";
  }

  const getGameDirectory = () => {
    return FileSystem.documentDirectory;
  }

  const addGameToLibrary = async (zipFilePath, gameId) => {
    try {
      log("addGameToLibrary: " + zipFilePath);

      // Define extraction path
      const extractPath = `${getGameDirectory()}${gameId}`;

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
      const storyPath = `${extractPath}/story.json`;
      const fileContents = await FileSystem.readAsStringAsync(storyPath);
      const gameData = JSON.parse(fileContents);

      if (isGameOwned(gameId)) {
        log('Already Owned', 'You already have this game in your library!');
        return;
      }

      // Create new game object
      const newGame = {
        id: gameId,
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
        const fileContents = await FileSystem.readAsStringAsync(game.filePath + "/story.json");
        const parsedData = JSON.parse(fileContents);
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