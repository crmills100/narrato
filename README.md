# Talewell CYOA Player Application

Talewell is a player / reader-facing app for choose your own adventure (CYOA) games. One can browse for a CYOA story and it will show the story with text and images. “Where stories come to life.”

Narrato Engine is the engine or creation platform. “Crafted by Narrato.” or “Powered by Narrato Engine.”

## Features

- 📚 **Local Game Library** - Store and organize your adventure games
- 🌐 **Online Store** - Browse and download new games from a central server
- 🎮 **Advanced Game Engine** - Support for rich text, images, audio, and complex branching
- 💾 **Auto-Save** - Automatic progress saving with multiple save slots
- 🏆 **Achievements** - Unlock achievements and track your progress
- 🎨 **Customizable UI** - Multiple themes and text size options
- 🔊 **Audio Support** - Background music and sound effects
- 📱 **Responsive Design** - Optimized for both phones and tablets

## Advanced Features (TBC)

- Narration mode (reads the story)
- Voice control mode (you speak the choices)
- Create AI story: ability to have generative AI create a story


## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)

### Setup
1. Clone the repository:
```bash
git clone https://github.com/your-username/cyoa-mobile-engine.git
cd cyoa-mobile-engine
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
expo start
```

4. Run on device:
   - Install Expo Go app on your mobile device
   - Scan the QR code displayed in terminal/browser
   - Or run `expo start --android` or `expo start --ios`

## Project Structure

```
├── App.js                      # Main application entry point
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── GameReader.js      # Text rendering with animations
│   │   ├── ChoiceButton.js    # Interactive choice buttons
│   │   └── AchievementToast.js # Achievement notifications
│   ├── context/               # React Context providers
│   │   └── GameContext.js     # Game state management
│   ├── engine/                # Game engine logic
│   │   ├── GameEngine.js      # Basic game engine
│   │   └── AdvancedGameEngine.js # Enhanced engine with audio/effects
│   ├── screens/               # App screens
│   │   ├── LibraryScreen.js   # Local game library
│   │   ├── StoreScreen.js     # Online game store
│   │   ├── GameScreen.js      # Game player
│   │   └── SettingsScreen.js  # App settings
│   └── services/              # External services
│       ├── GameDownloader.js  # Game download/installation
│       └── StoreAPI.js        # Server communication
├── assets/                    # App assets (icons, splash screens)
├── app.json                   # Expo configuration
└── package.json              # Dependencies and scripts
```

## Game Format Support

The app supports the CYOA file format with the following features:

- **Rich Text**: Markdown formatting with variable interpolation
- **Multimedia**: Images and audio assets
- **Branching Logic**: Conditional choices and dynamic content
- **Game State**: Variables, inventory, and achievements
- **Save System**: Multiple save slots with progress tracking

### Example Game Structure
```json
{
  "meta": {
    "title": "Sample Adventure",
    "author": "Game Developer",
    "version": "1.0.0"
  },
  "story": {
    "nodes": {
      "start": {
        "content": {
          "text": "# Welcome to the Adventure!\n\nYour journey begins..."
        },
        "choices": [
          {
            "id": "choice1",
            "text": "Explore the forest",
            "target": "forest"
          }
        ]
      }
    },
    "start_node": "start"
  }
}
```
## Building for Development (Android)

```bash
eas build --platform android --profile development
```

On device, download APK file and install.

## Building for Production

### Android APK
```bash
expo build:android
```

### iOS IPA
```bash
expo build:ios
```

### App Store Deployment
1. Configure app signing in `app.json`
2. Build with `expo build:android` or `expo build:ios`
3. Download and upload to respective app stores

## Configuration

### Server Configuration
Update the API endpoint in `src/services/StoreAPI.js`:
```javascript
static baseURL = 'https://your-api-server.com';
```

### App Settings
Modify `app.json` for app metadata:
- App name and description
- Icons and splash screens
- Permissions and capabilities
- Build settings

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the TBD License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Expo team for the excellent React Native framework
- React Navigation for seamless navigation
- Community contributors and testers

## Support

For support and questions:
- Create an issue on GitHub
- Join our Discord community
- Email: support@cyoa-games.com

---

Made with ❤️ using Expo React Native
