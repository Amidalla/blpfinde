export default class ArrowBallAnimator {
    constructor() {
        const rect = document.querySelector('rect[x="9.32989"][y="9.32989"][width="383.661"]');
        if (rect) {
            const x = parseFloat(rect.getAttribute('x') || '0');
            const y = parseFloat(rect.getAttribute('y') || '0');
            const width = parseFloat(rect.getAttribute('width') || '0');
            const height = parseFloat(rect.getAttribute('height') || '0');
            this.centerX = x + width / 2;
            this.centerY = y + height / 2;
        } else {
            this.centerX = 201.16;
            this.centerY = 201.16;
        }

        this.radius = 191.83;


        this.isTablet = window.innerWidth <= 1230 && window.innerWidth > 750;
        this.isMobile = window.innerWidth <= 750;


        if (this.isMobile) {
            this.currentAngle = this.timeToAngle(12, 0);
        } else if (this.isTablet) {
            this.currentAngle = this.timeToAngle(9, 0);
        } else {
            this.currentAngle = this.timeToAngle(11, 0);
        }

        this.firstTargetAngle = this.timeToAngle(1, 0);
        this.secondTargetAngle = this.timeToAngle(3, 0);
        this.thirdTargetAngle = this.timeToAngle(5, 0);
        this.fourthTargetAngle = this.timeToAngle(7, 0);
        this.fifthTargetAngle = this.timeToAngle(9, 0);

        this.ball = null;
        this.blueCircle = null;
        this.whiteCircle = null;
        this.animationFrame = null;
        this.onFinalComplete = null;
        this.targetBlock = null;
        this.debugMarkers = [];
    }

    normalizeAngle(angle) {
        const twoPi = 2 * Math.PI;
        angle = angle % twoPi;
        if (angle < 0) angle += twoPi;
        return angle;
    }

    getClockwiseDistance(startAngle, endAngle) {
        let start = this.normalizeAngle(startAngle);
        let end = this.normalizeAngle(endAngle);

        if (end < start) {
            return (end + 2 * Math.PI) - start;
        } else {
            return end - start;
        }
    }

    timeToAngle(hours, minutes) {
        let hourValue = hours % 12;

        if (hourValue === 0) hourValue = 12;
        let angle = hourValue * 30 + minutes * 0.5;
        return angle * Math.PI / 180;
    }

    init() {
        this.addBallToSVG();
        this.disableClipping();
        return this;
    }

    disableClipping() {
        const svg = document.querySelector('.control-units svg');
        if (svg) {
            svg.style.overflow = 'visible';

            let parent = svg.parentElement;
            while (parent) {
                if (window.getComputedStyle(parent).overflow === 'hidden') {
                    parent.style.overflow = 'visible';
                }
                parent = parent.parentElement;
            }
        }
    }

    addBallToSVG() {
        const controlUnitsSection = document.querySelector('.control-units');
        if (!controlUnitsSection) return;

        const svg = controlUnitsSection.querySelector('svg');
        if (!svg) return;

        this.destroy();

        const ballX = this.centerX + this.radius * Math.sin(this.currentAngle);
        const ballY = this.centerY - this.radius * Math.cos(this.currentAngle);

        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.classList.add('static-ball-group');

        this.blueCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        this.blueCircle.setAttribute('cx', ballX);
        this.blueCircle.setAttribute('cy', ballY);
        this.blueCircle.setAttribute('r', '19.5');
        this.blueCircle.setAttribute('fill', '#BBDFFD');
        this.blueCircle.setAttribute('class', 'static-ball-blue');
        group.appendChild(this.blueCircle);

        this.whiteCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        this.whiteCircle.setAttribute('cx', ballX);
        this.whiteCircle.setAttribute('cy', ballY);
        this.whiteCircle.setAttribute('r', '6');
        this.whiteCircle.setAttribute('fill', '#F1F8FA');
        this.whiteCircle.setAttribute('class', 'static-ball-white');
        group.appendChild(this.whiteCircle);

        svg.appendChild(group);
        this.ball = group;
    }


    moveToOneOClock() {

        if (this.isMobile || this.isTablet) return;

        if (!this.blueCircle || !this.whiteCircle) return;
        this.animateTo(this.firstTargetAngle);
    }

    moveToThreeOClock(callback) {

        if (this.isMobile || this.isTablet) {
            if (callback) callback();
            return;
        }

        if (!this.blueCircle || !this.whiteCircle) {
            if (callback) callback();
            return;
        }
        this.onFinalComplete = callback;
        this.animateTo(this.secondTargetAngle);
    }

    moveToFiveOClock(callback) {

        if (this.isMobile || this.isTablet) {
            if (callback) callback();
            return;
        }

        if (!this.blueCircle || !this.whiteCircle) {
            if (callback) callback();
            return;
        }
        this.onFinalComplete = callback;
        this.animateTo(this.thirdTargetAngle);
    }

    moveToSevenOClock(callback) {

        if (this.isMobile || this.isTablet) {
            if (callback) callback();
            return;
        }

        if (!this.blueCircle || !this.whiteCircle) {
            if (callback) callback();
            return;
        }
        this.onFinalComplete = callback;
        this.animateTo(this.fourthTargetAngle);
    }

    moveToNineOClock(callback) {

        if (this.isMobile || this.isTablet) {
            if (callback) callback();
            return;
        }

        if (!this.blueCircle || !this.whiteCircle) {
            if (callback) callback();
            return;
        }
        this.onFinalComplete = callback;
        this.animateTo(this.fifthTargetAngle);
    }


    animateTo(targetAngle) {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }

        const startAngle = this.currentAngle;
        const distance = this.getClockwiseDistance(startAngle, targetAngle);
        const startTime = performance.now();
        const duration = 600;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            this.currentAngle = this.normalizeAngle(startAngle + distance * easeProgress);

            const ballX = this.centerX + this.radius * Math.sin(this.currentAngle);
            const ballY = this.centerY - this.radius * Math.cos(this.currentAngle);

            this.blueCircle.setAttribute('cx', ballX);
            this.blueCircle.setAttribute('cy', ballY);
            this.whiteCircle.setAttribute('cx', ballX);
            this.whiteCircle.setAttribute('cy', ballY);

            if (progress < 1) {
                this.animationFrame = requestAnimationFrame(animate);
            } else {
                this.currentAngle = targetAngle;
                this.animationFrame = null;

                const finalX = this.centerX + this.radius * Math.sin(targetAngle);
                const finalY = this.centerY - this.radius * Math.cos(targetAngle);
                this.blueCircle.setAttribute('cx', finalX);
                this.blueCircle.setAttribute('cy', finalY);
                this.whiteCircle.setAttribute('cx', finalX);
                this.whiteCircle.setAttribute('cy', finalY);

                if (this.onFinalComplete) {
                    this.onFinalComplete();
                    this.onFinalComplete = null;
                }
            }
        };

        this.animationFrame = requestAnimationFrame(animate);
    }

    handleResize() {
        const wasTablet = this.isTablet;
        const wasMobile = this.isMobile;

        this.isTablet = window.innerWidth <= 1230 && window.innerWidth > 750;
        this.isMobile = window.innerWidth <= 750;

        this.disableClipping();


        let newAngle;
        if (this.isMobile) {
            newAngle = this.timeToAngle(12, 0);
        } else if (this.isTablet) {
            newAngle = this.timeToAngle(9, 0);
        } else {
            newAngle = this.timeToAngle(11, 0);
        }


        if (wasMobile !== this.isMobile || wasTablet !== this.isTablet) {
            this.currentAngle = newAngle;
        }

        this.destroy();
        this.addBallToSVG();


        const ballX = this.centerX + this.radius * Math.sin(this.currentAngle);
        const ballY = this.centerY - this.radius * Math.cos(this.currentAngle);
        if (this.blueCircle && this.whiteCircle) {
            this.blueCircle.setAttribute('cx', ballX);
            this.blueCircle.setAttribute('cy', ballY);
            this.whiteCircle.setAttribute('cx', ballX);
            this.whiteCircle.setAttribute('cy', ballY);
        }
    }

    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }

        const svg = document.querySelector('.control-units svg');
        if (svg) {
            const ball = svg.querySelector('.static-ball-group');
            if (ball) ball.remove();
        }
        this.ball = null;
        this.blueCircle = null;
        this.whiteCircle = null;
    }
}