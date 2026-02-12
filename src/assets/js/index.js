import "../styles/reset.scss";
import "../styles/styles.scss";
import "../styles/header.scss";
import "../styles/home.scss";
import "../styles/news-tabs.scss";
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

// Регистрируем модули Swiper
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
        // 1. Сначала инициализируем все слайдеры (один раз!)
        SlidersInit();

        // 2. Потом инициализируем табы (они будут обновлять слайдеры)
        initNewsTabs();

        // 3. Остальные инициализации
        lazyLoadInstance.update();
        initPhoneMasks();
        initAnimation();
        initSearch();
        initAllVideos();
});

window.addEventListener('load', function() {
        lazyLoadInstance.update();

        // Обновляем все слайдеры после полной загрузки страницы
        setTimeout(() => {
                const swipers = document.querySelectorAll('.swiper');
                swipers.forEach(swiperEl => {
                        if (swiperEl.swiper) {
                                swiperEl.swiper.update();
                        }
                });
        }, 100);
});

// Обновляем слайдеры при ресайзе
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
        SlidersInit
};