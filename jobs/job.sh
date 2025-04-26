#!/bin/sh
echo https://username:${1}@gitlab.com/TravColbert/traviscolbert.net_articles.git
git clone https://username:${1}@gitlab.com/TravColbert/traviscolbert.net_articles.git ./node-express-starter-app-blog/articles
