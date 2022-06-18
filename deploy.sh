#!/bin/bash
git pull
npm install
npm run build-slydepay
npm run build-staging
rm -rf live-bak
mv live live-bak
rm -rf live
mv dist live

# Revert logic
# mv live dist
# mv live-bak live
