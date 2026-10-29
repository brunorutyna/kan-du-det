#!/bin/sh
# Stamp a new version so phones load fresh files and open games show "Ny version".
cd "$(dirname "$0")/.."
V=$(date -u +%Y%m%d%H%M%S)
echo "$V" > version.txt
sed -i -E "s/\?v=[0-9]{14}/?v=$V/g; s/VERSION: '[0-9]{14}'/VERSION: '$V'/" index.html
echo "version $V"
