#!/bin/bash

echo https://username:${1}@gitlab.com/TravColbert/traviscolbert.net_articles.git
git clone https://username:${1}@gitlab.com/TravColbert/traviscolbert.net_articles.git ./articles
