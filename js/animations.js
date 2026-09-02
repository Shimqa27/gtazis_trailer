(function loadSectionBackgrounds(){
    document.querySelectorAll('[data-bg]').forEach((section) => {
        const n = section.getAttribute('data-bg');
        // Используем абсолютный путь от корня сайта
        section.style.setProperty('--section-bg', `url("/gtazis_trailer/assets/images/back${n}.png")`);
    });
})();
function initAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;
    
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    gsap.registerPlugin(ScrollTrigger);

    // ============================================
    // СНАЧАЛА ПРОВЕРЯЕМ — ЕСТЬ ЛИ ЭЛЕМЕНТЫ
    // ============================================
    
    // 1. Hero — проверяем что элемент существует
    const hero = document.querySelector('.hero');
    if (hero) {
        gsap.to(hero, {
            scale: 1.08,
            y: -120,
            opacity: 0.6,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.5
            }
        });
    }

    // 2. Signal Cards — стопка
    const signalCards = document.querySelectorAll('.signal-card');
    const signalStack = document.querySelector('.signal-stack');
    
    if (signalCards.length && signalStack) {
        function initStack() {
            signalCards.forEach((card, i) => {
                gsap.set(card, {
                    x: 0,
                    y: i * 12,
                    rotation: 0,
                    scale: 1,
                    zIndex: signalCards.length - i,
                    transformOrigin: 'center center'
                });
            });
        }

        function fanOut() {
            signalCards.forEach((card, i) => {
                const center = (signalCards.length - 1) / 2;
                const offset = i - center;
                
                gsap.to(card, {
                    x: offset * 50,
                    y: -Math.abs(offset) * 30,
                    rotation: offset * 12,
                    scale: 0.95,
                    duration: 0.6,
                    ease: 'back.out(1.6)',
                    zIndex: i,
                    transformOrigin: 'center center'
                });
            });
        }

        function fanIn() {
            signalCards.forEach((card, i) => {
                gsap.to(card, {
                    x: 0,
                    y: i * 12,
                    rotation: 0,
                    scale: 1,
                    duration: 0.5,
                    ease: 'power2.out',
                    zIndex: signalCards.length - i,
                    transformOrigin: 'center center'
                });
            });
        }

        signalStack.addEventListener('mouseenter', fanOut);
        signalStack.addEventListener('mouseleave', fanIn);

        // Появление при скролле
        signalCards.forEach((card, i) => {
            gsap.fromTo(card, 
                { 
                    opacity: 0,
                    y: 60 + i * 15,
                    scale: 0.85,
                    rotation: i % 2 === 0 ? 10 : -10
                }, 
                {
                    opacity: 1,
                    y: i * 12,
                    scale: 1,
                    rotation: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    delay: i * 0.1,
                    scrollTrigger: {
                        trigger: '.signal-stack',
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    },
                    onComplete: () => {
                        initStack();
                    }
                }
            );
        });
    }

    // 3. Заголовки — проверяем что они есть
    const headings = document.querySelectorAll('.section-heading, .posts-head h2, .theory-core h2, .discord h2, .roadmap-head h2, .final h2');
    if (headings.length) {
        headings.forEach((el) => {
            const words = el.textContent.trim().split(' ');
            el.innerHTML = words.map(word => 
                `<span style="display:inline-block;opacity:0;transform:translateY(30px) rotateX(20deg);">${word}</span>`
            ).join(' ');
            
            const spans = el.querySelectorAll('span');
            gsap.to(spans, {
                opacity: 1,
                y: 0,
                rotateX: 0,
                duration: 0.8,
                stagger: 0.08,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                    toggleActions: 'play none none reverse'
                }
            });
        });
    }

    // 4. Секции
    const sections = document.querySelectorAll('.diag-section');
    if (sections.length) {
        sections.forEach((section) => {
            const content = section.querySelector('.section-content');
            if (content) {
                gsap.fromTo(section, 
                    { 
                        opacity: 0.4,
                        scale: 0.97,
                        y: 120
                    }, 
                    {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 92%',
                            end: 'top 40%',
                            scrub: 1.2
                        }
                    }
                );
            }
        });
    }

    // 5. Theory Ring — проверяем
    const ring = document.querySelector('.theory-ring');
    if (ring) {
        gsap.to(ring, {
            rotation: 720,
            duration: 30,
            ease: 'none',
            repeat: -1
        });
    }

    ScrollTrigger.refresh();
}
