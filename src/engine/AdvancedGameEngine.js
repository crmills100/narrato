// src/engine/AdvancedGameEngine.js - Enhanced game engine with more features
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

export class AdvancedGameEngine {
  constructor(gameData, settings = {}) {
    this.gameData = gameData;
    this.settings = settings;
    this.currentNode = null;
    this.variables = {};
    this.inventory = [];
    this.history = [];
    this.achievements = [];
    this.audioObjects = {};
  }

  async initializeGame() {
    // Initialize variables
    const varDefs = this.gameData.story.game_state?.variables || {};
    for (const [name, definition] of Object.entries(varDefs)) {
      this.variables[name] = definition.initial_value;
    }

    // Load starting node
    const startNode = this.gameData.story.start_node || 'start';
    await this.loadNode(startNode);

    return true;
  }

  async loadNode(nodeId) {
    const node = this.gameData.story.nodes[nodeId];
    if (!node) {
      throw new Error(`Node ${nodeId} not found`);
    }

    this.currentNode = { id: nodeId, ...node };
    this.history.push(nodeId);

    // Process node effects
    if (node.effects) {
      await this.processEffects(node.effects);
    }

    // Handle audio
    if (node.content?.audio && this.settings.soundEnabled) {
      await this.playAudio(node.content.audio);
    }

    // Handle haptic feedback
    if (this.settings.vibration) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    return this.currentNode;
  }

  async makeChoice(choice) {
    // Validate choice is available
    if (!this.isChoiceAvailable(choice)) {
      throw new Error('Choice is not available');
    }

    // Process choice effects
    if (choice.effects) {
      await this.processEffects(choice.effects);
    }

    // Handle choice costs
    if (choice.cost) {
      this.processCosts(choice.cost);
    }

    // Navigate to target node
    return await this.loadNode(choice.target);
  }

  isChoiceAvailable(choice) {
    if (!choice.conditions) return true;

    if (choice.conditions.show_if) {
      if (!this.evaluateConditions(choice.conditions.show_if)) {
        return false;
      }
    }

    if (choice.conditions.enable_if) {
      if (!this.evaluateConditions(choice.conditions.enable_if)) {
        return false;
      }
    }

    return true;
  }

  evaluateConditions(conditions) {
    return conditions.every(condition => {
      switch (condition.type) {
        case 'variable':
          return this.evaluateVariableCondition(condition);
        case 'inventory':
          return this.evaluateInventoryCondition(condition);
        case 'achievement':
          return this.achievements.includes(condition.achievement);
        case 'random':
          return Math.random() < (condition.probability || 0.5);
        default:
          return true;
      }
    });
  }

  evaluateVariableCondition(condition) {
    const value = this.variables[condition.variable];
    const target = condition.value;

    switch (condition.operator) {
      case '==': return value === target;
      case '!=': return value !== target;
      case '<': return value < target;
      case '>': return value > target;
      case '<=': return value <= target;
      case '>=': return value >= target;
      case 'contains': return String(value).includes(String(target));
      default: return true;
    }
  }

  evaluateInventoryCondition(condition) {
    switch (condition.operator) {
      case 'has': return this.inventory.includes(condition.item);
      case 'not_has': return !this.inventory.includes(condition.item);
      default: return true;
    }
  }

  async processEffects(effects) {
    // Set variables
    if (effects.set_variables) {
      Object.assign(this.variables, effects.set_variables);
    }

    // Modify variables
    if (effects.modify_variables) {
      for (const [varName, modification] of Object.entries(effects.modify_variables)) {
        const currentValue = this.variables[varName] || 0;
        switch (modification.operation) {
          case 'add':
            this.variables[varName] = currentValue + modification.value;
            break;
          case 'subtract':
            this.variables[varName] = currentValue - modification.value;
            break;
          case 'multiply':
            this.variables[varName] = currentValue * modification.value;
            break;
          default:
            this.variables[varName] = modification.value;
        }
      }
    }

    // Inventory changes
    if (effects.add_inventory) {
      this.inventory.push(...effects.add_inventory);
    }

    if (effects.remove_inventory) {
      this.inventory = this.inventory.filter(item => 
        !effects.remove_inventory.includes(item)
      );
    }

    // Unlock achievements
    if (effects.unlock_achievements) {
      const newAchievements = effects.unlock_achievements.filter(
        achievement => !this.achievements.includes(achievement)
      );
      this.achievements.push(...newAchievements);
      
      // Show achievement notifications
      for (const achievement of newAchievements) {
        await this.showAchievement(achievement);
      }
    }
  }

  processCosts(costs) {
    // Deduct variable costs
    if (costs.variables) {
      for (const [varName, cost] of Object.entries(costs.variables)) {
        this.variables[varName] = (this.variables[varName] || 0) - cost;
      }
    }

    // Remove required items
    if (costs.inventory) {
      costs.inventory.forEach(item => {
        const index = this.inventory.indexOf(item);
        if (index > -1) {
          this.inventory.splice(index, 1);
        }
      });
    }
  }

  async playAudio(audioId) {
    try {
      const audioData = this.gameData.story.assets?.audio?.[audioId];
      if (!audioData) return;

      // Stop previous audio if not looping
      if (this.audioObjects[audioId]) {
        await this.audioObjects[audioId].unloadAsync();
      }

      // Load and play new audio
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioData.path },
        { 
          shouldPlay: true, 
          isLooping: audioData.loop || false,
          volume: audioData.volume || 0.5,
        }
      );

      this.audioObjects[audioId] = sound;
    } catch (error) {
      console.error('Failed to play audio:', error);
    }
  }

  async showAchievement(achievementId) {
    const achievement = this.gameData.story.game_state?.achievements?.[achievementId];
    if (!achievement) return;

    // Trigger haptic feedback
    if (this.settings.vibration) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    // In a real app, this would show a toast or modal
    console.log(`Achievement unlocked: ${achievement.name}`);
  }

  processText(text) {
    if (!text) return '';

    // Replace variable placeholders
    let processed = text.replace(/\{(\w+)\}/g, (match, varName) => {
      return this.variables[varName] !== undefined ? this.variables[varName] : match;
    });

    // Handle inventory count
    processed = processed.replace(/\{inventory_count\}/g, this.inventory.length.toString());

    // Handle conditional text blocks
    processed = processed.replace(/\{if:(\w+)\}([^{]*)\{\/if\}/g, (match, condition, content) => {
      // Simple condition evaluation - in real app would be more sophisticated
      const value = this.variables[condition];
      return value ? content : '';
    });

    // Handle random text selection
    processed = processed.replace(/\{random:([^}]*)\}/g, (match, options) => {
      const choices = options.split('|');
      return choices[Math.floor(Math.random() * choices.length)];
    });

    return processed;
  }

  getGameState() {
    return {
      currentNode: this.currentNode?.id,
      variables: this.variables,
      inventory: this.inventory,
      history: this.history,
      achievements: this.achievements,
      timestamp: new Date().toISOString(),
    };
  }

  loadGameState(state) {
    this.variables = state.variables || {};
    this.inventory = state.inventory || [];
    this.history = state.history || [];
    this.achievements = state.achievements || [];
    
    if (state.currentNode) {
      this.loadNode(state.currentNode);
    }
  }

  async cleanup() {
    // Unload all audio
    for (const sound of Object.values(this.audioObjects)) {
      try {
        await sound.unloadAsync();
      } catch (error) {
        console.error('Failed to unload audio:', error);
      }
    }
    this.audioObjects = {};
  }
}
