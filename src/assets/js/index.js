import "../styles/reset.scss";
import "../styles/styles.scss";
import LazyLoad from "vanilla-lazyload";
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css';
import { Pagination, Navigation, Autoplay, Thumbs, EffectFade } from 'swiper/modules';
import { Animation } from "./animation.js";
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
        const svgElement = document.querySelector('.stub__left svg');

        if (svgElement) {
                const animation = new Animation(svgElement);


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