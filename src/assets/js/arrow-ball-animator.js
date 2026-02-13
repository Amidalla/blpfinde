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

        this.currentAngle = this.timeToAngle(11, 0);
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
        if (!this.blueCircle || !this.whiteCircle) return;

        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }

        const startAngle = this.currentAngle;
        const targetAngle = this.firstTargetAngle;
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
            }
        };

        this.animationFrame = requestAnimationFrame(animate);
    }

    moveToThreeOClock(callback) {
        if (!this.blueCircle || !this.whiteCircle) {
            if (callback) callback();
            return;
        }

        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }

        this.onFinalComplete = callback;

        const startAngle = this.currentAngle;
        const targetAngle = this.secondTargetAngle;
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

    moveToFiveOClock(callback) {
        if (!this.blueCircle || !this.whiteCircle) {
            if (callback) callback();
            return;
        }

        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }

        this.onFinalComplete = callback;

        const startAngle = this.currentAngle;
        const targetAngle = this.thirdTargetAngle;
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

    moveToSevenOClock(callback) {
        if (!this.blueCircle || !this.whiteCircle) {
            if (callback) callback();
            return;
        }

        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }

        this.onFinalComplete = callback;

        const startAngle = this.currentAngle;
        const targetAngle = this.fourthTargetAngle;
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

    moveToNineOClock(callback) {
        if (!this.blueCircle || !this.whiteCircle) {
            if (callback) callback();
            return;
        }

        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }

        this.onFinalComplete = callback;

        const startAngle = this.currentAngle;
        const targetAngle = this.fifthTargetAngle;
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
        this.disableClipping();

        const currentAngle = this.currentAngle;
        this.destroy();
        this.addBallToSVG();
        this.currentAngle = currentAngle;

        if (this.currentAngle === this.firstTargetAngle ||
            this.currentAngle === this.secondTargetAngle ||
            this.currentAngle === this.thirdTargetAngle ||
            this.currentAngle === this.fourthTargetAngle ||
            this.currentAngle === this.fifthTargetAngle) {
            const ballX = this.centerX + this.radius * Math.sin(this.currentAngle);
            const ballY = this.centerY - this.radius * Math.cos(this.currentAngle);
            if (this.blueCircle && this.whiteCircle) {
                this.blueCircle.setAttribute('cx', ballX);
                this.blueCircle.setAttribute('cy', ballY);
                this.whiteCircle.setAttribute('cx', ballX);
                this.whiteCircle.setAttribute('cy', ballY);
            }
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