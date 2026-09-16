// Lightweight shim so existing extension code (chrome.storage.local API)
// works unchanged inside a plain web page / PWA, backed by localStorage.
window.chrome = window.chrome || {};
window.chrome.storage = window.chrome.storage || {
  local: {
    get(keys, callback) {
      const result = {};
      const keyList = Array.isArray(keys) ? keys : Object.keys(keys || {});
      keyList.forEach((key) => {
        const raw = localStorage.getItem('appdata:' + key);
        if (raw !== null) {
          try {
            result[key] = JSON.parse(raw);
          } catch (e) {
            result[key] = raw;
          }
        } else if (!Array.isArray(keys) && keys && Object.prototype.hasOwnProperty.call(keys, key)) {
          result[key] = keys[key];
        }
      });
      callback(result);
    },
    set(obj, callback) {
      Object.keys(obj).forEach((key) => {
        localStorage.setItem('appdata:' + key, JSON.stringify(obj[key]));
      });
      if (callback) callback();
    }
  }
};
