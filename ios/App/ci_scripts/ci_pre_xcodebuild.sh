#!/bin/sh

# Build Ember
yarn build --environment=production

# Capacitor Sync
npx cap sync ios
