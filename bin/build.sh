echo "Installing pnpm..."

npm install -g pnpm
pnpm install
pnpm run env:load
pnpm run build:env
