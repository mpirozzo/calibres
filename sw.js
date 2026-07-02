const CACHE='calibres-v46';
const ASSETS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).then(resp=>{const cp=resp.clone();caches.open(CACHE).then(c=>c.put('./index.html',cp));return resp;}).catch(()=>caches.match('./index.html').then(r=>r||caches.match('./'))));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(r=> r || fetch(e.request).then(resp=>{
      const cp=resp.clone(); caches.open(CACHE).then(c=>c.put(e.request,cp)); return resp;
    }).catch(()=> caches.match('./index.html')))
  );
});