Work Plan:
----------

Learning / environment setup:

- complete tutorial (StickerSmash) x

Basic version: "Basic"
- revisit ChatGPT/Claude generated code x
- basic flow: x
   - select a story x
   - show text and navigation buttons and "end" x
- update README and check-in x

Version 0.1: "Demoable"
- change to Claude for generation
- rich story fomat:
   - define .cyoa file fomat
   - functionality: nodes, text, sounds, images, ...
- story viewing / game engine:
   - scrollbar on long text 
   - display images
   - multiple paragraphs of text
- "Home"
   - basic version - placeholder text
   - story from URL - placeholder text
   - browse for local story
- "Library" manage and launch local stories:
   - browse (icons and titles)
   - select to launch
   - delete
- create demo stories:
   - bedtime story - port bedtime story from google
   - music album - use genAI songs
   - vacation album - use Iceland trip
   - infant story (Totes McGoats Adventure inital adventure)
   - modern family story
   - breaking bad story
   - porn story?
- intermediate Expo learning:
   - read: https://docs.expo.dev/workflow/overview/

Version 0.2: "Server Library"
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

Version 0.3: "Distributable"
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

Version 0.4: "Interactive"
- narration mode (reads the story)
- voice control mode (you speak the choices)
- child-lock mode (only responde to specific sequence of touches)
- story viewing:
   - hyperlinks in story text

Version 0.5: "Creators"
- create AI story: ability to have generative AI create a story
- tool to author story

Version 0.6: "
- more advanced story library (searching, browsing, 3rd party contribution)

Version 0.7: "Alpha"
- alpha versions publised to Android and Apple stored

Version 1.0:
- marketing
- 3rd party authors

