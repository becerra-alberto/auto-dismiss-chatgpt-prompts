const PROMPT_TEXT_PATTERNS = [
  /too many requests/i,
  /making requests too quickly/i,
  /temporarily limited access/i
];

const BUTTON_TEXT_PATTERN = /^got it$/i;
const DEFAULT_SETTINGS = {
  enabled: true,
  cooldownMs: 1500,
  strictMatch: true
};

let lastClickAt = 0;
let settings = { ...DEFAULT_SETTINGS };

chrome.storage.sync.get(DEFAULT_SETTINGS, (storedSettings) => {
  settings = { ...DEFAULT_SETTINGS, ...storedSettings };
  dismissMatchingPrompt();
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "sync") {
    return;
  }

  settings = Object.fromEntries(
    Object.entries(settings).map(([key, value]) => [
      key,
      changes[key] ? changes[key].newValue : value
    ])
  );

  dismissMatchingPrompt();
});

function normalizeText(value) {
  return value.replace(/\s+/g, " ").trim();
}

function isVisible(element) {
  const style = window.getComputedStyle(element);
  const rect = element.getBoundingClientRect();

  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    style.opacity !== "0" &&
    rect.width > 0 &&
    rect.height > 0
  );
}

function looksLikeRateLimitDialog(container) {
  const text = normalizeText(container.innerText || container.textContent || "");

  if (settings.strictMatch) {
    return PROMPT_TEXT_PATTERNS.every((pattern) => pattern.test(text));
  }

  return (
    PROMPT_TEXT_PATTERNS[0].test(text) &&
    PROMPT_TEXT_PATTERNS.slice(1).some((pattern) => pattern.test(text))
  );
}

function findDismissButton(container) {
  const candidates = container.querySelectorAll("button, [role='button']");

  return Array.from(candidates).find((candidate) => {
    const label = normalizeText(candidate.innerText || candidate.textContent || "");
    return BUTTON_TEXT_PATTERN.test(label) && isVisible(candidate);
  });
}

function dismissMatchingPrompt() {
  if (!settings.enabled) {
    return;
  }

  const now = Date.now();

  if (now - lastClickAt < settings.cooldownMs) {
    return;
  }

  const candidates = document.querySelectorAll(
    "[role='dialog'], [aria-modal='true'], div"
  );

  for (const candidate of candidates) {
    if (!isVisible(candidate) || !looksLikeRateLimitDialog(candidate)) {
      continue;
    }

    const button = findDismissButton(candidate);

    if (button) {
      lastClickAt = now;
      button.click();
      return;
    }
  }
}

const observer = new MutationObserver(dismissMatchingPrompt);

observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
  characterData: true
});

dismissMatchingPrompt();
