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

const params = window
    .location
    .search
    .replace('?','')
    .split('&')
    .reduce(
        function(p,e){
            var a = e.split('=');
            p[ decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
            return p;
        },
        {}
    );

if (params?.active_tab) {
    document.querySelectorAll('.cases-tabs__nav .cases-tabs__btn')
        .forEach(el => el.classList.remove('active'));

    document.querySelectorAll('.cases-tabs__pane')
        .forEach(el => el.classList.remove('active'));

    document.querySelector('.cases-tabs__nav .cases-tabs__btn[data-tab=' + params.active_tab + ']')
        .classList.add('active')
    document.querySelector('#' + params.active_tab)
        .classList.add('active')

}

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
    formValidator: null,

    init() {
        this.initCore();
        this.initModules();
        this.initAnimations();
        this.initEventListeners();
        this.initTabletAnimator();
        this.initAccordion();
        this.initMobileMenu();
        initModals();
        this.initFormValidation();
    },

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

        setTimeout(() => {
            try {
                const certificateLinks = document.querySelectorAll('[data-fancybox="certificates"]');

                certificateLinks.forEach((link) => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        const propertyItem = link.closest('.property__item');
                        if (!propertyItem) return;

                        const allItems = Array.from(document.querySelectorAll('.property__item'));
                        const currentIndex = allItems.indexOf(propertyItem);

                        const items = allItems.map((item, i) => {
                            const clone = item.cloneNode(true);

                            clone.removeAttribute('data-fancybox');
                            clone.removeAttribute('data-src');
                            clone.classList.add('property__item--expanded');

                            const closeBtn = document.createElement('button');
                            closeBtn.className = 'custom-fancybox-close scale-in';
                            closeBtn.setAttribute('data-fancybox-close', '');

                            const isMobile = window.matchMedia('(max-width: 768px)').matches;
                            const isSmallMobile = window.matchMedia('(max-width: 480px)').matches;

                            let btnWidth = '44px';
                            let btnHeight = '44px';
                            let svgWidth = '44';
                            let svgHeight = '44';

                            if (isSmallMobile) {
                                btnWidth = '28px';
                                btnHeight = '28px';
                                svgWidth = '28';
                                svgHeight = '28';
                            } else if (isMobile) {
                                btnWidth = '32px';
                                btnHeight = '32px';
                                svgWidth = '32';
                                svgHeight = '32';
                            }

                            closeBtn.style.width = btnWidth;
                            closeBtn.style.height = btnHeight;

                            closeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 44 44" fill="none">
                                <path d="M37.5963 33.224L26.3729 22.0006L37.5963 10.7771C38.808 9.56543 38.808 7.61465 37.5963 6.40293C36.3846 5.19121 34.4338 5.19121 33.2221 6.40293L21.9986 17.6264L10.7752 6.40293C9.56348 5.19121 7.6127 5.19121 6.40098 6.40293C5.18926 7.61465 5.18926 9.56543 6.40098 10.7771L17.6244 22.0006L6.40098 33.224C5.18926 34.4357 5.18926 36.3865 6.40098 37.5982C7.6127 38.81 9.56348 38.81 10.7752 37.5982L21.9986 26.3748L33.2221 37.5982C34.4338 38.81 36.3846 38.81 37.5963 37.5982C38.7994 36.3865 38.7994 34.4272 37.5963 33.224Z" fill="#212529"></path>
                            </svg>`;
                            clone.appendChild(closeBtn);

                            const modalId = 'certificate-property-modal-' + i + '-' + Date.now();
                            clone.id = modalId;

                            const tempDiv = document.createElement('div');
                            tempDiv.style.display = 'none';
                            tempDiv.appendChild(clone);
                            document.body.appendChild(tempDiv);

                            return {
                                src: '#' + modalId,
                                type: 'inline'
                            };
                        });

                        Fancybox.show(items, {
                            startIndex: currentIndex,
                            showClass: "f-fadeIn",
                            hideClass: "f-fadeOut",
                            groupAll: true,
                            infinite: true,
                            transitionEffect: "fade",
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
                                fade: true,
                                Navigation: {
                                    prevTpl: '<button class="f-button is-prev" title="Назад" style="display: flex; align-items: center; justify-content: center; width: 50px; height: 50px; background: rgba(0,0,0,0.5); border-radius: 50%; color: white; font-size: 24px; position: absolute; left: 20px; top: 50%; transform: translateY(-50%); z-index: 1000; cursor: pointer; border: none;">‹</button>',
                                    nextTpl: '<button class="f-button is-next" title="Вперед" style="display: flex; align-items: center; justify-content: center; width: 50px; height: 50px; background: rgba(0,0,0,0.5); border-radius: 50%; color: white; font-size: 24px; position: absolute; right: 20px; top: 50%; transform: translateY(-50%); z-index: 1000; cursor: pointer; border: none;">›</button>',
                                },
                            },
                            on: {
                                close: () => {
                                    document.querySelectorAll('[id^="certificate-property-modal-"]').forEach(el => {
                                        const parent = el.parentNode;
                                        if (parent && parent.parentNode) {
                                            parent.parentNode.removeChild(parent);
                                        }
                                    });
                                }
                            }
                        });
                    });
                });

                const galleryLinks = document.querySelectorAll('[data-fancybox="certificates-gallery"]');

                galleryLinks.forEach((link) => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        const certificateItem = link.closest('.certificates__item');
                        if (!certificateItem) return;

                        const allItems = Array.from(document.querySelectorAll('.certificates__list .certificates__item'));
                        const currentIndex = allItems.indexOf(certificateItem);

                        const items = allItems.map((item, i) => {
                            const clone = item.cloneNode(true);

                            clone.removeAttribute('data-fancybox');
                            clone.removeAttribute('data-src');
                            clone.classList.add('certificates__item--expanded');

                            const closeBtn = document.createElement('button');
                            closeBtn.className = 'custom-fancybox-close scale-in';
                            closeBtn.setAttribute('data-fancybox-close', '');

                            const isMobile = window.matchMedia('(max-width: 768px)').matches;
                            const isSmallMobile = window.matchMedia('(max-width: 480px)').matches;

                            let btnWidth = '44px';
                            let btnHeight = '44px';
                            let svgWidth = '44';
                            let svgHeight = '44';

                            if (isSmallMobile) {
                                btnWidth = '28px';
                                btnHeight = '28px';
                                svgWidth = '28';
                                svgHeight = '28';
                            } else if (isMobile) {
                                btnWidth = '32px';
                                btnHeight = '32px';
                                svgWidth = '32';
                                svgHeight = '32';
                            }

                            closeBtn.style.width = btnWidth;
                            closeBtn.style.height = btnHeight;

                            closeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 44 44" fill="none">
                                <path d="M37.5963 33.224L26.3729 22.0006L37.5963 10.7771C38.808 9.56543 38.808 7.61465 37.5963 6.40293C36.3846 5.19121 34.4338 5.19121 33.2221 6.40293L21.9986 17.6264L10.7752 6.40293C9.56348 5.19121 7.6127 5.19121 6.40098 6.40293C5.18926 7.61465 5.18926 9.56543 6.40098 10.7771L17.6244 22.0006L6.40098 33.224C5.18926 34.4357 5.18926 36.3865 6.40098 37.5982C7.6127 38.81 9.56348 38.81 10.7752 37.5982L21.9986 26.3748L33.2221 37.5982C34.4338 38.81 36.3846 38.81 37.5963 37.5982C38.7994 36.3865 38.7994 34.4272 37.5963 33.224Z" fill="#212529"></path>
                            </svg>`;
                            clone.appendChild(closeBtn);

                            const modalId = 'certificate-gallery-modal-' + i + '-' + Date.now();
                            clone.id = modalId;

                            const tempDiv = document.createElement('div');
                            tempDiv.style.display = 'none';
                            tempDiv.appendChild(clone);
                            document.body.appendChild(tempDiv);

                            return {
                                src: '#' + modalId,
                                type: 'inline'
                            };
                        });

                        Fancybox.show(items, {
                            startIndex: currentIndex,
                            showClass: "f-fadeIn",
                            hideClass: "f-fadeOut",
                            groupAll: true,
                            infinite: true,
                            transitionEffect: "fade",
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
                                fade: true,
                                Navigation: {
                                    prevTpl: '<button class="f-button is-prev" title="Назад" style="display: flex; align-items: center; justify-content: center; width: 50px; height: 50px; background: rgba(0,0,0,0.5); border-radius: 50%; color: white; font-size: 24px; position: absolute; left: 20px; top: 50%; transform: translateY(-50%); z-index: 1000; cursor: pointer; border: none;">‹</button>',
                                    nextTpl: '<button class="f-button is-next" title="Вперед" style="display: flex; align-items: center; justify-content: center; width: 50px; height: 50px; background: rgba(0,0,0,0.5); border-radius: 50%; color: white; font-size: 24px; position: absolute; right: 20px; top: 50%; transform: translateY(-50%); z-index: 1000; cursor: pointer; border: none;">›</button>',
                                },
                            },
                            on: {
                                close: () => {
                                    document.querySelectorAll('[id^="certificate-gallery-modal-"]').forEach(el => {
                                        const parent = el.parentNode;
                                        if (parent && parent.parentNode) {
                                            parent.parentNode.removeChild(parent);
                                        }
                                    });
                                }
                            }
                        });
                    });
                });

                const availableLinks = document.querySelectorAll('[data-fancybox="available-certificates"]');

                availableLinks.forEach((link) => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        const certificateItem = link.closest('.certificates__item');
                        if (!certificateItem) return;

                        const allItems = Array.from(document.querySelectorAll('.available-certificates .certificates__item'));
                        const currentIndex = allItems.indexOf(certificateItem);

                        const items = allItems.map((item, i) => {
                            const clone = item.cloneNode(true);

                            clone.removeAttribute('data-fancybox');
                            clone.removeAttribute('data-src');
                            clone.classList.add('certificates__item--expanded');

                            const closeBtn = document.createElement('button');
                            closeBtn.className = 'custom-fancybox-close scale-in';
                            closeBtn.setAttribute('data-fancybox-close', '');

                            const isMobile = window.matchMedia('(max-width: 768px)').matches;
                            const isSmallMobile = window.matchMedia('(max-width: 480px)').matches;

                            let btnWidth = '44px';
                            let btnHeight = '44px';
                            let svgWidth = '44';
                            let svgHeight = '44';

                            if (isSmallMobile) {
                                btnWidth = '28px';
                                btnHeight = '28px';
                                svgWidth = '28';
                                svgHeight = '28';
                            } else if (isMobile) {
                                btnWidth = '32px';
                                btnHeight = '32px';
                                svgWidth = '32';
                                svgHeight = '32';
                            }

                            closeBtn.style.width = btnWidth;
                            closeBtn.style.height = btnHeight;

                            closeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 44 44" fill="none">
                                <path d="M37.5963 33.224L26.3729 22.0006L37.5963 10.7771C38.808 9.56543 38.808 7.61465 37.5963 6.40293C36.3846 5.19121 34.4338 5.19121 33.2221 6.40293L21.9986 17.6264L10.7752 6.40293C9.56348 5.19121 7.6127 5.19121 6.40098 6.40293C5.18926 7.61465 5.18926 9.56543 6.40098 10.7771L17.6244 22.0006L6.40098 33.224C5.18926 34.4357 5.18926 36.3865 6.40098 37.5982C7.6127 38.81 9.56348 38.81 10.7752 37.5982L21.9986 26.3748L33.2221 37.5982C34.4338 38.81 36.3846 38.81 37.5963 37.5982C38.7994 36.3865 38.7994 34.4272 37.5963 33.224Z" fill="#212529"></path>
                            </svg>`;
                            clone.appendChild(closeBtn);

                            const modalId = 'available-certificate-modal-' + i + '-' + Date.now();
                            clone.id = modalId;

                            const tempDiv = document.createElement('div');
                            tempDiv.style.display = 'none';
                            tempDiv.appendChild(clone);
                            document.body.appendChild(tempDiv);

                            return {
                                src: '#' + modalId,
                                type: 'inline'
                            };
                        });

                        Fancybox.show(items, {
                            startIndex: currentIndex,
                            showClass: "f-fadeIn",
                            hideClass: "f-fadeOut",
                            groupAll: true,
                            infinite: true,
                            transitionEffect: "fade",
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
                                fade: true,
                                Navigation: {
                                    prevTpl: '<button class="f-button is-prev" title="Назад" style="display: flex; align-items: center; justify-content: center; width: 50px; height: 50px; background: rgba(0,0,0,0.5); border-radius: 50%; color: white; font-size: 24px; position: absolute; left: 20px; top: 50%; transform: translateY(-50%); z-index: 1000; cursor: pointer; border: none;">‹</button>',
                                    nextTpl: '<button class="f-button is-next" title="Вперед" style="display: flex; align-items: center; justify-content: center; width: 50px; height: 50px; background: rgba(0,0,0,0.5); border-radius: 50%; color: white; font-size: 24px; position: absolute; right: 20px; top: 50%; transform: translateY(-50%); z-index: 1000; cursor: pointer; border: none;">›</button>',
                                },
                            },
                            on: {
                                close: () => {
                                    document.querySelectorAll('[id^="available-certificate-modal-"]').forEach(el => {
                                        const parent = el.parentNode;
                                        if (parent && parent.parentNode) {
                                            parent.parentNode.removeChild(parent);
                                        }
                                    });
                                }
                            }
                        });
                    });
                });

            } catch (e) {
            }
        }, 500);

        setTimeout(() => {
            try {
                const reviewLinks = document.querySelectorAll('.all-reviews__body .news-link');

                reviewLinks.forEach((link) => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        const reviewItem = link.closest('.all-reviews__item');
                        if (!reviewItem) return;

                        const allReviews = Array.from(document.querySelectorAll('.all-reviews__item'));
                        const currentIndex = allReviews.indexOf(reviewItem);

                        const items = allReviews.map((item, i) => {
                            const clone = item.cloneNode(true);
                            clone.classList.add('all-reviews__item--expanded');

                            const cloneLink = clone.querySelector('.news-link');
                            if (cloneLink) cloneLink.remove();

                            const itemHasVideo = clone.querySelector('.video-container') !== null;

                            if (itemHasVideo) {
                                const videoContainer = clone.querySelector('.video-container');
                                if (videoContainer) {
                                    const videoElement = videoContainer.querySelector('video');
                                    if (videoElement) {
                                        videoElement.controls = true;
                                        videoElement.removeAttribute('poster');

                                        const playButton = videoContainer.querySelector('.play-button');
                                        const fullscreenButton = videoContainer.querySelector('.fullscreen-button');
                                        const posterOverlay = videoContainer.querySelector('.poster-overlay');

                                        if (playButton) playButton.remove();
                                        if (fullscreenButton) fullscreenButton.remove();
                                        if (posterOverlay) posterOverlay.remove();
                                    }
                                }

                                const textParagraph = clone.querySelector('.all-reviews__body p');
                                if (textParagraph) {
                                    textParagraph.remove();
                                }
                            } else {
                                const textParagraph = clone.querySelector('.all-reviews__body p');
                                if (textParagraph) {
                                    textParagraph.style.webkitLineClamp = 'unset';
                                    textParagraph.style.display = 'block';
                                    textParagraph.style.overflow = 'visible';
                                    textParagraph.style.maxHeight = 'none';
                                }
                            }

                            const closeBtn = document.createElement('button');
                            closeBtn.className = 'custom-fancybox-close scale-in';
                            closeBtn.setAttribute('data-fancybox-close', '');

                            const isMobile = window.matchMedia('(max-width: 768px)').matches;
                            const isSmallMobile = window.matchMedia('(max-width: 480px)').matches;

                            let btnWidth = '44px';
                            let btnHeight = '44px';
                            let svgWidth = '44';
                            let svgHeight = '44';

                            if (isSmallMobile) {
                                btnWidth = '28px';
                                btnHeight = '28px';
                                svgWidth = '28';
                                svgHeight = '28';
                            } else if (isMobile) {
                                btnWidth = '32px';
                                btnHeight = '32px';
                                svgWidth = '32';
                                svgHeight = '32';
                            }

                            closeBtn.style.width = btnWidth;
                            closeBtn.style.height = btnHeight;

                            closeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 44 44" fill="none">
                                <path d="M37.5963 33.224L26.3729 22.0006L37.5963 10.7771C38.808 9.56543 38.808 7.61465 37.5963 6.40293C36.3846 5.19121 34.4338 5.19121 33.2221 6.40293L21.9986 17.6264L10.7752 6.40293C9.56348 5.19121 7.6127 5.19121 6.40098 6.40293C5.18926 7.61465 5.18926 9.56543 6.40098 10.7771L17.6244 22.0006L6.40098 33.224C5.18926 34.4357 5.18926 36.3865 6.40098 37.5982C7.6127 38.81 9.56348 38.81 10.7752 37.5982L21.9986 26.3748L33.2221 37.5982C34.4338 38.81 36.3846 38.81 37.5963 37.5982C38.7994 36.3865 38.7994 34.4272 37.5963 33.224Z" fill="#212529"></path>
                            </svg>`;
                            clone.appendChild(closeBtn);

                            const modalId = 'review-modal-' + i + '-' + Date.now();
                            clone.id = modalId;

                            const tempDiv = document.createElement('div');
                            tempDiv.style.display = 'none';
                            tempDiv.appendChild(clone);
                            document.body.appendChild(tempDiv);

                            return {
                                src: '#' + modalId,
                                type: 'inline'
                            };
                        });

                        Fancybox.show(items, {
                            startIndex: currentIndex,
                            showClass: "f-fadeIn",
                            hideClass: "f-fadeOut",
                            groupAll: true,
                            infinite: true,
                            transitionEffect: "fade",
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
                                fade: true,
                                Navigation: {
                                    prevTpl: '<button class="f-button is-prev" title="Назад" style="display: flex; align-items: center; justify-content: center; width: 50px; height: 50px; background: rgba(0,0,0,0.5); border-radius: 50%; color: white; font-size: 24px; position: absolute; left: 20px; top: 50%; transform: translateY(-50%); z-index: 1000; cursor: pointer; border: none;">‹</button>',
                                    nextTpl: '<button class="f-button is-next" title="Вперед" style="display: flex; align-items: center; justify-content: center; width: 50px; height: 50px; background: rgba(0,0,0,0.5); border-radius: 50%; color: white; font-size: 24px; position: absolute; right: 20px; top: 50%; transform: translateY(-50%); z-index: 1000; cursor: pointer; border: none;">›</button>',
                                },
                            },
                            on: {
                                close: () => {
                                    document.querySelectorAll('[id^="review-modal-"]').forEach(el => {
                                        const parent = el.parentNode;
                                        if (parent && parent.parentNode) {
                                            parent.parentNode.removeChild(parent);
                                        }
                                    });
                                }
                            }
                        });
                    });
                });
            } catch (e) {
            }
        }, 500);

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