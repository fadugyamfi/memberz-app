#!/bin/bash
git pull
npm install
npm run build-slydepay
npm run build-staging
rm -rf live.bak
cp -R live/* live.bak
rm -rf live/*
cp -R dist/* live
