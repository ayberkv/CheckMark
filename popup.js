document.addEventListener("DOMContentLoaded", () => {
  const prefixInput = document.getElementById("prefix");
  const settingsForm = document.getElementById("settingsForm");

  chrome.storage.sync.get("prefix", ({ prefix }) => {
    if (prefix) {
      prefixInput.value = prefix;
      console.log("Loaded prefix:", prefix);
    }
  });

  settingsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const prefix = prefixInput.value.trim();

    chrome.storage.sync.set({ prefix }, () => {
      console.log("Prefix successfully saved:", prefix);

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: "updatePrefix", prefix });
      });

      alert("Prefix successfully saved!");
    });
  });
});
