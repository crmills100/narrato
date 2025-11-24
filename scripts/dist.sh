#!/bin/bash

# cleanup
rm ./stories/basic_story/basic_story.zip
rm ./stories/music_demo/music_demo.zip
rm ./stories/lullaby_star/lullaby_star.zip
rm ./stories/totes_vol1_ep1/totes_vol1_ep1.zip

mkdir www
mkdir www/talewell
mkdir www/talewell/images

cp ./stories/story_list.json ./www/talewell
cp ./stories/index.html ./www/talewell
cp -r ./stories/images ./www/talewell
cp ./stories/favicon.ico ./www/talewell
cp ./stories/favicon-*.png ./www/talewell

mkdir ./www/talewell/privacy
cp ./stories/privacy/index.html ./www/talewell/privacy/index.html


cd ./stories/basic_story
zip -r basic_story story.json thumbnail.jpg images audio
cd ../../
cp ./stories/basic_story/basic_story.zip ./www/talewell

cd ./stories/music_demo
zip -r music_demo story.json thumbnail.jpg images audio
cd ../../
cp ./stories/music_demo/music_demo.zip ./www/talewell

cd ./stories/lullaby_star
zip -r lullaby_star story.json thumbnail.jpg images audio
cd ../../
cp ./stories/lullaby_star/lullaby_star.zip ./www/talewell
cp ./stories/lullaby_star/thumbnail.jpg ./www/talewell/images/ls_thumbnail.jpg

cd ./stories/totes_vol1_ep1
zip -r totes_vol1_ep1 story.json thumbnail.jpg images audio
cd ../../
cp ./stories/totes_vol1_ep1/totes_vol1_ep1.zip ./www/talewell
cp ./stories/totes_vol1_ep1/thumbnail.jpg ./www/talewell/images/tm_thumbnail.png

cd ./www
zip -r talewell_www.zip talewell
cd /var/www/html
sudo unzip -o /home/vboxuser/code/narrato/www/talewell_www.zip

