#!/bin/sh
echo https://app:$1@gitlab.com/TravColbert/traviscolbert.net_articles.git
git clone https://app:$1@gitlab.com/TravColbert/traviscolbert.net_articles.git ./node-express-starter-app-blog/articles
