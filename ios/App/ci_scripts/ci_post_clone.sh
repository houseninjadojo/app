#!/bin/sh

export HOMEBREW_NO_INSTALL_CLEANUP=TRUE
brew install cocoapods
# have to add node yourself
brew install node@16
# link it to the path
brew link node@16

brew install yarn

# Install node deps
yarn install --frozen-lockfile

# Build Ember
yarn build --environment=production

# Capacitor Sync
npx cap sync ios
