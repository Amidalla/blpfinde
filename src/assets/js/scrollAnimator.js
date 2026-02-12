import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

class ScrollAnimator {
    constructor() {
        this.isMobileView = window.innerWidth <= 750;
        this.init();
    }

    init() {
        if (this.isMobileView) {
            this.setupMobileAnimation();
        } else {
            this.setupDesktopAnimation();
        }
        this.setupResizeHandler();
    }

    setupDesktopAnimation() {
        this.animateSections();
        this.animateToolsItems();
        this.animateTechnologyItems();
        this.animateDignityItems();
        this.animateModalItems();
        this.animateAboutPoints();
        this.animateClientsMedia();
        this.animateButtons();
        this.animateHeader();
        this.setupTabsButtons();
    }

    setupMobileAnimation() {
        const allButtons = document.querySelectorAll('.btn, .color-btn, .not-color-btn, .hero-btn, .technology__btn, .main-about__btn, .clients__btn, .bid-btn, .submit-btn, .header__btn .color-btn, .footer .color-btn, .download-link');

        allButtons.forEach(btn => {
            btn.style.removeProperty('opacity');
            btn.style.removeProperty('transform');
            btn.style.removeProperty('scale');
            btn.style.removeProperty('translate');
            btn.style.removeProperty('rotate');
            btn.style.removeProperty('animation');
        });

        gsap.set([
            '.hero',
            '.tools__item',
            '.technology__item',
            '.dignity__item',
            '.modal-item',
            '.main-about',
            '.clients',
            '.main-info',
            '.bid',
            '.clients__media',
            '.btn',
            '.color-btn',
            '.not-color-btn',
            '.hero-btn',
            '.technology__btn',
            '.main-about__btn',
            '.clients__btn',
            '.bid-btn',
            '.submit-btn',
            '.header__btn .color-btn',
            '.footer .color-btn',
            '.download-link'
        ], {
            opacity: 1,
            y: 0,
            scale: 1,
            x: 0
        });

        this.setupTabsButtons();
    }

    setupTabsButtons() {
        const tabsButtons = document.querySelectorAll('.news-tabs .btn, .news-tabs .color-btn, .news-tabs .main-info__btn');

        tabsButtons.forEach(button => {
            button.style.removeProperty('opacity');
            button.style.removeProperty('transform');
            button.style.removeProperty('scale');
            button.style.removeProperty('translate');
            button.style.removeProperty('rotate');
            button.style.removeProperty('animation');

            gsap.set(button, {
                opacity: 1,
                scale: 1,
                y: 0
            });
        });
    }

    animateSections() {
        const sections = [
            '.hero',
            '.tools',
            '.technology',
            '.dignity',
            '.main-about',
            '.clients',
            '.main-info',
            '.bid'
        ];

        sections.forEach((selector, index) => {
            const section = document.querySelector(selector);
            if (!section) return;

            gsap.set(section, { opacity: 0, y: 50 });

            ScrollTrigger.create({
                trigger: section,
                start: 'top 85%',
                onEnter: () => {
                    gsap.to(section, {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: 'power2.out',
                        delay: index * 0.1
                    });
                },
                once: true
            });
        });
    }

    animateToolsItems() {
        const items = document.querySelectorAll('.tools__item');
        if (!items.length) return;

        gsap.set(items, {
            opacity: 0,
            y: 60,
            scale: 0.95
        });

        ScrollTrigger.create({
            trigger: '.tools',
            start: 'top 80%',
            onEnter: () => {
                gsap.to(items, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: 'power3.out'
                });
            },
            once: true
        });
    }

    animateTechnologyItems() {
        const items = document.querySelectorAll('.technology__item');
        if (!items.length) return;

        gsap.set(items, {
            opacity: 0,
            y: 80,
            scale: 0.95
        });

        ScrollTrigger.create({
            trigger: '.technology__list',
            start: 'top 80%',
            onEnter: () => {
                gsap.to(items, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.9,
                    stagger: 0.15,
                    ease: 'power3.out',
                    onComplete: () => this.addTechnologyHoverEffects()
                });
                this.animateTechnologyArrows();
            },
            once: true
        });
    }

    animateTechnologyArrows() {
        const arrows = document.querySelectorAll('.technology__item .item-arrow');
        arrows.forEach((arrow, index) => {
            const svg = arrow.querySelector('svg');
            const span = arrow.querySelector('span');

            if (svg) {
                gsap.set(svg, { opacity: 0.7, scale: 0.9 });
                gsap.to(svg, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    delay: 0.3 + index * 0.1,
                    ease: 'back.out(1.2)'
                });
            }

            if (span) {
                gsap.set(span, { opacity: 0, scale: 0.5 });
                gsap.to(span, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.4,
                    delay: 0.4 + index * 0.1,
                    ease: 'back.out(1.2)'
                });
            }
        });
    }

    addTechnologyHoverEffects() {
        const items = document.querySelectorAll('.technology__item');
        items.forEach((item) => {
            item.removeEventListener('mouseenter', this.handleTechMouseEnter);
            item.removeEventListener('mouseleave', this.handleTechMouseLeave);
            item.addEventListener('mouseenter', this.handleTechMouseEnter);
            item.addEventListener('mouseleave', this.handleTechMouseLeave);
        });
    }

    handleTechMouseEnter(event) {
        const item = event.currentTarget;
        const bg = item.querySelector('.item-bg');
        const arrow = item.querySelector('.item-arrow');
        const span = arrow?.querySelector('span');
        const svg = arrow?.querySelector('svg');

        if (bg) {
            gsap.to(bg, {
                y: -8,
                scale: 1.02,
                duration: 0.2,
                ease: 'power2.out',
                boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
                overwrite: true
            });
        }

        if (arrow) {
            gsap.to(arrow, {
                x: 10,
                duration: 0.2,
                ease: 'power2.out',
                overwrite: true
            });
        }

        if (span) {
            gsap.to(span, {
                scale: 1.3,
                color: '#F83E49',
                duration: 0.15,
                ease: 'back.out(1.5)',
                overwrite: true
            });
        }

        if (svg) {
            gsap.to(svg, {
                scale: 1.1,
                duration: 0.15,
                ease: 'power2.out',
                overwrite: true
            });

            const path = svg.querySelector('path');
            if (path) {
                gsap.to(path, {
                    attr: { fill: '#F83E49' },
                    duration: 0.15,
                    ease: 'power2.out',
                    overwrite: true
                });
            }
        }
    }

    handleTechMouseLeave(event) {
        const item = event.currentTarget;
        const bg = item.querySelector('.item-bg');
        const arrow = item.querySelector('.item-arrow');
        const span = arrow?.querySelector('span');
        const svg = arrow?.querySelector('svg');
        const path = svg?.querySelector('path');

        if (bg) {
            gsap.to(bg, {
                y: 0,
                scale: 1,
                duration: 0.2,
                ease: 'power2.out',
                boxShadow: 'none',
                overwrite: true
            });
        }

        if (arrow) {
            gsap.to(arrow, {
                x: 0,
                duration: 0.2,
                ease: 'power2.out',
                overwrite: true
            });
        }

        if (span) {
            gsap.to(span, {
                scale: 1,
                color: '',
                duration: 0.15,
                ease: 'power2.out',
                overwrite: true
            });
        }

        if (svg) {
            gsap.to(svg, {
                scale: 1,
                duration: 0.15,
                ease: 'power2.out',
                overwrite: true
            });
        }

        if (path) {
            gsap.to(path, {
                attr: { fill: '#485F86' },
                duration: 0.15,
                ease: 'power2.out',
                overwrite: true
            });
        }
    }

    animateDignityItems() {
        const items = document.querySelectorAll('.dignity__item');
        if (!items.length) return;

        gsap.set(items, {
            opacity: 0,
            y: 50,
            scale: 0.95
        });

        ScrollTrigger.create({
            trigger: '.dignity',
            start: 'top 80%',
            onEnter: () => {
                gsap.to(items, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.7,
                    stagger: 0.1,
                    ease: 'back.out(1.2)'
                });
            },
            once: true
        });
    }

    animateModalItems() {
        const items = document.querySelectorAll('.modal-item');
        if (!items.length) return;

        gsap.set(items, {
            opacity: 0,
            y: 40,
            scale: 0.9
        });

        ScrollTrigger.create({
            trigger: '.modal-list',
            start: 'top 85%',
            onEnter: () => {
                gsap.to(items, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'back.out(1.2)'
                });
            },
            once: true
        });
    }

    animateAboutPoints() {
        const points = document.querySelectorAll('.main-about__point');
        if (!points.length) return;

        gsap.set(points, {
            opacity: 0,
            y: 40,
            scale: 0.95
        });

        ScrollTrigger.create({
            trigger: '.main-about__list',
            start: 'top 85%',
            onEnter: () => {
                gsap.to(points, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.7,
                    stagger: 0.2,
                    ease: 'power3.out'
                });
            },
            once: true
        });
    }

    animateClientsMedia() {
        const media = document.querySelectorAll('.clients__media');
        if (!media.length) return;

        gsap.set(media, {
            opacity: 0,
            scale: 0.8,
            rotation: -3
        });

        ScrollTrigger.create({
            trigger: '.clients',
            start: 'top 80%',
            onEnter: () => {
                gsap.to(media, {
                    opacity: 1,
                    scale: 1,
                    rotation: 0,
                    duration: 0.8,
                    ease: 'elastic.out(1, 0.4)'
                });
            },
            once: true
        });
    }

    animateHeader() {
        const headerBtn = document.querySelector('.header__btn .color-btn');
        if (!headerBtn) return;

        headerBtn.style.removeProperty('opacity');
        headerBtn.style.removeProperty('transform');
        headerBtn.style.removeProperty('scale');
        headerBtn.style.removeProperty('translate');
        headerBtn.style.removeProperty('rotate');
        headerBtn.style.removeProperty('animation');

        gsap.set(headerBtn, {
            opacity: 0,
            scale: 0.9,
            y: -5
        });

        gsap.to(headerBtn, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            delay: 0.3,
            ease: 'back.out(1.7)'
        });
    }

    animateButtons() {
        const buttons = document.querySelectorAll(
            '.btn, .color-btn, .not-color-btn, .hero-btn, .technology__btn, .main-about__btn, .clients__btn, .bid-btn, .submit-btn, .footer .color-btn, .download-link'
        );

        if (!buttons.length) return;

        const headerBtn = document.querySelector('.header__btn .color-btn');

        const buttonsToAnimate = Array.from(buttons).filter(btn => {
            if (btn === headerBtn) return false;
            if (btn.closest('.news-tabs')) return false;
            if (btn.classList.contains('link-btn')) return false; // Исключаем link-btn
            return true;
        });

        buttonsToAnimate.forEach(btn => {
            btn.style.removeProperty('opacity');
            btn.style.removeProperty('transform');
            btn.style.removeProperty('scale');
            btn.style.removeProperty('translate');
            btn.style.removeProperty('rotate');
            btn.style.removeProperty('animation');
        });

        gsap.set(buttonsToAnimate, {
            opacity: 0,
            scale: 0.9
        });

        ScrollTrigger.batch(buttonsToAnimate, {
            start: 'top 95%',
            onEnter: batch => {
                gsap.to(batch, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'back.out(1.7)',
                    clearProps: 'transform,scale,opacity'
                });
            },
            once: true
        });

        this.addButtonsHoverEffects();
    }

    addButtonsHoverEffects() {
        const allButtons = document.querySelectorAll(
            '.btn, .color-btn, .not-color-btn, .hero-btn, .technology__btn, .main-about__btn, .clients__btn, .bid-btn, .submit-btn, .footer .color-btn, .download-link, .header__btn .color-btn'
        );

        allButtons.forEach(button => {
            if (button.closest('.news-tabs')) {
                button.style.removeProperty('opacity');
                button.style.removeProperty('transform');
                button.style.removeProperty('scale');
                button.style.removeProperty('translate');
                button.style.removeProperty('rotate');
                button.style.removeProperty('animation');

                gsap.set(button, {
                    opacity: 1,
                    scale: 1,
                    y: 0
                });
            }

            button.removeEventListener('mouseenter', this.handleButtonMouseEnter);
            button.removeEventListener('mouseleave', this.handleButtonMouseLeave);
            button.addEventListener('mouseenter', this.handleButtonMouseEnter);
            button.addEventListener('mouseleave', this.handleButtonMouseLeave);
        });
    }

    handleButtonMouseEnter(event) {
        const button = event.currentTarget;

        // Для link-btn - никаких эффектов
        if (button.classList.contains('link-btn')) {
            return;
        }

        gsap.to(button, {
            y: -3,
            duration: 0.15,
            ease: 'power2.out',
            boxShadow: '0 8px 20px rgba(248, 62, 73, 0.3)',
            overwrite: true
        });

        if (button.classList.contains('download-link')) {
            const svg = button.querySelector('svg');

            if (svg) {
                gsap.to(svg, {
                    y: -2,
                    duration: 0.15,
                    ease: 'power2.out',
                    overwrite: true
                });
            }
        }
    }

    handleButtonMouseLeave(event) {
        const button = event.currentTarget;

        // Для link-btn - никаких эффектов
        if (button.classList.contains('link-btn')) {
            return;
        }

        gsap.to(button, {
            y: 0,
            duration: 0.15,
            ease: 'power2.out',
            boxShadow: 'none',
            overwrite: true
        });

        if (button.classList.contains('download-link')) {
            const svg = button.querySelector('svg');

            if (svg) {
                gsap.to(svg, {
                    y: 0,
                    duration: 0.15,
                    ease: 'power2.out',
                    overwrite: true
                });
            }
        }
    }

    setupResizeHandler() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                ScrollTrigger.refresh();
                this.isMobileView = window.innerWidth <= 750;
                if (this.isMobileView) {
                    this.setupMobileAnimation();
                }
            }, 250);
        });
    }

    destroy() {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        gsap.globalTimeline.clear();
    }
}

export default ScrollAnimator;