#!/usr/bin/env bash
# Packages the extension into dist/ai-2-si-<version>.zip for upload to the
# Chrome Web Store. The version comes from manifest.json.
set -euo pipefail
cd "$(dirname "$0")/.."

version=$(sed -n 's/.*"version": *"\([^"]*\)".*/\1/p' manifest.json)
out="dist/ai-2-si-$version.zip"

mkdir -p dist
rm -f "$out"
zip -qX "$out" manifest.json content.js icons/icon-*.png

echo "Built $out"
unzip -l "$out"
