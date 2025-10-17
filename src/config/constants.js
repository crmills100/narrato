// src/config/constants.js - Centralized app configuration

// Storage Keys
export const STORAGE_KEYS = {
  SETTINGS: 'narrato_settings',
  DEVELOPER_MODE: 'developer_mode',
  STORY_LIST_URL: 'story_list_url',
  // Add other storage keys used throughout the app
  GAME_SAVES: 'game_saves',
  DOWNLOADED_GAMES: 'downloaded_games',
};

// Server Configuration
export const SERVER = {
  DEFAULT_STORY_LIST_URL: 'http://192.168.1.196/narrato/story_list.json',
  DEFAULT_ADD_STORY_URL: "http://192.168.1.196/narrato/basic_story.zip",
  TIMEOUT: 30000, // 30 seconds
};

// Default Settings
export const DEFAULT_SETTINGS = {
  soundEnabled: true,
  autoSave: true,
  textSize: 'medium',
  darkMode: false,
  vibration: true,
  notifications: false,
};


// Theme Colors
export const COLORS = {
  PRIMARY: '#007C83',      // Deep Teal
  SECONDARY: '#F6D06F',    // Golden Sand
  DARK: '#20293F',         // Midnight Indigo
  ACCENT: '#B57F50',       // Copper
  BACKGROUND: '#FAF7F0',   // Parchment
  TEXT: '#2B2B2B',         // Charcoal Ink
  
  // UI Colors
  SWITCH_ACTIVE: '#6366f1',
  SWITCH_INACTIVE: '#ccc',
  BORDER: '#e5e7eb',
  SUCCESS: '#10b981',
  ERROR: '#ef4444',
  WARNING: '#f59e0b',
};

// App Metadata
export const APP_INFO = {
  NAME: 'InkLoom',
  TAGLINE: 'Weave your own story',
  VERSION: '1.0.0',
  BUILD: '1',
};
