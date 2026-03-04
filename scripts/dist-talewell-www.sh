# talewell.narratoengine.com deployment

# deploys talewell_www.zip to narrato-www/plain-sunset-7c99
# plain-sunset-7c99 is the Cloudflare Pages project for talewell.narratoengine.com

# prerequites: login to cloudflare


cd /home/vboxuser/code/narrato-www/plain-sunset-7c99/public
unzip -o /home/vboxuser/code/narrato/www/talewell_www.zip
cd /home/vboxuser/code/narrato-www/plain-sunset-7c99
npm run deploy
