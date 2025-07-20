#!/bin/bash

# Set terminal title
echo -e "\033]0;Ambiquiz - Production Server\007"

echo
echo "========================================"
echo "    Starting Ambiquiz Production Server"
echo "========================================"
echo

# Change to the script directory
cd "$(dirname "$0")"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed or not in PATH!"
    echo "Please install Node.js from https://nodejs.org/"
    echo
    read -p "Press Enter to exit..."
    exit 1
fi

# Display Node.js version
NODE_VERSION=$(node --version)
echo "Node.js version: $NODE_VERSION"
echo

# Check if node_modules exists (optional check since you're distributing it)
if [ ! -d "node_modules" ]; then
    echo "WARNING: node_modules directory not found!"
    echo "This might cause issues. Consider running 'npm install' manually."
    echo
fi

# Check if .next build directory exists
if [ ! -d ".next" ]; then
    echo "Building application for production..."
    echo
    npm run build
    if [ $? -ne 0 ]; then
        echo
        echo "ERROR: Failed to build the application!"
        read -p "Press Enter to exit..."
        exit 1
    fi
    echo "Build completed successfully!"
    echo
else
    echo "Using existing production build..."
    echo
fi

# Start the production server
echo "Starting production server..."
echo
echo "The application will open in your browser at http://localhost:3000"
echo
echo "Press Ctrl+C to stop the server"
echo

# Open browser after delay (macOS)
(sleep 5 && open "http://localhost:3000") &

# Start the production server
npm start

# Keep the terminal open if there's an error
if [ $? -ne 0 ]; then
    echo
    echo "ERROR: Failed to start the production server!"
    read -p "Press Enter to exit..."
fi