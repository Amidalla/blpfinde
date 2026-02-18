import Swiper from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

let newsSliders = [];
let leftColumnSliders = [];

export function SlidersInit() {
    initNewsSliders();
    initLeftColumnSlider();
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
                }
            }
        });

        newsSliders.push(slider);
    });
}


function initLeftColumnSlider() {
    const leftColumn = document.querySelector('.control-units__item:first-child');
    if (!leftColumn) return;

    const windowWidth = window.innerWidth;


    if (windowWidth > 1230) {

        if (leftColumn.swiper) {
            destroyLeftColumnSlider();
        }
        return;
    }


    else if (windowWidth > 750 && windowWidth <= 1230) {

        if (leftColumn.swiper) {
            destroyLeftColumnSlider();
        }
        initTabletSlider(leftColumn);
    }

    else if (windowWidth <= 750) {

        if (leftColumn.swiper) {
            destroyLeftColumnSlider();
        }
        initMobileSlider(leftColumn);
    }
}


function initTabletSlider(leftColumn) {

    if (!leftColumn.dataset.originalContent) {
        leftColumn.dataset.originalContent = leftColumn.innerHTML;
    }

    const blocks = Array.from(leftColumn.children);
    if (blocks.length === 0) return;


    const containerHeight = 400;
    leftColumn.style.height = containerHeight + 'px';
    leftColumn.style.overflow = 'hidden';
    leftColumn.style.position = 'relative';


    const swiperWrapper = document.createElement('div');
    swiperWrapper.className = 'swiper-wrapper';
    swiperWrapper.style.transitionTimingFunction = 'cubic-bezier(0.4, 0, 0.2, 1)';


    const spaceBetween = 11;
    const slideHeight = (containerHeight - (2 * spaceBetween)) / 3;


    const allSlides = [];


    for (let i = blocks.length - 3; i < blocks.length; i++) {
        if (blocks[i]) {
            const slideDiv = createTabletSlide(blocks[i], slideHeight, spaceBetween);
            allSlides.push(slideDiv);
        }
    }


    blocks.forEach((block) => {
        if (block) {
            const slideDiv = createTabletSlide(block, slideHeight, spaceBetween);
            allSlides.push(slideDiv);
        }
    });


    for (let i = 0; i < 3; i++) {
        if (blocks[i]) {
            const slideDiv = createTabletSlide(blocks[i], slideHeight, spaceBetween);
            allSlides.push(slideDiv);
        }
    }


    allSlides.forEach(slide => {
        swiperWrapper.appendChild(slide);
    });


    leftColumn.innerHTML = '';
    leftColumn.appendChild(swiperWrapper);


    function updateCenterSlide(swiper) {
        const slides = swiper.slides;
        slides.forEach(slide => slide.classList.remove('center-slide'));

        const visibleSlides = swiper.el.querySelectorAll('.swiper-slide-visible');
        if (visibleSlides.length >= 3) {
            const centralSlide = visibleSlides[1];
            if (centralSlide) centralSlide.classList.add('center-slide');
        }
    }


    const slider = new Swiper(leftColumn, {
        modules: [Autoplay],
        direction: 'vertical',
        slidesPerView: 3,
        spaceBetween: spaceBetween,
        loop: true,
        initialSlide: 3,
        autoplay: {
            delay: 1500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        },
        speed: 400,
        mousewheel: true,
        grabCursor: true,
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        on: {
            init: function() {
                leftColumn.swiper = this;
                this.update();
                setTimeout(() => {
                    updateCenterSlide(this);
                }, 100);
            },
            slideChange: function() {
                updateCenterSlide(this);
            },
            resize: function() {
                if (window.innerWidth > 1230 || window.innerWidth <= 750) {
                    this.destroy(true, true);
                    initLeftColumnSlider();
                }
            }
        }
    });

    leftColumnSliders.push(slider);
}


function createTabletSlide(block, height, spaceBetween) {
    const slideDiv = document.createElement('div');
    slideDiv.className = 'swiper-slide';
    slideDiv.style.height = height + 'px';
    slideDiv.style.marginBottom = spaceBetween + 'px';

    const blockClone = block.cloneNode(true);
    blockClone.style.transform = '';
    blockClone.style.transition = 'background 0.3s ease, color 0.3s ease';
    blockClone.style.height = height + 'px';

    slideDiv.appendChild(blockClone);
    return slideDiv;
}


function initMobileSlider(leftColumn) {

    if (!leftColumn.dataset.originalContent) {
        leftColumn.dataset.originalContent = leftColumn.innerHTML;
    }

    const blocks = Array.from(leftColumn.children);
    if (blocks.length === 0) return;


    leftColumn.style.height = 'auto';
    leftColumn.style.overflow = 'hidden';
    leftColumn.style.position = 'relative';
    leftColumn.style.width = '100%';


    const swiperWrapper = document.createElement('div');
    swiperWrapper.className = 'swiper-wrapper';
    swiperWrapper.style.transitionTimingFunction = 'cubic-bezier(0.4, 0, 0.2, 1)';
    swiperWrapper.style.display = 'flex';
    swiperWrapper.style.alignItems = 'stretch';


    const spaceBetween = 16;
    const containerWidth = leftColumn.offsetWidth;
    const slideWidth = containerWidth * 0.8;


    const allSlides = [];


    for (let i = blocks.length - 3; i < blocks.length; i++) {
        if (blocks[i]) {
            const slideDiv = createMobileSlide(blocks[i], slideWidth, spaceBetween);
            allSlides.push(slideDiv);
        }
    }


    blocks.forEach((block) => {
        if (block) {
            const slideDiv = createMobileSlide(block, slideWidth, spaceBetween);
            allSlides.push(slideDiv);
        }
    });


    for (let i = 0; i < 3; i++) {
        if (blocks[i]) {
            const slideDiv = createMobileSlide(blocks[i], slideWidth, spaceBetween);
            allSlides.push(slideDiv);
        }
    }


    allSlides.forEach(slide => {
        swiperWrapper.appendChild(slide);
    });


    leftColumn.innerHTML = '';
    leftColumn.appendChild(swiperWrapper);


    function updateCenterSlide(swiper) {
        const slides = swiper.slides;
        slides.forEach(slide => slide.classList.remove('center-slide'));

        const visibleSlides = swiper.el.querySelectorAll('.swiper-slide-visible');
        if (visibleSlides.length >= 3) {
            const centralSlide = visibleSlides[1];
            if (centralSlide) centralSlide.classList.add('center-slide');
        } else if (visibleSlides.length > 0) {
            visibleSlides[0].classList.add('center-slide');
        }
    }


    const slider = new Swiper(leftColumn, {
        modules: [Autoplay],
        direction: 'horizontal',
        slidesPerView: 'auto',
        spaceBetween: spaceBetween,
        centeredSlides: true,
        loop: true,
        initialSlide: 3,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        },
        speed: 500,
        grabCursor: true,
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        on: {
            init: function() {
                leftColumn.swiper = this;
                this.update();
                setTimeout(() => {
                    updateCenterSlide(this);
                }, 100);
            },
            slideChange: function() {
                updateCenterSlide(this);
            },
            resize: function() {
                if (window.innerWidth > 750) {
                    this.destroy(true, true);
                    initLeftColumnSlider();
                } else {
                    const newContainerWidth = leftColumn.offsetWidth;
                    const newSlideWidth = newContainerWidth * 0.8;

                    this.slides.forEach(slide => {
                        slide.style.width = newSlideWidth + 'px';
                    });

                    this.update();
                    updateCenterSlide(this);
                }
            }
        }
    });

    leftColumnSliders.push(slider);
}


function createMobileSlide(block, width, spaceBetween) {
    const slideDiv = document.createElement('div');
    slideDiv.className = 'swiper-slide';
    slideDiv.style.width = width + 'px';
    slideDiv.style.height = 'auto';
    slideDiv.style.marginRight = spaceBetween + 'px';
    slideDiv.style.flexShrink = '0';

    const blockClone = block.cloneNode(true);
    blockClone.style.transform = '';
    blockClone.style.transition = 'background 0.3s ease, color 0.3s ease';
    blockClone.style.height = 'auto';
    blockClone.style.margin = '0';

    slideDiv.appendChild(blockClone);
    return slideDiv;
}

function destroyLeftColumnSlider() {
    leftColumnSliders.forEach(slider => {
        if (slider && !slider.destroyed) {
            slider.destroy(true, true);
        }
    });
    leftColumnSliders = [];

    const leftColumn = document.querySelector('.control-units__item:first-child');
    if (leftColumn) {
        if (leftColumn.dataset.originalContent) {
            leftColumn.innerHTML = leftColumn.dataset.originalContent;
            delete leftColumn.dataset.originalContent;
        }

        leftColumn.style.height = '';
        leftColumn.style.overflow = '';
        leftColumn.style.position = '';
        leftColumn.style.width = '';
        delete leftColumn.swiper;
    }
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

    leftColumnSliders.forEach(slider => {
        if (slider && !slider.destroyed) {
            slider.update();

            const slides = slider.slides;
            slides.forEach(slide => slide.classList.remove('center-slide'));

            const visibleSlides = slider.el.querySelectorAll('.swiper-slide-visible');
            if (slider.params.direction === 'vertical') {
                if (visibleSlides.length >= 3) {
                    const centralSlide = visibleSlides[1];
                    if (centralSlide) centralSlide.classList.add('center-slide');
                }
            } else {
                if (visibleSlides.length >= 3) {
                    const centralSlide = visibleSlides[1];
                    if (centralSlide) centralSlide.classList.add('center-slide');
                } else if (visibleSlides.length > 0) {
                    visibleSlides[0].classList.add('center-slide');
                }
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

    leftColumnSliders.forEach(slider => {
        if (slider && !slider.destroyed) {
            slider.destroy(true, true);
        }
    });
    leftColumnSliders = [];
}

export function getSlidersCount() {
    return newsSliders.length + leftColumnSliders.length;
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