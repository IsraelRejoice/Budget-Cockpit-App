/* ============================================================
   BOOT GUARD — a tiny, separate script that never depends on app.js.
   If the app fails to start (a script error, a missing file, files from two
   different versions), the loading screen used to stay up forever with no
   explanation. This watches for that, remembers the last error, and after a
   short wait shows what went wrong with two recovery buttons.
   ============================================================ */
(function(){
  var lastError = '';
  function remember(m){ lastError = String(m || '').slice(0, 280); }
  window.addEventListener('error', function(e){
    remember((e.message || 'Error') + (e.filename ? ' (' + String(e.filename).split('/').pop() + ':' + e.lineno + ')' : ''));
  });
  window.addEventListener('unhandledrejection', function(e){
    remember('Promise: ' + ((e.reason && e.reason.message) || e.reason));
  });

  function show(reason){
    var box = document.getElementById('introFail'), msg = document.getElementById('introFailMsg');
    if(!box || !msg) return;
    var text = reason || 'The app is taking longer than expected to start.';
    if(window.__versionMismatch) text += ' The app files on this device are out of sync (different versions) — "Reset app cache & reload" fixes that.';
    else if(lastError && text.indexOf(lastError) === -1) text += ' Details: ' + lastError;
    msg.textContent = text;
    box.style.display = 'block';
  }
  window.__bootFail = show;

  function reset(){
    var jobs = [];
    try{ if(window.caches && caches.keys) jobs.push(caches.keys().then(function(ks){ return Promise.all(ks.map(function(k){ return caches.delete(k); })); })); }catch(e){}
    try{ if(navigator.serviceWorker && navigator.serviceWorker.getRegistrations) jobs.push(navigator.serviceWorker.getRegistrations().then(function(rs){ return Promise.all(rs.map(function(r){ return r.unregister(); })); })); }catch(e){}
    var go = function(){ location.replace(location.pathname + '?r=' + Date.now() + (location.hash || '')); };
    Promise.all(jobs).then(go, go);
  }
  function wire(){
    var r = document.getElementById('introFailReload'), x = document.getElementById('introFailReset');
    if(r) r.addEventListener('click', function(e){ e.stopPropagation(); location.reload(); });
    if(x) x.addEventListener('click', function(e){ e.stopPropagation(); reset(); });
    // tidy the cache-busting parameter off the address bar once we're up
    try{ if(/[?&]r=\d+/.test(location.search)) history.replaceState(null, '', location.pathname + location.hash); }catch(e){}
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire); else wire();

  window.setTimeout(function(){
    var ls = document.getElementById('loadingScreen');
    if(!ls) return;
    var gone = ls.style.display === 'none' || ls.classList.contains('leaving');
    if(!gone) show();
  }, window.__BOOT_WATCHDOG_MS || 14000);
})();
