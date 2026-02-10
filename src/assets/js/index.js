import "../styles/reset.scss";
import "../styles/styles.scss";
import "../styles/header.scss";
import "../styles/home.scss";
import LazyLoad from "vanilla-lazyload";
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css';
import { Pagination, Navigation, Autoplay, Thumbs, EffectFade } from 'swiper/modules';
import Animation from "./animation.js";
import IMask from 'imask';
import { initSearch } from "./search.js";
import { initAllVideos } from "./video.js";

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

document.addEventListener('DOMContentLoaded', function() {
        lazyLoadInstance.update();
        initPhoneMasks();
        initAnimation();
        initSearch();
        initAllVideos();
});

window.addEventListener('load', function() {
        lazyLoadInstance.update();
});

export {
        lazyLoadInstance,
        initPhoneMasks,
        initAnimation,
        initSearch,
        initAllVideos
};