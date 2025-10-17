#!/bin/bash

mkdir www
mkdir www/narrato
mkdir www/narrato/images

cp ./assets/story_list.json ./www/narrato

cd ./assets/basic_story
zip -r basic_story story.json thumbnail.jpg images audio
cd ../../
cp ./assets/basic_story/basic_story.zip ./www/narrato

cd ./assets/music_demo
zip -r music_demo story.json thumbnail.jpg images audio
cd ../../
cp ./assets/music_demo/music_demo.zip ./www/narrato

cd ./assets/lullaby_star
zip -r lullaby_star story.json thumbnail.jpg images audio
cd ../../
cp ./assets/lullaby_star/lullaby_star.zip ./www/narrato
cp ./assets/lullaby_star/thumbnail.jpg ./www/narrato/images/ls_thumbnail.jpg

cd ./assets/totes_vol1_ep1
zip -r totes_vol1_ep1 story.json thumbnail.jpg images audio
cd ../../
cp ./assets/totes_vol1_ep1/totes_vol1_ep1.zip ./www/narrato
cp ./assets/totes_vol1_ep1/thumbnail.jpg ./www/narrato/images/tm_thumbnail.png

cd ./www
zip -r narrato_www.zip narrato
cd /var/www/html
sudo unzip -o /home/vboxuser/code/narrato/www/narrato_www.zip


# narrato.crmills.com deployment
#
# cd /home/vboxuser/code/narrato-www/plain-sunset-7c99/public
# unzip -o /home/vboxuser/code/narrato/www/narrato_www.zip
# rm narrato/lullaby_star.zip
# cd /home/vboxuser/code/narrato-www/plain-sunset-7c99
# npm run deploy
