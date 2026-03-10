import "../styles/reset.scss";
import "../styles/styles.scss";
import "../styles/header.scss";
import "../styles/footer.scss";
import "../styles/home.scss";
import "../styles/news-tabs.scss";
import "../styles/scroll-animations.scss";
import "../styles/circle-animation.scss";
import "../styles/arrow-ball.scss";
import "../styles/arrow-path.scss";
import "../styles/about-product.scss";
import "../styles/about.scss";
import "../styles/questions.scss";
import "../styles/cases.scss";
import "../styles/news.scss";
import "../styles/news-detail.scss";
import "../styles/article.scss";
import "../styles/article-detail.scss";
import "../styles/consultants.scss";
import "../styles/access-materials.scss";
import "../styles/policy.scss";
import "../styles/error.scss";
import "../styles/reviews.scss";
import "../styles/contacts.scss";
import "../styles/modals.scss";
import "../styles/custom-fancybox.scss"

import LazyLoad from "vanilla-lazyload";
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css';
import {Pagination, Navigation, Autoplay, Thumbs, EffectFade} from 'swiper/modules';
import IMask from 'imask';
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import {Fancybox} from "@fancyapps/ui";

import {initSearch} from "./search.js";
import {initAllVideos} from "./video.js";
import {initNewsTabs} from "./tabs.js";
import {initPolicyNavigation} from "./policy.js";
import {SlidersInit} from "./sliders.js";
import ScrollAnimator from "./scrollAnimator.js";
import CircleAnimator from "./circleAnimator.js";
import ArrowBallAnimator from "./arrow-ball-animator.js";
import ArrowPathAnimator from "./arrow-path-animator.js";
import tabletArrowAnimator from "./tabletArrowAnimator.js";
import Accordion from "./accordion.js";
import { initMobileMenu, initModals } from "./modals.js";
import FormValidator from "./formValidator.js";

Swiper.use([Pagination, Navigation, Autoplay, Thumbs, EffectFade]);

const lazyLoadInstance = new LazyLoad({
    elements_selector: ".lazy",
    use_native: true
});

function initPhoneMasks() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        IMask(input, {
            mask: '+{7} (000) 000-00-00',
            lazy: false,
            placeholderChar: '_'
        });
    });
}

function initAnimation() {
    const svgContainers = document.querySelectorAll('.benefit .svg-animation-container');
    svgContainers.forEach((container) => {
        import("./animation.js").then(module => {
            const Animation = module.default;
            const animation = new Animation(container);
            if (!animation.isMobileView) {
                animation.setupScrollObserver();
            }
        }).catch(() => {
        });
    });
}

function addAnimationClasses() {
    document.querySelectorAll('section:not(.no-animation)').forEach((section, index) => {
        if (!section.classList.contains('fade-up') &&
            !section.classList.contains('scale-in') &&
            !section.classList.contains('fade-down')) {
            if (index % 2 === 0) {
                section.classList.add('fade-up');
            } else {
                section.classList.add('scale-in');
            }
        }
    });

    document.querySelectorAll('.section-title, h2, h3').forEach((title) => {
        if (!title.classList.contains('fade-up-delay')) {
            title.classList.add('fade-up-delay');
        }
    });

    document.querySelectorAll('.card, .service-card, .service-item, .portfolio-item, .benefit-card, .team-card').forEach((card, index) => {
        if (!card.classList.contains('fade-up') && !card.classList.contains('scale-in')) {
            if (index % 3 === 0) {
                card.classList.add('fade-up');
            } else {
                card.classList.add('scale-in');
            }
        }
    });

    document.querySelectorAll('.btn, .button, button:not(.no-animation)').forEach((button) => {
        if (!button.classList.contains('scale-in')) {
            button.classList.add('scale-in');
        }
    });
}

const App = {
    lazyLoad: lazyLoadInstance,
    swipers: [],
    circleAnimator: null,
    scrollAnimator: null,
    arrowBallAnimator: null,
    arrowPathAnimator: null,
    tabletArrowAnimator: null,
    accordion: null,
    videosInitialized: false,
    mobileMenuInitialized: false,
    formValidator: null, // ДОБАВЛЕНО



    init() {
        this.initCore();
        this.initModules();
        this.initAnimations();
        this.initEventListeners();
        this.initTabletAnimator();
        this.initAccordion();
        this.initMobileMenu();
        initModals();
        this.initFormValidation(); // ДОБАВЛЕНО: инициализация валидации форм
    },

    // ДОБАВЛЕНО: новый метод для инициализации валидации форм
    initFormValidation() {
        setTimeout(() => {
            try {
                this.formValidator = new FormValidator();
            } catch (error) {
                console.warn('Form validation initialization failed:', error);
            }
        }, 200);
    },

    initMobileMenu() {
        if (!this.mobileMenuInitialized) {
            setTimeout(() => {
                try {
                    initMobileMenu();
                    this.mobileMenuInitialized = true;
                } catch (e) {
                    console.warn('Mobile menu initialization failed:', e);
                }
            }, 100);
        }
    },

    initCore() {

        try {
            SlidersInit();
        } catch (e) {
        }

        try {
            initNewsTabs();
        } catch (e) {
        }

        try {
            initPolicyNavigation();
        } catch (e) {
        }

        try {
            initPhoneMasks();
        } catch (e) {
        }

        try {
            initSearch();
        } catch (e) {
        }


        window.Fancybox = Fancybox;


        if (!this.videosInitialized) {
            setTimeout(() => {
                try {
                    initAllVideos();
                    this.videosInitialized = true;
                } catch (e) {
                }
            }, 500);
        }


        try {
            Fancybox.bind('[data-fancybox="certificates"]', {
                groupAll: true,
                type: "inline",
                Images: {
                    initialSize: "fit",
                    zoom: true,
                    pan: true,
                },
                wheel: "zoom",
                click: "toggleZoom",
                Toolbar: false,
                Thumbs: false,
                Carousel: {
                    Navigation: {
                        prevTpl: '<button class="f-button is-prev" title="Назад"></button>',
                        nextTpl: '<button class="f-button is-next" title="Вперед"></button>',
                    },
                },
                on: {
                    init: (fancybox) => {
                        setTimeout(() => {
                            const slides = fancybox.carousel?.slides;
                            if (slides) {
                                slides.forEach((slide, index) => {
                                    const originalItem = document.querySelectorAll('.property__item')[index];
                                    const expandedItem = document.getElementById(`property${index + 1}-content`);
                                    if (originalItem && expandedItem) {
                                        originalItem.classList.forEach(className => {
                                            if (!className.includes('lazy') && !expandedItem.classList.contains(className)) {
                                                expandedItem.classList.add(className);
                                            }
                                        });
                                    }
                                });
                            }
                        }, 100);
                    }
                }
            });
        } catch (e) {
        }


        try {
            Fancybox.bind('[data-fancybox="certificates-gallery"]', {
                groupAll: true,
                type: "inline",
                Images: {
                    initialSize: "fit",
                    zoom: true,
                    pan: true,
                },
                wheel: "zoom",
                click: "toggleZoom",
                Toolbar: false,
                Thumbs: false,
                Carousel: {
                    Navigation: {
                        prevTpl: '<button class="f-button is-prev" title="Назад"></button>',
                        nextTpl: '<button class="f-button is-next" title="Вперед"></button>',
                    },
                },
                on: {
                    init: (fancybox) => {
                        setTimeout(() => {
                            const slides = fancybox.carousel?.slides;
                            if (slides) {
                                slides.forEach((slide, index) => {
                                    const originalItem = document.querySelectorAll('.certificates__list .certificates__item')[index];
                                    const expandedItem = document.getElementById(`certificate${index + 1}-content`);
                                    if (originalItem && expandedItem) {
                                        originalItem.classList.forEach(className => {
                                            if (!className.includes('lazy') && !expandedItem.classList.contains(className)) {
                                                expandedItem.classList.add(className);
                                            }
                                        });
                                    }
                                });
                            }
                        }, 100);
                    }
                }
            });
        } catch (e) {
        }


        try {
            Fancybox.bind('[data-fancybox="available-certificates"]', {
                groupAll: true,
                type: "inline",
                Images: {
                    initialSize: "fit",
                    zoom: true,
                    pan: true,
                },
                wheel: "zoom",
                click: "toggleZoom",
                Toolbar: false,
                Thumbs: false,
                Carousel: {
                    Navigation: {
                        prevTpl: '<button class="f-button is-prev" title="Назад"></button>',
                        nextTpl: '<button class="f-button is-next" title="Вперед"></button>',
                    },
                },
                on: {
                    init: (fancybox) => {
                        setTimeout(() => {
                            const slides = fancybox.carousel?.slides;
                            if (slides) {
                                slides.forEach((slide, index) => {
                                    const originalItem = document.querySelectorAll('.available-certificates .certificates__item')[index];
                                    const expandedItem = document.getElementById(`available-certificate${index + 1}-content`);
                                    if (originalItem && expandedItem) {
                                        originalItem.classList.forEach(className => {
                                            if (!className.includes('lazy') && !expandedItem.classList.contains(className)) {
                                                expandedItem.classList.add(className);
                                            }
                                        });
                                    }
                                });
                            }
                        }, 100);
                    }
                }
            });
        } catch (e) {
        }


        try {
            Fancybox.bind('[data-fancybox="reviews"]', {
                groupAll: true,
                type: "inline",
                Images: {
                    initialSize: "fit",
                    zoom: true,
                    pan: true,
                },
                wheel: "zoom",
                click: false,
                Toolbar: false,
                Thumbs: false,
                Carousel: {
                    Navigation: {
                        prevTpl: '<button class="f-button is-prev" title="Назад"></button>',
                        nextTpl: '<button class="f-button is-next" title="Вперед"></button>',
                    },
                },
                on: {
                    init: (fancybox) => {
                        setTimeout(() => {
                            const slides = fancybox.carousel?.slides;
                            if (slides) {
                                slides.forEach((slide, index) => {
                                    const originalItem = document.querySelectorAll('.all-reviews__item')[index];
                                    const expandedItem = document.getElementById(`review${index + 1}-content`);
                                    if (originalItem && expandedItem) {
                                        originalItem.classList.forEach(className => {
                                            if (!className.includes('lazy') && !expandedItem.classList.contains(className)) {
                                                expandedItem.classList.add(className);
                                            }
                                        });
                                    }
                                });
                            }
                        }, 100);
                    },
                    "Carousel.change": (fancybox, carousel, page, prevPage) => {
                        document.querySelectorAll('video').forEach(video => {
                            if (!video.paused) {
                                video.pause();
                            }
                        });
                    },
                    close: () => {
                        document.querySelectorAll('video').forEach(video => {
                            if (!video.paused) {
                                video.pause();
                            }
                        });
                    }
                }
            });
        } catch (e) {
        }


        try {
            this.lazyLoad.update();
        } catch (e) {
        }

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && node.querySelector?.('.media-element')) {
                            if (!this.videosInitialized) {
                                setTimeout(() => {
                                    initAllVideos();
                                    this.videosInitialized = true;
                                }, 100);
                            }
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    },

    initVideosInFancybox() {
        const videos = document.querySelectorAll('.fancybox__container video');
        if (!videos.length) return;

        videos.forEach(video => {
            if (!video.hasAttribute('controls')) {
                video.setAttribute('controls', '');
            }
            if (!video.hasAttribute('playsinline')) {
                video.setAttribute('playsinline', '');
            }
            video.style.pointerEvents = 'auto';


            if (video.readyState === 0) {
                video.load();
            }
        });
    },

    addCustomCloseButton() {
        this.removeCustomCloseButton();

        const container = document.querySelector('.fancybox__container');
        if (!container) return;

        const closeBtn = document.createElement('button');
        closeBtn.className = 'custom-fancybox-close';
        closeBtn.setAttribute('aria-label', 'Закрыть');
        closeBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            Fancybox.close();
        };

        container.appendChild(closeBtn);
    },

    removeCustomCloseButton() {
        const existingBtn = document.querySelector('.custom-fancybox-close');
        if (existingBtn) {
            existingBtn.remove();
        }
    },

    initModules() {
        this.scrollAnimator = new ScrollAnimator();

        setTimeout(() => {
            try {
                this.circleAnimator = new CircleAnimator();
                this.circleAnimator.init();
            } catch (error) {
            }
        }, 200);

        setTimeout(() => {
            try {
                this.arrowBallAnimator = new ArrowBallAnimator();
                this.arrowBallAnimator.init();
                window.arrowBallAnimator = this.arrowBallAnimator;
            } catch (error) {
            }
        }, 300);

        setTimeout(() => {
            try {
                this.arrowPathAnimator = new ArrowPathAnimator();
                this.arrowPathAnimator.init();
            } catch (error) {
            }
        }, 400);
    },

    initTabletAnimator() {
        if (window.innerWidth <= 1230) {
            setTimeout(() => {
                try {
                    this.tabletArrowAnimator = new tabletArrowAnimator();
                    this.tabletArrowAnimator.init();
                    window.tabletArrowAnimator = this.tabletArrowAnimator;
                } catch (error) {
                }
            }, 600);
        }
    },

    initAccordion() {
        setTimeout(() => {
            try {
                this.accordion = new Accordion('.questions-accordion .accordion');

                setTimeout(() => {
                    if (this.accordion) {
                        const icons = document.querySelectorAll('.icon-plus svg, .icon-minus svg');
                        if (icons.length > 0) {
                            this.accordion.fixSvgIds();
                        }
                    }
                }, 200);
            } catch (error) {
            }
        }, 300);
    },

    initAnimations() {
        initAnimation();
        addAnimationClasses();
    },

    initEventListeners() {
        window.addEventListener('load', () => {
            this.lazyLoad.update();
            this.updateSwipers();

            if (this.circleAnimator) {
                this.circleAnimator.init();
            }
            if (this.arrowBallAnimator) {
                this.arrowBallAnimator.handleResize();
            }
            if (this.arrowPathAnimator) {
                this.arrowPathAnimator.handleResize();
            }
        });

        window.addEventListener('resize', () => {
            this.updateSwipers();

            const isTablet = window.innerWidth <= 1230;

            if (isTablet && !this.tabletArrowAnimator) {
                try {
                    this.tabletArrowAnimator = new tabletArrowAnimator();
                    this.tabletArrowAnimator.init();
                    window.tabletArrowAnimator = this.tabletArrowAnimator;
                } catch (error) {
                }
            } else if (!isTablet && this.tabletArrowAnimator) {
                if (this.tabletArrowAnimator.destroy) {
                    this.tabletArrowAnimator.destroy();
                }
                this.tabletArrowAnimator = null;
                delete window.tabletArrowAnimator;
            }

            if (this.circleAnimator) {
                this.circleAnimator.handleResize();
            }
            if (this.arrowBallAnimator) {
                this.arrowBallAnimator.handleResize();
            }
            if (this.arrowPathAnimator) {
                this.arrowPathAnimator.handleResize();
            }
        });

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    ticking = false;
                });
                ticking = true;
            }
        });
    },

    updateSwipers() {
        const swipers = document.querySelectorAll('.swiper');
        swipers.forEach(swiperEl => {
            if (swiperEl.swiper) {
                swiperEl.swiper.update();
            }
        });
    },

    refresh() {
        this.lazyLoad.update();
        this.updateSwipers();

        if (this.circleAnimator) {
            this.circleAnimator.init();
            this.circleAnimator.handleResize();
        }
        if (this.arrowBallAnimator) {
            this.arrowBallAnimator.handleResize();
        }
        if (this.arrowPathAnimator) {
            this.arrowPathAnimator.handleResize();
        }
        if (this.tabletArrowAnimator) {
            this.tabletArrowAnimator.destroy();
            this.tabletArrowAnimator = null;
            if (window.innerWidth <= 1230) {
                try {
                    this.tabletArrowAnimator = new tabletArrowAnimator();
                    this.tabletArrowAnimator.init();
                    window.tabletArrowAnimator = this.tabletArrowAnimator;
                } catch (error) {
                }
            }
        }
        if (this.accordion) {
            this.accordion.refresh();
        }
    },

    destroy() {
        if (this.circleAnimator) {
            this.circleAnimator.destroy();
        }
        if (this.arrowBallAnimator) {
            this.arrowBallAnimator.destroy();
        }
        if (this.arrowPathAnimator) {
            this.arrowPathAnimator.destroy();
        }
        if (this.tabletArrowAnimator) {
            this.tabletArrowAnimator.destroy();
        }
        if (this.accordion) {
            this.accordion.destroy();
        }

        delete window.arrowBallAnimator;
        delete window.tabletArrowAnimator;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

window.AppInstance = App;

export {
    lazyLoadInstance,
    initPhoneMasks,
    initAnimation,
    initSearch,
    initAllVideos,
    initNewsTabs,
    initPolicyNavigation,
    SlidersInit,
    App
};

if (import.meta.hot) {
    import.meta.hot.accept();
}