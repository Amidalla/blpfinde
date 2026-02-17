export default class ArrowPathAnimator {
    constructor() {
        this.firstArrow = null;
        this.secondArrow = null;
        this.thirdArrow = null;
        this.fourthArrow = null;
        this.fifthArrow = null;
        this.sixthArrow = null;
        this.firstBlock = null;
        this.secondBlock = null;
        this.thirdBlock = null;
        this.fourthBlock = null;
        this.fifthBlock = null;
        this.sixthBlock = null;
        this.arrowBallAnimator = null;
        this.isMobile = window.innerWidth <= 768;
        this.hasAnimated = false;
        this.isAnimating = false;
        this.observer = null;
        this.animationStage = 0;
        this.ballX = 0;
        this.ballY = 0;
        this.container = null;
    }


    getTranslateValue() {

        if (window.innerWidth <= 1700) {
            return 14;
        }

        return 90;
    }


    getArrowDisplayTime() {

        if (window.innerWidth <= 1700) {
            return 800;
        }
        return 600;
    }


    shouldShortenArrows() {
        return window.innerWidth <= 1700;
    }

    init() {
        this.findTargetBlocks();
        this.getBallCoordinates();
        this.getArrowBallAnimator();
        this.container = document.querySelector('.control-units');

        this.setupZIndex();

        if (this.isMobile) {
            this.showImmediately();
        } else {
            this.hide();
            this.setupScrollObserver();
        }

        window.addEventListener('resize', this.handleResize.bind(this));
        return this;
    }

    setupZIndex() {
        if (this.container) {
            this.container.style.position = 'relative';
            this.container.style.zIndex = '1';
        }

        const svg = document.querySelector('.control-units svg');
        if (svg) {
            svg.style.position = 'relative';
            svg.style.zIndex = '20';
        }

        const ballGroup = document.querySelector('.static-ball-group');
        if (ballGroup) {
            ballGroup.style.zIndex = '30';
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

    findTargetBlocks() {
        const section = document.querySelector('.control-units');
        if (!section) return;

        const blocks = section.querySelectorAll('.control-units__block');
        blocks.forEach((block) => {
            const title = block.querySelector('h4');
            if (title) {
                if (title.textContent.includes('Запутанные процессы')) {
                    this.firstBlock = block;
                    block.style.transform = '';
                    block.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s ease, color 0.2s ease';
                    block.classList.remove('active');
                }
                if (title.textContent.includes('Неэффективная работа сотрудников')) {
                    this.secondBlock = block;
                    block.style.transform = '';
                    block.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s ease, color 0.2s ease';
                    block.classList.remove('active');
                }
                if (title.textContent.includes('Нет понимания с чего начать')) {
                    this.thirdBlock = block;
                    block.style.transform = '';
                    block.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s ease, color 0.2s ease';
                    block.classList.remove('active');
                }
                if (title.textContent.includes('Отсутствие четкого видения изменений')) {
                    this.fourthBlock = block;
                    block.style.transform = '';
                    block.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s ease, color 0.2s ease';
                    block.classList.remove('active');
                }
                if (title.textContent.includes('Слабое вовлечение сотрудников')) {
                    this.fifthBlock = block;
                    block.style.transform = '';
                    block.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s ease, color 0.2s ease';
                    block.classList.remove('active');
                }
                if (title.textContent.includes('Понимание проблем не дает видения решения')) {
                    this.sixthBlock = block;
                    block.style.transform = '';
                    block.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s ease, color 0.2s ease';
                    block.classList.remove('active');
                }
            }
        });
    }

    createFirstArrow(ballX, ballY) {
        if (!this.firstBlock) return null;

        const arrowDiv = document.createElement('div');
        arrowDiv.style.position = 'absolute';
        arrowDiv.style.top = '0';
        arrowDiv.style.left = '0';
        arrowDiv.style.width = '100%';
        arrowDiv.style.height = '100%';
        arrowDiv.style.pointerEvents = 'none';
        arrowDiv.style.zIndex = '10';
        arrowDiv.style.overflow = 'visible';
        arrowDiv.style.opacity = '0';

        const displayTime = this.getArrowDisplayTime();
        arrowDiv.style.transition = `opacity ${displayTime * 0.3}ms ease`;

        const svg = document.querySelector('.control-units svg');
        const svgRect = svg.getBoundingClientRect();
        const containerRect = this.container.getBoundingClientRect();

        const ballContainerX = svgRect.left - containerRect.left + ballX;
        const ballContainerY = svgRect.top - containerRect.top + ballY;

        const arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

        const shorten = this.shouldShortenArrows();

        if (shorten) {

            arrowSvg.setAttribute('width', '133');
            arrowSvg.setAttribute('height', '60');

            arrowSvg.setAttribute('viewBox', '0 0 133 60');
        } else {
            arrowSvg.setAttribute('width', '241');
            arrowSvg.setAttribute('height', '60');
            arrowSvg.setAttribute('viewBox', '0 0 241 60');
        }

        arrowSvg.style.position = 'absolute';


        if (window.innerWidth <= 1700) {
            arrowSvg.style.left = (ballContainerX - 131) + 'px';
            arrowSvg.style.top = (ballContainerY - 57.2941) + 'px';
        } else {
            arrowSvg.style.left = (ballContainerX - 237.5) + 'px';
            arrowSvg.style.top = (ballContainerY - 57.2941) + 'px';
        }

        arrowSvg.style.overflow = 'visible';
        arrowSvg.style.transform = 'none';
        arrowSvg.style.zIndex = '10';

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        if (shorten) {

            path.setAttribute('d', 'M126.833 57.2941C126.833 58.7668 128.027 59.9607 129.5 59.9607C130.973 59.9607 132.167 58.7668 132.167 57.2941C132.167 55.8213 130.973 54.6274 129.5 54.6274C128.027 54.6274 126.833 55.8213 126.833 57.2941ZM0.0647185 14.0481C-0.0711593 14.2885 0.0135722 14.5935 0.253972 14.7294L4.17151 16.9436C4.4119 17.0795 4.71694 16.9948 4.85282 16.7544C4.98869 16.514 4.90396 16.2089 4.66356 16.0731L1.18131 14.1048L3.14954 10.6226C3.28541 10.3822 3.20068 10.0771 2.96028 9.94127C2.71988 9.80539 2.41485 9.89012 2.27897 10.1305L0.0647185 14.0481ZM129.5 57.2941L129.85 56.9372C99.196 26.2859 58.999 9.2754 0.366178 13.8123L0.5 14.2941L0.633822 14.7758C58.901 10.3127 98.804 27.1021 129.15 57.651L129.5 57.2941Z');
        } else {
            path.setAttribute('d', 'M234.833 57.2941C234.833 58.7668 236.027 59.9607 237.5 59.9607C238.973 59.9607 240.167 58.7668 240.167 57.2941C240.167 55.8213 238.973 54.6274 237.5 54.6274C236.027 54.6274 234.833 55.8213 234.833 57.2941ZM0.0647185 14.0481C-0.0711593 14.2885 0.0135722 14.5935 0.253972 14.7294L4.17151 16.9436C4.4119 17.0795 4.71694 16.9948 4.85282 16.7544C4.98869 16.514 4.90396 16.2089 4.66356 16.0731L1.18131 14.1048L3.14954 10.6226C3.28541 10.3822 3.20068 10.0771 2.96028 9.94127C2.71988 9.80539 2.41485 9.89012 2.27897 10.1305L0.0647185 14.0481ZM237.5 57.2941L237.85 56.9372C184.696 4.78592 108.499 -16.2246 0.366178 13.8123L0.5 14.2941L0.633822 14.7758C108.501 -15.1873 184.304 5.80215 237.15 57.651L237.5 57.2941Z');
        }

        path.setAttribute('fill', '#BBDFFD');

        arrowSvg.appendChild(path);
        arrowDiv.appendChild(arrowSvg);
        this.container.appendChild(arrowDiv);

        return {
            div: arrowDiv,
            svg: arrowSvg,
            path: path,
            ballContainerX,
            ballContainerY
        };
    }

    createSecondArrow(ballContainerX, ballContainerY) {
        if (!this.secondBlock) return null;

        const arrowDiv = document.createElement('div');
        arrowDiv.style.position = 'absolute';
        arrowDiv.style.top = '0';
        arrowDiv.style.left = '0';
        arrowDiv.style.width = '100%';
        arrowDiv.style.height = '100%';
        arrowDiv.style.pointerEvents = 'none';
        arrowDiv.style.zIndex = '10';
        arrowDiv.style.overflow = 'visible';
        arrowDiv.style.opacity = '0';

        const displayTime = this.getArrowDisplayTime();
        arrowDiv.style.transition = `opacity ${displayTime * 0.3}ms ease`;

        let arrowLeft, arrowTop;

        if (window.innerWidth <= 1700) {
            arrowLeft = ballContainerX - 2;
            arrowTop = ballContainerY - 57.2941;
        } else {
            arrowLeft = ballContainerX - 3.5;
            arrowTop = ballContainerY - 57.2941;
        }

        const arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

        const shorten = this.shouldShortenArrows();

        if (shorten) {
            arrowSvg.setAttribute('width', '133');
            arrowSvg.setAttribute('height', '60');
            arrowSvg.setAttribute('viewBox', '0 0 133 60');
        } else {
            arrowSvg.setAttribute('width', '241');
            arrowSvg.setAttribute('height', '60');
            arrowSvg.setAttribute('viewBox', '0 0 241 60');
        }

        arrowSvg.style.position = 'absolute';
        arrowSvg.style.left = arrowLeft + 'px';
        arrowSvg.style.top = arrowTop + 'px';
        arrowSvg.style.overflow = 'visible';
        arrowSvg.style.zIndex = '10';
        arrowSvg.style.transform = 'scaleX(-1)';

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        if (shorten) {
            path.setAttribute('d', 'M126.833 57.2941C126.833 58.7668 128.027 59.9607 129.5 59.9607C130.973 59.9607 132.167 58.7668 132.167 57.2941C132.167 55.8213 130.973 54.6274 129.5 54.6274C128.027 54.6274 126.833 55.8213 126.833 57.2941ZM0.0647185 14.0481C-0.0711593 14.2885 0.0135722 14.5935 0.253972 14.7294L4.17151 16.9436C4.4119 17.0795 4.71694 16.9948 4.85282 16.7544C4.98869 16.514 4.90396 16.2089 4.66356 16.0731L1.18131 14.1048L3.14954 10.6226C3.28541 10.3822 3.20068 10.0771 2.96028 9.94127C2.71988 9.80539 2.41485 9.89012 2.27897 10.1305L0.0647185 14.0481ZM129.5 57.2941L129.85 56.9372C99.196 26.2859 58.999 9.2754 0.366178 13.8123L0.5 14.2941L0.633822 14.7758C58.901 10.3127 98.804 27.1021 129.15 57.651L129.5 57.2941Z');
        } else {
            path.setAttribute('d', 'M234.833 57.2941C234.833 58.7668 236.027 59.9607 237.5 59.9607C238.973 59.9607 240.167 58.7668 240.167 57.2941C240.167 55.8213 238.973 54.6274 237.5 54.6274C236.027 54.6274 234.833 55.8213 234.833 57.2941ZM0.0647185 14.0481C-0.0711593 14.2885 0.0135722 14.5935 0.253972 14.7294L4.17151 16.9436C4.4119 17.0795 4.71694 16.9948 4.85282 16.7544C4.98869 16.514 4.90396 16.2089 4.66356 16.0731L1.18131 14.1048L3.14954 10.6226C3.28541 10.3822 3.20068 10.0771 2.96028 9.94127C2.71988 9.80539 2.41485 9.89012 2.27897 10.1305L0.0647185 14.0481ZM237.5 57.2941L237.85 56.9372C184.696 4.78592 108.499 -16.2246 0.366178 13.8123L0.5 14.2941L0.633822 14.7758C108.501 -15.1873 184.304 5.80215 237.15 57.651L237.5 57.2941Z');
        }

        path.setAttribute('fill', '#BBDFFD');

        arrowSvg.appendChild(path);
        arrowDiv.appendChild(arrowSvg);
        this.container.appendChild(arrowDiv);

        return {
            div: arrowDiv,
            svg: arrowSvg,
            path: path,
            ballContainerX,
            ballContainerY,
            arrowLeft,
            arrowTop
        };
    }

    createThirdArrow(ballContainerX, ballContainerY) {
        if (!this.thirdBlock) return null;

        const arrowDiv = document.createElement('div');
        arrowDiv.style.position = 'absolute';
        arrowDiv.style.top = '0';
        arrowDiv.style.left = '0';
        arrowDiv.style.width = '100%';
        arrowDiv.style.height = '100%';
        arrowDiv.style.pointerEvents = 'none';
        arrowDiv.style.zIndex = '10';
        arrowDiv.style.overflow = 'visible';
        arrowDiv.style.opacity = '0';

        const displayTime = this.getArrowDisplayTime();
        arrowDiv.style.transition = `opacity ${displayTime * 0.3}ms ease`;

        let arrowLeft, arrowTop;

        if (window.innerWidth <= 1700) {
            arrowLeft = ballContainerX - 0;
            arrowTop = ballContainerY - 4;
        } else {
            arrowLeft = ballContainerX - 0;
            arrowTop = ballContainerY - 4;
        }

        const arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

        const shorten = this.shouldShortenArrows();

        if (shorten) {
            arrowSvg.setAttribute('width', '66');
            arrowSvg.setAttribute('height', '8');
            arrowSvg.setAttribute('viewBox', '0 0 66 8');
        } else {
            arrowSvg.setAttribute('width', '120');
            arrowSvg.setAttribute('height', '8');
            arrowSvg.setAttribute('viewBox', '0 0 120 8');
        }

        arrowSvg.style.position = 'absolute';
        arrowSvg.style.left = arrowLeft + 'px';
        arrowSvg.style.top = arrowTop + 'px';
        arrowSvg.style.overflow = 'visible';
        arrowSvg.style.zIndex = '10';
        arrowSvg.style.transform = 'scaleX(-1)';

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        if (shorten) {
            path.setAttribute('d', 'M0.146447 3.33004C-0.0488155 3.5253 -0.0488155 3.84189 0.146447 4.03715L3.32843 7.21913C3.52369 7.41439 3.84027 7.41439 4.03553 7.21913C4.2308 7.02387 4.2308 6.70728 4.03553 6.51202L1.20711 3.68359L4.03553 0.855167C4.2308 0.659904 4.2308 0.343322 4.03553 0.14806C3.84027 -0.0472023 3.52369 -0.0472023 3.32843 0.14806L0.146447 3.33004ZM66 3.68359V3.18359H0.5V3.68359V4.18359H66V3.68359Z');
        } else {
            path.setAttribute('d', 'M0.146447 3.33004C-0.0488155 3.5253 -0.0488155 3.84189 0.146447 4.03715L3.32843 7.21913C3.52369 7.41439 3.84027 7.41439 4.03553 7.21913C4.2308 7.02387 4.2308 6.70728 4.03553 6.51202L1.20711 3.68359L4.03553 0.855167C4.2308 0.659904 4.2308 0.343322 4.03553 0.14806C3.84027 -0.0472023 3.52369 -0.0472023 3.32843 0.14806L0.146447 3.33004ZM120 3.68359V3.18359H0.5V3.68359V4.18359H120V3.68359Z');
        }

        path.setAttribute('fill', '#BBDFFD');

        arrowSvg.appendChild(path);
        arrowDiv.appendChild(arrowSvg);
        this.container.appendChild(arrowDiv);

        return {
            div: arrowDiv,
            svg: arrowSvg,
            path: path,
            ballContainerX,
            ballContainerY,
            arrowLeft,
            arrowTop
        };
    }

    createFourthArrow(ballContainerX, ballContainerY) {
        if (!this.fourthBlock) return null;

        const arrowDiv = document.createElement('div');
        arrowDiv.style.position = 'absolute';
        arrowDiv.style.top = '0';
        arrowDiv.style.left = '0';
        arrowDiv.style.width = '100%';
        arrowDiv.style.height = '100%';
        arrowDiv.style.pointerEvents = 'none';
        arrowDiv.style.zIndex = '10';
        arrowDiv.style.overflow = 'visible';
        arrowDiv.style.opacity = '0';

        const displayTime = this.getArrowDisplayTime();
        arrowDiv.style.transition = `opacity ${displayTime * 0.3}ms ease`;

        let arrowLeft, arrowTop;

        if (window.innerWidth <= 1700) {
            arrowLeft = ballContainerX - 2;
            arrowTop = ballContainerY - 2.7059;
        } else {
            arrowLeft = ballContainerX - 3.5;
            arrowTop = ballContainerY - 2.7059;
        }

        const arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

        const shorten = this.shouldShortenArrows();

        if (shorten) {
            arrowSvg.setAttribute('width', '133');
            arrowSvg.setAttribute('height', '60');
            arrowSvg.setAttribute('viewBox', '0 0 133 60');
        } else {
            arrowSvg.setAttribute('width', '241');
            arrowSvg.setAttribute('height', '60');
            arrowSvg.setAttribute('viewBox', '0 0 241 60');
        }

        arrowSvg.style.position = 'absolute';
        arrowSvg.style.left = arrowLeft + 'px';
        arrowSvg.style.top = arrowTop + 'px';
        arrowSvg.style.overflow = 'visible';
        arrowSvg.style.zIndex = '10';
        arrowSvg.style.transform = 'scaleX(-1) scaleY(-1)';

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        if (shorten) {
            path.setAttribute('d', 'M126.833 57.2941C126.833 58.7668 128.027 59.9607 129.5 59.9607C130.973 59.9607 132.167 58.7668 132.167 57.2941C132.167 55.8213 130.973 54.6274 129.5 54.6274C128.027 54.6274 126.833 55.8213 126.833 57.2941ZM0.0647185 14.0481C-0.0711593 14.2885 0.0135722 14.5935 0.253972 14.7294L4.17151 16.9436C4.4119 17.0795 4.71694 16.9948 4.85282 16.7544C4.98869 16.514 4.90396 16.2089 4.66356 16.0731L1.18131 14.1048L3.14954 10.6226C3.28541 10.3822 3.20068 10.0771 2.96028 9.94127C2.71988 9.80539 2.41485 9.89012 2.27897 10.1305L0.0647185 14.0481ZM129.5 57.2941L129.85 56.9372C99.196 26.2859 58.999 9.2754 0.366178 13.8123L0.5 14.2941L0.633822 14.7758C58.901 10.3127 98.804 27.1021 129.15 57.651L129.5 57.2941Z');
        } else {
            path.setAttribute('d', 'M234.833 57.2941C234.833 58.7668 236.027 59.9607 237.5 59.9607C238.973 59.9607 240.167 58.7668 240.167 57.2941C240.167 55.8213 238.973 54.6274 237.5 54.6274C236.027 54.6274 234.833 55.8213 234.833 57.2941ZM0.0647185 14.0481C-0.0711593 14.2885 0.0135722 14.5935 0.253972 14.7294L4.17151 16.9436C4.4119 17.0795 4.71694 16.9948 4.85282 16.7544C4.98869 16.514 4.90396 16.2089 4.66356 16.0731L1.18131 14.1048L3.14954 10.6226C3.28541 10.3822 3.20068 10.0771 2.96028 9.94127C2.71988 9.80539 2.41485 9.89012 2.27897 10.1305L0.0647185 14.0481ZM237.5 57.2941L237.85 56.9372C184.696 4.78592 108.499 -16.2246 0.366178 13.8123L0.5 14.2941L0.633822 14.7758C108.501 -15.1873 184.304 5.80215 237.15 57.651L237.5 57.2941Z');
        }

        path.setAttribute('fill', '#BBDFFD');

        arrowSvg.appendChild(path);
        arrowDiv.appendChild(arrowSvg);
        this.container.appendChild(arrowDiv);

        return {
            div: arrowDiv,
            svg: arrowSvg,
            path: path,
            ballContainerX,
            ballContainerY,
            arrowLeft,
            arrowTop
        };
    }

    createFifthArrow(ballContainerX, ballContainerY) {
        if (!this.fifthBlock) return null;

        const arrowDiv = document.createElement('div');
        arrowDiv.style.position = 'absolute';
        arrowDiv.style.top = '0';
        arrowDiv.style.left = '0';
        arrowDiv.style.width = '100%';
        arrowDiv.style.height = '100%';
        arrowDiv.style.pointerEvents = 'none';
        arrowDiv.style.zIndex = '10';
        arrowDiv.style.overflow = 'visible';
        arrowDiv.style.opacity = '0';

        const displayTime = this.getArrowDisplayTime();
        arrowDiv.style.transition = `opacity ${displayTime * 0.3}ms ease`;

        let arrowLeft, arrowTop;

        if (window.innerWidth <= 1700) {
            arrowLeft = ballContainerX - 131;
            arrowTop = ballContainerY - 2.7059;
        } else {
            arrowLeft = ballContainerX - 237.5;
            arrowTop = ballContainerY - 2.7059;
        }

        const arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

        const shorten = this.shouldShortenArrows();

        if (shorten) {
            arrowSvg.setAttribute('width', '133');
            arrowSvg.setAttribute('height', '60');
            arrowSvg.setAttribute('viewBox', '0 0 133 60');
        } else {
            arrowSvg.setAttribute('width', '241');
            arrowSvg.setAttribute('height', '60');
            arrowSvg.setAttribute('viewBox', '0 0 241 60');
        }

        arrowSvg.style.position = 'absolute';
        arrowSvg.style.left = arrowLeft + 'px';
        arrowSvg.style.top = arrowTop + 'px';
        arrowSvg.style.overflow = 'visible';
        arrowSvg.style.zIndex = '10';
        arrowSvg.style.transform = 'scaleY(-1)';

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        if (shorten) {
            path.setAttribute('d', 'M126.833 57.2941C126.833 58.7668 128.027 59.9607 129.5 59.9607C130.973 59.9607 132.167 58.7668 132.167 57.2941C132.167 55.8213 130.973 54.6274 129.5 54.6274C128.027 54.6274 126.833 55.8213 126.833 57.2941ZM0.0647185 14.0481C-0.0711593 14.2885 0.0135722 14.5935 0.253972 14.7294L4.17151 16.9436C4.4119 17.0795 4.71694 16.9948 4.85282 16.7544C4.98869 16.514 4.90396 16.2089 4.66356 16.0731L1.18131 14.1048L3.14954 10.6226C3.28541 10.3822 3.20068 10.0771 2.96028 9.94127C2.71988 9.80539 2.41485 9.89012 2.27897 10.1305L0.0647185 14.0481ZM129.5 57.2941L129.85 56.9372C99.196 26.2859 58.999 9.2754 0.366178 13.8123L0.5 14.2941L0.633822 14.7758C58.901 10.3127 98.804 27.1021 129.15 57.651L129.5 57.2941Z');
        } else {
            path.setAttribute('d', 'M234.833 57.2941C234.833 58.7668 236.027 59.9607 237.5 59.9607C238.973 59.9607 240.167 58.7668 240.167 57.2941C240.167 55.8213 238.973 54.6274 237.5 54.6274C236.027 54.6274 234.833 55.8213 234.833 57.2941ZM0.0647185 14.0481C-0.0711593 14.2885 0.0135722 14.5935 0.253972 14.7294L4.17151 16.9436C4.4119 17.0795 4.71694 16.9948 4.85282 16.7544C4.98869 16.514 4.90396 16.2089 4.66356 16.0731L1.18131 14.1048L3.14954 10.6226C3.28541 10.3822 3.20068 10.0771 2.96028 9.94127C2.71988 9.80539 2.41485 9.89012 2.27897 10.1305L0.0647185 14.0481ZM237.5 57.2941L237.85 56.9372C184.696 4.78592 108.499 -16.2246 0.366178 13.8123L0.5 14.2941L0.633822 14.7758C108.501 -15.1873 184.304 5.80215 237.15 57.651L237.5 57.2941Z');
        }

        path.setAttribute('fill', '#BBDFFD');

        arrowSvg.appendChild(path);
        arrowDiv.appendChild(arrowSvg);
        this.container.appendChild(arrowDiv);

        return {
            div: arrowDiv,
            svg: arrowSvg,
            path: path,
            ballContainerX,
            ballContainerY,
            arrowLeft,
            arrowTop
        };
    }

    createSixthArrow(ballContainerX, ballContainerY) {
        if (!this.sixthBlock) return null;

        const arrowDiv = document.createElement('div');
        arrowDiv.style.position = 'absolute';
        arrowDiv.style.top = '0';
        arrowDiv.style.left = '0';
        arrowDiv.style.width = '100%';
        arrowDiv.style.height = '100%';
        arrowDiv.style.pointerEvents = 'none';
        arrowDiv.style.zIndex = '10';
        arrowDiv.style.overflow = 'visible';
        arrowDiv.style.opacity = '0';

        const displayTime = this.getArrowDisplayTime();
        arrowDiv.style.transition = `opacity ${displayTime * 0.3}ms ease`;

        let arrowLeft, arrowTop;

        if (window.innerWidth <= 1700) {
            arrowLeft = ballContainerX - 66;
            arrowTop = ballContainerY - 4;
        } else {
            arrowLeft = ballContainerX - 120;
            arrowTop = ballContainerY - 4;
        }

        const arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

        const shorten = this.shouldShortenArrows();

        if (shorten) {
            arrowSvg.setAttribute('width', '66');
            arrowSvg.setAttribute('height', '8');
            arrowSvg.setAttribute('viewBox', '0 0 66 8');
        } else {
            arrowSvg.setAttribute('width', '120');
            arrowSvg.setAttribute('height', '8');
            arrowSvg.setAttribute('viewBox', '0 0 120 8');
        }

        arrowSvg.style.position = 'absolute';
        arrowSvg.style.left = arrowLeft + 'px';
        arrowSvg.style.top = arrowTop + 'px';
        arrowSvg.style.overflow = 'visible';
        arrowSvg.style.zIndex = '10';
        arrowSvg.style.transform = 'scaleY(-1)';

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        if (shorten) {
            path.setAttribute('d', 'M0.146447 3.33004C-0.0488155 3.5253 -0.0488155 3.84189 0.146447 4.03715L3.32843 7.21913C3.52369 7.41439 3.84027 7.41439 4.03553 7.21913C4.2308 7.02387 4.2308 6.70728 4.03553 6.51202L1.20711 3.68359L4.03553 0.855167C4.2308 0.659904 4.2308 0.343322 4.03553 0.14806C3.84027 -0.0472023 3.52369 -0.0472023 3.32843 0.14806L0.146447 3.33004ZM66 3.68359V3.18359H0.5V3.68359V4.18359H66V3.68359Z');
        } else {
            path.setAttribute('d', 'M0.146447 3.33004C-0.0488155 3.5253 -0.0488155 3.84189 0.146447 4.03715L3.32843 7.21913C3.52369 7.41439 3.84027 7.41439 4.03553 7.21913C4.2308 7.02387 4.2308 6.70728 4.03553 6.51202L1.20711 3.68359L4.03553 0.855167C4.2308 0.659904 4.2308 0.343322 4.03553 0.14806C3.84027 -0.0472023 3.52369 -0.0472023 3.32843 0.14806L0.146447 3.33004ZM120 3.68359V3.18359H0.5V3.68359V4.18359H120V3.68359Z');
        }

        path.setAttribute('fill', '#BBDFFD');

        arrowSvg.appendChild(path);
        arrowDiv.appendChild(arrowSvg);
        this.container.appendChild(arrowDiv);

        return {
            div: arrowDiv,
            svg: arrowSvg,
            path: path,
            ballContainerX,
            ballContainerY,
            arrowLeft,
            arrowTop
        };
    }

    startAnimation() {
        if (this.isMobile || this.hasAnimated || this.isAnimating) return;

        this.isAnimating = true;
        this.animationStage = 1;

        const ball = this.getBallCoordinates();
        if (!ball) return;

        this.firstArrow = this.createFirstArrow(ball.x, ball.y);
        if (!this.firstArrow || !this.firstBlock) {
            this.isAnimating = false;
            return;
        }

        const displayTime = this.getArrowDisplayTime();

        this.firstArrow.div.style.opacity = '1';
        this.firstBlock.classList.add('active');

        const translateValue = this.getTranslateValue();
        this.firstBlock.style.transform = `translateX(-${translateValue}px)`;

        setTimeout(() => {
            this.firstArrow.div.style.opacity = '0';
            this.firstBlock.classList.remove('active');

            setTimeout(() => {
                if (this.arrowBallAnimator) {
                    this.arrowBallAnimator.moveToOneOClock();
                }

                setTimeout(() => {
                    if (this.secondArrow?.div) {
                        this.secondArrow.div.remove();
                        this.secondArrow = null;
                    }

                    document.querySelectorAll('[data-debug-marker]').forEach(el => el.remove());
                    this.startSecondArrow();
                }, 600);
            }, 200);
        }, displayTime);
    }

    startSecondArrow() {
        this.animationStage = 2;

        const ballContainer = this.getBallContainerCoordinates();
        if (!ballContainer || !this.secondBlock) return;

        this.secondArrow = this.createSecondArrow(ballContainer.x, ballContainer.y);
        if (!this.secondArrow) return;

        const displayTime = this.getArrowDisplayTime();

        this.secondArrow.div.style.opacity = '1';
        this.secondBlock.classList.add('active');

        const translateValue = this.getTranslateValue();
        this.secondBlock.style.transform = `translateX(${translateValue}px)`;

        setTimeout(() => {
            this.secondArrow.div.style.opacity = '0';
            this.secondBlock.classList.remove('active');

            if (this.arrowBallAnimator) {
                this.arrowBallAnimator.moveToThreeOClock(() => {
                    setTimeout(() => {
                        this.startThirdArrow();
                    }, 200);
                });
            } else {
                this.hasAnimated = true;
                this.isAnimating = false;
                this.animationStage = 0;
            }
        }, displayTime);
    }

    startThirdArrow() {
        this.animationStage = 3;

        const ballContainer = this.getBallContainerCoordinates();
        if (!ballContainer || !this.thirdBlock) {
            this.hasAnimated = true;
            this.isAnimating = false;
            this.animationStage = 0;
            return;
        }

        this.thirdArrow = this.createThirdArrow(ballContainer.x, ballContainer.y);
        if (!this.thirdArrow) {
            this.hasAnimated = true;
            this.isAnimating = false;
            this.animationStage = 0;
            return;
        }

        const displayTime = this.getArrowDisplayTime();

        this.thirdArrow.div.style.opacity = '1';
        this.thirdBlock.classList.add('active');

        const translateValue = this.getTranslateValue();
        this.thirdBlock.style.transform = `translateX(${translateValue}px)`;

        setTimeout(() => {
            this.thirdArrow.div.style.opacity = '0';
            this.thirdBlock.classList.remove('active');

            if (this.arrowBallAnimator) {
                this.arrowBallAnimator.moveToFiveOClock(() => {
                    setTimeout(() => {
                        this.startFourthArrow();
                    }, 200);
                });
            } else {
                this.hasAnimated = true;
                this.isAnimating = false;
                this.animationStage = 0;
            }
        }, displayTime);
    }

    startFourthArrow() {
        this.animationStage = 4;

        const ballContainer = this.getBallContainerCoordinates();
        if (!ballContainer || !this.fourthBlock) {
            this.hasAnimated = true;
            this.isAnimating = false;
            this.animationStage = 0;
            return;
        }

        this.fourthArrow = this.createFourthArrow(ballContainer.x, ballContainer.y);
        if (!this.fourthArrow) {
            this.hasAnimated = true;
            this.isAnimating = false;
            this.animationStage = 0;
            return;
        }

        const displayTime = this.getArrowDisplayTime();

        this.fourthArrow.div.style.opacity = '1';
        this.fourthBlock.classList.add('active');

        const translateValue = this.getTranslateValue();
        this.fourthBlock.style.transform = `translateX(${translateValue}px)`;

        setTimeout(() => {
            this.fourthArrow.div.style.opacity = '0';
            this.fourthBlock.classList.remove('active');

            if (this.arrowBallAnimator) {
                this.arrowBallAnimator.moveToSevenOClock(() => {
                    setTimeout(() => {
                        this.startFifthArrow();
                    }, 200);
                });
            } else {
                this.hasAnimated = true;
                this.isAnimating = false;
                this.animationStage = 0;
            }
        }, displayTime);
    }

    startFifthArrow() {
        this.animationStage = 5;

        const ballContainer = this.getBallContainerCoordinates();
        if (!ballContainer || !this.fifthBlock) {
            this.hasAnimated = true;
            this.isAnimating = false;
            this.animationStage = 0;
            return;
        }

        this.fifthArrow = this.createFifthArrow(ballContainer.x, ballContainer.y);
        if (!this.fifthArrow) {
            this.hasAnimated = true;
            this.isAnimating = false;
            this.animationStage = 0;
            return;
        }

        const displayTime = this.getArrowDisplayTime();

        this.fifthArrow.div.style.opacity = '1';
        this.fifthBlock.classList.add('active');

        const translateValue = this.getTranslateValue();
        this.fifthBlock.style.transform = `translateX(-${translateValue}px)`;

        setTimeout(() => {
            this.fifthArrow.div.style.opacity = '0';
            this.fifthBlock.classList.remove('active');

            if (this.arrowBallAnimator) {
                this.arrowBallAnimator.moveToNineOClock(() => {
                    setTimeout(() => {
                        this.startSixthArrow();
                    }, 200);
                });
            } else {
                this.hasAnimated = true;
                this.isAnimating = false;
                this.animationStage = 0;
            }
        }, displayTime);
    }

    startSixthArrow() {
        this.animationStage = 6;

        const ballContainer = this.getBallContainerCoordinates();
        if (!ballContainer || !this.sixthBlock) {
            this.hasAnimated = true;
            this.isAnimating = false;
            this.animationStage = 0;
            return;
        }

        this.sixthArrow = this.createSixthArrow(ballContainer.x, ballContainer.y);
        if (!this.sixthArrow) {
            this.hasAnimated = true;
            this.isAnimating = false;
            this.animationStage = 0;
            return;
        }

        const displayTime = this.getArrowDisplayTime();

        this.sixthArrow.div.style.opacity = '1';
        this.sixthBlock.classList.add('active');

        const translateValue = this.getTranslateValue();
        this.sixthBlock.style.transform = `translateX(-${translateValue}px)`;

        setTimeout(() => {
            this.sixthArrow.div.style.opacity = '0';
            this.sixthBlock.classList.remove('active');

            if (this.arrowBallAnimator) {
                this.scaleBallToZero();
            } else {
                this.hasAnimated = true;
                this.isAnimating = false;
                this.animationStage = 0;
            }
        }, displayTime);
    }

    scaleBallToZero() {
        const ballGroup = document.querySelector('.static-ball-group');
        if (!ballGroup) {
            this.hasAnimated = true;
            this.isAnimating = false;
            this.animationStage = 0;
            return;
        }

        const blueCircle = ballGroup.querySelector('.static-ball-blue');
        if (blueCircle) {
            const cx = blueCircle.getAttribute('cx');
            const cy = blueCircle.getAttribute('cy');
            ballGroup.style.transformOrigin = `${cx}px ${cy}px`;
        }

        ballGroup.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease';
        ballGroup.style.transform = 'scale(0)';
        ballGroup.style.opacity = '0';

        setTimeout(() => {
            if (this.arrowBallAnimator) {
                this.arrowBallAnimator.destroy();
            }
            this.hasAnimated = true;
            this.isAnimating = false;
            this.animationStage = 0;
        }, 800);
    }

    hide() {
        if (this.firstArrow) this.firstArrow.div.style.opacity = '0';
        if (this.secondArrow) this.secondArrow.div.style.opacity = '0';
        if (this.thirdArrow) this.thirdArrow.div.style.opacity = '0';
        if (this.fourthArrow) this.fourthArrow.div.style.opacity = '0';
        if (this.fifthArrow) this.fifthArrow.div.style.opacity = '0';
        if (this.sixthArrow) this.sixthArrow.div.style.opacity = '0';
        if (this.firstBlock) {
            this.firstBlock.style.transform = '';
            this.firstBlock.classList.remove('active');
        }
        if (this.secondBlock) {
            this.secondBlock.style.transform = '';
            this.secondBlock.classList.remove('active');
        }
        if (this.thirdBlock) {
            this.thirdBlock.style.transform = '';
            this.thirdBlock.classList.remove('active');
        }
        if (this.fourthBlock) {
            this.fourthBlock.style.transform = '';
            this.fourthBlock.classList.remove('active');
        }
        if (this.fifthBlock) {
            this.fifthBlock.style.transform = '';
            this.fifthBlock.classList.remove('active');
        }
        if (this.sixthBlock) {
            this.sixthBlock.style.transform = '';
            this.sixthBlock.classList.remove('active');
        }
    }

    showImmediately() {
        const translateValue = this.getTranslateValue();

        if (this.firstBlock) this.firstBlock.style.transform = `translateX(-${translateValue}px)`;
        if (this.secondBlock) this.secondBlock.style.transform = `translateX(${translateValue}px)`;
        if (this.thirdBlock) this.thirdBlock.style.transform = `translateX(${translateValue}px)`;
        if (this.fourthBlock) this.fourthBlock.style.transform = `translateX(${translateValue}px)`;
        if (this.fifthBlock) this.fifthBlock.style.transform = `translateX(-${translateValue}px)`;
        if (this.sixthBlock) this.sixthBlock.style.transform = `translateX(-${translateValue}px)`;
        this.hasAnimated = true;
    }

    setupScrollObserver() {
        const section = document.querySelector('.control-units');
        if (!section) {
            this.startAnimation();
            return;
        }

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated && !this.isAnimating) {
                    this.startAnimation();
                    this.observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        this.observer.observe(section);
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;

        const translateValue = this.getTranslateValue();

        if (this.hasAnimated) {
            this.destroyArrow();
            if (this.firstBlock) {
                this.firstBlock.style.transform = `translateX(-${translateValue}px)`;
                this.firstBlock.classList.remove('active');
            }
            if (this.secondBlock) {
                this.secondBlock.style.transform = `translateX(${translateValue}px)`;
                this.secondBlock.classList.remove('active');
            }
            if (this.thirdBlock) {
                this.thirdBlock.style.transform = `translateX(${translateValue}px)`;
                this.thirdBlock.classList.remove('active');
            }
            if (this.fourthBlock) {
                this.fourthBlock.style.transform = `translateX(${translateValue}px)`;
                this.fourthBlock.classList.remove('active');
            }
            if (this.fifthBlock) {
                this.fifthBlock.style.transform = `translateX(-${translateValue}px)`;
                this.fifthBlock.classList.remove('active');
            }
            if (this.sixthBlock) {
                this.sixthBlock.style.transform = `translateX(-${translateValue}px)`;
                this.sixthBlock.classList.remove('active');
            }
        }

        if (wasMobile !== this.isMobile) {
            if (this.isMobile) {
                this.showImmediately();
            } else {
                this.destroyArrow();
                this.hide();
                this.hasAnimated = false;
                this.isAnimating = false;
                this.animationStage = 0;
                if (this.observer) this.observer.disconnect();
                this.setupScrollObserver();
            }
        }
    }

    destroyArrow() {
        if (this.firstArrow?.div) this.firstArrow.div.remove();
        if (this.secondArrow?.div) this.secondArrow.div.remove();
        if (this.thirdArrow?.div) this.thirdArrow.div.remove();
        if (this.fourthArrow?.div) this.fourthArrow.div.remove();
        if (this.fifthArrow?.div) this.fifthArrow.div.remove();
        if (this.sixthArrow?.div) this.sixthArrow.div.remove();
        this.firstArrow = null;
        this.secondArrow = null;
        this.thirdArrow = null;
        this.fourthArrow = null;
        this.fifthArrow = null;
        this.sixthArrow = null;
    }

    destroy() {
        this.destroyArrow();
        if (this.firstBlock) {
            this.firstBlock.style.transform = '';
            this.firstBlock.classList.remove('active');
        }
        if (this.secondBlock) {
            this.secondBlock.style.transform = '';
            this.secondBlock.classList.remove('active');
        }
        if (this.thirdBlock) {
            this.thirdBlock.style.transform = '';
            this.thirdBlock.classList.remove('active');
        }
        if (this.fourthBlock) {
            this.fourthBlock.style.transform = '';
            this.fourthBlock.classList.remove('active');
        }
        if (this.fifthBlock) {
            this.fifthBlock.style.transform = '';
            this.fifthBlock.classList.remove('active');
        }
        if (this.sixthBlock) {
            this.sixthBlock.style.transform = '';
            this.sixthBlock.classList.remove('active');
        }
        if (this.observer) this.observer.disconnect();
        window.removeEventListener('resize', this.handleResize.bind(this));
    }
}