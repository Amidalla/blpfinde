import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

class ScrollAnimator {
    constructor() {
        this.isMobileView = window.innerWidth <= 750;
        this.isHomePage = document.querySelector('main.home-page') !== null;
        this.animationsStarted = false;
        this.downloadLinkAnimation = null;
        this.init();
    }

    setupDesktopAnimation() {
        this.setInitialState();

        if (document.readyState === 'complete') {
            this.delayedStart();
        } else {
            window.addEventListener('load', () => {
                this.delayedStart();
            });
        }
    }

    setInitialState() {
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

        sections.forEach(selector => {
            const section = document.querySelector(selector);
            if (section) {
                gsap.set(section, { opacity: 0, y: 50 });
            }
        });

        gsap.set('.tools__item', { opacity: 0, y: 60 });
        gsap.set('.technology__item', { opacity: 0, y: 80 });
        gsap.set('.dignity__item', { opacity: 0, y: 50 });
        gsap.set('.modal-item', { opacity: 0, y: 40 });
        gsap.set('.main-about__point', { opacity: 0, y: 40 });
        gsap.set('.clients__media', { opacity: 0, scale: 0.8, rotation: -3 });

        const buttons = document.querySelectorAll('.btn, .color-btn, .not-color-btn, .hero-btn, .technology__btn, .main-about__btn, .clients__btn, .bid-btn, .submit-btn, .footer .color-btn, .download-link');
        const headerBtn = document.querySelector('.header__btn .color-btn');

        buttons.forEach(btn => {
            if (btn !== headerBtn && !btn.closest('.news-tabs') && !btn.classList.contains('link-btn')) {
                gsap.set(btn, { opacity: 0 });
            }
        });

        gsap.set(headerBtn, { opacity: 0, y: -5 });
    }

    delayedStart() {
        if (this.animationsStarted) return;
        this.animationsStarted = true;

        setTimeout(() => {
            this.startAnimations();
        }, 200);
    }

    startAnimations() {
        if (this.isMobileView) {
            this.animateMobile();
        } else {
            this.animateDesktop();
        }
        this.animateDownloadLink();
    }

    animateDesktop() {
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

    animateMobile() {

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

            ScrollTrigger.create({
                trigger: section,
                start: 'top 85%',
                onEnter: () => {
                    gsap.to(section, {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: 'none',
                        delay: index * 0.05
                    });
                },
                once: true
            });
        });


        const toolsItems = document.querySelectorAll('.tools__item');
        if (toolsItems.length) {
            ScrollTrigger.create({
                trigger: '.tools',
                start: 'top 80%',
                onEnter: () => {
                    gsap.to(toolsItems, {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.15,
                        ease: 'none'
                    });
                },
                once: true
            });
        }

        const technologyItems = document.querySelectorAll('.technology__item');
        if (technologyItems.length) {
            ScrollTrigger.create({
                trigger: '.technology__list',
                start: 'top 80%',
                onEnter: () => {
                    gsap.to(technologyItems, {
                        opacity: 1,
                        y: 0,
                        duration: 0.9,
                        stagger: 0.1,
                        ease: 'none',
                        onComplete: () => this.addTechnologyHoverEffects()
                    });
                },
                once: true
            });
        }

        const dignityItems = document.querySelectorAll('.dignity__item');
        if (dignityItems.length) {
            ScrollTrigger.create({
                trigger: '.dignity',
                start: 'top 80%',
                onEnter: () => {
                    gsap.to(dignityItems, {
                        opacity: 1,
                        y: 0,
                        duration: 0.7,
                        stagger: 0.08,
                        ease: 'none'
                    });
                },
                once: true
            });
        }

        const modalItems = document.querySelectorAll('.modal-item');
        if (modalItems.length) {
            ScrollTrigger.create({
                trigger: '.modal-list',
                start: 'top 85%',
                onEnter: () => {
                    gsap.to(modalItems, {
                        opacity: 1,
                        y: 0,
                        duration: 0.7,
                        stagger: 0.08,
                        ease: 'none'
                    });
                },
                once: true
            });
        }

        const aboutPoints = document.querySelectorAll('.main-about__point');
        if (aboutPoints.length) {
            ScrollTrigger.create({
                trigger: '.main-about__list',
                start: 'top 85%',
                onEnter: () => {
                    gsap.to(aboutPoints, {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.15,
                        ease: 'none'
                    });
                },
                once: true
            });
        }

        const clientsMedia = document.querySelectorAll('.clients__media');
        if (clientsMedia.length) {
            ScrollTrigger.create({
                trigger: '.clients',
                start: 'top 80%',
                onEnter: () => {
                    gsap.to(clientsMedia, {
                        opacity: 1,
                        scale: 1,
                        rotation: 0,
                        duration: 0.9,
                        ease: 'none'
                    });
                },
                once: true
            });
        }

        const buttons = document.querySelectorAll(
            '.btn, .color-btn, .not-color-btn, .hero-btn, .technology__btn, .main-about__btn, .clients__btn, .bid-btn, .submit-btn, .footer .color-btn, .download-link'
        );

        if (buttons.length) {
            const headerBtn = document.querySelector('.header__btn .color-btn');
            const buttonsToAnimate = Array.from(buttons).filter(btn => {
                if (btn === headerBtn) return false;
                if (btn.closest('.news-tabs')) return false;
                if (btn.classList.contains('link-btn')) return false;
                return true;
            });

            ScrollTrigger.batch(buttonsToAnimate, {
                start: 'top 95%',
                onEnter: batch => {
                    gsap.to(batch, {
                        opacity: 1,
                        duration: 0.6,
                        stagger: 0.05,
                        ease: 'none'
                    });
                },
                once: true
            });
        }


        const headerBtn = document.querySelector('.header__btn .color-btn');
        if (headerBtn) {
            gsap.to(headerBtn, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                delay: 0.2,
                ease: 'none'
            });
        }

        this.setupTabsButtons();
        this.addButtonsHoverEffects();
    }

    init() {
        if (!this.isHomePage) {
            return;
        }

        this.setInitialState();
        this.setupResizeHandler();

        if (document.readyState === 'complete') {
            this.delayedStart();
        } else {
            window.addEventListener('load', () => {
                this.delayedStart();
            });
        }
    }

    setupDesktopAnimation() {

    }

    setupMobileAnimation() {

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

            ScrollTrigger.create({
                trigger: section,
                start: 'top 85%',
                onEnter: () => {
                    gsap.to(section, {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: 'none',
                        delay: index * 0.05
                    });
                },
                once: true
            });
        });
    }

    animateToolsItems() {
        const items = document.querySelectorAll('.tools__item');
        if (!items.length) return;

        ScrollTrigger.create({
            trigger: '.tools',
            start: 'top 80%',
            onEnter: () => {
                gsap.to(items, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'none'
                });
            },
            once: true
        });
    }

    animateTechnologyItems() {
        const items = document.querySelectorAll('.technology__item');
        if (!items.length) return;

        ScrollTrigger.create({
            trigger: '.technology__list',
            start: 'top 80%',
            onEnter: () => {
                gsap.to(items, {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    stagger: 0.1,
                    ease: 'none',
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
                gsap.set(svg, { opacity: 0.7 });
                gsap.to(svg, {
                    opacity: 1,
                    duration: 0.5,
                    delay: 0.2 + index * 0.05,
                    ease: 'none'
                });
            }

            if (span) {
                gsap.set(span, { opacity: 0 });
                gsap.to(span, {
                    opacity: 1,
                    duration: 0.4,
                    delay: 0.25 + index * 0.05,
                    ease: 'none'
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
                duration: 0.15,
                ease: 'power2.out',
                boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
                overwrite: true
            });
        }

        if (arrow) {
            gsap.to(arrow, {
                x: 10,
                duration: 0.15,
                ease: 'power2.out',
                overwrite: true
            });
        }

        if (span) {
            gsap.to(span, {
                scale: 1.3,
                color: '#F83E49',
                duration: 0.1,
                ease: 'back.out(1.5)',
                overwrite: true
            });
        }

        if (svg) {
            gsap.to(svg, {
                scale: 1.1,
                duration: 0.1,
                ease: 'power2.out',
                overwrite: true
            });

            const path = svg.querySelector('path');
            if (path) {
                gsap.to(path, {
                    attr: { fill: '#F83E49' },
                    duration: 0.1,
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
                duration: 0.15,
                ease: 'power2.out',
                boxShadow: 'none',
                overwrite: true
            });
        }

        if (arrow) {
            gsap.to(arrow, {
                x: 0,
                duration: 0.15,
                ease: 'power2.out',
                overwrite: true
            });
        }

        if (span) {
            gsap.to(span, {
                scale: 1,
                color: '',
                duration: 0.1,
                ease: 'power2.out',
                overwrite: true
            });
        }

        if (svg) {
            gsap.to(svg, {
                scale: 1,
                duration: 0.1,
                ease: 'power2.out',
                overwrite: true
            });
        }

        if (path) {
            gsap.to(path, {
                attr: { fill: '#485F86' },
                duration: 0.1,
                ease: 'power2.out',
                overwrite: true
            });
        }
    }

    animateDignityItems() {
        const items = document.querySelectorAll('.dignity__item');
        if (!items.length) return;

        ScrollTrigger.create({
            trigger: '.dignity',
            start: 'top 80%',
            onEnter: () => {
                gsap.to(items, {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    stagger: 0.08,
                    ease: 'none'
                });
            },
            once: true
        });
    }

    animateModalItems() {
        const items = document.querySelectorAll('.modal-item');
        if (!items.length) return;

        ScrollTrigger.create({
            trigger: '.modal-list',
            start: 'top 85%',
            onEnter: () => {
                gsap.to(items, {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    stagger: 0.08,
                    ease: 'none'
                });
            },
            once: true
        });
    }

    animateAboutPoints() {
        const points = document.querySelectorAll('.main-about__point');
        if (!points.length) return;

        ScrollTrigger.create({
            trigger: '.main-about__list',
            start: 'top 85%',
            onEnter: () => {
                gsap.to(points, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'none'
                });
            },
            once: true
        });
    }

    animateClientsMedia() {
        const media = document.querySelectorAll('.clients__media');
        if (!media.length) return;

        ScrollTrigger.create({
            trigger: '.clients',
            start: 'top 80%',
            onEnter: () => {
                gsap.to(media, {
                    opacity: 1,
                    scale: 1,
                    rotation: 0,
                    duration: 0.9,
                    ease: 'none'
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

        gsap.to(headerBtn, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: 0.2,
            ease: 'none'
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
            if (btn.classList.contains('link-btn')) return false;
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

        ScrollTrigger.batch(buttonsToAnimate, {
            start: 'top 95%',
            onEnter: batch => {
                gsap.to(batch, {
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.05,
                    ease: 'none'
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

        if (button.classList.contains('link-btn')) {
            return;
        }

        gsap.to(button, {
            y: -3,
            duration: 0.1,
            ease: 'power2.out',
            boxShadow: '0 8px 20px rgba(43, 47, 66, 0.3)',
            overwrite: true
        });

        if (button.classList.contains('download-link')) {
            const svg = button.querySelector('svg');

            if (svg) {
                gsap.to(svg, {
                    y: -2,
                    duration: 0.1,
                    ease: 'power2.out',
                    overwrite: true
                });
            }
        }
    }

    handleButtonMouseLeave(event) {
        const button = event.currentTarget;

        if (button.classList.contains('link-btn')) {
            return;
        }

        gsap.to(button, {
            y: 0,
            duration: 0.1,
            ease: 'power2.out',
            boxShadow: 'none',
            overwrite: true
        });

        if (button.classList.contains('download-link')) {
            const svg = button.querySelector('svg');

            if (svg) {
                gsap.to(svg, {
                    y: 0,
                    duration: 0.1,
                    ease: 'power2.out',
                    overwrite: true
                });
            }
        }
    }

    animateDownloadLink() {
        const downloadLink = document.querySelector('.download-link');
        if (!downloadLink || this.isMobileView) return;

        this.downloadLinkAnimation = gsap.to(downloadLink, {
            keyframes: [
                { x: 3, y: 0, duration: 0.5, ease: "sine.inOut" },
                { x: 0, y: 3, duration: 0.5, ease: "sine.inOut" },
                { x: -3, y: 0, duration: 0.5, ease: "sine.inOut" },
                { x: 0, y: -3, duration: 0.5, ease: "sine.inOut" },
                { x: 0, y: 0, duration: 0.5, ease: "sine.inOut" }
            ],
            repeat: -1,
            repeatDelay: 0.5
        });

        downloadLink.addEventListener('mouseenter', () => {
            if (this.downloadLinkAnimation) {
                this.downloadLinkAnimation.pause();
            }
        });

        downloadLink.addEventListener('mouseleave', () => {
            if (this.downloadLinkAnimation) {
                this.downloadLinkAnimation.resume();
            }
        });
    }

    setupResizeHandler() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                ScrollTrigger.refresh();
                this.isMobileView = window.innerWidth <= 750;

                if (this.isMobileView && this.downloadLinkAnimation) {
                    this.downloadLinkAnimation.kill();
                    this.downloadLinkAnimation = null;
                } else if (!this.isMobileView && !this.downloadLinkAnimation && this.isHomePage) {
                    this.animateDownloadLink();
                }
            }, 250);
        });
    }

    destroy() {
        if (this.downloadLinkAnimation) {
            this.downloadLinkAnimation.kill();
            this.downloadLinkAnimation = null;
        }

        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        gsap.globalTimeline.clear();
    }
}

export default ScrollAnimator;