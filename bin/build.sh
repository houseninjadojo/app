# !/bin/bash

echo "Installing pnpm..."

npm install -g pnpm
pnpm run env:load
pnpm run build:env
