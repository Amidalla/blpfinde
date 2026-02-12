import "../styles/reset.scss";
import "../styles/styles.scss";
import "../styles/header.scss";
import "../styles/footer.scss";
import "../styles/home.scss";
import "../styles/news-tabs.scss";
import "../styles/scroll-animations.scss";
import LazyLoad from "vanilla-lazyload";
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css';
import { Pagination, Navigation, Autoplay, Thumbs, EffectFade } from 'swiper/modules';
import Animation from "./animation.js";
import IMask from 'imask';
import { initSearch } from "./search.js";
import { initAllVideos } from "./video.js";
import { initNewsTabs } from "./tabs.js";
import { SlidersInit } from "./sliders.js";
import ScrollAnimator from "./scrollAnimator.js";


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
                const animation = new Animation(container);
                if (!animation.isMobileView) {
                        animation.setupScrollObserver();
                }
        });
}

function initScrollAnimations() {
        const scrollAnimator = new ScrollAnimator();
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

document.addEventListener('DOMContentLoaded', function() {

        SlidersInit();

        initNewsTabs();

        lazyLoadInstance.update();
        initPhoneMasks();
        initAnimation();
        initSearch();
        initAllVideos();
        initScrollAnimations();

});

window.addEventListener('load', function() {
        lazyLoadInstance.update();

        setTimeout(() => {
                const swipers = document.querySelectorAll('.swiper');
                swipers.forEach(swiperEl => {
                        if (swiperEl.swiper) {
                                swiperEl.swiper.update();
                        }
                });
        }, 100);
});

window.addEventListener('resize', function() {
        const swipers = document.querySelectorAll('.swiper');
        swipers.forEach(swiperEl => {
                if (swiperEl.swiper) {
                        swiperEl.swiper.update();
                }
        });
});

export {
        lazyLoadInstance,
        initPhoneMasks,
        initAnimation,
        initSearch,
        initAllVideos,
        initNewsTabs,
        SlidersInit,
        initScrollAnimations
};