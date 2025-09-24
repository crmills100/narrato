#!/bin/bash

cd /home/vboxuser/code/narrato/assets/basic_story
zip -r basic_story story.json thumbnail.jpg images audio
sudo cp basic_story.zip /var/www/html


cd /home/vboxuser/code/narrato/assets/music_demo
zip -r music_demo story.json thumbnail.jpg images audio
sudo cp music_demo.zip /var/www/html


cd /home/vboxuser/code/narrato/assets/lullaby_star
zip -r lullaby_star story.json thumbnail.jpg images audio
sudo cp lullaby_star.zip /var/www/html


cd /home/vboxuser/code/narrato/assets/totes_vol1_ep1
zip -r totes_vol1_ep1 story.json thumbnail.jpg images audio
sudo cp totes_vol1_ep1.zip /var/www/html
