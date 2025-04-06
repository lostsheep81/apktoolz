#!/bin/bash

# Uninstall crewai globally if installed
echo "Uninstalling crewai..."
sudo npm uninstall -g crewai

# Clear npm cache
echo "Clearing npm cache..."
sudo npm cache clean --force

# Update npm and node to the latest versions
echo "Updating npm and node to the latest versions..."
sudo npm install -g npm
sudo npm install -g n
sudo n latest

# Check the version of node and npm
node --version
npm --version

# Clone the crewai repository
echo "Cloning the crewai repository..."
git clone https://github.com/crewai/crewai.git

# Navigate to the repository
cd crewai

# Install dependencies
echo "Installing dependencies..."
npm install

# Run setup
echo "Running crewai setup..."
npx ts-node src/crewai/cli/cli.ts setup
