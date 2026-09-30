# AI → SI

A Chrome extension that finds every standalone "AI" on a page, strikes it through, and puts a red "SI" next to it in the same casing (`AI` → `SI`, `ai` → `si`, `Ai` → `Si`).

## Install

1. Open `chrome://extensions`
2. Turn on **Developer mode** (top right)
3. Click **Load unpacked** and select this folder

## Behavior

- Matches "AI" as a word on its own in any casing (`AI`, `ai`, `AI-powered`, `AI's`), plus a capital "AI" at the end of a camel-cased name (`OpenAI`, `xAI`, `GenAI`). Ordinary words like `said`, `maid`, `EMAIL` and `AIDS` are left alone.
- Leaves `<code>`, `<pre>`, form fields and editable areas alone.
- Picks up content that loads later (SPAs, infinite scroll) and also rewrites the tab title.
