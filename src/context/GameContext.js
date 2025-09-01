// src/context/GameContext.js - Game state management
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { gameEngine } from '../engine/GameEngine';

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
      const stored = await AsyncStorage.getItem('cyoa_library2');
      const library = stored ? JSON.parse(stored) : [];
      dispatch({ type: 'SET_LIBRARY', payload: library });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load library' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addGameToLibrary = async (gameData) => {
    try {
      const newGame = {
        id: gameData.id || Date.now().toString(),
        ...gameData,
        dateAdded: new Date().toISOString(),
      };
      
      const updatedLibrary = [...state.library, newGame];
      await AsyncStorage.setItem('cyoa_library2', JSON.stringify(updatedLibrary));
      dispatch({ type: 'ADD_TO_LIBRARY', payload: newGame });
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add game to library' });
      return false;
    }
  };

  const loadGame = async (gameId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const game = state.library.find(g => g.id === gameId);
      if (!game) throw new Error('Game not found');
      
      // Load saved progress if exists
      const savedState = await AsyncStorage.getItem(`cyoa_save_${gameId}`);
      const gameState = savedState ? JSON.parse(savedState) : {};
      
      dispatch({ type: 'LOAD_GAME', payload: game });
      dispatch({ type: 'UPDATE_GAME_STATE', payload: gameState });
    } catch (error) {
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