// src/services/GameDownloader.js - Handle game downloads and installation
import * as FileSystem from 'expo-file-system';
import { unzip } from 'react-native-zip-archive';

export class GameDownloader {
  static async downloadGame(gameInfo, onProgress) {
    try {
      const downloadUrl = `https://api.cyoa-games.com/download/${gameInfo.id}`;
      const fileUri = FileSystem.documentDirectory + `${gameInfo.id}.cyoapkg`;
      
      const downloadResumable = FileSystem.createDownloadResumable(
        downloadUrl,
        fileUri,
        {},
        onProgress
      );

      const { uri } = await downloadResumable.downloadAsync();
      
      // Extract and install game
      const extractPath = FileSystem.documentDirectory + `games/${gameInfo.id}/`;
      await FileSystem.makeDirectoryAsync(extractPath, { intermediates: true });
      
      await unzip(uri, extractPath);
      
      // Read game manifest
      const manifestUri = extractPath + 'manifest.json';
      const manifestContent = await FileSystem.readAsStringAsync(manifestUri);
      const manifest = JSON.parse(manifestContent);
      
      // Read main story file
      const storyUri = extractPath + manifest.game.main_file;
      const storyContent = await FileSystem.readAsStringAsync(storyUri);
      const story = JSON.parse(storyContent);
      
      // Clean up download file
      await FileSystem.deleteAsync(uri);
      
      return {
        ...gameInfo,
        story,
        manifest,
        localPath: extractPath,
        installed: true,
      };
      
    } catch (error) {
      console.error('Download failed:', error);
      throw new Error('Failed to download and install game');
    }
  }

  static async removeGame(gameId) {
    try {
      const gamePath = FileSystem.documentDirectory + `games/${gameId}/`;
      await FileSystem.deleteAsync(gamePath);
      return true;
    } catch (error) {
      console.error('Failed to remove game:', error);
      return false;
    }
  }

  static async getGameSize(gameId) {
    try {
      const gamePath = FileSystem.documentDirectory + `games/${gameId}/`;
      const info = await FileSystem.getInfoAsync(gamePath);
      return info.size || 0;
    } catch (error) {
      return 0;
    }
  }
}
