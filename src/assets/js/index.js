import "../styles/reset.scss";
import "../styles/styles.scss";
import LazyLoad from "vanilla-lazyload";
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css';
import { Pagination, Navigation, Autoplay, Thumbs, EffectFade } from 'swiper/modules';
import Animation from "./animation.js"; // Изменено на дефолтный импорт
import IMask from 'imask';

Swiper.use([Pagination, Navigation, Autoplay, Thumbs, EffectFade]);

// Инициализация lazy loading изображений
const lazyLoadInstance = new LazyLoad({
        elements_selector: ".lazy",
        use_native: true
});

// Инициализация масок для телефонов
function initPhoneMasks() {
        const phoneInputs = document.querySelectorAll('input[type="tel"]');

        phoneInputs.forEach(input => {
                IMask(input, {
                        mask: '+{7} (000) 000-00-00',
                        lazy: false
                });
        });
}

// Инициализация анимаций
function initAnimation() {
        const svgContainer = document.querySelector('.svg-animation-container');

        if (svgContainer) {
                const animation = new Animation(svgContainer);

                // Проверяем SVG внутри контейнера
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
});

window.addEventListener('load', function() {

        setTimeout(initAnimation, 100);
});

export {
        lazyLoadInstance,
        initPhoneMasks,
        initAnimation
};