#!/bin/bash
git pull
npm install
npm run build-slydepay
num run build-staging
