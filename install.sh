#!/usr/bin/env bash
. ~/.nvm/nvm.sh

# jump into project dir
cd $(dirname $0)

# use correct npm and install dependencies
nvm install
nvm use
npm i -g npm@7.19 yarn
yarn install

# CMS Site
ln -sf ../../api/api-cms/block-meta.json ./packages/site/site-cms/block-meta.json
