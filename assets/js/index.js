/**
 * Ghost Photo Theme — JavaScript
 */

import '../css/index.css';

/* --------------------------------------------------------------------------
   Theme Toggle (Dark/Light)
   -------------------------------------------------------------------------- */

function initThemeToggle() {
    const toggle = document.querySelector('.photo-theme-toggle');
    if (!toggle) return;

    const getPreferred = () => {
        const saved = localStorage.getItem('photo-theme');
        if (saved) return saved;
        const setting = document.body.dataset.defaultTheme || 'dark';
        if (setting === 'auto') {
            return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
        }
        return setting;
    };

    const apply = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        toggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
        const sunIcon = toggle.querySelector('.icon-sun');
        const moonIcon = toggle.querySelector('.icon-moon');
        if (sunIcon && moonIcon) {
            sunIcon.style.display = theme === 'dark' ? 'none' : 'block';
            moonIcon.style.display = theme === 'dark' ? 'block' : 'none';
        }
    };

    apply(getPreferred());

    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        localStorage.setItem('photo-theme', next);
        apply(next);
    });
}

/* --------------------------------------------------------------------------
   Header Scroll Effect
   -------------------------------------------------------------------------- */

function initHeaderScroll() {
    const header = document.querySelector('.photo-header');
    if (!header || header.classList.contains('photo-header--minimal') || header.classList.contains('photo-header--full')) return;

    let ticking = false;
    const onScroll = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                header.classList.toggle('photo-header--scrolled', window.scrollY > 50);
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* --------------------------------------------------------------------------
   Mobile Menu
   -------------------------------------------------------------------------- */

function initMobileMenu() {
    const toggle = document.querySelector('.photo-menu-toggle');
    const nav = document.querySelector('.photo-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('is-open');
        toggle.classList.toggle('is-active', isOpen);
        toggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('is-open');
            toggle.classList.remove('is-active');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
}

/* --------------------------------------------------------------------------
   Scroll Reveal Animations
   -------------------------------------------------------------------------- */

function initScrollReveal() {
    if (document.body.dataset.animations === 'false') return;

    const targets = document.querySelectorAll('.photo-reveal, .photo-reveal-scale, .photo-reveal-fade, .photo-stagger');
    if (!targets.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        targets.forEach(el => el.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    targets.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   Lightbox
   -------------------------------------------------------------------------- */

function initLightbox() {
    if (document.body.dataset.lightbox === 'false') return;

    const lightbox = document.querySelector('.photo-lightbox');
    if (!lightbox) return;

    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('.photo-lightbox-caption');
    const prevBtn = lightbox.querySelector('.photo-lightbox-prev');
    const nextBtn = lightbox.querySelector('.photo-lightbox-next');

    let images = [];
    let currentIndex = 0;

    // Collect all zoomable images
    const collectImages = () => {
        images = [];
        document.querySelectorAll('.photo-post-content img, .kg-gallery-image img, .photo-card-image img').forEach(img => {
            if (img.closest('.photo-lightbox')) return;
            images.push({
                src: img.src,
                alt: img.alt || '',
                caption: img.closest('figure')?.querySelector('figcaption')?.textContent || ''
            });
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', (e) => {
                e.preventDefault();
                currentIndex = images.findIndex(i => i.src === img.src);
                openLightbox();
            });
        });
    };

    const openLightbox = () => {
        const data = images[currentIndex];
        if (!data) return;
        lightboxImg.src = data.src;
        lightboxImg.alt = data.alt;
        if (lightboxCaption) {
            lightboxCaption.textContent = data.caption;
            lightboxCaption.style.display = data.caption ? '' : 'none';
        }
        lightbox.classList.add('is-active');
        document.body.style.overflow = 'hidden';
        updateNav();
    };

    const closeLightbox = () => {
        lightbox.classList.remove('is-active');
        document.body.style.overflow = '';
    };

    const showPrev = () => {
        if (currentIndex > 0) {
            currentIndex--;
            openLightbox();
        }
    };

    const showNext = () => {
        if (currentIndex < images.length - 1) {
            currentIndex++;
            openLightbox();
        }
    };

    const updateNav = () => {
        if (prevBtn) prevBtn.style.display = currentIndex > 0 ? '' : 'none';
        if (nextBtn) nextBtn.style.display = currentIndex < images.length - 1 ? '' : 'none';
    };

    // Close on backdrop click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Close button
    lightbox.querySelector('.photo-lightbox-close')?.addEventListener('click', closeLightbox);

    // Navigation
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });

    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('is-active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });

    collectImages();
}

/* --------------------------------------------------------------------------
   Search Shortcut (Cmd/Ctrl+K)
   -------------------------------------------------------------------------- */

function initSearchShortcut() {
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('.gh-search-icon, [data-ghost-search]');
            if (searchInput) searchInput.click();
        }
    });
}

/* --------------------------------------------------------------------------
   Parallax Hero (subtle)
   -------------------------------------------------------------------------- */

function initParallax() {
    const hero = document.querySelector('.photo-hero-image img, .photo-post-hero img');
    if (!hero) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                const rate = scrolled * 0.3;
                hero.style.transform = `translateY(${rate}px) scale(1.05)`;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

/* --------------------------------------------------------------------------
   Image lazy loading fallback
   -------------------------------------------------------------------------- */

function initLazyImages() {
    // Native lazy loading for browsers that support it
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        if ('loading' in HTMLImageElement.prototype) return;
        // Fallback IntersectionObserver for older browsers
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    if (image.dataset.src) {
                        image.src = image.dataset.src;
                    }
                    observer.unobserve(image);
                }
            });
        });
        observer.observe(img);
    });
}

/* --------------------------------------------------------------------------
   Initialize
   -------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initHeaderScroll();
    initMobileMenu();
    initScrollReveal();
    initLightbox();
    initSearchShortcut();
    initParallax();
    initLazyImages();
});
