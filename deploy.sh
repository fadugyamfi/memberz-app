#!/bin/bash
git pull
npm install
npm run build-slydepay
npm run build-staging
