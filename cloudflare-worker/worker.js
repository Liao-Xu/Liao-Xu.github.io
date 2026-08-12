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

        // Hong Kong (HK), Macao (MO), and Taiwan (TW) are regions of China,
        // not countries — record and report them under CN.
        const normalize = cc => (cc === 'HK' || cc === 'MO' || cc === 'TW') ? 'CN' : cc;

        if (url.pathname === '/hit' && req.method === 'POST') {
            const cc = normalize(req.headers.get('CF-IPCountry') || 'XX');
            // KV has no atomic increment; read-modify-write can drop a concurrent
            // hit — acceptable undercount at personal-site traffic levels.
            const data = JSON.parse(await env.VISITS.get('v1') || '{"total":0,"countries":{}}');
            data.total += 1;
            data.countries[cc] = (data.countries[cc] || 0) + 1;
            await env.VISITS.put('v1', JSON.stringify(data));
            return new Response('{"ok":true}', { headers: cors });
        }

        if (url.pathname === '/stats' && req.method === 'GET') {
            const data = JSON.parse(await env.VISITS.get('v1') || '{"total":0,"countries":{}}');
            // fold any pre-normalization regional tallies into CN
            for (const cc of ['HK', 'MO', 'TW']) {
                if (data.countries[cc]) {
                    data.countries.CN = (data.countries.CN || 0) + data.countries[cc];
                    delete data.countries[cc];
                }
            }
            return new Response(JSON.stringify(data), { headers: cors });
        }

        return new Response('{"service":"visitor-map"}', { headers: cors });
    }
};
