import "../styles/reset.scss";
import "../styles/styles.scss";
import "../styles/header.scss";
import "../styles/footer.scss";
import "../styles/home.scss";
import "../styles/news-tabs.scss";
import "../styles/scroll-animations.scss";
import "../styles/circle-animation.scss";

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
import CircleAnimator from "./circleAnimator.js"; // ИСПРАВЛЕНО - импортируем класс

// ============= ИНИЦИАЛИЗАЦИЯ SWIPER =============
Swiper.use([Pagination, Navigation, Autoplay, Thumbs, EffectFade]);

// ============= LAZY LOAD =============
const lazyLoadInstance = new LazyLoad({
        elements_selector: ".lazy",
        use_native: true
});

// ============= МАСКИ ДЛЯ ТЕЛЕФОНОВ =============
function initPhoneMasks() {
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        phoneInputs.forEach(input => {
                IMask(input, {
                        mask: '+{7} (000) 000-00-00',
                        lazy: false
                });
        });
}

// ============= СТАРЫЕ АНИМАЦИИ =============
function initAnimation() {
        const svgContainers = document.querySelectorAll('.benefit .svg-animation-container');
        svgContainers.forEach((container) => {
                import("./animation.js").then(module => {
                        const Animation = module.default;
                        const animation = new Animation(container);
                        if (!animation.isMobileView) {
                                animation.setupScrollObserver();
                        }
                }).catch(err => console.warn('Animation module not loaded:', err));
        });
}

// ============= ДОБАВЛЕНИЕ КЛАССОВ ДЛЯ SCROLL-АНИМАЦИЙ =============
function addAnimationClasses() {
        // Секции
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

        // Заголовки
        document.querySelectorAll('.section-title, h2, h3').forEach((title) => {
                if (!title.classList.contains('fade-up-delay')) {
                        title.classList.add('fade-up-delay');
                }
        });

        // Карточки
        document.querySelectorAll('.card, .service-card, .service-item, .portfolio-item, .benefit-card, .team-card').forEach((card, index) => {
                if (!card.classList.contains('fade-up') && !card.classList.contains('scale-in')) {
                        if (index % 3 === 0) {
                                card.classList.add('fade-up');
                        } else {
                                card.classList.add('scale-in');
                        }
                }
        });

        // Кнопки
        document.querySelectorAll('.btn, .button, button:not(.no-animation)').forEach((button) => {
                if (!button.classList.contains('scale-in')) {
                        button.classList.add('scale-in');
                }
        });
}

// ============= ГЛОБАЛЬНЫЙ ОБЪЕКТ ДЛЯ ХРАНЕНИЯ ЭКЗЕМПЛЯРОВ =============
const App = {
        lazyLoad: lazyLoadInstance,
        swipers: [],
        circleAnimator: null,
        scrollAnimator: null,

        init() {
                this.initCore();
                this.initModules();
                this.initAnimations();
                this.initEventListeners();
        },

        // Базовые инициализации
        initCore() {
                SlidersInit();
                initNewsTabs();
                initPhoneMasks();
                initSearch();
                initAllVideos();

                // Обновляем lazyLoad
                this.lazyLoad.update();
        },

        // Инициализация модулей анимации
        initModules() {
                // ScrollAnimator
                this.scrollAnimator = new ScrollAnimator();

                // CircleAnimator - ИСПРАВЛЕНО: создаем экземпляр класса
                setTimeout(() => {
                        try {
                                this.circleAnimator = new CircleAnimator();
                                this.circleAnimator.init();
                        } catch (error) {
                                console.warn('Failed to initialize CircleAnimator:', error);
                        }
                }, 200);
        },

        // Старые анимации (для обратной совместимости)
        initAnimations() {
                initAnimation();
                addAnimationClasses();
        },

        // Обработчики событий
        initEventListeners() {
                // Load event
                window.addEventListener('load', () => {
                        this.lazyLoad.update();
                        this.updateSwipers();

                        // Обновляем аниматор кругов
                        if (this.circleAnimator) {
                                this.circleAnimator.init();
                        }
                });

                // Resize event
                window.addEventListener('resize', () => {
                        this.updateSwipers();

                        // Обновляем CircleAnimator при ресайзе
                        if (this.circleAnimator) {
                                this.circleAnimator.handleResize();
                        }
                });

                // Scroll event с throttle
                let ticking = false;
                window.addEventListener('scroll', () => {
                        if (!ticking) {
                                window.requestAnimationFrame(() => {
                                        // Дополнительная логика при скролле, если нужна
                                        ticking = false;
                                });
                                ticking = true;
                        }
                });
        },

        // Обновление свайперов
        updateSwipers() {
                const swipers = document.querySelectorAll('.swiper');
                swipers.forEach(swiperEl => {
                        if (swiperEl.swiper) {
                                swiperEl.swiper.update();
                        }
                });
        },

        // Метод для принудительного обновления всех анимаций
        refresh() {
                this.lazyLoad.update();
                this.updateSwipers();

                if (this.circleAnimator) {
                        this.circleAnimator.init();
                        this.circleAnimator.handleResize();
                }
        }
};

// ============= ЗАПУСК ПРИ ЗАГРУЗКЕ =============
document.addEventListener('DOMContentLoaded', () => {
        App.init();
});

// ============= ДИНАМИЧЕСКАЯ ПЕРЕЗАГРУЗКА ДЛЯ SPA/АЯКС =============
window.AppInstance = App;

// ============= ЭКСПОРТЫ =============
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

// ============= HMR ДЛЯ WEBPACK/VITE =============
if (import.meta.hot) {
        import.meta.hot.accept();
}