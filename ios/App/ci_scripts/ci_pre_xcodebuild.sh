#!/bin/sh

# Build Ember
yarn build --environment=production

# Capacitor Sync
yarn cap sync ios
