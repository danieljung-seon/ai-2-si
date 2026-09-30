(() => {
  const MARKER = "data-ai2si";
  // Standalone "AI" in any casing ("AI", "ai", "Ai", "AI-powered", "AI's"), or an
  // uppercase "AI" ending a camel-cased word ("OpenAI", "xAI", "GenAI").
  // Doesn't match "said", "maid", "EMAIL", or "AIDS".
  const PATTERN = /(?<![\p{L}\p{N}])[aA][iI](?![\p{L}\p{N}])|(?<=\p{Ll})AI(?![\p{L}\p{N}])/gu;
  const SKIP_TAGS = new Set([
    "SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "INPUT", "SELECT", "OPTION",
    "CODE", "PRE", "SVG", "MATH", "IFRAME", "TEMPLATE",
  ]);

  // Carry each character's case from the original over to the replacement.
  function matchCase(original, replacement) {
    return [...replacement]
      .map((ch, i) => {
        const o = original[i];
        return o && o === o.toUpperCase() ? ch.toUpperCase() : ch.toLowerCase();
      })
      .join("");
  }

  function shouldSkip(node) {
    for (let el = node.parentElement; el; el = el.parentElement) {
      if (
        SKIP_TAGS.has(el.tagName) ||
        el.hasAttribute(MARKER) ||
        el.isContentEditable ||
        (el.hasAttribute("contenteditable") && el.getAttribute("contenteditable") !== "false")
      ) {
        return true;
      }
    }
    return false;
  }

  function buildReplacement(original) {
    const wrapper = document.createElement("span");
    wrapper.setAttribute(MARKER, "");

    const struck = document.createElement("s");
    struck.textContent = original;
    struck.style.cssText = "text-decoration: line-through !important; opacity: 0.7;";

    const si = document.createElement("span");
    si.textContent = matchCase(original, "si");
    si.style.cssText = "color: #e00 !important; font-weight: bold; margin-left: 0.15em;";

    wrapper.append(struck, si);
    return wrapper;
  }

  function replaceInTextNode(node) {
    const text = node.nodeValue;
    PATTERN.lastIndex = 0;
    if (!PATTERN.test(text)) return;

    const frag = document.createDocumentFragment();
    let last = 0;
    PATTERN.lastIndex = 0;
    for (const m of text.matchAll(PATTERN)) {
      if (m.index > last) frag.append(text.slice(last, m.index));
      frag.append(buildReplacement(m[0]));
      last = m.index + m[0].length;
    }
    if (last < text.length) frag.append(text.slice(last));
    node.replaceWith(frag);
  }

  function processTree(root) {
    if (root.nodeType === Node.TEXT_NODE) {
      if (!shouldSkip(root)) replaceInTextNode(root);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE) return;
    if (SKIP_TAGS.has(root.tagName) || root.hasAttribute(MARKER)) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        return /ai/i.test(n.nodeValue) && !shouldSkip(n)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(replaceInTextNode);
  }

  // Also rewrite the tab title.
  function processTitle() {
    const t = document.title;
    const next = t.replace(PATTERN, (m) => matchCase(m, "si"));
    if (next !== t) document.title = next;
  }

  processTree(document.body);
  processTitle();

  // Handle content added later (SPAs, infinite scroll, etc.), batched per frame.
  const pending = new Set();
  let scheduled = false;
  function flush() {
    scheduled = false;
    observer.disconnect();
    for (const node of pending) {
      if (node.isConnected) processTree(node);
    }
    pending.clear();
    processTitle();
    observe();
  }

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === "characterData") pending.add(m.target);
      else m.addedNodes.forEach((n) => pending.add(n));
    }
    if (pending.size && !scheduled) {
      scheduled = true;
      requestAnimationFrame(flush);
    }
  });

  function observe() {
    observer.observe(document.documentElement, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }
  observe();
})();
