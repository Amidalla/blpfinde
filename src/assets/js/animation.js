export class Animation {
    constructor(svgElement) {
        this.svgElement = svgElement;
        this.isAnimating = false;
        this.hasAnimated = false;


        this.svgElement.style.opacity = '0';
        this.svgElement.style.visibility = 'hidden';
        this.svgElement.style.pointerEvents = 'none';
        this.svgElement.style.transition = 'none';


        this.svgElement.classList.add('svg-animation-container');
    }

    start() {

        if (this.hasAnimated || this.isAnimating) {
            return;
        }

        this.isAnimating = true;


        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.prepareElements();

                requestAnimationFrame(() => {
                    // Показываем SVG контейнер
                    this.svgElement.style.opacity = '1';
                    this.svgElement.style.visibility = 'visible';
                    this.svgElement.style.pointerEvents = 'auto';

                    // Запускаем анимацию в следующем кадре
                    requestAnimationFrame(() => {
                        this.animateSvgPaths();
                    });
                });
            });
        });
    }

    // Подготовка элементов
    prepareElements() {
        const targetLinePaths = [
            'path[d="M283.836 203.674C364.872 192.813 381.504 188.799 568.778 159.211"]',
            'path[d="M588.766 156.682L545.951 161.903C492.693 168.169 428.644 163.295 399.752 159.815C299.502 143.106 158.498 109.879 94.1016 123.803"]',
            'path[d="M220.133 426.104L571.009 366.581"]',
            'path[d="M181.5 274.684C287.328 270.747 327.825 239.893 433.501 200.168C501.17 173.434 549.433 162.251 558.483 160.859L947.998 100.291"]',
            'path[d="M211.734 605.131C325.51 580.834 317.796 479.168 423.858 426.562C525.292 376.251 587.026 366.929 596.076 365.536C596.076 365.536 711.19 344.412 784.046 271.552C860.278 189.055 883.252 105.512 947.997 100.291"]'
        ];

        const targetCirclePaths = [
            'path[d="M207.437 406.188C217.591 408.197 223.201 419.245 219.817 430.963C216.433 442.681 205.394 450.434 195.24 448.425C185.086 446.416 179.476 435.368 182.86 423.65C186.244 411.932 197.284 404.179 207.437 406.188Z"]',
            'path[d="M204.357 595.578C209.767 596.649 212.797 602.553 210.974 608.866C209.151 615.178 203.223 619.31 197.812 618.24C192.402 617.169 189.371 611.264 191.194 604.952C193.017 598.639 198.947 594.507 204.357 595.578Z"]',
            'path[d="M595.906 343.785C606.06 345.794 611.67 356.841 608.286 368.559C604.902 380.278 593.862 388.031 583.709 386.021C573.555 384.012 567.945 372.964 571.329 361.246C574.713 349.528 585.753 341.775 595.906 343.785Z"]',
            'path[d="M594.625 136.29C604.779 138.299 610.389 149.347 607.005 161.065C603.621 172.783 592.581 180.536 582.427 178.526C572.274 176.517 566.664 165.47 570.048 153.751C573.432 142.033 584.471 134.28 594.625 136.29Z"]',
            'path[d="M88.1695 115.044C92.7172 115.944 95.279 120.914 93.7399 126.244C92.2008 131.573 87.2005 135.047 82.6527 134.148C78.1051 133.247 75.5443 128.277 77.0834 122.948C78.6226 117.618 83.6218 114.145 88.1695 115.044Z"]',
            'path[d="M175.99 266.335C180.538 267.235 183.099 272.205 181.56 277.534C180.021 282.864 175.021 286.338 170.473 285.438C165.925 284.538 163.365 279.568 164.904 274.238C166.443 268.909 171.442 265.436 175.99 266.335Z"]',
            'path[d="M276.74 193.545C282.15 194.616 285.18 200.52 283.357 206.833C281.534 213.145 275.605 217.277 270.195 216.207C264.785 215.136 261.754 209.231 263.577 202.919C265.4 196.606 271.329 192.474 276.74 193.545Z"]'
        ];

        // Скрываем все анимируемые элементы
        targetLinePaths.forEach(selector => {
            const path = this.svgElement.querySelector(selector);
            if (path) {
                path.style.opacity = '0';
                path.style.transition = 'none';
            }
        });

        targetCirclePaths.forEach(selector => {
            const path = this.svgElement.querySelector(selector);
            if (path) {
                path.style.opacity = '0';
                path.style.transition = 'none';
            }
        });

        const ellipses = this.svgElement.querySelectorAll('ellipse');
        ellipses.forEach(ellipse => {
            ellipse.style.opacity = '0';
            ellipse.style.transition = 'none';
        });

        const groupsToHide = [
            'g[opacity="0.8"]:has(rect[width="228.984"])',
            'g[clip-path="url(#clip0_347_4170)"]',
            'g[opacity="0.8"]:has(path[d^="M15.4219 224.772"])',
            'g[clip-path="url(#clip1_347_4170)"]',
            'g[opacity="0.8"]:has(path[d^="M134.984 347.418"])',
            'g[clip-path="url(#clip2_347_4170)"]',
            'g[opacity="0.8"]:has(path[d^="M34.7112 559.542"])',
            'g[clip-path="url(#clip3_347_4170)"]'
        ];

        groupsToHide.forEach(selector => {
            const group = this.svgElement.querySelector(selector);
            if (group) {
                group.style.opacity = '0';
                group.style.transition = 'none';
            }
        });

        const allGroups = this.svgElement.querySelectorAll('g[opacity="0.8"]');
        allGroups.forEach(group => {
            group.style.opacity = '0';
            group.style.transition = 'none';
        });

        const clipPathGroups = this.svgElement.querySelectorAll('g[clip-path]');
        clipPathGroups.forEach(group => {
            group.style.opacity = '0';
            group.style.transition = 'none';
        });
    }

    animateSvgPaths() {
        const targetPaths = [
            'path[d="M283.836 203.674C364.872 192.813 381.504 188.799 568.778 159.211"]',
            'path[d="M588.766 156.682L545.951 161.903C492.693 168.169 428.644 163.295 399.752 159.815C299.502 143.106 158.498 109.879 94.1016 123.803"]',
            'path[d="M220.133 426.104L571.009 366.581"]',
            'path[d="M181.5 274.684C287.328 270.747 327.825 239.893 433.501 200.168C501.17 173.434 549.433 162.251 558.483 160.859L947.998 100.291"]',
            'path[d="M211.734 605.131C325.51 580.834 317.796 479.168 423.858 426.562C525.292 376.251 587.026 366.929 596.076 365.536C596.076 365.536 711.19 344.412 784.046 271.552C860.278 189.055 883.252 105.512 947.997 100.291"]'
        ];

        const lineAnimationDuration = 1445;
        const delayBetweenLines = 361;

        const totalLinesAnimationTime = (targetPaths.length * delayBetweenLines) + lineAnimationDuration;
        const ellipsesAndCirclesStartTime = totalLinesAnimationTime * 0.4;

        // Отслеживаем завершение анимации групп
        const groupsAnimationEndTime = this.calculateGroupsAnimationEndTime();
        const totalAnimationTime = Math.max(
            totalLinesAnimationTime,
            ellipsesAndCirclesStartTime + 2000,
            groupsAnimationEndTime
        );

        // Устанавливаем таймер для завершения всей анимации
        setTimeout(() => {
            this.onAnimationComplete();
        }, totalAnimationTime + 1000);

        setTimeout(() => {
            this.animateEllipsesAndCircles();
        }, ellipsesAndCirclesStartTime);

        targetPaths.forEach((selector, index) => {
            const path = this.svgElement.querySelector(selector);
            if (path) {
                const length = path.getTotalLength();

                path.style.strokeDasharray = length;
                path.style.strokeDashoffset = length;
                path.style.transition = 'none';

                setTimeout(() => {
                    path.style.opacity = '1';

                    setTimeout(() => {
                        path.style.transition = `stroke-dashoffset ${lineAnimationDuration / 1000}s ease-in-out`;
                        path.style.strokeDashoffset = '0';
                    }, 50);
                }, index * delayBetweenLines);
            }
        });
    }

    animateEllipsesAndCircles() {
        this.animateEllipses();
        this.animateCirclePaths();

        setTimeout(() => {
            this.animateGroups();
        }, 500);
    }

    animateEllipses() {
        const ellipses = this.svgElement.querySelectorAll('ellipse');

        if (ellipses.length === 0) return;

        const indices = Array.from({length: ellipses.length}, (_, i) => i);
        this.shuffleArray(indices);

        const ellipseAnimationDuration = 680;

        indices.forEach((ellipseIndex, orderIndex) => {
            const ellipse = ellipses[ellipseIndex];
            const delay = orderIndex * 128 + Math.random() * 170;

            setTimeout(() => {
                ellipse.style.transition = `opacity ${ellipseAnimationDuration / 1000}s ease-out`;
                ellipse.style.opacity = '1';
            }, delay);
        });
    }

    animateCirclePaths() {
        const circlePaths = [
            'path[d="M207.437 406.188C217.591 408.197 223.201 419.245 219.817 430.963C216.433 442.681 205.394 450.434 195.24 448.425C185.086 446.416 179.476 435.368 182.86 423.65C186.244 411.932 197.284 404.179 207.437 406.188Z"]',
            'path[d="M204.357 595.578C209.767 596.649 212.797 602.553 210.974 608.866C209.151 615.178 203.223 619.31 197.812 618.24C192.402 617.169 189.371 611.264 191.194 604.952C193.017 598.639 198.947 594.507 204.357 595.578Z"]',
            'path[d="M595.906 343.785C606.06 345.794 611.67 356.841 608.286 368.559C604.902 380.278 593.862 388.031 583.709 386.021C573.555 384.012 567.945 372.964 571.329 361.246C574.713 349.528 585.753 341.775 595.906 343.785Z"]',
            'path[d="M594.625 136.29C604.779 138.299 610.389 149.347 607.005 161.065C603.621 172.783 592.581 180.536 582.427 178.526C572.274 176.517 566.664 165.47 570.048 153.751C573.432 142.033 584.471 134.28 594.625 136.29Z"]',
            'path[d="M88.1695 115.044C92.7172 115.944 95.279 120.914 93.7399 126.244C92.2008 131.573 87.2005 135.047 82.6527 134.148C78.1051 133.247 75.5443 128.277 77.0834 122.948C78.6226 117.618 83.6218 114.145 88.1695 115.044Z"]',
            'path[d="M175.99 266.335C180.538 267.235 183.099 272.205 181.56 277.534C180.021 282.864 175.021 286.338 170.473 285.438C165.925 284.538 163.365 279.568 164.904 274.238C166.443 268.909 171.442 265.436 175.99 266.335Z"]',
            'path[d="M276.74 193.545C282.15 194.616 285.18 200.52 283.357 206.833C281.534 213.145 275.605 217.277 270.195 216.207C264.785 215.136 261.754 209.231 263.577 202.919C265.4 196.606 271.329 192.474 276.74 193.545Z"]'
        ];

        const circleAnimationDuration = 1700;
        const indices = Array.from({length: circlePaths.length}, (_, i) => i);
        this.shuffleArray(indices);

        indices.forEach((pathIndex, orderIndex) => {
            const selector = circlePaths[pathIndex];
            const path = this.svgElement.querySelector(selector);

            if (path) {
                const length = path.getTotalLength();

                path.style.strokeDasharray = length;
                path.style.strokeDashoffset = length;
                path.style.transition = 'none';

                const delay = orderIndex * 150 + Math.random() * 200;

                setTimeout(() => {
                    path.style.opacity = '1';

                    setTimeout(() => {
                        path.style.transition = `stroke-dashoffset ${circleAnimationDuration / 1000}s ease-in-out`;
                        path.style.strokeDashoffset = '0';
                    }, 50);
                }, delay);
            }
        });
    }

    animateGroups() {
        const groupPairs = [
            [
                'g[opacity="0.8"]:has(rect[width="228.984"])',
                'g[clip-path="url(#clip0_347_4170)"]'
            ],
            [
                'g[opacity="0.8"]:has(path[d^="M15.4219 224.772"])',
                'g[clip-path="url(#clip1_347_4170)"]'
            ],
            [
                'g[opacity="0.8"]:has(path[d^="M134.984 347.418"])',
                'g[clip-path="url(#clip2_347_4170)"]'
            ],
            [
                'g[opacity="0.8"]:has(path[d^="M34.7112 559.542"])',
                'g[clip-path="url(#clip3_347_4170)"]'
            ]
        ];

        groupPairs.forEach((pairSelectors, pairIndex) => {
            const delay = pairIndex * 1040;

            setTimeout(() => {
                pairSelectors.forEach(selector => {
                    const group = this.svgElement.querySelector(selector);
                    if (group) {
                        group.style.transition = 'opacity 1.56s ease-out';
                        group.style.opacity = group.getAttribute('opacity') || '1';
                    }
                });
            }, delay);
        });
    }

    calculateGroupsAnimationEndTime() {

        const groupPairsCount = 4;
        const delayBetweenPairs = 1040;
        const groupAnimationDuration = 1560;

        return (groupPairsCount * delayBetweenPairs) + groupAnimationDuration;
    }

    onAnimationComplete() {
        this.isAnimating = false;
        this.hasAnimated = true;


        this.cleanupAnimationStyles();


        this.dispatchAnimationCompleteEvent();
    }

    cleanupAnimationStyles() {

        const allElements = this.svgElement.querySelectorAll('*');
        allElements.forEach(el => {
            el.style.transition = '';
        });


        this.svgElement.style.transition = '';
        this.svgElement.classList.add('animation-complete');
    }

    dispatchAnimationCompleteEvent() {
        const event = new CustomEvent('animationComplete', {
            detail: { svgElement: this.svgElement }
        });
        this.svgElement.dispatchEvent(event);
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}