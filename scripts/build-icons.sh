#!/usr/bin/env bash
# Renders icons/*.svg to the PNG sizes Chrome needs. Requires rsvg-convert
# (brew install librsvg). The PNGs are committed, so this only needs to run
# after changing the SVGs.
set -euo pipefail
cd "$(dirname "$0")/../icons"

for size in 16 32 48; do
  rsvg-convert -w "$size" -h "$size" icon-small.svg -o "icon-$size.png"
done
rsvg-convert -w 128 -h 128 icon.svg -o icon-128.png

echo "Rendered icon-{16,32,48,128}.png"
