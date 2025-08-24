Work Plan:
----------

Learning / environment setup:

- complete tutorial (StickerSmash) x

Basic version: "Basic"
- revisit ChatGPT/Claude generated code x
- basic flow: x
   - select a story
   - show text and navigation buttons and "end"
- update README and check-in

Version 0.1: "Demoable"
- story viewing:
   - display images
   - scrollbar on long text
- manage local stories:
   - basic story from URL:
      - simple JSON
      - save locally
      - delete story
   - rich story from URL:
      - more advanced file format with images
      - parse file format
- manage shared stories (no authentication, user login, ...):
   - client:
      - option to set server URL
      - browse library from list on "the server" (connect to server and shows a list)
      - select story
      - saves to local story collection
   - local server:
      - local web server (same LAN)
      - serve list of stories in JSON
      - serve individual story
- create 3 stories:
   - infant story (Totes McGoats Adventure inital adventure)
   - kids story (star wars?)
   - modern family story
   - breaking bad story
   - porn story?
- intermediate learning:
   - read: https://docs.expo.dev/workflow/overview/

Version 0.2: "Distributable"
- cloud flare
   - serve list of stories in JSON
   - serve individual story
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
- pre-release client published to server for download

Version 0.3: "Interactive"
- narration mode (reads the story)
- voice control mode (you speak the choices)
- create AI story: ability to have generative AI create a story
- child-lock mode (only responde to specific sequence of touches)
- story viewing:
   - hyperlinks in story text

Version 0.4: "
- more advanced story library (searching, browsing, 3rd party contribution)

Version 0.5: "Alpha"
- alpha versions publised to Android and Apple stored

Version 1.0:
- marketing
- 3rd party authors


Update the StoryList component to be able to add new stories from a user provided URL. There should be a text field labeled "Add Story...", a field for a URL, and button named "Add". When the user presses the "Add" button the application should fetch the story from the URL, persist the data locally, and make the story available in the Story array.