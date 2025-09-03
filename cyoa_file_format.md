# Choose Your Own Adventure (CYOA) File Format Specification

## Overview

The CYOA format (.cyoa) is a ZIP-based file format designed for interactive fiction games with rich multimedia content, branching narratives, and complex game mechanics. The main game component of the format is the story.json file detailed below.

## File Structure

```json
{
  "meta": {
    "title": "string",
    "author": "string", 
    "version": "string",
    "description": "string",
    "created": "ISO 8601 datetime",
    "modified": "ISO 8601 datetime",
    "language": "string (ISO 639-1)",
    "rating": "string (G, PG, PG-13, R, etc.)",
    "estimated_play_time": "number (minutes)",
    "tags": ["array", "of", "strings"]
  },
  "assets": {
    "images": {
      "image_id": {
        "path": "relative/path/to/image.jpg",
        "alt_text": "string",
        "width": "number (optional)",
        "height": "number (optional)",
        "format": "string (jpg, png, webp, etc.)"
      }
    },
    "audio": {
      "audio_id": {
        "path": "relative/path/to/audio.mp3",
        "loop": "boolean",
        "volume": "number (0.0-1.0)",
        "format": "string (mp3, ogg, wav, etc.)"
      }
    },
    "stylesheets": {
      "style_id": {
        "path": "relative/path/to/style.css",
        "scope": "string (global, node, choice, etc.)"
      }
    }
  },
  "game_state": {
    "variables": {
      "variable_name": {
        "type": "string (integer, string, boolean, array, object)",
        "initial_value": "any",
        "description": "string (optional)"
      }
    },
    "inventory": {
      "enabled": "boolean",
      "max_items": "number (optional)",
      "items": {
        "item_id": {
          "name": "string",
          "description": "string",
          "image": "string (optional asset ID)",
          "properties": "object (optional)"
        }
      }
    },
    "achievements": {
      "achievement_id": {
        "name": "string",
        "description": "string",
        "hidden": "boolean",
        "conditions": "array of condition objects"
      }
    }
  },
  "nodes": {
    "node_id": {
      "title": "string (optional)",
      "content": {
        "text": "string (markdown supported)",
        "image": "string (optional asset ID)",
        "audio": "string (optional asset ID)",
        "style": "string (optional CSS class or asset ID)",
        "animations": {
          "enter": "string (CSS animation class)",
          "exit": "string (CSS animation class)"
        }
      },
      "conditions": {
        "show_if": "array of condition objects",
        "hide_if": "array of condition objects"
      },
      "effects": {
        "set_variables": {
          "variable_name": "new_value"
        },
        "modify_variables": {
          "variable_name": {
            "operation": "string (add, subtract, multiply, divide, append, etc.)",
            "value": "any"
          }
        },
        "add_inventory": ["array", "of", "item_ids"],
        "remove_inventory": ["array", "of", "item_ids"],
        "unlock_achievements": ["array", "of", "achievement_ids"],
        "custom_scripts": {
          "on_enter": "string (JavaScript code)",
          "on_exit": "string (JavaScript code)"
        }
      },
      "choices": [
        {
          "id": "string",
          "text": "string (markdown supported)",
          "target": "string (node_id)",
          "conditions": {
            "show_if": "array of condition objects",
            "enable_if": "array of condition objects"
          },
          "effects": {
            "set_variables": {
              "variable_name": "new_value"
            },
            "modify_variables": {
              "variable_name": {
                "operation": "string",
                "value": "any"
              }
            },
            "add_inventory": ["array", "of", "item_ids"],
            "remove_inventory": ["array", "of", "item_ids"]
          },
          "style": "string (optional CSS class)",
          "cost": {
            "variables": {
              "variable_name": "cost_amount"
            },
            "inventory": ["required", "items"]
          }
        }
      ],
      "auto_advance": {
        "enabled": "boolean",
        "delay": "number (seconds)",
        "target": "string (node_id)",
        "conditions": "array of condition objects (optional)"
      }
    }
  },
  "start_node": "string (node_id)"
}
```

## Condition Objects

Conditions are used throughout the format to create dynamic content:

```json
{
  "type": "string (variable, inventory, achievement, random, custom)",
  "variable": "string (variable name for variable type)",
  "operator": "string (==, !=, <, >, <=, >=, contains, not_contains)",
  "value": "any (comparison value)",
  "item": "string (item_id for inventory type)",
  "achievement": "string (achievement_id for achievement type)",
  "probability": "number 0.0-1.0 (for random type)",
  "script": "string (JavaScript expression for custom type)"
}
```

## Rich Text Formatting

Text content supports Markdown with extensions:

### Standard Markdown
- **Bold**, *italic*, ~~strikethrough~~
- Headers (# ## ###)
- Lists (ordered and unordered)
- Links [text](url)
- Code blocks and inline code

### CYOA Extensions
- `{variable_name}` - Insert variable value
- `{inventory_count}` - Show inventory item count
- `{if:condition}...{/if}` - Conditional text
- `{random:option1|option2|option3}` - Random text selection
- `{style:class_name}styled text{/style}` - Inline styling
- `{delay:2}` - Pause for 2 seconds before showing subsequent text
- `{typewriter}text{/typewriter}` - Typewriter animation effect

## Example File

```json
{
  "meta": {
    "title": "The Enchanted Forest",
    "author": "Jane Storyteller",
    "version": "1.2.0",
    "description": "A magical adventure through an mysterious forest",
    "created": "2024-01-15T10:30:00Z",
    "modified": "2024-02-20T14:45:00Z",
    "language": "en",
    "rating": "PG",
    "estimated_play_time": 45,
    "tags": ["fantasy", "magic", "forest", "adventure"]
  },
  "assets": {
    "images": {
      "forest_entrance": {
        "path": "images/forest_entrance.jpg",
        "alt_text": "A misty forest entrance with ancient trees",
        "width": 800,
        "height": 600,
        "format": "jpg"
      },
      "magic_sword": {
        "path": "images/sword.png",
        "alt_text": "A glowing magical sword",
        "format": "png"
      }
    },
    "audio": {
      "forest_ambience": {
        "path": "audio/forest_sounds.ogg",
        "loop": true,
        "volume": 0.3,
        "format": "ogg"
      },
      "sword_pickup": {
        "path": "audio/sword_pickup.wav",
        "loop": false,
        "volume": 0.8,
        "format": "wav"
      }
    }
  },
  "game_state": {
    "variables": {
      "player_health": {
        "type": "integer",
        "initial_value": 100,
        "description": "Player's health points"
      },
      "player_name": {
        "type": "string", 
        "initial_value": "",
        "description": "The player's chosen name"
      },
      "has_sword": {
        "type": "boolean",
        "initial_value": false,
        "description": "Whether player has found the magic sword"
      }
    },
    "inventory": {
      "enabled": true,
      "max_items": 10,
      "items": {
        "magic_sword": {
          "name": "Gleaming Sword of Truth",
          "description": "A magical blade that glows with inner light",
          "image": "magic_sword",
          "properties": {
            "damage": 25,
            "magical": true
          }
        }
      }
    },
    "achievements": {
      "sword_master": {
        "name": "Sword Master",
        "description": "Found the legendary magic sword",
        "hidden": false,
        "conditions": [
          {
            "type": "variable",
            "variable": "has_sword",
            "operator": "==", 
            "value": true
          }
        ]
      }
    }
  },
  "nodes": {
    "start": {
      "title": "The Forest Entrance",
      "content": {
        "text": "# Welcome, {player_name}!\n\nYou stand before the entrance to the **Enchanted Forest**. {typewriter}Ancient trees tower above you, their branches creating a natural cathedral of green and shadow.{/typewriter}\n\n*The air hums with magic...*",
        "image": "forest_entrance",
        "audio": "forest_ambience"
      },
      "choices": [
        {
          "id": "enter_forest",
          "text": "🌲 Enter the forest",
          "target": "forest_path"
        },
        {
          "id": "turn_back", 
          "text": "🔙 Turn back (you're not ready)",
          "target": "game_over"
        }
      ]
    },
    "forest_path": {
      "content": {
        "text": "## Deep in the Forest\n\nYou venture deeper into the woods. Suddenly, you notice something glinting between the roots of an ancient oak tree.\n\n{if:has_sword}You already carry the magic sword, so you continue on your path.{/if}"
      },
      "choices": [
        {
          "id": "investigate_glint",
          "text": "✨ Investigate the glinting object",
          "target": "find_sword",
          "conditions": {
            "show_if": [
              {
                "type": "variable",
                "variable": "has_sword",
                "operator": "==",
                "value": false
              }
            ]
          }
        },
        {
          "id": "ignore_continue",
          "text": "👣 Ignore it and continue walking", 
          "target": "deeper_forest"
        }
      ]
    },
    "find_sword": {
      "content": {
        "text": "## The Magic Sword\n\n{delay:1}You carefully dig around the roots and uncover a **magnificent sword**! {typewriter}It pulses with magical energy and seems to whisper your name.{/typewriter}",
        "image": "magic_sword",
        "audio": "sword_pickup"
      },
      "effects": {
        "set_variables": {
          "has_sword": true
        },
        "add_inventory": ["magic_sword"],
        "unlock_achievements": ["sword_master"]
      },
      "choices": [
        {
          "id": "take_sword",
          "text": "⚔️ Take the sword",
          "target": "deeper_forest"
        }
      ]
    }
  },
  "start_node": "start"
}
```

## Key Features

### 1. **Rich Multimedia Support**
- Images with responsive sizing and alt text
- Background audio with loop and volume controls
- CSS styling for custom visual themes

### 2. **Dynamic Text System**
- Variable interpolation with `{variable_name}`
- Conditional text blocks with `{if:condition}...{/if}`
- Animation effects like typewriter and delays
- Full Markdown support for formatting

### 3. **Game State Management**
- Typed variables (integer, string, boolean, array, object)
- Inventory system with item properties
- Achievement system with unlock conditions
- Custom JavaScript scripting for complex logic

### 4. **Conditional Logic**
- Show/hide choices based on game state
- Enable/disable choices with visual feedback
- Dynamic content that changes based on player progress
- Random elements for replayability

### 5. **Advanced Choice System**
- Choices can have costs (variables, inventory items)
- Rich choice text with markdown formatting
- Multiple condition types for complex branching
- Choice effects that modify game state

### 6. **Extensibility**
- Custom CSS styling support
- JavaScript scripting for complex behaviors
- Modular asset management
- Plugin system through custom scripts

## Validation Rules

1. **Node References**: All target nodes must exist
2. **Asset References**: All referenced assets must be defined
3. **Variable Types**: Variable operations must match declared types
4. **Circular Dependencies**: Detect and prevent infinite loops
5. **Required Fields**: Ensure all mandatory fields are present
6. **Path Validation**: Verify all asset paths are valid relative paths

## File Organization

```
game_folder/
├── story.json              # Main story file
├── images/                 # Image assets
│   ├── backgrounds/
│   ├── characters/
│   └── items/
├── audio/                  # Audio assets
│   ├── music/
│   ├── sfx/
│   └── ambient/
├── styles/                 # CSS stylesheets
│   ├── themes/
│   └── animations/
└── scripts/               # Custom JavaScript
    ├── helpers/
    └── plugins/
```

## Implementation Notes

### Rendering Engine Requirements
- JSON parser with validation
- Markdown renderer with custom extensions
- Condition evaluator for game logic
- Asset loader for multimedia content
- State management system
- Save/load functionality

### Performance Considerations
- Lazy loading of assets
- Preloading of adjacent nodes
- Efficient condition evaluation
- Memory management for large stories
- Caching strategies for repeated playthroughs

### Accessibility Features
- Alt text for all images
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Customizable text size

This format provides a robust foundation for creating sophisticated choose-your-own-adventure games while remaining human-readable and easy to author.