export default class tabletArrowAnimator {
    constructor() {
        this.currentArrow = null;
        this.arrowBallAnimator = null;
        this.container = null;
        this.animationTimeout = null;
        this.isAnimating = false;
        this.ballX = 0;
        this.ballY = 0;
        this.initAttempts = 0;
        this.maxAttempts = 10;
        this.swiper = null;
        this.isUserInteracting = false;
        this.interactionTimeout = null;
    }

    init() {
        this.getBallCoordinates();
        this.getArrowBallAnimator();
        this.container = document.querySelector('.control-units');
        this.trySubscribeToSliderEvents();
        return this;
    }

    trySubscribeToSliderEvents() {
        const leftColumn = document.querySelector('.control-units__item:first-child');

        if (leftColumn && leftColumn.swiper) {
            this.swiper = leftColumn.swiper;
            this.subscribeToSliderEvents(this.swiper);
        } else if (this.initAttempts < this.maxAttempts) {
            this.initAttempts++;
            setTimeout(() => this.trySubscribeToSliderEvents(), 300);
        }
    }

    getArrowBallAnimator() {
        this.arrowBallAnimator = window.arrowBallAnimator || null;
    }

    getBallCoordinates() {
        const svg = document.querySelector('.control-units svg');
        if (!svg) return;

        const ballGroup = svg.querySelector('.static-ball-group');
        if (!ballGroup) return;

        const blueCircle = ballGroup.querySelector('.static-ball-blue');
        if (!blueCircle) return;

        const cx = parseFloat(blueCircle.getAttribute('cx') || '0');
        const cy = parseFloat(blueCircle.getAttribute('cy') || '0');

        this.ballX = cx;
        this.ballY = cy;

        return { x: this.ballX, y: this.ballY };
    }

    getBallScreenCoordinates() {
        const svg = document.querySelector('.control-units svg');
        if (!svg) return null;

        const ballGroup = svg.querySelector('.static-ball-group');
        if (!ballGroup) return null;

        const blueCircle = ballGroup.querySelector('.static-ball-blue');
        if (!blueCircle) return null;

        const cx = parseFloat(blueCircle.getAttribute('cx') || '0');
        const cy = parseFloat(blueCircle.getAttribute('cy') || '0');

        const svgPoint = svg.createSVGPoint();
        svgPoint.x = cx;
        svgPoint.y = cy;

        const screenCTM = svg.getScreenCTM();
        const screenPoint = svgPoint.matrixTransform(screenCTM);

        return {
            x: screenPoint.x,
            y: screenPoint.y
        };
    }

    getBallContainerCoordinates() {
        const screenCoords = this.getBallScreenCoordinates();
        if (!screenCoords || !this.container) return null;

        const containerRect = this.container.getBoundingClientRect();
        const containerX = screenCoords.x - containerRect.left;
        const containerY = screenCoords.y - containerRect.top;

        return {
            x: containerX,
            y: containerY
        };
    }

    subscribeToSliderEvents(swiper) {
        if (!swiper) return;


        swiper.on('touchStart', () => {
            this.isUserInteracting = true;


            if (this.currentArrow) {
                this.currentArrow.div.style.opacity = '0';
                setTimeout(() => {
                    if (this.currentArrow) {
                        this.currentArrow.div.remove();
                        this.currentArrow = null;
                    }
                }, 300);
            }


            if (this.animationTimeout) {
                clearTimeout(this.animationTimeout);
                this.animationTimeout = null;
            }
        });

        swiper.on('touchEnd', () => {

            if (this.interactionTimeout) {
                clearTimeout(this.interactionTimeout);
            }

            this.interactionTimeout = setTimeout(() => {
                this.isUserInteracting = false;
                this.interactionTimeout = null;
            }, 500);
        });

        swiper.on('slideChange', () => {
            this.onSlideChange();
        });

        setTimeout(() => {
            this.onSlideChange();
        }, 200);
    }

    onSlideChange() {

        if (this.isUserInteracting || this.isAnimating || !this.swiper) return;


        if (this.animationTimeout) {
            clearTimeout(this.animationTimeout);
            this.animationTimeout = null;
        }


        this.showArrow();
    }

    showArrow() {
        if (this.currentArrow) {
            this.currentArrow.div.remove();
            this.currentArrow = null;
        }

        const ballCoords = this.getBallContainerCoordinates();
        if (!ballCoords) return;

        this.currentArrow = this.createArrow(ballCoords.x, ballCoords.y);

        if (!this.currentArrow) return;

        setTimeout(() => {
            if (this.currentArrow && !this.isUserInteracting) {
                this.currentArrow.div.style.opacity = '1';
            }
        }, 50);

        this.animationTimeout = setTimeout(() => {
            if (this.currentArrow) {
                this.currentArrow.div.style.opacity = '0';

                setTimeout(() => {
                    if (this.currentArrow) {
                        this.currentArrow.div.remove();
                        this.currentArrow = null;
                    }
                }, 300);
            }
            this.animationTimeout = null;
        }, 1500);
    }

    createArrow(fromX, fromY) {
        const arrowDiv = document.createElement('div');
        arrowDiv.style.position = 'absolute';
        arrowDiv.style.top = '0';
        arrowDiv.style.left = '0';
        arrowDiv.style.width = '100%';
        arrowDiv.style.height = '100%';
        arrowDiv.style.pointerEvents = 'none';
        arrowDiv.style.zIndex = '15';
        arrowDiv.style.overflow = 'visible';
        arrowDiv.style.opacity = '0';
        arrowDiv.style.transition = 'opacity 0.3s ease';

        const arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');


        if (window.innerWidth <= 750) {

            arrowSvg.setAttribute('width', '8');
            arrowSvg.setAttribute('height', '88');
            arrowSvg.setAttribute('viewBox', '0 0 8 88');

            arrowSvg.style.position = 'absolute';
            arrowSvg.style.left = (fromX - 4) + 'px';
            arrowSvg.style.top = (fromY - 88) + 'px';
            arrowSvg.style.overflow = 'visible';
            arrowSvg.style.zIndex = '15';

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', 'M3.33004 0.146447C3.5253 -0.0488155 3.84189 -0.0488155 4.03715 0.146447L7.21913 3.32843C7.41439 3.52369 7.41439 3.84027 7.21913 4.03553C7.02387 4.2308 6.70728 4.2308 6.51202 4.03553L3.68359 1.20711L0.855167 4.03553C0.659904 4.2308 0.343322 4.2308 0.14806 4.03553C-0.0472023 3.84027 -0.0472023 3.52369 0.14806 3.32843L3.33004 0.146447ZM3.18359 88L3.18359 0.5L4.18359 0.5L4.18359 88L3.18359 88Z');
            path.setAttribute('fill', '#BBDFFD');

            arrowSvg.appendChild(path);
        } else {

            arrowSvg.setAttribute('width', '88');
            arrowSvg.setAttribute('height', '8');
            arrowSvg.setAttribute('viewBox', '0 0 88 8');

            arrowSvg.style.position = 'absolute';
            arrowSvg.style.left = (fromX - 88) + 'px';
            arrowSvg.style.top = (fromY - 4) + 'px';
            arrowSvg.style.overflow = 'visible';
            arrowSvg.style.zIndex = '15';

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', 'M0.146447 3.33004C-0.0488155 3.5253 -0.0488155 3.84189 0.146447 4.03715L3.32843 7.21913C3.52369 7.41439 3.84027 7.41439 4.03553 7.21913C4.2308 7.02387 4.2308 6.70728 4.03553 6.51202L1.20711 3.68359L4.03553 0.855167C4.2308 0.659904 4.2308 0.343322 4.03553 0.14806C3.84027 -0.0472023 3.52369 -0.0472023 3.32843 0.14806L0.146447 3.33004ZM88 3.68359V3.18359H0.5V3.68359V4.18359H88V3.68359Z');
            path.setAttribute('fill', '#BBDFFD');

            arrowSvg.appendChild(path);
        }

        arrowDiv.appendChild(arrowSvg);
        this.container.appendChild(arrowDiv);

        return {
            div: arrowDiv,
            svg: arrowSvg,
            path: arrowSvg.querySelector('path')
        };
    }

    destroy() {
        if (this.currentArrow) {
            this.currentArrow.div.remove();
            this.currentArrow = null;
        }

        if (this.animationTimeout) {
            clearTimeout(this.animationTimeout);
            this.animationTimeout = null;
        }

        if (this.interactionTimeout) {
            clearTimeout(this.interactionTimeout);
            this.interactionTimeout = null;
        }

        if (this.swiper) {
            this.swiper.off('touchStart');
            this.swiper.off('touchEnd');
            this.swiper.off('slideChange');
            this.swiper = null;
        }
    }
}