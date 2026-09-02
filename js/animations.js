(function loadSectionBackgrounds(){
    document.querySelectorAll('[data-bg]').forEach((section) => {
        const n = section.getAttribute('data-bg');
        section.style.setProperty('--section-bg', `url("../assets/images/back${n}.png")`);
    });
})();

function initAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    gsap.registerPlugin(ScrollTrigger);
    gsap.config({ force3D: true });
    gsap.defaults({ overwrite: 'auto' });

    // Hero: subtle parallax / scale
    gsap.to('#heroTitle', {
        scale: .82,
        y: -70,
        opacity: .72,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2
        }
    });

    // Every diagonal section rises over the previous section
    gsap.utils.toArray('.diag-section').forEach((section) => {
        gsap.fromTo(section, { y: 80, opacity: .9 }, {
            y: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top 95%',
                end: 'top 50%',
                scrub: 1.4
            }
        });
        gsap.fromTo(section.querySelectorAll('.section-content'), { y: 45 }, {
            y: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'top 45%',
                scrub: 1.4
            }
        });
    });

    // Large heading drifts horizontally while scrolling
    gsap.utils.toArray(
        '.section-heading,.posts-head h2,.theory-core h2,.discord h2,.roadmap-head h2,.final h2'
    ).forEach((el, i) => {
        gsap.fromTo(el, { x: i % 2 ? 45 : -45 }, {
            x: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: el,
                start: 'top 92%',
                end: 'top 45%',
                scrub: 1.4
            }
        });
    });

    // Cards arrive with depth — softer, silkier entrance
    gsap.utils.toArray('.signal-card,.post,.step').forEach((el, i) => {
        gsap.fromTo(el, { y: 70, opacity: 0, rotateX: 8 }, {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1.1,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                toggleActions: 'play none none reverse'
            },
            delay: i * .05
        });
    });

    // Diagonal edge reacts slightly to scroll (custom property animation)
    gsap.utils.toArray('.diag-section').forEach((section) => {
        gsap.fromTo(section, { '--edgeShift': '0px' }, {
            '--edgeShift': '18px',
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.4
            }
        });
    });

    initCardFan();
    initPostTilt();
    initCompareSliders();

    ScrollTrigger.refresh();
}

// Signal cards fan out on hover of the stack, like a hand of cards
function initCardFan() {
    if (!window.gsap) return;

    const stack = document.querySelector('.signal-stack');
    if (!stack) return;

    const cards = stack.querySelectorAll('.signal-card');
    if (!cards.length) return;

    const mid = (cards.length - 1) / 2;

    stack.addEventListener('mouseenter', () => {
        gsap.to(cards, {
            x: (i) => (i - mid) * 25,
            rotation: (i) => (i - mid) * 8,
            duration: .5,
            ease: 'back.out(1.4)'
        });
    });

    stack.addEventListener('mouseleave', () => {
        gsap.to(cards, {
            x: 0,
            rotation: 0,
            duration: .5,
            ease: 'power3.out'
        });
    });
}

// Posts tilt in 3D toward the cursor, like the image now sits inside them
function initPostTilt() {
    if (!window.gsap) return;

    document.querySelectorAll('.post').forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            gsap.to(card, {
                rotateY: x * 25,
                rotateX: -y * 25,
                duration: .3,
                transformPerspective: 600,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateY: 0,
                rotateX: 0,
                duration: .6,
                ease: 'power3.out'
            });
        });
    });
}

// Before/after style comparison sliders — supports any number of them on the page
function initCompareSliders() {
    if (!window.gsap) return;

    document.querySelectorAll('.compare-slider').forEach((container) => {
        const before = container.querySelector('.compare-before');
        const handle = container.querySelector('.compare-handle');
        if (!before || !handle) return;

        const move = (clientX) => {
            const rect = container.getBoundingClientRect();
            let x = (clientX - rect.left) / rect.width;
            x = Math.min(1, Math.max(0, x));
            gsap.to(handle, { left: x * 100 + '%', duration: .1 });
            gsap.to(before, {
                clipPath: `inset(0 ${(1 - x) * 100}% 0 0)`,
                duration: .1
            });
        };

        container.addEventListener('mousemove', (e) => move(e.clientX));
        container.addEventListener('touchmove', (e) => {
            if (e.touches[0]) move(e.touches[0].clientX);
        }, { passive: true });
    });
}
