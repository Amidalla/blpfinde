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

import LazyLoad from "vanilla-lazyload";
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css';
import { Pagination, Navigation, Autoplay, Thumbs, EffectFade } from 'swiper/modules';
import IMask from 'imask';

import { initSearch } from "./search.js";
import { initAllVideos } from "./video.js";
import { initNewsTabs } from "./tabs.js";
import { SlidersInit } from "./sliders.js";
import ScrollAnimator from "./scrollAnimator.js";
import CircleAnimator from "./circleAnimator.js";
import ArrowBallAnimator from "./arrow-ball-animator.js";
import ArrowPathAnimator from "./arrow-path-animator.js";
import tabletArrowAnimator from "./tabletArrowAnimator.js";

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
                        lazy: false
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
                }).catch(() => {});
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

        init() {
                this.initCore();
                this.initModules();
                this.initAnimations();
                this.initEventListeners();
                this.initTabletAnimator();
        },

        initCore() {
                SlidersInit();
                initNewsTabs();
                initPhoneMasks();
                initSearch();
                initAllVideos();
                this.lazyLoad.update();
        },

        initModules() {
                this.scrollAnimator = new ScrollAnimator();

                setTimeout(() => {
                        try {
                                this.circleAnimator = new CircleAnimator();
                                this.circleAnimator.init();
                        } catch (error) {}
                }, 200);

                setTimeout(() => {
                        try {
                                this.arrowBallAnimator = new ArrowBallAnimator();
                                this.arrowBallAnimator.init();
                                window.arrowBallAnimator = this.arrowBallAnimator;
                        } catch (error) {}
                }, 300);

                setTimeout(() => {
                        try {
                                this.arrowPathAnimator = new ArrowPathAnimator();
                                this.arrowPathAnimator.init();
                        } catch (error) {}
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
                                        console.log('Tablet animator init error:', error);
                                }
                        }, 600);
                }
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
                                } catch (error) {}
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
                                } catch (error) {}
                        }
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
        SlidersInit,
        App
};

if (import.meta.hot) {
        import.meta.hot.accept();
}