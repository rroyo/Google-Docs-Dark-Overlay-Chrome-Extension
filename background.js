chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ opacity: 0.4 });
});
