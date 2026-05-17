# ChatGPT Prompt Auto-Dismiss

This is a small Chrome extension that automatically clicks **Got it** when ChatGPT shows the "Too many requests" prompt.

## Install in Chrome

1. Open `chrome://extensions`.
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Select this folder:

   `/Users/alberto/Documents/Codex/2026-05-17/fix-it-so-these-prompts-are/auto-dismiss-chatgpt-prompts`

5. Refresh ChatGPT.

The extension is intentionally scoped to:

- `https://chatgpt.com/*`
- `https://chat.openai.com/*`

It only clicks a visible **Got it** button when the surrounding dialog includes the "Too many requests" rate-limit text.
