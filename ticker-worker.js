// SpVgg HüMax Live-Ticker Background Poller Worker
// Runs in a dedicated background thread to prevent browser tab throttling/freezing

let timer = null;
let apiUrl = '';

self.onmessage = function(e) {
    if (!e.data) return;
    if (e.data.type === 'START') {
        apiUrl = e.data.url;
        if (timer) clearInterval(timer);
        poll();
        timer = setInterval(poll, 3000);
    } else if (e.data.type === 'STOP') {
        if (timer) clearInterval(timer);
        timer = null;
    } else if (e.data.type === 'POLL_NOW') {
        poll();
    }
};

async function poll() {
    if (!apiUrl) return;
    try {
        const res = await fetch(apiUrl + '?t=' + Date.now(), { cache: 'no-store' });
        if (res.ok) {
            const data = await res.json();
            self.postMessage({ type: 'TICKER_DATA', data: data });
        }
    } catch(err) {
        // Network temporary error, continue polling
    }
}
