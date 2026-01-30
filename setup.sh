#!/bin/bash
set -e

echo "=== Space Robotics Workshop Setup ==="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Required Node major version
REQUIRED_NODE_MAJOR=20

# 1. Check for nvm
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    source "$HOME/.nvm/nvm.sh"
elif [ -s "/usr/local/opt/nvm/nvm.sh" ]; then
    source "/usr/local/opt/nvm/nvm.sh"
fi

if ! command -v nvm &> /dev/null; then
    echo -e "${YELLOW}nvm not found. Installing nvm...${NC}"
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    source "$NVM_DIR/nvm.sh"
fi

# 2. Install and use correct Node version
echo -e "${GREEN}Setting up Node ${REQUIRED_NODE_MAJOR}...${NC}"
nvm install $REQUIRED_NODE_MAJOR
nvm use $REQUIRED_NODE_MAJOR

# Verify Node version
NODE_VERSION=$(node -v)
NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | tr -d 'v')
if [ "$NODE_MAJOR" -ne "$REQUIRED_NODE_MAJOR" ]; then
    echo -e "${RED}Error: Node $REQUIRED_NODE_MAJOR required, but got $NODE_VERSION${NC}"
    exit 1
fi
echo -e "${GREEN}Using Node $NODE_VERSION${NC}"

# 3. Install yarn if missing
if ! command -v yarn &> /dev/null; then
    echo -e "${YELLOW}yarn not found. Installing yarn...${NC}"
    npm install -g yarn
fi
echo -e "${GREEN}Using yarn $(yarn --version)${NC}"

# 4. Install dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
yarn install

# 5. Clean Gatsby cache
echo -e "${GREEN}Cleaning Gatsby cache...${NC}"
yarn clean

echo ""
echo -e "${GREEN}=== Setup complete! ===${NC}"
echo ""
echo "To start the development server, run:"
echo "  source ~/.nvm/nvm.sh && nvm use $REQUIRED_NODE_MAJOR && yarn develop"
echo ""
echo "The site will be available at http://localhost:8000/"
