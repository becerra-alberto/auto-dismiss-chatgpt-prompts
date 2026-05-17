# Prompt Auto-Dismiss for ChatGPT

This is a small Chrome extension that automatically clicks **Got it** when ChatGPT shows selected prompts, starting with the "Too many requests" prompt.

## Settings

Click the extension icon in the Chrome toolbar to change:

- **Auto-dismiss**: turn automatic dismissal on or off.
- **Match style**: choose strict matching for the exact rate-limit prompt, or flexible matching for minor text changes.
- **Minimum delay**: choose how quickly repeated matching prompts can be dismissed.

## Install in Chrome

1. Open `chrome://extensions`.
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Select this folder:

   `/Users/alberto/Projects/auto-dismiss-chatgpt-prompts`

5. Refresh ChatGPT.

The extension is intentionally scoped to:

- `https://chatgpt.com/*`
- `https://chat.openai.com/*`

It only clicks a visible **Got it** button when the surrounding dialog includes the "Too many requests" rate-limit text.

## Chrome Web Store

Release ZIPs are written to `dist/`. The Chrome Web Store listing helper copy and artwork live in `store/`.
