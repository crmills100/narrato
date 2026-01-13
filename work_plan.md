Work Plan:
----------

## Version -0.1: Learning / environment setup: x
- complete tutorial (StickerSmash) x

## Version 0.1: Basic "POC" version x
- revisit ChatGPT/Claude generated code x
- basic flow: x
   - select a story x
   - show text and navigation buttons and "end" x
   - story management (add + delete) x
- update README and check-in x

## Version 0.2: "Demoable" x
- change to Claude for generation x
- rich story fomat: x
   - update StoreScreen.js to save to local disk x
   - pass path to JSON file to GameContext.js x
   - create a sample JSON with body and image x
   - define .cyoa file fomat (ZIP: JSON + assets) x
   - unzip file in GameContext.js x
   - return image assets from GameContext.js x
   - functionality: nodes, text, sounds, images, ... x
- story viewing / game engine: x
   - scrollbar on long text x
   - multiple paragraphs of text (via markdown) x
   - display node level images x
   - play background sound x
   - state: check to see that state is saved and resumed x
   - state: return to start (via menu) x
- Create main tabs of application: x
   - "Home" - browsing server x
   - "Library" - local stories x
   - "Settings" - settings, info x
   - Move "Add by URL" to "Settings" x
- "Home" screen: x
   - basic version - placeholder text x
- "Library" screen: manage and launch local stories: x
   - browse for local story x
   - browse (icons and titles) x
   - select to launch x
   - delete story x
- "Settings" screen: x
   - show logs x
- fixes: x
   - header goes into status area x
   - audio still plays on switching screen x
- create demo stories: x
   - bedtime story - port bedtime story from google https://g.co/gemini/share/076bd2395a2c, audio from https://suno.com/ x
   - infant story (Totes McGoats Adventure inital adventure) - GenAI conversation: crmills100@yahoo.com ChatGPT x
- app distribution: x
   - Android x
      - basic standalone build (AAB) x
      - local hosting x
         - convert AAB to APK https://github.com/google/bundletool x
         - host on cloudflare - deferred file too large - x

## Version 0.2.2: "MVP Google Play Store" x

- Demo stories: x
   - finish images for first Totes infant story x
- Fixes: x
   - error on delete story from library x
   - undefined showing in logs x
- "Home" screen: x
   - static list of stories: load 2 demo stories into "Home" (totes + lullaby) x
   - add “Import Story” to marketplace UI - not needed - in developer section x
   - icons of stories x 
- Server: x
   - update dist script to create zip file x
   - deploy zip file locally x
   - host static assets (images, story_list, stories) on CloudFlare (crmills.com) x
   - move default URLs to a single location x
   - remove stories that do not work x
   - reduce size of lullaby_star.zip to under 25MB (export png as jpg) x
   - update defaults with URL(s) x
- "Settings" screen: x
   - Terms of Service x
   - Privacy Policy x
   - about, version x
   - review text for ToS, Privacy Policy, About x
- Application logo (search for images on Wix?) x
   - create application logos https://docs.expo.dev/develop/user-interface/splash-screen-and-app-icon/ x
   - test x
- App Distribution: Publish Talewell on play store with 2 bundled free stories: x
   - Android x
      - play store x
         - signup for developer account https://play.google.com/console/signup x
         - alpha version published to store https://docs.expo.dev/submit/android/ x
- Prepare for alpha release: x
   - create dev 0.2.2 development build x
   - application "final touches" x
      - Talewell name x
      - name of app under logo is not "Talewell" x
      - bg color of logo is purple x
      - logo is too big x
      - package name in build x
      - register domain name (narratoengine.com) x
      - email address in ToS and PP x
      - setup support@narratoengine.com and privacy@narratoengine.com emails x
      - test support and privacy emails x
      - URLs in ToS and PP x
      - setup URLs: x
         - setup worker for: https://talewell.narratoengine.com/talewell/ x
         - update distribution to talewell.narratoengine.com x
         - update default URLs in application config x
   - create production build x
   - publish x
      - alpha version published to play store x
      - download and smoke test from play store x

## Version 0.2.2.1: "Alpha Testers" / 14+ testers
Push to get 14 testers signed up
   - Status:
      Beta questionarie responses: https://docs.google.com/forms/d/1f3Dhi_x83L8TEEYTs04dDhwKmkFzY55WpxSVqQgr2SE/edit#responses


   - Reddit:
      - write Reddit post (https://chatgpt.com/c/677761ad-7684-800f-ba0a-5619224c6160) x 
      - publish comment to r/SideProject x 
      - publish comment to r/apps - need to wait until play store link is possible
      - publish post to kids stories group
      - publish post to authors stories group
   - other:
      - write short blog/linkedin/text post  x
      - update wix personal site with Talewell
      - Facebook post
      - write howto on creating a story
      - write email with instructions - see "Alpha/Beta Marketing"
      - setup testing feedback form
      - bring Google Groups sign-up into instructions?: https://groups.google.com/u/1/g/talewell-alpha
      - uodate instructions with link: https://play.google.com/console/u/0/developers/5133380479146916403/app/4975687090598532054/tracks/4699868577417718154?tab=testers
   - metrics:
      - enable Google Analytics for narratoengine.com x
   - ads?




## Version www-0.1: "WWW content into own project"
   - Move stories to own github project
   - Update distribution
      - application
      - server
   - Initial version of content for website:
     - content for URLs:
         - content for: https://narratoengine.com/
         - content for: https://narratoengine.com/talewell/privacy
         - content for: https://narratoengine.com/talewell/ x
         - NOTE: talewell.narratoengine.com should be redirected to narratoengine.com/talewell/
         - NOTE: leave talewell.narratoengine.com for apps

## Version 0.2.3: "MVP iOS Store"
- "Settings" screen:
  - iOS version details
  - build number from build
- "Home" screen:
   - add “Coming Soon” to marketplace UI
- App Distribution: Publish Talewell on both stores with 2 bundled free stories
   - iOS
      - basic standalone build for simulator?
      - test flight version published https://docs.expo.dev/submit/ios/ 

## Version 0.2.4: "AI Creator"
- create AI story: ability to have generative AI create a story
- metrics:
   - downloads per story
   - application launches
   - number of users
   - metrics for story downloads
   - metrics for application
   - relationship between Google Analytics and Google Tag Manager?
- content:
   - check out Project Gutenberg (www.gutenberg.org) Project Gutenberg is a digital library of more than 15,000 pieces of literature considered to be in the public domain.

## Version 0.2.6:
- "Current Story":
   - ability to go in and out full screen, restore <-> maximize
   - restored view mode has back and forward buttons
   - display images: inline
   - display images: click to zoom
   - display images: full screen background with text on top
   - add inventory and variables support
   - child-lock mode: tap in center and drag to action (only responde to specific sequence of touches)
- Create main tabs of application:
   - "Current" - icon of current story
- "Current" screen
   - book/story icon that launches current story
   - empty story by default
   - set to current story on launch from library
- more demo stories:
   - Spanish story
   - create second Totes story
   - modern family story
   - breaking bad story
   - corn story?
   - music album - use genAI songs
   - vacation album - use Iceland trip
- intermediate Expo learning:
   - read: https://docs.expo.dev/workflow/overview/
- "Settings"
   - implement features
      - sound effects on/off
      - text size S/M/L
   - switch languages
- I18N / L10N
   - strings database for UI text
   - call strings databse

## Version 0.3: "IAP Library" https://chatgpt.com/c/677761ad-7684-800f-ba0a-5619224c6160
- Add backend catalog with story previews
- Enable in app purchases (IAP) for story downloads
- manage shared stories (authentication, user login, ...):
   - client:
      - option to set server URL
      - browse library from list on "the server" (connect to server and shows a list)
      - select story
      - saves to local story collection
   - server:
      - local web server (same LAN)
      - serve list of stories in .cyoa
      - serve individual story

## Version 0.4: "Website Library"
- Launch website storefront (Stripe or Gumroad)
- Add account linking and story syncing
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
- AI story templates
  - kids night time story
  - kids animal adventure story
- tool to author story

## Version 0.7: "
- more advanced story library (searching, browsing, 3rd party contribution)

## Version 0.8: "Alpha"
- alpha versions publised to Android and Apple stored

## Version 1.0:
- marketing
- 3rd party authors


# Alpha/Beta Marketing

## 1. Signup workflow:

- Review signups: https://docs.google.com/forms/d/1f3Dhi_x83L8TEEYTs04dDhwKmkFzY55WpxSVqQgr2SE/edit#responses
- Add new emails to google groups: https://groups.google.com/g/talewell-alpha
- Send welcome email to any new signups


- details of email: 


   From: support@narratoengine.com
   Bcc: {new email signups}
   Subject:
   Email text:

   Welcome to Talewell, {TODO},

   Install on your device:
   https://play.google.com/store/apps/details?id=com.narratoengine.talewell


   Send defects / issues via form {TODO}, if the issue is new you will receive an electronic Amazon gift card for $USD 10.


# Builds:

## 1. Development EAS build for Android

> eas build --platform android --profile development
> npx expo start # ensure running development build

navigate to expo.dev build area (https://expo.dev/accounts/crmills100/projects/) and navigate to the build
download the build
install the build artifact on the device
open the app on the device and scan QR code from the expo dev console

## 2. www smoketest

https://narratoengine.com/                                  # via worker in cloudflare
https://talewell.narratoengine.com/                         # via narrato-www
https://talewell.narratoengine.com/talewell/                # via narrato-www
https://talewell.narratoengine.com/talewell/story_list.json # via narrato-www

https://narratoengine.com/talewell/privacy/
https://narratoengine.com/talewell/

## 3. Internal Play Store Release

1. Build app: eas build --platform android --profile production
2. Download app from expo.dev https://expo.dev/accounts/crmills100/projects/talewell
3. Upload to Play Store: 
https://play.google.com/console/u/0/developers/5133380479146916403/app-list
4. Copy URL of test artifact and smoke test on device

## 4. Internal Play Store Release with EAS submission

1. Build app: eas build --platform android --profile production
2. Submit app: eas submit --platform android
3. Publish via Play Store GUI
4. Copy URL of test artifact and smoke test on device

## 5. Update git token
Check current URL:
    git remote -v

Obtain token:
    https://github.com/settings/tokens/
    
Set remote URL:
    git remote set-url origin https://crmills100:{TOKEN}@github.com/crmills100/narrato.git


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


## 2. Audio - background effects - complete

https://pixabay.com/sound-effects/search/forest/

## 3. Child-lock mode - complete

Press in center and drag to button

## 4. AI story creation

Given a simple JSON and a description, can a GenAI tool create a story


## 5. Local Build for Android - complete

- convert on Android device to apk
- publish on local webserver

## 6. APK for local Android install using command line - complete

- setup keystore:

keytool -genkey -v -keystore mykey.ks -alias key_alias -keyalg RSA -keysize 2048 -validity 100
(password: welcome)

- create build:

    - eas build --platform android --profile production
    - download aab file from build
    - copy to linux host: scp -i C:\Users\cmills\.ssh\id_ed25519_linuxdev .\application-5846be8c-c9fb-4291-8e60-78cd14b50d77.aab vboxuser@192.168.1.196:/home/vboxuser/tmp
    - mv application-5846be8c-c9fb-4291-8e60-78cd14b50d77.aab narrato_0.2.2.aab
    - java -jar bundletool-all-1.18.2.jar build-apks --output=./apks --output-format=DIRECTORY --bundle=narrato_0.2.2.aab --mode=universal --ks=mykey.ks --ks-key-alias=key_alias
    - mv apks/universal.apk apks/narrato_0.2.2.apk
    - publish to local webserver: sudo cp apks/narrato_0.2.2.apk /var/www/html/narrato_0.2.2.apk


