echo "Installing pnpm..."

corepack enable
corepack prepare pnpm@latest --activate
pnpm config set node-linker hoisted
pnpm install
pnpm run build:env
