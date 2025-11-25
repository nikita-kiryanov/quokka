self.addEventListener("install", event => {
    self.skipWaiting();
});
self.addEventListener("activate", event => {
    event.waitUntil(self.clients.claim());
});

const API_HOST = 'localhost:3000';

async function handleFetch(event) {
    try {
        const response = await fetch(event.request);

        if (!response.ok) {
            const cachedResponse = await caches.match(event.request);
            return cachedResponse ?? response;
        }

        const cache = await caches.open('api-cache');

        await cache.put(event.request, response.clone());

        return response;
    } catch (error) {
        const cachedResponse = await caches.match(event.request);

        if (cachedResponse) {
            return cachedResponse;
        }

        return new Response(JSON.stringify({ error: 'offline' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

self.addEventListener("fetch", event => {
    const url = new URL(event.request.url);

    const isApiRequest = (url.host === API_HOST) || (url.origin === self.location.origin);

    if (event.request.method !== 'GET' || !isApiRequest) {
        return;
    }

    event.respondWith(handleFetch(event));
});
