import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

let newsSliders = [];

export function SlidersInit() {
    initNewsSliders();
}

function initNewsSliders() {
    const sliderWrappers = document.querySelectorAll(".news-swiper-wrapper");

    sliderWrappers.forEach((wrapper) => {
        const sliderElement = wrapper.querySelector(".news-swiper");
        if (!sliderElement) return;

        const prevButton = wrapper.querySelector('.swiper-button-prev');
        const nextButton = wrapper.querySelector('.swiper-button-next');

        if (!prevButton || !nextButton) return;

        if (sliderElement.swiper) {
            if (!newsSliders.includes(sliderElement.swiper)) {
                newsSliders.push(sliderElement.swiper);
            }
            return;
        }

        const slider = new Swiper(sliderElement, {
            modules: [Navigation],
            autoplay: false,
            speed: 600,
            slidesPerView: 1,
            spaceBetween: 20,
            loop: false,
            pagination: false,
            navigation: {
                nextEl: nextButton,
                prevEl: prevButton
            },
            autoHeight: false,
            breakpoints: {
                0: {
                    slidesPerView: 1,
                    spaceBetween: 20
                },
                481: {
                    slidesPerView: 2,
                    spaceBetween: 24
                },
                1200: {
                    slidesPerView: 3,
                    spaceBetween: 30
                }
            },
            on: {
                init: function() {
                    updateArrowStates(this, prevButton, nextButton);
                },
                slideChange: function() {
                    updateArrowStates(this, prevButton, nextButton);
                },
                resize: function() {
                    this.update();
                    updateArrowStates(this, prevButton, nextButton);
                },
                destroy: function() {
                    const index = newsSliders.indexOf(this);
                    if (index > -1) {
                        newsSliders.splice(index, 1);
                    }
                }
            }
        });

        newsSliders.push(slider);
    });
}

export function updateAllSliders() {
    newsSliders.forEach(slider => {
        if (slider && !slider.destroyed) {
            slider.update();
            const wrapper = slider.el.closest('.news-swiper-wrapper');
            if (wrapper) {
                const prevButton = wrapper.querySelector('.swiper-button-prev');
                const nextButton = wrapper.querySelector('.swiper-button-next');
                updateArrowStates(slider, prevButton, nextButton);
            }
        }
    });
}

export function destroyAllSliders() {
    newsSliders.forEach(slider => {
        if (slider && !slider.destroyed) {
            slider.destroy(true, true);
        }
    });
    newsSliders = [];
}

export function getSlidersCount() {
    return newsSliders.length;
}

function updateArrowStates(swiperInstance, prevButton, nextButton) {
    if (!prevButton || !nextButton) return;

    if (swiperInstance.isBeginning) {
        prevButton.classList.add('disabled');
        prevButton.setAttribute('disabled', 'disabled');
    } else {
        prevButton.classList.remove('disabled');
        prevButton.removeAttribute('disabled');
    }

    if (swiperInstance.isEnd) {
        nextButton.classList.add('disabled');
        nextButton.setAttribute('disabled', 'disabled');
    } else {
        nextButton.classList.remove('disabled');
        nextButton.removeAttribute('disabled');
    }
}

export default SlidersInit;