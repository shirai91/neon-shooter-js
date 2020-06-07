#!/bin/sh
rm -rf ./dist
mkdir dist
npm run build
cp -r ./app/* ./dist
cp ./package.json ./dist
git add dist && git commit -m "Publish dist"
git push -d origin gh-pages
git subtree push --prefix dist origin gh-pages
