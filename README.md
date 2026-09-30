# AI → SI

A Chrome extension that finds every standalone "AI" on a page, strikes it through, and puts a red "SI" next to it in the same casing (`AI` → `SI`, `ai` → `si`, `Ai` → `Si`).

## Install

1. Open `chrome://extensions`
2. Turn on **Developer mode** (top right)
3. Click **Load unpacked** and select this folder

## Publishing

```sh
./scripts/build-zip.sh     # → dist/ai-2-si-<version>.zip, ready to upload to the Chrome Web Store
./scripts/build-icons.sh   # re-render icons/*.png after editing the SVGs (needs rsvg-convert)
```

Bump `version` in `manifest.json` before each store upload.

## Behavior

- Matches "AI" as a word on its own in any casing (`AI`, `ai`, `AI-powered`, `AI's`), plus a capital "AI" at the end of a camel-cased name (`OpenAI`, `xAI`, `GenAI`). Ordinary words like `said`, `maid`, `EMAIL` and `AIDS` are left alone.
- Leaves `<code>`, `<pre>`, form fields and editable areas alone.
- Picks up content that loads later (SPAs, infinite scroll) and also rewrites the tab title.
