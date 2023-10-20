function addOverlayWhenReady() {
  if (document.body) {
    const GOOGLE_DOCS_DOMAIN = 'docs.google.com';

    let overlay;

    if (window.location.hostname === GOOGLE_DOCS_DOMAIN) {
      chrome.storage.sync.get('opacity', function (data) {
        overlay = document.createElement('div');
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'black';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.zIndex = '10000';
        overlay.style.pointerEvents = 'none';
        overlay.style.opacity = data.opacity || '0.4';
        document.body.appendChild(overlay);
      });
    }

    chrome.runtime.onMessage.addListener(function (request) {
      if (request.opacity) {
        overlay.style.opacity = request.opacity;
      }
    });

    chrome.storage.onChanged.addListener(function (changes) {
      if (changes.opacity) {
        overlay.style.opacity = changes.opacity.newValue || '0.4';
      }
    });
  } else {
    // If the body isn't available yet, check again after a short delay
    setTimeout(addOverlayWhenReady, 10);
  }
}

addOverlayWhenReady();
