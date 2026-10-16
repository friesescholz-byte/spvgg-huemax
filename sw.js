// SpVgg HüMax Live-Ticker Service Worker v2
// Enables native system push & local notifications on Android and modern desktop/mobile devices

const CACHE_NAME = 'huemax-ticker-v2';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// 1. Listen for local message from main thread or background worker
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        const { title, options } = event.data;
        self.registration.showNotification(title, options);
    }
});

// 2. Listen for Server-Sent Web Push events (VAPID / Cloudflare Worker Push)
self.addEventListener('push', (event) => {
    let payload = { title: 'SpVgg HüMax Tor-Alarm', body: 'Neues Ereignis im Live-Ticker!' };
    try {
        if (event.data) {
            payload = event.data.json();
        }
    } catch(e) {
        if (event.data) payload.body = event.data.text();
    }

    event.waitUntil(
        self.registration.showNotification(payload.title || 'SpVgg HüMax Live-Ticker', {
            body: payload.body || 'Neues Tor oder Spielereignis!',
            icon: 'logo.png',
            badge: 'logo.png',
            vibrate: [200, 100, 200, 100, 400],
            data: { url: payload.url || '/liveticker.html' },
            requireInteraction: true
        })
    );
});

// 3. Handle user clicking on a notification
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const targetUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : '/liveticker.html';

    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // If already open, focus the tab
            for (const client of clientList) {
                if (client.url.includes('liveticker.html') && 'focus' in client) {
                    return client.focus();
                }
            }
            // Otherwise open a new window
            if (self.clients.openWindow) {
                return self.clients.openWindow(targetUrl);
            }
        })
    );
});
