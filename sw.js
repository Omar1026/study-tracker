// عامل الخدمة: يخزّن ملفات التطبيق للعمل دون اتصال.
// ملاحظة: عند تغيير أي ملف، ارفع رقم CACHE في الأسفل لتفريغ النسخة القديمة.
const CACHE = "study-tracker-v1";

const SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./supabase-config.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
];

const CDN_PREFIXES = ["https://cdn.jsdelivr.net/npm/@supabase/supabase-js"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isKnownCdn = CDN_PREFIXES.some((prefix) => request.url.startsWith(prefix));
  if (!isSameOrigin && !isKnownCdn) return;

  // الشبكة أولًا ثم الكاش؛ عند فقد الاتصال نعود إلى النسخة المخزّنة.
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() =>
        caches.match(request, { ignoreSearch: true }).then((cached) =>
          cached || (request.mode === "navigate" ? caches.match("./index.html") : Response.error())
        )
      )
  );
});
