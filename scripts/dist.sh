#!/bin/bash

cd /home/vboxuser/code/narrato/assets/basic_story
zip basic_story story.json images
sudo cp basic_story.zip /var/www/html
