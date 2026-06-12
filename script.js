// ===================== Theme handling =====================
// (initial data-theme is set by the inline script in <head> to avoid a flash)
const THEME_KEY = 'theme';

function applyThemeIcon(theme) {
    const icon = document.querySelector('.theme-toggle i');
    if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;
    applyThemeIcon(document.documentElement.getAttribute('data-theme') || 'light');

    toggle.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.classList.add('theme-switching');
        toggle.classList.add('flipping');
        setTimeout(() => {
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem(THEME_KEY, next);
            applyThemeIcon(next);
            toggle.classList.remove('flipping');
        }, 220);
        setTimeout(() => document.documentElement.classList.remove('theme-switching'), 800);
    });
});

// ===================== Mobile navigation =====================
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');

    const bars = navToggle.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        if (navMenu.classList.contains('active')) {
            if (index === 0) bar.style.transform = 'rotate(45deg) translate(6px, 6px)';
            if (index === 1) bar.style.opacity = '0';
            if (index === 2) bar.style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            bar.style.transform = 'none';
            bar.style.opacity = '1';
        }
    });
});

const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const bars = navToggle.querySelectorAll('.bar');
        bars.forEach(bar => {
            bar.style.transform = 'none';
            bar.style.opacity = '1';
        });
    });
});

// ===================== Navbar state + back-to-top =====================
const navbar = document.querySelector('.navbar');
const backToTop = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 600);
}, { passive: true });

if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===================== Scroll spy (active nav link) =====================
const spy = new IntersectionObserver((entries) => {
    const visible = entries.filter(e => e.isIntersecting);
    if (!visible.length) return;
    const best = visible.reduce((a, b) => (b.intersectionRatio > a.intersectionRatio ? b : a));
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + best.target.id);
    });
}, { rootMargin: '-40% 0px -55% 0px' });

document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));

// ===================== Scroll-reveal with stagger =====================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.addEventListener('DOMContentLoaded', () => {
    if (prefersReducedMotion) return;

    document.querySelectorAll('.section-header').forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // Stagger siblings within each card group
    const groups = ['.featured-grid', '.publication-list', '.talks-content', '.awards-list', '.contact-info'];
    groups.forEach(sel => {
        document.querySelectorAll(sel).forEach(group => {
            Array.from(group.children).forEach((el, i) => {
                el.classList.add('reveal');
                el.style.setProperty('--reveal-delay', Math.min(i * 70, 420) + 'ms');
                revealObserver.observe(el);
            });
        });
    });
});

// ===================== Profile photo 3D tilt =====================
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.image-container');
    if (!container || prefersReducedMotion) return;
    if (!window.matchMedia('(hover: hover)').matches) return;

    let targetX = 0, targetY = 0, currentX = 0, currentY = 0, rafId = null;

    function animate() {
        currentX += (targetX - currentX) * 0.12;
        currentY += (targetY - currentY) * 0.12;
        container.style.transform = `perspective(700px) rotateX(${currentY}deg) rotateY(${currentX}deg)`;
        if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
            rafId = requestAnimationFrame(animate);
        } else {
            rafId = null;
        }
    }

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        targetX = x * 14;
        targetY = -y * 14;
        if (!rafId) rafId = requestAnimationFrame(animate);
    });

    container.addEventListener('mouseleave', () => {
        targetX = 0;
        targetY = 0;
        if (!rafId) rafId = requestAnimationFrame(animate);
    });
});

// ===================== Copy email =====================
document.addEventListener('DOMContentLoaded', () => {
    const emailLink = document.querySelector('a[href^="mailto:"]');
    if (emailLink) {
        emailLink.addEventListener('click', (e) => {
            e.preventDefault();
            const email = emailLink.textContent;

            if (navigator.clipboard) {
                navigator.clipboard.writeText(email).then(() => {
                    showNotification('Email copied to clipboard!');
                }).catch(() => {
                    window.location.href = emailLink.href;
                });
            } else {
                window.location.href = emailLink.href;
            }
        });
    }
});

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: var(--shadow-lg);
        z-index: 1001;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===================== Cosmic Aurora starfield (dark mode only) =====================
(function initCosmos() {
    const canvas = document.getElementById('cosmos');
    if (!canvas || prefersReducedMotion) return;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let w = 0, h = 0, running = true;
    const pointer = { x: -9999, y: -9999 };
    const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        // Dense field: ~3x v2. Capped so huge monitors stay smooth.
        const count = Math.min(420, Math.floor(w * h / 4800));
        stars = Array.from({ length: count }, () => {
            const violet = Math.random() < 0.22;
            return {
                x: Math.random() * w,
                y: Math.random() * h,
                r: 0.4 + Math.random() * 1.5,
                vx: (Math.random() - 0.5) * 0.14,
                vy: (Math.random() - 0.5) * 0.14,
                tw: Math.random() * Math.PI * 2,
                tws: 0.004 + Math.random() * 0.014,
                hue: violet ? '167, 139, 250' : '185, 220, 255'
            };
        });
    }

    function frame() {
        if (!running) return;
        ctx.clearRect(0, 0, w, h);
        if (isDark()) {
            for (const s of stars) {
                s.x += s.vx; s.y += s.vy; s.tw += s.tws;
                const dx = s.x - pointer.x, dy = s.y - pointer.y;
                const d2 = dx * dx + dy * dy;
                if (d2 < 14000) {
                    const d = Math.sqrt(d2) || 1;
                    s.x += (dx / d) * 0.7;
                    s.y += (dy / d) * 0.7;
                }
                if (s.x < -5) s.x = w + 5; if (s.x > w + 5) s.x = -5;
                if (s.y < -5) s.y = h + 5; if (s.y > h + 5) s.y = -5;
                const alpha = 0.28 + 0.52 * (0.5 + 0.5 * Math.sin(s.tw));
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${s.hue}, ${alpha})`;
                ctx.fill();
            }
        }
        requestAnimationFrame(frame);
    }

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', e => { pointer.x = e.clientX; pointer.y = e.clientY; }, { passive: true });
    document.addEventListener('visibilitychange', () => {
        running = !document.hidden;
        if (running) requestAnimationFrame(frame);
    });

    resize();
    requestAnimationFrame(frame);
})();

// ===================== Cursor glow (dark mode only) =====================
(function initCursorGlow() {
    const glow = document.querySelector('.cursor-glow');
    if (!glow || prefersReducedMotion) return;
    if (!window.matchMedia('(hover: hover)').matches) { glow.style.display = 'none'; return; }

    let tx = innerWidth / 2, ty = innerHeight / 3, cx = tx, cy = ty, raf = null;

    function step() {
        cx += (tx - cx) * 0.08;
        cy += (ty - cy) * 0.08;
        glow.style.transform = `translate(${cx - 280}px, ${cy - 280}px)`;
        if (Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5) {
            raf = requestAnimationFrame(step);
        } else {
            raf = null;
        }
    }

    window.addEventListener('pointermove', e => {
        tx = e.clientX; ty = e.clientY;
        if (!raf) raf = requestAnimationFrame(step);
    }, { passive: true });

    step();
})();

// ===================== Background music (YouTube embed) =====================
// "Smooth" — Santana ft. Rob Thomas (lyric video by 7clouds Rock, lyrics
// rendered in the video itself). Served via YouTube's IFrame API; never
// autoplays (browser policy + courtesy) — it starts on the visitor's click.
(function initMusic() {
    const toggle = document.querySelector('.music-toggle');
    const card = document.getElementById('musicPlayer');
    const closeBtn = document.querySelector('.music-close');
    if (!toggle || !card) return;

    const VIDEO_ID = 'vU1qMMvTQ6Q';
    let player = null;
    let apiLoading = false;
    let wantPlay = false; // user intent while the API/player is still loading

    function setPlaying(on) {
        toggle.classList.toggle('playing', on);
        card.classList.toggle('playing', on);
        toggle.setAttribute('aria-pressed', on ? 'true' : 'false');
        toggle.setAttribute('aria-label', on ? 'Pause music' : 'Play music');
    }

    function openCard() {
        card.classList.add('open');
        card.setAttribute('aria-hidden', 'false');
    }

    function closeCard() {
        card.classList.remove('open');
        card.setAttribute('aria-hidden', 'true');
    }

    function loadAPI() {
        if (apiLoading || window.YT) return;
        apiLoading = true;
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
    }

    function createPlayer() {
        player = new YT.Player('ytplayer', {
            videoId: VIDEO_ID,
            playerVars: {
                autoplay: 0,
                loop: 1,
                playlist: VIDEO_ID, // required for single-video loop
                rel: 0,
                modestbranding: 1,
                playsinline: 1
            },
            events: {
                onReady: (e) => {
                    e.target.setVolume(45);
                    if (wantPlay) e.target.playVideo();
                },
                onStateChange: (e) => {
                    if (e.data === YT.PlayerState.PLAYING) setPlaying(true);
                    else if (e.data === YT.PlayerState.PAUSED) setPlaying(false);
                    else if (e.data === YT.PlayerState.ENDED) e.target.playVideo(); // belt-and-suspenders loop
                }
            }
        });
    }

    // The IFrame API calls this global once it has loaded.
    window.onYouTubeIframeAPIReady = createPlayer;

    toggle.addEventListener('click', () => {
        // First interaction: load API + show card; player plays on ready.
        if (!player) {
            wantPlay = true;
            openCard();
            setPlaying(true); // optimistic; corrected by onStateChange
            loadAPI();
            return;
        }
        const state = player.getPlayerState ? player.getPlayerState() : -1;
        if (state === YT.PlayerState.PLAYING) {
            player.pauseVideo();
        } else {
            openCard();
            player.playVideo();
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (player && player.pauseVideo) player.pauseVideo();
            setPlaying(false);
            closeCard();
        });
    }

    // Theater mode: enlarge the card so the video's synced captions are readable.
    const expandBtn = document.querySelector('.music-expand');
    if (expandBtn) {
        expandBtn.addEventListener('click', () => {
            const on = card.classList.toggle('expanded');
            expandBtn.setAttribute('aria-label', on ? 'Shrink player' : 'Expand player');
            const icon = expandBtn.querySelector('i');
            if (icon) icon.className = on ? 'fas fa-compress' : 'fas fa-expand';
        });
    }
})();

// ===================== Featured cards open their paper =====================
// Clicking anywhere on a featured-research card opens that card's paper link;
// the inner links (Paper, Software) keep their own behavior.
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.featured-card').forEach(card => {
        const paper = card.querySelector('.publication-links a');
        if (!paper) return;
        card.addEventListener('click', (e) => {
            if (e.target.closest('a')) return;
            window.open(paper.href, '_blank', 'noopener');
        });
    });
});
