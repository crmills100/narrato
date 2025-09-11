Work Plan:
----------

Learning / environment setup:

- complete tutorial (StickerSmash) x

## Version 0.1: Basic "POC" version x
- revisit ChatGPT/Claude generated code x
- basic flow: x
   - select a story x
   - show text and navigation buttons and "end" x
   - story management (add + delete) x
- update README and check-in x

## Version 0.2: "Demoable"
- change to Claude for generation x
- rich story fomat: x
   - update StoreScreen.js to save to local disk x
   - pass path to JSON file to GameContext.js x
   - create a sample JSON with body and image x
   - define .cyoa file fomat (ZIP: JSON + assets) x
   - unzip file in GameContext.js x
   - return image assets from GameContext.js x
   - functionality: nodes, text, sounds, images, ... x
- story viewing / game engine:
   - scrollbar on long text x
   - multiple paragraphs of text (via markdown) x
   - display node level images x
   - play background sound x
   - display images: inline
   - display images: click to zoom
   - state: check to see that state is saved and resumed
   - state: return to start
   - child-lock mode: tap in center and drag to action (only responde to specific sequence of touches)
- Create main tabs of application:
   - "Current" - icon of current story
   - "Home" - browsing server 
   - "Library" - local stories 
   - "Settings" - settings, info
   - remove extra "Add" tab
- "Current"
   - book/story icon that launches current story
   - empty story by default
   - set to current story on launch from library
- "Home"
   - basic version - placeholder text x
   - icons of stories
- "Library" manage and launch local stories:
   - browse for local story x
   - browse (icons and titles) x
   - select to launch x
   - delete
   - add story by URL
- "Settings"
   - show logs x
   - about, version, license, static text
   - implement features
      - sound effects on/off
      - text size S/M/L
- fixes
   - header goes into status area x
   - audio still plays on switching screen x
- create demo stories:
   - bedtime story - port bedtime story from google https://g.co/gemini/share/076bd2395a2c
   - music album - use genAI songs
   - vacation album - use Iceland trip
   - infant story (Totes McGoats Adventure inital adventure) - what is the GenAI conversation?
- app distribution:
   - android: standalone build with static list of stories
   - iOS: standalone build with static list of stories


## Version 0.2.1

- "Current Story":
   - ability to go in and out full screen, restore <-> maximize
   - restored mode has back and forward buttons
- more demo stories:
   - Spanish story
   - modern family story
   - breaking bad story
   - corn story?
- intermediate Expo learning:
   - read: https://docs.expo.dev/workflow/overview/

## Version 0.3: "Server Library"
- manage shared stories (no authentication, user login, ...):
   - client:
      - option to set server URL
      - browse library from list on "the server" (connect to server and shows a list)
      - select story
      - saves to local story collection
   - server:
      - local web server (same LAN)
      - serve list of stories in .cyoa
      - serve individual story

## Version 0.4: "Distributable"
- cloud flare
   - serve list of stories
   - serve individual story in .cyoa format
- accounts and authentication
    - client
      - login
    - server:
      - login
      - create new account
      - reset password
- content:
   - story workflow from git -> published on server
   - 3 infant stories
- options:
   - increase/decrease font size
- pre-release client published to server for download

## Version 0.5: "Interactive"
- narration mode (reads the story)
- voice control mode (you speak the choices)
- story viewing:
   - hyperlinks in story text

## Version 0.6: "Creators"
- create AI story: ability to have generative AI create a story
- tool to author story

## Version 0.7: "
- more advanced story library (searching, browsing, 3rd party contribution)

## Version 0.8: "Alpha"
- alpha versions publised to Android and Apple stored

## Version 1.0:
- marketing
- 3rd party authors




# Code Experiments:

## 1. Images - complete

This works:

      const fileName = `2671807.jpg`;
      const fileUri = FileSystem.documentDirectory + fileName;

      // Download the file
      const result = await FileSystem.downloadAsync("http://192.168.0.157/2671807.jpg", fileUri);
      log(fileUri);      
      // Saved file Uri is: file:///data/user/0/host.exp.exponent/files/2671807.jpg


      // Display the image
          <Image
            source={{ uri: "file:///data/user/0/host.exp.exponent/files/2671807.jpg" }}
            style={styles.storyImage}
            resizeMode="cover"
          />


## 2. Audio - background effects: - complete

https://pixabay.com/sound-effects/search/forest/

## 3. Child-lock mode

Press in center and drag to button

## 4. AI story creation

Given a simple JSON and a description, can a GenAI tool create a story
