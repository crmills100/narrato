// src/services/StoreAPI.js - Server communication
export class StoreAPI {
  static baseURL = 'https://api.cyoa-games.com';

  static async fetchFeaturedGames() {
    try {
      const response = await fetch(`${this.baseURL}/games/featured`);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch featured games:', error);
      return [];
    }
  }

  static async searchGames(query, filters = {}) {
    try {
      const params = new URLSearchParams({
        q: query,
        ...filters,
      });
      
      const response = await fetch(`${this.baseURL}/games/search?${params}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to search games:', error);
      return [];
    }
  }

  static async getGameDetails(gameId) {
    try {
      const response = await fetch(`${this.baseURL}/games/${gameId}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get game details:', error);
      return null;
    }
  }

  static async reportIssue(gameId, issueType, description) {
    try {
      await fetch(`${this.baseURL}/games/${gameId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueType, description }),
      });
      return true;
    } catch (error) {
      console.error('Failed to report issue:', error);
      return false;
    }
  }
}