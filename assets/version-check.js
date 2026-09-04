(function () {
  var VERSION_URL = '../assets/version.json';
  var POLL_MS = 5000;
  var TOAST_MS = 7000;
  var STORAGE_KEY = 'versionCheckJustReloaded';

  function showUpdatedToast() {
    var el = document.createElement('div');
    el.style.cssText = 'position:fixed; top:20px; right:20px; display:flex; align-items:center; gap:12px; max-width:300px; background:#fff; color:#1E2A32; font-family:"Inter",sans-serif; padding:16px 20px; border-radius:12px; border-left:4px solid #2F6F62; box-shadow:0 10px 30px rgba(0,0,0,.18); z-index:9999; opacity:0; transform:translateY(-10px); transition:opacity .35s ease, transform .35s ease; pointer-events:none;';
    el.innerHTML = '<span style="flex-shrink:0; width:24px; height:24px; border-radius:50%; background:#2F6F62; color:#fff; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700;">&#10003;</span><span style="font-size:14px; font-weight:600; line-height:1.4;">Sidan har uppdaterats</span>';
    document.body.appendChild(el);
    requestAnimationFrame(function () {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
    setTimeout(function () {
      el.style.opacity = '0';
      el.style.transform = 'translateY(-10px)';
      setTimeout(function () { el.remove(); }, 350);
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
