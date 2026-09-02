(function() {
    const body = document.body;
    const pre = document.getElementById('preloader');
    const counter = document.getElementById('counter');
    const letters = document.querySelectorAll('#heroTitle span');

    let n = 0;

    function count() {
        n += (100 - n) * .12;
        if (n > 99.3) n = 100;
        counter.textContent = Math.round(n) + '%';
        if (n < 100) {
            requestAnimationFrame(count);
        } else {
            reveal();
        }
    }

    function reveal() {
        if (window.gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            gsap.to(pre, {
                opacity: 0,
                duration: .65,
                delay: .15,
                onComplete: () => pre.remove()
            });
            gsap.fromTo(letters, { y: 70, opacity: 0, filter: 'blur(16px)', rotateX: -35 }, {
                y: 0,
                opacity: 1,
                filter: 'blur(0)',
                rotateX: 0,
                duration: .8,
                stagger: .055,
                ease: 'power4.out',
                delay: .25,
                onComplete: () => letters.forEach(x => {
                    x.style.opacity = 1;
                    x.style.filter = 'none';
                    x.style.transform = 'none';
                })
            });
            gsap.fromTo('.hero-kicker,.hero-copy,.hero-scroll', { y: 24, opacity: 0 }, {
                y: 0,
                opacity: 1,
                duration: .7,
                stagger: .1,
                ease: 'power3.out',
                delay: .75
            });
        } else {
            pre.remove();
            letters.forEach(x => x.style.opacity = 1);
        }
        body.classList.remove('lock');

        // Инициализируем анимации только если GSAP загружен
        if (window.gsap && window.ScrollTrigger) {
            if (typeof initAnimations === 'function') {
                initAnimations();
            }
        }
    }

    // Запускаем загрузку
    requestAnimationFrame(count);
})();