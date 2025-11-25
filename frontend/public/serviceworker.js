self.addEventListener("install", event => {
    console.log("Service worker installed");
});
self.addEventListener("activate", event => {
    console.log("Service worker activated");
});

const API_HOST = 'localhost:3000';

self.addEventListener("fetch", event => {
    const url = new URL(event.request.url);
    const isApiRequest = url.host === API_HOST || url.origin === self.location.origin;

    if (event.request.method !== 'GET' || !isApiRequest) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(response => {
                const copy = response.clone();
                caches.open('api-cache').then(cache => cache.put(event.request, copy));
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});
