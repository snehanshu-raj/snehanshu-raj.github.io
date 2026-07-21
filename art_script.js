/* ============================================================
   Snehanshu Raj · Art & Craft Gallery interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initNav();
    buildCaptions();
    initReveal();
    initFilters();
    initLightbox();
});

const MEDIUM = {
    sketching: 'Sketch',
    painting: 'Painting',
    doodle: 'Doodle',
    craft: 'Quilling & Craft'
};

const items = () => Array.from(document.querySelectorAll('.art-item'));
const pad = (n) => String(n).padStart(2, '0');

/* ---------- Nav background on scroll ---------- */
function initNav() {
    const nav = document.getElementById('gnav');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- Build hover captions (medium + running number) ---------- */
function buildCaptions() {
    items().forEach((item, i) => {
        const cat = item.dataset.category;
        const medium = MEDIUM[cat] || 'Artwork';
        item.dataset.title = medium;
        item.dataset.no = pad(i + 1);

        const cap = document.createElement('figcaption');
        cap.className = 'art-cap';
        cap.innerHTML = `
            <span class="cap-icon"><i class="fas fa-expand"></i></span>
            <span class="cap-medium">${medium}</span>
            <span class="cap-no">No. ${pad(i + 1)}</span>`;
        item.appendChild(cap);
    });
}

/* ---------- Reveal on scroll ---------- */
function initReveal() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { items().forEach(el => el.classList.add('revealed')); return; }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    items().forEach(el => observer.observe(el));
}

/* ---------- Filters ---------- */
function initFilters() {
    const filters = document.getElementById('filters');
    const emptyNote = document.getElementById('emptyNote');
    if (!filters) return;

    filters.addEventListener('click', (e) => {
        const btn = e.target.closest('.fbtn');
        if (!btn) return;

        filters.querySelectorAll('.fbtn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        let visible = 0;
        items().forEach(item => {
            const show = filter === 'all' || item.dataset.category === filter;
            item.classList.toggle('is-hidden', !show);
            if (show) {
                visible++;
                item.classList.add('revealed');
            }
        });
        if (emptyNote) emptyNote.hidden = visible !== 0;
    });
}

/* ---------- Lightbox ---------- */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lbImg');
    const lbTitle = document.getElementById('lbTitle');
    const lbCounter = document.getElementById('lbCounter');
    const lbClose = document.getElementById('lbClose');
    const lbPrev = document.getElementById('lbPrev');
    const lbNext = document.getElementById('lbNext');
    if (!lightbox) return;

    let pool = [];      // currently visible items
    let pos = 0;

    const visibleItems = () => items().filter(el => !el.classList.contains('is-hidden'));

    const render = () => {
        const item = pool[pos];
        if (!item) return;
        const img = item.querySelector('img');
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        lbTitle.textContent = `${item.dataset.title} · No. ${item.dataset.no}`;
        lbCounter.textContent = `${pad(pos + 1)} / ${pad(pool.length)}`;
    };

    const open = (item) => {
        pool = visibleItems();
        pos = Math.max(0, pool.indexOf(item));
        render();
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const close = () => {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    const nav = (dir) => {
        if (!pool.length) return;
        pos = (pos + dir + pool.length) % pool.length;
        render();
    };

    items().forEach(item => item.addEventListener('click', () => open(item)));

    lbClose.addEventListener('click', close);
    lbPrev.addEventListener('click', () => nav(-1));
    lbNext.addEventListener('click', () => nav(1));
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lb-stage')) close();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowLeft') nav(-1);
        else if (e.key === 'ArrowRight') nav(1);
    });
}
