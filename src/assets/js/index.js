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
        const svgContainer = document.querySelector('.svg-animation-container');

        if (svgContainer) {
                const animation = new Animation(svgContainer);
                const svgElement = svgContainer.querySelector('svg');

                if (svgElement) {
                        if (svgElement.hasAttribute('data-loaded')) {
                                animation.start();
                        } else {
                                svgElement.addEventListener('load', () => {
                                        svgElement.setAttribute('data-loaded', 'true');
                                        animation.start();
                                });

                                setTimeout(() => {
                                        if (!svgElement.hasAttribute('data-loaded')) {
                                                svgElement.setAttribute('data-loaded', 'true');
                                                animation.start();
                                        }
                                }, 500);
                        }
                } else {
                        setTimeout(() => {
                                animation.start();
                        }, 100);
                }
        }
}

document.addEventListener('DOMContentLoaded', function() {
        lazyLoadInstance.update();
        initPhoneMasks();
        initAnimation();
        initSearch();
        initAllVideos();
});

window.addEventListener('load', function() {
        setTimeout(initAnimation, 100);
});

export {
        lazyLoadInstance,
        initPhoneMasks,
        initAnimation,
        initSearch,
        initAllVideos
};