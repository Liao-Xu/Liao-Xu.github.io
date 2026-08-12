// Cosmic visitor map — self-hosted dot-matrix world map.
// Land bitmap + country centroids are baked from public-domain Natural Earth
// boundaries (via world.geo.json). Counts come from the Cloudflare Worker in
// cloudflare-worker/; an empty WORKER_URL renders the map without counts.
(function () {
    const WORKER_URL = 'https://visitor-map.liao-xu.workers.dev';
    const MAP = {"W":100,"H":50,"b64":"AAAAAIADAAAAAAAAAAAA+Pf/AwAAAAEAAAAAhMz/H0ABAAAAAAAAgPjA/wAAYMAfsAAAgF8e+A8AAKH+Pw4A/99SBn8A+ID6////9///Y/kowP//////D/7/HwwDAPf///////D9/3AgAHj9////nwEM/g8eABDm////HwQAwP/3AwCS/////2AAAPz/PwCg/////z8CAID//wQA/P////8DAADw/w8AwL/u//8PAACA/z8AgKdj//9/AgAA8P8BADD97/9/AwAAAP8fAAAT/P7/LwEAAOD/AADwAf//fwQAAAD8BwCAP/f//w8AAADAhwAA+P/3//8AAAAAcAgAwP///v8HAAAAAIYAAP7/fv6/AAAAAGACAOD/78NzAQAAAAAcAAD+/x0cjwAAAAAABgDg/3+A4AAAAAAAQAYA/P8LCAoAAAAAAPgDwP//gCEQAAAAAAB/ALj/BwBFAAAAAADwDwDgfwBgBgAAAAAA/wAA/wMAdAAAAAAA8H8A4B8AQIADAAAAAP8PAP4BAAhwAAAAAPD/AMAfAAAQAAAAAAD+DwD8AQAAKAAAAADgfwDgnwAA4AIAAAAA/AcA/gwAAH+AAAAAgH8AwE8AAPwHAAAAAPwBAPwEAMD/AAAAAMAPAMAHAAD8HwAAAAD8AAB4AADA/wEAAADABwCAAwAAnA8AAAAAPAAAAAAAAPAAAAAAwAMAAAAAAAAGCAAAAA4AAAAAAABAAAAAAMAAAAAAAAAAAAIAAAAGAAAAAAAAAAAAAABgAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==","centroids":{"GL":[38.2,3],"CA":[22,7.6],"RU":[76.5,7.4],"NO":[53.7,5.3],"US":[18,12.9],"FI":[56.8,6.7],"IS":[44,6],"SE":[54,7.3],"GB":[48.7,10],"LV":[57,9],"DE":[52.4,11.2],"LT":[56,10],"BY":[57.5,10],"KZ":[68,12.2],"NL":[51,11],"PL":[55,11],"UA":[58.1,11.8],"MN":[77.9,12.7],"CN":[78.4,16.2],"FR":[50.4,12.8],"AT":[54,12],"SK":[55,12],"IT":[52.8,14],"HR":[54,13],"RS":[55,13],"RO":[56.5,13],"ES":[48.3,14.9],"ME":[55,14],"BG":[56.5,14],"GE":[61,14],"UZ":[67,14.5],"KG":[70.3,14.3],"JP":[87.7,15.7],"AL":[55,15],"GR":[56,15],"TR":[59.2,15.4],"AM":[62,15],"AZ":[63,15],"TM":[66,15.3],"TJ":[69,15],"KP":[85,15],"TN":[52,16.5],"IR":[64.6,17.6],"AF":[68.3,16.9],"KR":[85,16],"MA":[47.1,18.6],"DZ":[50.4,19.3],"SY":[60,17],"IQ":[61.7,17.3],"IN":[71.6,21],"MX":[21.1,20.5],"LY":[54.7,19.5],"EG":[57.9,19.6],"SA":[61.8,20.3],"PK":[68.4,19.1],"NP":[72.5,19],"MR":[46.2,21.9],"AE":[65,20],"MM":[76.3,22],"CU":[27,21],"ML":[48.6,22.5],"NE":[52,23],"TD":[54.7,23.3],"OM":[65.3,21.3],"BD":[75,21],"VN":[78.7,22.3],"TW":[83,21],"SD":[57.7,23.6],"TH":[77.3,23.7],"LA":[78.5,22.5],"ER":[60.5,23.5],"YE":[62.8,23.3],"PH":[83.5,24.5],"HN":[25,24],"NI":[26,24],"SN":[45.5,24],"BF":[48.7,24.7],"ET":[60.6,25.9],"KH":[79,24],"CR":[26,25],"CO":[29.2,27.6],"VE":[31,26.4],"GN":[46.7,25.3],"BJ":[50,25.5],"NG":[51.7,25.7],"PA":[27.5,26],"GY":[33,27],"SL":[46,26],"CI":[48,26.5],"GH":[49,26.5],"CM":[52.8,27],"CF":[55.5,26.7],"SS":[58,26.5],"SO":[61.8,27.8],"LK":[72,26],"SR":[34,27],"LR":[47,27],"ID":[81.5,29.5],"MY":[79.8,27.5],"BR":[34.8,32.5],"CG":[53.7,29],"CD":[56.1,29.8],"UG":[58.5,28.5],"KE":[59.8,29],"EC":[28,29],"GA":[52.5,29],"PE":[29,32.3],"BI":[58,30],"TZ":[59.2,31.2],"PG":[89.3,30.7],"AO":[54.3,32.7],"ZM":[57.2,33.2],"BO":[31.6,34.8],"MW":[59,33],"MZ":[59.1,34.7],"AU":[87,37.7],"MG":[62.4,35.4],"NA":[54.5,36.2],"ZW":[57.7,35.3],"FJ":[99,35],"PY":[33.5,37],"BW":[56.5,36.5],"CL":[29.4,42.1],"AR":[31.3,40.8],"ZA":[56.6,38.8],"UY":[34,40],"NZ":[98,43],"AQ":[50,55],"TF":[69.3,46.3],"BE":[51.2,11.9],"BS":[28.3,20.6],"BA":[54.9,14.2],"BZ":[25.4,23.4],"BM":[32,18.2],"BN":[81.9,27.7],"BT":[75.1,19.8],"CH":[52.3,13.2],"CY":[59.2,17.3],"CZ":[54.3,12.1],"DJ":[61.8,25.2],"DK":[52.9,9.9],"DO":[30.5,22.8],"EE":[57.1,9.1],"FK":[33.5,47.1],"GM":[45.7,24.7],"GW":[45.8,25.2],"GQ":[52.9,28.7],"GT":[24.9,23.9],"GF":[35.3,28],"HT":[29.7,22.8],"HU":[55.4,13],"IE":[47.8,10.9],"IL":[59.7,18.5],"JM":[28.5,23.1],"JO":[60.3,18.5],"KW":[63.2,19.2],"LB":[60,17.6],"LS":[57.8,39.5],"LU":[51.7,12.1],"MD":[57.9,13.1],"MK":[56,15],"MT":[54,16.9],"NC":[96,36.6],"PR":[31.6,23],"PT":[47.8,15.7],"QA":[64.2,20.6],"RW":[58.3,30],"EH":[46.4,20.9],"SB":[94.3,32.3],"SV":[25.3,24.6],"SI":[54.2,13.4],"SZ":[58.7,38.4],"TG":[50.3,26.4],"TL":[85,32.4],"TT":[32.9,25.7],"VU":[96.5,34.7],"PS":[59.8,18.3]}};

    // micro-states absent from the low-res landmass data
    Object.assign(MAP.centroids, {
        SG: [78.8, 28.8], HK: [81.7, 21.6], MO: [81.5, 21.7], MT: [54.0, 16.9],
        BH: [64.0, 20.3], LU: [51.7, 12.2], AD: [50.4, 14.7], MC: [52.1, 14.2],
        MV: [70.3, 28.2], MU: [66.0, 36.3], BB: [33.5, 24.8], SC: [65.4, 30.9]
    });

    const canvas = document.getElementById('visitorMapCanvas');
    const statsEl = document.getElementById('visitorMapStats');
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // unpack land bitmap
    const bytes = atob(MAP.b64);
    const land = [];
    for (let i = 0; i < MAP.W * MAP.H; i++) {
        if (bytes.charCodeAt(i >> 3) & (1 << (i & 7))) land.push([i % MAP.W, Math.floor(i / MAP.W)]);
    }

    let visitors = null; // { total, countries: {US: n, ...} }
    let pulse = 0;

    function colors() {
        const dark = document.documentElement.getAttribute('data-theme') === 'dark';
        return dark
            ? { dot: 'rgba(148, 184, 220, 0.30)', glowA: '56, 189, 248', glowB: '167, 139, 250' }
            : { dot: 'rgba(71, 85, 105, 0.30)', glowA: '2, 132, 199', glowB: '124, 58, 237' };
    }

    function render() {
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const cssW = canvas.clientWidth || 270;
        const cssH = cssW * (MAP.H / MAP.W);
        if (canvas.width !== Math.round(cssW * dpr)) {
            canvas.width = Math.round(cssW * dpr);
            canvas.height = Math.round(cssH * dpr);
        }
        canvas.style.height = cssH + 'px';
        const sx = canvas.width / MAP.W;
        const sy = canvas.height / MAP.H;
        const c = colors();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // base land dots
        ctx.fillStyle = c.dot;
        const r = Math.max(0.8, sx * 0.26);
        for (const [gx, gy] of land) {
            ctx.beginPath();
            ctx.arc((gx + 0.5) * sx, (gy + 0.5) * sy, r, 0, Math.PI * 2);
            ctx.fill();
        }

        // visitor glows
        if (visitors && visitors.countries) {
            const entries = Object.entries(visitors.countries).filter(([cc]) => MAP.centroids[cc]);
            entries.forEach(([cc, count], idx) => {
                const [gx, gy] = MAP.centroids[cc];
                const x = (gx + 0.5) * sx, y = (gy + 0.5) * sy;
                const mag = Math.log2(count + 1);
                const breathe = prefersReducedMotion ? 1 : 0.85 + 0.15 * Math.sin(pulse + idx * 1.7);
                const glowR = (sx * 1.6 + mag * sx * 0.9) * breathe;
                const hue = idx % 2 === 0 ? c.glowA : c.glowB;

                const grad = ctx.createRadialGradient(x, y, 0, x, y, glowR);
                grad.addColorStop(0, `rgba(${hue}, 0.85)`);
                grad.addColorStop(0.4, `rgba(${hue}, 0.35)`);
                grad.addColorStop(1, `rgba(${hue}, 0)`);
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(x, y, glowR, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = `rgba(${hue}, 1)`;
                ctx.beginPath();
                ctx.arc(x, y, Math.max(1.2, sx * 0.32), 0, Math.PI * 2);
                ctx.fill();
            });
        }
    }

    function animate() {
        pulse += 0.04;
        render();
        requestAnimationFrame(animate);
    }

    function showStats() {
        if (!statsEl || !visitors) return;
        const n = Object.keys(visitors.countries || {}).filter(cc => cc !== 'XX').length;
        statsEl.textContent = `${visitors.total.toLocaleString()} visits · ${n} ${n === 1 ? 'region' : 'regions'}`;
    }

    // first paint (map renders even with no backend)
    render();

    // re-render on theme switch and resize
    new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    window.addEventListener('resize', render, { passive: true });

    if (!WORKER_URL || WORKER_URL.indexOf('__') === 0) return;

    // count this visit once per session, then load stats
    // (data-no-hit on the canvas — e.g. the stats page — views without counting)
    const ping = (canvas.dataset.noHit !== undefined || sessionStorage.getItem('vm_hit'))
        ? Promise.resolve()
        : fetch(WORKER_URL + '/hit', { method: 'POST' })
            .then(() => sessionStorage.setItem('vm_hit', '1'))
            .catch(() => {});

    ping
        .then(() => fetch(WORKER_URL + '/stats'))
        .then(r => r.json())
        .then(data => {
            visitors = data;
            showStats();
            if (prefersReducedMotion) render();
            else animate();
        })
        .catch(() => { /* worker unreachable — base map stays, no counts shown */ });
})();
