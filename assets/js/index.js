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
   Image Protection (prevent right-click / drag)
   -------------------------------------------------------------------------- */

function initImageProtection() {
    if (document.body.dataset.imageProtection === 'false') return;

    document.addEventListener('contextmenu', (e) => {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
        }
    });

    document.addEventListener('dragstart', (e) => {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
        }
    });
}

/* --------------------------------------------------------------------------
   Before/After Comparison Slider
   -------------------------------------------------------------------------- */

function initComparisonSliders() {
    document.querySelectorAll('.photo-compare').forEach(container => {
        const slider = container.querySelector('.photo-compare-slider');
        const beforeImg = container.querySelector('.photo-compare-before');
        if (!slider || !beforeImg) return;

        let isDragging = false;

        const updatePosition = (x) => {
            const rect = container.getBoundingClientRect();
            let pos = ((x - rect.left) / rect.width) * 100;
            pos = Math.max(0, Math.min(100, pos));
            beforeImg.style.clipPath = `inset(0 ${100 - pos}% 0 0)`;
            slider.style.left = `${pos}%`;
        };

        // Set initial position at 50%
        beforeImg.style.clipPath = 'inset(0 50% 0 0)';
        slider.style.left = '50%';

        const onStart = (e) => {
            isDragging = true;
            container.classList.add('is-dragging');
            e.preventDefault();
        };

        const onMove = (e) => {
            if (!isDragging) return;
            const x = e.touches ? e.touches[0].clientX : e.clientX;
            updatePosition(x);
        };

        const onEnd = () => {
            isDragging = false;
            container.classList.remove('is-dragging');
        };

        slider.addEventListener('mousedown', onStart);
        slider.addEventListener('touchstart', onStart, { passive: false });
        window.addEventListener('mousemove', onMove);
        window.addEventListener('touchmove', onMove, { passive: true });
        window.addEventListener('mouseup', onEnd);
        window.addEventListener('touchend', onEnd);

        // Click anywhere to move slider
        container.addEventListener('click', (e) => {
            if (e.target === slider) return;
            updatePosition(e.clientX);
        });
    });
}

/* --------------------------------------------------------------------------
   Slideshow / Carousel
   -------------------------------------------------------------------------- */

function initSlideshows() {
    document.querySelectorAll('.photo-slideshow').forEach(slideshow => {
        const slides = slideshow.querySelectorAll('.photo-slide');
        const prevBtn = slideshow.querySelector('.photo-slideshow-prev');
        const nextBtn = slideshow.querySelector('.photo-slideshow-next');
        const counter = slideshow.querySelector('.photo-slideshow-counter');
        const autoplay = slideshow.dataset.autoplay !== 'false';
        const interval = parseInt(slideshow.dataset.interval || '5000', 10);

        if (slides.length === 0) return;

        let current = 0;
        let timer = null;

        const show = (index) => {
            slides.forEach((s, i) => {
                s.classList.toggle('is-active', i === index);
            });
            if (counter) {
                counter.textContent = `${index + 1} / ${slides.length}`;
            }
            current = index;
        };

        const next = () => show((current + 1) % slides.length);
        const prev = () => show((current - 1 + slides.length) % slides.length);

        const startAutoplay = () => {
            if (autoplay && slides.length > 1) {
                timer = setInterval(next, interval);
            }
        };

        const stopAutoplay = () => {
            if (timer) clearInterval(timer);
        };

        if (prevBtn) prevBtn.addEventListener('click', () => { stopAutoplay(); prev(); startAutoplay(); });
        if (nextBtn) nextBtn.addEventListener('click', () => { stopAutoplay(); next(); startAutoplay(); });

        // Keyboard navigation when focused
        slideshow.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { stopAutoplay(); prev(); startAutoplay(); }
            if (e.key === 'ArrowRight') { stopAutoplay(); next(); startAutoplay(); }
        });

        // Pause on hover
        slideshow.addEventListener('mouseenter', stopAutoplay);
        slideshow.addEventListener('mouseleave', startAutoplay);

        // Touch swipe
        let touchStartX = 0;
        slideshow.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            stopAutoplay();
        }, { passive: true });

        slideshow.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) next(); else prev();
            }
            startAutoplay();
        }, { passive: true });

        show(0);
        startAutoplay();
    });
}

/* --------------------------------------------------------------------------
   Booking CTA (persistent floating button)
   -------------------------------------------------------------------------- */

function initBookingCTA() {
    const btn = document.querySelector('.photo-booking-cta');
    if (!btn) return;

    // Show after scrolling past hero
    let ticking = false;
    const onScroll = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                btn.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.5);
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
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
    initImageProtection();
    initComparisonSliders();
    initSlideshows();
    initBookingCTA();
});
