document.addEventListener('DOMContentLoaded', function () {
  const slider = document.getElementById('opacitySlider');

  // Check the URL of the current tab
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentTab = tabs[0];

    // If the current tab's URL is not a Google Docs page, disable the slider
    if (!currentTab.url.includes('docs.google.com')) {
      slider.disabled = true;
    }
  });

  if (!slider) {
    console.error('opacitySlider element not found');
    return;
  }

  function saveOpacity(event) {
    let opacityValue = event.target.value / 100;
    chrome.storage.sync.set({ opacity: opacityValue }, function () {
      if (chrome.runtime.lastError) {
        console.error('Error setting storage:', JSON.stringify(chrome.runtime.lastError));
      } else {
        console.log('Opacity value saved:', opacityValue);
      }
    });
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs && tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, { opacity: opacityValue.toString() });
      } else {
        console.error('No active tab found to send message');
      }
    });
  }
  slider.addEventListener('input', saveOpacity);
  slider.addEventListener('change', saveOpacity);

  chrome.storage.sync.get('opacity', function (data) {
    if (data && typeof data.opacity !== 'undefined') {
      slider.value = data.opacity * 100;
    } else {
      console.error("Failed to retrieve opacity from storage or it hasn't been set yet");
    }
  });
});
