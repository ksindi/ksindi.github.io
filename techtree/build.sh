#!/bin/bash
set -e
cd "$(dirname "$0")"
npx esbuild src/main.ts --bundle --outfile=dist/game.js --format=esm --minify
mkdir -p ../static/techtree
cp index.html style.css dist/game.js ../static/techtree/
echo "Build complete → ../static/techtree/"
