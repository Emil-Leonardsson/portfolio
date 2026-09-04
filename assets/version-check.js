(function () {
  var VERSION_URL = '../assets/version.json';
  var POLL_MS = 5000;
  var TOAST_MS = 3000;
  var STORAGE_KEY = 'versionCheckJustReloaded';

  function showUpdatedToast() {
    var el = document.createElement('div');
    el.textContent = 'Uppdaterad';
    el.style.cssText = 'position:fixed; top:16px; right:16px; background:#2F6F62; color:#fff; font-family:"IBM Plex Mono",monospace; font-size:12px; font-weight:600; padding:8px 14px; border-radius:999px; box-shadow:0 4px 12px rgba(0,0,0,.18); z-index:9999; opacity:0; transition:opacity .3s ease; pointer-events:none;';
    document.body.appendChild(el);
    requestAnimationFrame(function () { el.style.opacity = '1'; });
    setTimeout(function () {
      el.style.opacity = '0';
      setTimeout(function () { el.remove(); }, 300);
    }, TOAST_MS);
  }

  if (sessionStorage.getItem(STORAGE_KEY) === '1') {
    sessionStorage.removeItem(STORAGE_KEY);
    showUpdatedToast();
  }

  function fetchVersion() {
    return fetch(VERSION_URL, { cache: 'no-store' })
      .then(function (res) { return res.json(); })
      .then(function (data) { return data.v; })
      .catch(function () { return null; });
  }

  fetchVersion().then(function (baseline) {
    if (baseline === null) return;
    setInterval(function () {
      fetchVersion().then(function (current) {
        if (current !== null && current !== baseline) {
          sessionStorage.setItem(STORAGE_KEY, '1');
          location.reload();
        }
      });
    }, POLL_MS);
  });
})();
