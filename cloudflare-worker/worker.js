// Visitor-map backend: counts visits per country for liao-xu.github.io.
// Country comes from Cloudflare's CF-IPCountry header — no IPs are read or stored.
export default {
    async fetch(req, env) {
        const url = new URL(req.url);
        const cors = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Content-Type': 'application/json'
        };

        if (req.method === 'OPTIONS') {
            return new Response(null, { headers: cors });
        }

        if (url.pathname === '/hit' && req.method === 'POST') {
            const cc = req.headers.get('CF-IPCountry') || 'XX';
            // KV has no atomic increment; read-modify-write can drop a concurrent
            // hit — acceptable undercount at personal-site traffic levels.
            const data = JSON.parse(await env.VISITS.get('v1') || '{"total":0,"countries":{}}');
            data.total += 1;
            data.countries[cc] = (data.countries[cc] || 0) + 1;
            await env.VISITS.put('v1', JSON.stringify(data));
            return new Response('{"ok":true}', { headers: cors });
        }

        if (url.pathname === '/stats' && req.method === 'GET') {
            const data = await env.VISITS.get('v1') || '{"total":0,"countries":{}}';
            return new Response(data, { headers: cors });
        }

        return new Response('{"service":"visitor-map"}', { headers: cors });
    }
};
