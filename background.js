chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "setPrefix") {
      chrome.storage.sync.set({ prefix: message.prefix }, () => {
        sendResponse({ success: true });
      });
      return true;
    }
  
    if (message.type === "getPrefix") {
      chrome.storage.sync.get("prefix", (data) => {
        sendResponse({ prefix: data.prefix });
      });
      return true;
    }
  });
  
