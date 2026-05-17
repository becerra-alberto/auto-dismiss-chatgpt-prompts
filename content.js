const PROMPT_TEXT_PATTERNS = [
  /too many requests/i,
  /making requests too quickly/i,
  /temporarily limited access/i
];

const BUTTON_TEXT_PATTERN = /^got it$/i;
const CLICK_COOLDOWN_MS = 1500;

let lastClickAt = 0;

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
  return PROMPT_TEXT_PATTERNS.every((pattern) => pattern.test(text));
}

function findDismissButton(container) {
  const candidates = container.querySelectorAll("button, [role='button']");

  return Array.from(candidates).find((candidate) => {
    const label = normalizeText(candidate.innerText || candidate.textContent || "");
    return BUTTON_TEXT_PATTERN.test(label) && isVisible(candidate);
  });
}

function dismissMatchingPrompt() {
  const now = Date.now();

  if (now - lastClickAt < CLICK_COOLDOWN_MS) {
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
