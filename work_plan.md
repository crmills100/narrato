Work Plan:
----------

Learning / environment setup:

- complete tutorial (StickerSmash) x

Version 0.1: Basic "POC" version
- revisit ChatGPT/Claude generated code x
- basic flow: x
   - select a story x
   - show text and navigation buttons and "end" x
   - story management (add + delete) x
- update README and check-in x

Version 0.2: "Demoable"
- change to Claude for generation x
- rich story fomat:
   - update StoreScreen.js to save to local disk x
   - pass path to JSON file to GameContext.js x
   - create a sample file with body and image x
   - define .cyoa file fomat (ZIP + JSON) 
   - unzip file in GameContext.js 
   - add to library[] in GameContext.js
   - return image assets from GameContext.js
   - update GameScreen.js to render images
   - functionality: nodes, text, sounds, images, ...
- story viewing / game engine:
   - scrollbar on long text x
   - multiple paragraphs of text (via markdown) x
   - display images
- Create main tabs of application:
   - "Current" - current story being viewed
   - "Home" - browsing server
   - "Library" - local stories
   - "More" - settings, info
- "Home"
   - basic version - placeholder text
   - story from URL - placeholder text
   - browse for local story
- "Library" manage and launch local stories:
   - browse (icons and titles)
   - select to launch
   - delete
- "Settings"
   - intro static text
   - show logs
- create demo stories:
   - bedtime story - port bedtime story from google https://g.co/gemini/share/076bd2395a2c
   - music album - use genAI songs
   - vacation album - use Iceland trip
   - infant story (Totes McGoats Adventure inital adventure)
   - modern family story
   - breaking bad story
   - porn story?
- intermediate Expo learning:
   - read: https://docs.expo.dev/workflow/overview/

Version 0.3: "Server Library"
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

Version 0.4: "Distributable"
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

Version 0.5: "Interactive"
- narration mode (reads the story)
- voice control mode (you speak the choices)
- child-lock mode (only responde to specific sequence of touches)
- story viewing:
   - hyperlinks in story text

Version 0.6: "Creators"
- create AI story: ability to have generative AI create a story
- tool to author story

Version 0.7: "
- more advanced story library (searching, browsing, 3rd party contribution)

Version 0.8: "Alpha"
- alpha versions publised to Android and Apple stored

Version 1.0:
- marketing
- 3rd party authors




Code Experiments:

1. Images

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