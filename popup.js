const DEFAULT_SETTINGS = {
  enabled: true,
  cooldownMs: 1500,
  strictMatch: true
};

const enabledInput = document.querySelector("#enabled");
const cooldownInput = document.querySelector("#cooldownMs");
const strictMatchInput = document.querySelector("#strictMatch");
const statusElement = document.querySelector("#status");

function showSaved() {
  statusElement.textContent = "Saved";
  window.setTimeout(() => {
    statusElement.textContent = "";
  }, 1200);
}

function readFormSettings() {
  return {
    enabled: enabledInput.checked,
    cooldownMs: Number(cooldownInput.value),
    strictMatch: strictMatchInput.value === "true"
  };
}

function writeFormSettings(settings) {
  enabledInput.checked = settings.enabled;
  cooldownInput.value = String(settings.cooldownMs);
  strictMatchInput.value = String(settings.strictMatch);
}

function saveSettings() {
  chrome.storage.sync.set(readFormSettings(), showSaved);
}

chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
  writeFormSettings({ ...DEFAULT_SETTINGS, ...settings });
});

enabledInput.addEventListener("change", saveSettings);
cooldownInput.addEventListener("change", saveSettings);
strictMatchInput.addEventListener("change", saveSettings);
