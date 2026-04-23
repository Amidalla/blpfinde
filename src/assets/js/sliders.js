import Swiper from 'swiper';
import { Navigation, Autoplay, Pagination, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

let newsSliders = [];
let leftColumnSliders = [];
let historySlider = null;
let casesSliders = [];
let partnersSlider = null;
let reviewsResultSlider = null;

export function SlidersInit() {
    initNewsSliders();
    initLeftColumnSlider();
    initHistorySlider();
    initCasesSliders();
    initPartnersSlider();
    initReviewsResultSlider();
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
                    spaceBetween: 16
                },
                500: {
                    slidesPerView: 2,
                    spaceBetween: 24
                },
                1000: {
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

function initCasesSliders() {
    const casesSlidersElements = document.querySelectorAll('.cases-tabs .cases-slider-container');

    casesSlidersElements.forEach((container) => {
        if (!container) return;

        const sliderElement = container.querySelector('.cases-slider.swiper');
        if (!sliderElement) return;

        const prevButton = container.querySelector('.swiper-button-prev');
        const nextButton = container.querySelector('.swiper-button-next');

        if (!prevButton || !nextButton) return;

        if (sliderElement.swiper) {
            if (!casesSliders.includes(sliderElement.swiper)) {
                casesSliders.push(sliderElement.swiper);
            }
            return;
        }

        const slider = new Swiper(sliderElement, {
            modules: [Navigation],
            autoplay: false,
            speed: 600,
            slidesPerView: 1,
            spaceBetween: 30,
            loop: false,
            pagination: false,
            navigation: {
                nextEl: nextButton,
                prevEl: prevButton
            },
            on: {
                init: function() {
                    updateCasesArrowStates(this, prevButton, nextButton);
                },
                slideChange: function() {
                    updateCasesArrowStates(this, prevButton, nextButton);
                },
                resize: function() {
                    this.update();
                    updateCasesArrowStates(this, prevButton, nextButton);
                }
            }
        });

        casesSliders.push(slider);
    });
}

function updateCasesArrowStates(swiperInstance, prevButton, nextButton) {
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

function initLeftColumnSlider() {
    const leftColumn = document.querySelector('.control-units__item:first-child');
    if (!leftColumn) return;

    const windowWidth = window.innerWidth;

    if (windowWidth > 1230) {
        if (leftColumn.swiper) {
            destroyLeftColumnSlider();
        }
        return;
    } else if (windowWidth > 750 && windowWidth <= 1230) {
        if (leftColumn.swiper) {
            destroyLeftColumnSlider();
        }
        initTabletSlider(leftColumn);
    } else if (windowWidth <= 750) {
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

        if (!swiper || !swiper.slides) return;

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
            delay: 2000,
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

function initHistorySlider() {
    const historySliderElement = document.querySelector('.history__slider .swiper');
    if (!historySliderElement) return;

    if (historySlider && !historySlider.destroyed) {
        return;
    }

    if (historySlider) {
        historySlider.destroy(true, true);
        historySlider = null;
    }

    const historySection = document.querySelector('.history__slider');
    const scrollbarContainer = historySection.querySelector('.swiper-custom-scrollbar');

    const allSlides = Array.from(historySliderElement.querySelectorAll('.swiper-slide'));


    const realSlides = allSlides.filter(slide => !slide.classList.contains('swiper-slide-duplicate'));
    const totalRealSlides = realSlides.length;


    const realIndexToDataIndex = {};
    realSlides.forEach((slide, idx) => {

        const dataIndex = parseInt(slide.getAttribute('data-swiper-slide-index'));
        realIndexToDataIndex[idx] = dataIndex;
    });

    let pendingTargetDataIndex = null;
    let isTransitioning = false;
    let retryCount = 0;

    function updateCircleActive(dataIndex) {
        const allCircles = document.querySelectorAll('.scrollbar-circle-big');
        if (!allCircles.length) return;

        let targetCircleIndex = -1;
        for (let i = 0; i < allCircles.length; i++) {
            const circleDataIndex = parseInt(allCircles[i].dataset.index);
            if (circleDataIndex === dataIndex) {
                targetCircleIndex = i;
                break;
            }
        }

        if (targetCircleIndex === -1) return;

        allCircles.forEach((circle, idx) => {
            if (idx === targetCircleIndex) {
                if (!circle.classList.contains('active')) {
                    circle.classList.add('active');
                    circle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="43" height="43" viewBox="0 0 43 43" fill="none">
                        <foreignObject x="-24" y="-24" width="91" height="91"><div xmlns="http://www.w3.org/1999/xhtml" style="backdrop-filter:blur(12px);height:100%;width:100%"></div></foreignObject>
                        <circle data-figma-bg-blur-radius="24" cx="21.5" cy="21.5" r="21" stroke="url(#paint0_linear_567_20355)" stroke-opacity="0.83" stroke-linecap="round" stroke-linejoin="round"/>
                        <foreignObject x="-15" y="-15" width="73" height="73"><div xmlns="http://www.w3.org/1999/xhtml" style="backdrop-filter:blur(12px);clip-path:url(#bgblur_0_567_20355_clip_path);height:100%;width:100%"></div></foreignObject>
                        <circle data-figma-bg-blur-radius="24" cx="21.5" cy="21.5" r="12" fill="url(#paint1_radial_567_20355)" stroke="url(#paint2_linear_567_20355)" stroke-linecap="round" stroke-linejoin="round"/>
                        <defs>
                            <clipPath id="bgblur_0_567_20355_clip_path" transform="translate(15 15)"><circle cx="21.5" cy="21.5" r="12"/></clipPath>
                            <linearGradient id="paint0_linear_567_20355" x1="21.5152" y1="14.6667" x2="21.4949" y2="42" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#62B6EA"/>
                                <stop offset="0.426133" stop-color="#77C5F5"/>
                                <stop offset="1" stop-color="#E2F4FF" stop-opacity="0.1"/>
                            </linearGradient>
                            <radialGradient id="paint1_radial_567_20355" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(18 17) rotate(74.9315) scale(13.4629)">
                                <stop stop-color="#C5E9FF"/>
                                <stop offset="1" stop-color="#77C5F5"/>
                            </radialGradient>
                            <linearGradient id="paint2_linear_567_20355" x1="13.6612" y1="12.6795" x2="28.3328" y2="30.8506" gradientUnits="userSpaceOnUse">
                                <stop stop-color="white" stop-opacity="0.25"/>
                                <stop offset="1" stop-color="white" stop-opacity="0"/>
                            </linearGradient>
                        </defs>
                    </svg>`;
                }
            } else {
                if (circle.classList.contains('active')) {
                    circle.classList.remove('active');
                    circle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                        <foreignObject x="-24" y="-24" width="73" height="73"><div xmlns="http://www.w3.org/1999/xhtml" style="backdrop-filter:blur(12px);clip-path:url(#bgblur_0_567_19992_clip_path);height:100%;width:100%"></div></foreignObject>
                        <circle data-figma-bg-blur-radius="24" cx="12.5" cy="12.5" r="12" fill="url(#paint0_radial_567_19992)" stroke="url(#paint1_linear_567_19992)" stroke-linecap="round" stroke-linejoin="round"/>
                        <defs>
                            <clipPath id="bgblur_0_567_19992_clip_path" transform="translate(24 24)"><circle cx="12.5" cy="12.5" r="12"/></clipPath>
                            <radialGradient id="paint0_radial_567_19992" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(9 8) rotate(74.9315) scale(13.4629)">
                                <stop stop-color="#C5E9FF"/>
                                <stop offset="1" stop-color="#77C5F5"/>
                            </radialGradient>
                            <linearGradient id="paint1_linear_567_19992" x1="4.66122" y1="3.67953" x2="19.3328" y2="21.8506" gradientUnits="userSpaceOnUse">
                                <stop stop-color="white" stop-opacity="0.25"/>
                                <stop offset="1" stop-color="white" stop-opacity="0"/>
                            </linearGradient>
                        </defs>
                    </svg>`;
                }
            }
        });
    }

    function createScrollbar() {
        scrollbarContainer.innerHTML = '';

        const trackContainer = document.createElement('div');
        trackContainer.className = 'scrollbar-track';

        const lineSvg = document.createElement('div');
        lineSvg.className = 'scrollbar-line';
        lineSvg.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="2" viewBox="0 0 1370 2" fill="none" preserveAspectRatio="none">
            <path d="M0 1H1369.5" stroke="#77C5F5" stroke-width="2"/>
        </svg>`;
        trackContainer.appendChild(lineSvg);

        const circlesContainer = document.createElement('div');
        circlesContainer.className = 'scrollbar-circles';

        const leftSmallCircle = document.createElement('span');
        leftSmallCircle.className = 'scrollbar-circle scrollbar-circle-small scrollbar-circle-left';
        leftSmallCircle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <foreignObject x="-24" y="-24" width="62" height="62"><div xmlns="http://www.w3.org/1999/xhtml" style="backdrop-filter:blur(12px);clip-path:url(#bgblur_0_567_19990_clip_path);height:100%;width:100%"></div></foreignObject>
            <circle data-figma-bg-blur-radius="24" cx="7" cy="7" r="6.5" fill="url(#paint0_radial_567_19990)" stroke="url(#paint1_linear_567_19990)" stroke-linecap="round" stroke-linejoin="round"/>
            <defs>
                <clipPath id="bgblur_0_567_19990_clip_path" transform="translate(24 24)"><circle cx="7" cy="7" r="6.5"/></clipPath>
                <radialGradient id="paint0_radial_567_19990" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(5.17391 4.65217) rotate(74.9315) scale(7.02413)">
                    <stop stop-color="#C5E9FF"/>
                    <stop offset="1" stop-color="#77C5F5"/>
                </radialGradient>
                <linearGradient id="paint1_linear_567_19990" x1="2.9102" y1="2.39802" x2="10.5649" y2="11.8786" gradientUnits="userSpaceOnUse">
                    <stop stop-color="white" stop-opacity="0.25"/>
                    <stop offset="1" stop-color="white" stop-opacity="0"/>
                </linearGradient>
            </defs>
        </svg>`;
        circlesContainer.appendChild(leftSmallCircle);

        const isMobile = window.innerWidth <= 750;
        const numberOfCircles = isMobile ? 1 : totalRealSlides;

        for (let i = 0; i < numberOfCircles; i++) {

            const dataIndexForCircle = realIndexToDataIndex[i];
            const bigCircle = document.createElement('span');
            bigCircle.className = `scrollbar-circle scrollbar-circle-big ${i === 0 ? 'active' : ''}`;
            bigCircle.dataset.index = dataIndexForCircle;

            if (i === 0) {
                bigCircle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="43" height="43" viewBox="0 0 43 43" fill="none">
                    <foreignObject x="-24" y="-24" width="91" height="91"><div xmlns="http://www.w3.org/1999/xhtml" style="backdrop-filter:blur(12px);height:100%;width:100%"></div></foreignObject>
                    <circle data-figma-bg-blur-radius="24" cx="21.5" cy="21.5" r="21" stroke="url(#paint0_linear_567_20355)" stroke-opacity="0.83" stroke-linecap="round" stroke-linejoin="round"/>
                    <foreignObject x="-15" y="-15" width="73" height="73"><div xmlns="http://www.w3.org/1999/xhtml" style="backdrop-filter:blur(12px);clip-path:url(#bgblur_0_567_20355_clip_path);height:100%;width:100%"></div></foreignObject>
                    <circle data-figma-bg-blur-radius="24" cx="21.5" cy="21.5" r="12" fill="url(#paint1_radial_567_20355)" stroke="url(#paint2_linear_567_20355)" stroke-linecap="round" stroke-linejoin="round"/>
                    <defs>
                        <clipPath id="bgblur_0_567_20355_clip_path" transform="translate(15 15)"><circle cx="21.5" cy="21.5" r="12"/></clipPath>
                        <linearGradient id="paint0_linear_567_20355" x1="21.5152" y1="14.6667" x2="21.4949" y2="42" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#62B6EA"/>
                            <stop offset="0.426133" stop-color="#77C5F5"/>
                            <stop offset="1" stop-color="#E2F4FF" stop-opacity="0.1"/>
                        </linearGradient>
                        <radialGradient id="paint1_radial_567_20355" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(18 17) rotate(74.9315) scale(13.4629)">
                            <stop stop-color="#C5E9FF"/>
                            <stop offset="1" stop-color="#77C5F5"/>
                        </radialGradient>
                        <linearGradient id="paint2_linear_567_20355" x1="13.6612" y1="12.6795" x2="28.3328" y2="30.8506" gradientUnits="userSpaceOnUse">
                            <stop stop-color="white" stop-opacity="0.25"/>
                            <stop offset="1" stop-color="white" stop-opacity="0"/>
                        </linearGradient>
                    </defs>
                </svg>`;
            } else {
                bigCircle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                    <foreignObject x="-24" y="-24" width="73" height="73"><div xmlns="http://www.w3.org/1999/xhtml" style="backdrop-filter:blur(12px);clip-path:url(#bgblur_0_567_19992_clip_path);height:100%;width:100%"></div></foreignObject>
                    <circle data-figma-bg-blur-radius="24" cx="12.5" cy="12.5" r="12" fill="url(#paint0_radial_567_19992)" stroke="url(#paint1_linear_567_19992)" stroke-linecap="round" stroke-linejoin="round"/>
                    <defs>
                        <clipPath id="bgblur_0_567_19992_clip_path" transform="translate(24 24)"><circle cx="12.5" cy="12.5" r="12"/></clipPath>
                        <radialGradient id="paint0_radial_567_19992" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(9 8) rotate(74.9315) scale(13.4629)">
                            <stop stop-color="#C5E9FF"/>
                            <stop offset="1" stop-color="#77C5F5"/>
                        </radialGradient>
                        <linearGradient id="paint1_linear_567_19992" x1="4.66122" y1="3.67953" x2="19.3328" y2="21.8506" gradientUnits="userSpaceOnUse">
                            <stop stop-color="white" stop-opacity="0.25"/>
                            <stop offset="1" stop-color="white" stop-opacity="0"/>
                        </linearGradient>
                    </defs>
                </svg>`;
            }

            if (!isMobile && numberOfCircles > 1) {
                bigCircle.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (historySlider && !historySlider.destroyed && !isTransitioning) {
                        const targetDataIndex = parseInt(bigCircle.dataset.index);
                        const activeSlide = historySliderElement.querySelector('.swiper-slide-active');
                        let currentDataIndex = null;


                        if (activeSlide && !activeSlide.classList.contains('swiper-slide-duplicate')) {
                            currentDataIndex = parseInt(activeSlide.getAttribute('data-swiper-slide-index'));
                        } else if (activeSlide) {

                            const originalIndex = parseInt(activeSlide.getAttribute('data-swiper-slide-index'));
                            currentDataIndex = originalIndex;
                        }

                        if (targetDataIndex === currentDataIndex) return;

                        pendingTargetDataIndex = targetDataIndex;
                        isTransitioning = true;
                        retryCount = 0;


                        const targetRealIndex = Object.keys(realIndexToDataIndex).find(
                            key => realIndexToDataIndex[key] === targetDataIndex
                        );
                        if (targetRealIndex !== undefined) {
                            historySlider.slideToLoop(parseInt(targetRealIndex), 300);
                        }
                    }
                });
            }

            circlesContainer.appendChild(bigCircle);
        }

        const rightSmallCircle = document.createElement('span');
        rightSmallCircle.className = 'scrollbar-circle scrollbar-circle-small scrollbar-circle-right';
        rightSmallCircle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <foreignObject x="-24" y="-24" width="62" height="62"><div xmlns="http://www.w3.org/1999/xhtml" style="backdrop-filter:blur(12px);clip-path:url(#bgblur_0_567_19990_clip_path);height:100%;width:100%"></div></foreignObject>
            <circle data-figma-bg-blur-radius="24" cx="7" cy="7" r="6.5" fill="url(#paint0_radial_567_19990)" stroke="url(#paint1_linear_567_19990)" stroke-linecap="round" stroke-linejoin="round"/>
            <defs>
                <clipPath id="bgblur_0_567_19990_clip_path" transform="translate(24 24)"><circle cx="7" cy="7" r="6.5"/></clipPath>
                <radialGradient id="paint0_radial_567_19990" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(5.17391 4.65217) rotate(74.9315) scale(7.02413)">
                    <stop stop-color="#C5E9FF"/>
                    <stop offset="1" stop-color="#77C5F5"/>
                </radialGradient>
                <linearGradient id="paint1_linear_567_19990" x1="2.9102" y1="2.39802" x2="10.5649" y2="11.8786" gradientUnits="userSpaceOnUse">
                    <stop stop-color="white" stop-opacity="0.25"/>
                    <stop offset="1" stop-color="white" stop-opacity="0"/>
                </linearGradient>
            </defs>
        </svg>`;
        circlesContainer.appendChild(rightSmallCircle);

        trackContainer.appendChild(circlesContainer);
        scrollbarContainer.appendChild(trackContainer);
    }

    createScrollbar();

    historySlider = new Swiper(historySliderElement, {
        modules: [Navigation],
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        loopPreventsSlide: false,
        speed: 300,
        navigation: {
            nextEl: historySection.querySelector('.swiper-button-next'),
            prevEl: historySection.querySelector('.swiper-button-prev'),
        },
        breakpoints: {
            0: {
                slidesPerView: 1.2,
                spaceBetween: 16
            },
            751: {
                slidesPerView: 2,
                spaceBetween: 24
            },
            1351: {
                slidesPerView: 4,
                spaceBetween: 30
            }
        },
        on: {
            init: function() {
                updateHistoryArrowStates(this);
                const isMobile = window.innerWidth <= 750;
                if (isMobile) {
                    updateCircleActive(0);
                } else {
                    const activeSlide = historySliderElement.querySelector('.swiper-slide-active');
                    let currentDataIndex = 0;

                    if (activeSlide && !activeSlide.classList.contains('swiper-slide-duplicate')) {
                        currentDataIndex = parseInt(activeSlide.getAttribute('data-swiper-slide-index'));
                    } else if (activeSlide) {
                        currentDataIndex = parseInt(activeSlide.getAttribute('data-swiper-slide-index'));
                    }

                    updateCircleActive(currentDataIndex);
                }
            },
            slideChange: function() {
                updateHistoryArrowStates(this);
            },
            slideChangeTransitionEnd: function() {
                const isMobile = window.innerWidth <= 750;
                if (isMobile) {
                    updateCircleActive(0);
                } else {
                    const activeSlide = historySliderElement.querySelector('.swiper-slide-active');
                    let currentDataIndex = 0;

                    if (activeSlide && !activeSlide.classList.contains('swiper-slide-duplicate')) {
                        currentDataIndex = parseInt(activeSlide.getAttribute('data-swiper-slide-index'));
                    } else if (activeSlide) {
                        currentDataIndex = parseInt(activeSlide.getAttribute('data-swiper-slide-index'));
                    }

                    if (pendingTargetDataIndex !== null) {
                        if (currentDataIndex === pendingTargetDataIndex) {
                            updateCircleActive(pendingTargetDataIndex);
                            pendingTargetDataIndex = null;
                            retryCount = 0;
                        } else if (retryCount < 3) {
                            retryCount++;
                            setTimeout(() => {
                                if (historySlider && !historySlider.destroyed && pendingTargetDataIndex !== null) {
                                    const targetRealIndex = Object.keys(realIndexToDataIndex).find(
                                        key => realIndexToDataIndex[key] === pendingTargetDataIndex
                                    );
                                    if (targetRealIndex !== undefined) {
                                        historySlider.slideToLoop(parseInt(targetRealIndex), 300);
                                    }
                                }
                            }, 100);
                        } else {
                            updateCircleActive(currentDataIndex);
                            pendingTargetDataIndex = null;
                            retryCount = 0;
                        }
                    } else {
                        updateCircleActive(currentDataIndex);
                    }
                    isTransitioning = false;
                }
            },
            resize: function() {
                createScrollbar();
                this.update();
                updateHistoryArrowStates(this);
                const isMobile = window.innerWidth <= 750;
                if (isMobile) {
                    updateCircleActive(0);
                } else {
                    const activeSlide = historySliderElement.querySelector('.swiper-slide-active');
                    let currentDataIndex = 0;

                    if (activeSlide && !activeSlide.classList.contains('swiper-slide-duplicate')) {
                        currentDataIndex = parseInt(activeSlide.getAttribute('data-swiper-slide-index'));
                    } else if (activeSlide) {
                        currentDataIndex = parseInt(activeSlide.getAttribute('data-swiper-slide-index'));
                    }

                    updateCircleActive(currentDataIndex);
                }
            }
        }
    });
}
function updateHistoryArrowStates(swiperInstance) {
    const historySection = document.querySelector('.history__slider');
    if (!historySection) return;

    const prevButton = historySection.querySelector('.swiper-button-prev');
    const nextButton = historySection.querySelector('.swiper-button-next');

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

function initPartnersSlider() {
    const partnersSliderElement = document.querySelector('.partners__slider.swiper');
    if (!partnersSliderElement) return;

    if (partnersSlider && !partnersSlider.destroyed) {
        partnersSlider.update();
        return;
    }

    if (partnersSlider) {
        partnersSlider.destroy(true, true);
        partnersSlider = null;
    }

    partnersSlider = new Swiper(partnersSliderElement, {
        modules: [Navigation, Autoplay],
        slidesPerView: 2,
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        },
        speed: 400,
        breakpoints: {
            0: {
                slidesPerView: 2.5,
                spaceBetween: 16
            },
            450: {
                slidesPerView: 3,
                spaceBetween: 20
            },
            600: {
                slidesPerView: 4,
                spaceBetween: 24
            },
            1024: {
                slidesPerView: 7,
                spaceBetween: 30
            },
            1650: {
                slidesPerView: 10,
                spaceBetween: 30
            }
        }
    });
}

function initReviewsResultSlider() {
    const reviewsPage = document.querySelector('.reviews-page');
    if (!reviewsPage) return;

    const resultList = reviewsPage.querySelector('.result__list');
    if (!resultList) return;

    if (reviewsResultSlider && !reviewsResultSlider.destroyed) {
        if (window.innerWidth > 1180) {
            destroyReviewsResultSlider();
        } else {
            reviewsResultSlider.update();
        }
        return;
    }

    if (window.innerWidth > 1180) {
        return;
    }

    const items = Array.from(resultList.children);
    if (!items || items.length === 0) return;

    resultList.classList.add('swiper-container');
    resultList.style.overflow = 'hidden';
    resultList.style.background = 'none';

    const wrapperDiv = document.createElement('div');
    wrapperDiv.className = 'swiper-wrapper';
    wrapperDiv.style.transitionTimingFunction = 'cubic-bezier(0.4, 0, 0.2, 1)';
    wrapperDiv.style.background = 'none';

    items.forEach(item => {
        if (item && item.nodeType === 1) {
            item.classList.add('swiper-slide');
            wrapperDiv.appendChild(item);
        }
    });

    resultList.innerHTML = '';
    resultList.appendChild(wrapperDiv);

    reviewsResultSlider = new Swiper(resultList, {
        modules: [Navigation, Pagination],
        slidesPerView: 3.5,
        spaceBetween: 20,
        loop: false,
        speed: 500,
        grabCursor: true,
        watchSlidesProgress: true,
        breakpoints: {
            0: {
                slidesPerView: 1.5,
                spaceBetween: 16
            },
            650: {
                slidesPerView: 2.5,
                spaceBetween: 20
            },
            901: {
                slidesPerView: 3.2,
                spaceBetween: 24
            },
            1181: {
                slidesPerView: 4,
                spaceBetween: 30
            }
        },
        on: {
            init: function() {
                this.update();
                if (this.wrapperEl) {
                    this.wrapperEl.style.background = 'none';
                }
            },
            resize: function(swiper) {
                if (window.innerWidth > 1180) {
                    destroyReviewsResultSlider();
                } else {
                    swiper.update();
                }
            }
        }
    });
}

function destroyReviewsResultSlider() {
    if (reviewsResultSlider && !reviewsResultSlider.destroyed) {
        reviewsResultSlider.destroy(true, true);
        reviewsResultSlider = null;

        const reviewsPage = document.querySelector('.reviews-page');
        if (!reviewsPage) return;

        const resultList = reviewsPage.querySelector('.result__list');
        if (!resultList) return;

        resultList.classList.remove('swiper-container');
        resultList.style.overflow = '';
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

    casesSliders.forEach(slider => {
        if (slider && !slider.destroyed) {
            slider.update();
            const prevButton = slider.el.querySelector('.swiper-button-prev');
            const nextButton = slider.el.querySelector('.swiper-button-next');
            updateCasesArrowStates(slider, prevButton, nextButton);
        }
    });


    leftColumnSliders.forEach(slider => {
        if (slider && !slider.destroyed && slider.slides) {
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

    if (historySlider && !historySlider.destroyed) {
        historySlider.update();
        updateHistoryArrowStates(historySlider);
    }

    if (partnersSlider && !partnersSlider.destroyed) {
        partnersSlider.update();
    }

    if (reviewsResultSlider && !reviewsResultSlider.destroyed) {
        reviewsResultSlider.update();
    }
}

export function destroyAllSliders() {
    newsSliders.forEach(slider => {
        if (slider && !slider.destroyed) {
            slider.destroy(true, true);
        }
    });
    newsSliders = [];

    casesSliders.forEach(slider => {
        if (slider && !slider.destroyed) {
            slider.destroy(true, true);
        }
    });
    casesSliders = [];

    leftColumnSliders.forEach(slider => {
        if (slider && !slider.destroyed) {
            slider.destroy(true, true);
        }
    });
    leftColumnSliders = [];

    if (historySlider && !historySlider.destroyed) {
        historySlider.destroy(true, true);
        historySlider = null;
    }

    if (partnersSlider && !partnersSlider.destroyed) {
        partnersSlider.destroy(true, true);
        partnersSlider = null;
    }

    destroyReviewsResultSlider();
}

export function getSlidersCount() {
    return newsSliders.length + casesSliders.length + leftColumnSliders.length + (historySlider ? 1 : 0) + (partnersSlider ? 1 : 0) + (reviewsResultSlider && !reviewsResultSlider.destroyed ? 1 : 0);
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