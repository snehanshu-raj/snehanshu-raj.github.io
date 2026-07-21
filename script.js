/* ============================================================
   Snehanshu Raj · Portfolio interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initScrollProgress();
    initScrollSpy();
    initReveal();
    initCounters();
    initRoleTyping();
    initProjectFilters();
});

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Navbar background on scroll ---------- */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- Mobile menu ---------- */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    if (!hamburger || !navMenu) return;

    const toggle = (open) => {
        const isOpen = open ?? !navMenu.classList.contains('active');
        navMenu.classList.toggle('active', isOpen);
        hamburger.classList.toggle('active', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    hamburger.addEventListener('click', () => toggle());
    navMenu.querySelectorAll('.nav-link').forEach(link =>
        link.addEventListener('click', () => toggle(false))
    );
}

/* ---------- Scroll progress bar ---------- */
function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    const update = () => {
        const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
}

/* ---------- Active section highlighting ---------- */
function initScrollSpy() {
    const links = Array.from(document.querySelectorAll('.nav-link'));
    const map = new Map();
    links.forEach(link => {
        const id = link.getAttribute('href').slice(1);
        const section = document.getElementById(id);
        if (section) map.set(section, link);
    });
    if (!map.size) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                links.forEach(l => l.classList.remove('active'));
                const link = map.get(entry.target);
                if (link) link.classList.add('active');
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    map.forEach((_, section) => observer.observe(section));
}

/* ---------- Reveal on scroll ---------- */
function initReveal() {
    const targets = document.querySelectorAll(
        '.section-head, .highlight-item, .skill-category, .timeline-item, .project-card, .education-card, .hobby-banner, .contact-card, .about-visual, .about-text > *'
    );
    if (prefersReduced) { targets.forEach(t => t.classList.add('visible')); return; }

    targets.forEach((t, i) => {
        t.classList.add('reveal');
        t.style.transitionDelay = Math.min((i % 6) * 60, 320) + 'ms';
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(t => observer.observe(t));
}

/* ---------- Animated counters ---------- */
function initCounters() {
    const counters = document.querySelectorAll('.hero-stat-num');
    if (!counters.length) return;

    const run = (el) => {
        const target = parseFloat(el.dataset.target);
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1400;
        const start = performance.now();

        const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const val = target * eased;
            el.textContent = val.toFixed(decimals) + (p === 1 ? suffix : '');
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = target.toFixed(decimals) + suffix;
        };
        requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                run(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

/* ---------- Hero role typing ---------- */
function initRoleTyping() {
    const el = document.getElementById('roleTyped');
    if (!el) return;

    const roles = [
        'Production Agentic AI Engineer',
        'Multi-Agent & A2A Systems Builder',
        'Machine Learning Engineer',
        'RAG & LLM Specialist',
        'Backend & Systems Engineer'
    ];

    if (prefersReduced) { el.textContent = roles[0]; return; }

    let roleIdx = 0, charIdx = 0, deleting = false;

    const type = () => {
        const current = roles[roleIdx];
        charIdx += deleting ? -1 : 1;
        el.textContent = current.slice(0, charIdx);

        let delay = deleting ? 45 : 85;
        if (!deleting && charIdx === current.length) {
            delay = 1800;
            deleting = true;
        } else if (deleting && charIdx === 0) {
            deleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            delay = 400;
        }
        setTimeout(type, delay);
    };
    setTimeout(type, 600);
}

/* ---------- Project filtering ---------- */
function initProjectFilters() {
    const filterWrap = document.getElementById('projectFilters');
    const cards = Array.from(document.querySelectorAll('.project-card'));
    if (!filterWrap || !cards.length) return;

    filterWrap.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;

        filterWrap.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        cards.forEach(card => {
            const cats = (card.dataset.category || '').split(' ');
            const show = filter === 'all' || cats.includes(filter);
            card.classList.toggle('hide', !show);
        });
    });
}
