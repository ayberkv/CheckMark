let barcodeData = '';
let barcodeTimer;
let loadedPrefix = '';

console.log("Script yüklendi.");

chrome.storage.sync.get("prefix", ({ prefix }) => {
  loadedPrefix = prefix || "";
  console.log("Prefix:", loadedPrefix);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "updatePrefix") {
    if (loadedPrefix === message.prefix) {
      console.log("Prefix zaten yüklü, tekrar güncellenmedi.");
      sendResponse({ success: true });
      return;
    }
    loadedPrefix = message.prefix || "";
    console.log("Prefix güncellendi:", loadedPrefix);
    sendResponse({ success: true });
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    if (loadedPrefix && barcodeData.startsWith(loadedPrefix)) {
      barcodeData = barcodeData.slice(loadedPrefix.length);
    }

    processBarcode(barcodeData);

    barcodeData = '';
    return;
  }

  if (event.key.length === 1) {
    barcodeData += event.key;

    clearTimeout(barcodeTimer);
    barcodeTimer = setTimeout(() => {
      barcodeData = '';
    }, 500);
  }
});

function processBarcode(barcode) {
  if (!barcode) {
    return;
  }

  const rows = document.querySelectorAll('tr[role="row"]');
  rows.forEach(row => {
    const cells = row.querySelectorAll('td[role="gridcell"]');
    if (cells.length > 1 && cells[1].querySelector('div.x-grid-cell-inner').textContent.trim() === barcode) {
      const checkbox = cells[0].querySelector('div.x-grid-row-checker');
      if (checkbox) {
        checkbox.click();
      }
    }
  });
}
