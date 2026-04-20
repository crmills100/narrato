# talewell.narratoengine.com deployment

# deploys talewell_www.zip to narrato-www/plain-sunset-7c99
# plain-sunset-7c99 is the Cloudflare Pages project for talewell.narratoengine.com

# prerequites: login to cloudflare

mkdir -p /home/vboxuser/code/narrato/www/plain-sunset-7c99/public
cd /home/vboxuser/code/narrato/www/plain-sunset-7c99/public
unzip -o /home/vboxuser/code/narrato/www_tmp/talewell_www.zip
cd /home/vboxuser/code/narrato/www/plain-sunset-7c99
npx wrangler deploy
