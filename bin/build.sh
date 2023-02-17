echo "Installing pnpm..."

npm install -g pnpm
pnpm install
pnpm run build:env
