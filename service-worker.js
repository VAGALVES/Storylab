const CACHE='storylab-static-v4';
const FILES=['./','./index.html','./style.css','./app.js','./data.js','./manifest.webmanifest','./assets/icon.svg','./assets/skyline.svg','./atlas-data.js','./atlas-engine.js','./atlas-recorder.js','./atlas-audio-ui.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{if(resp.ok){const c=resp.clone();caches.open(CACHE).then(cache=>cache.put(e.request,c))}return resp})))})
