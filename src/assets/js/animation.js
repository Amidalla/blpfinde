export class Animation {
    constructor(svgContainer) {
        if (svgContainer.__animationInstance) {
            return svgContainer.__animationInstance;
        }

        this.container = svgContainer;
        this.container.__animationInstance = this;

        this.isAnimating = false;
        this.hasAnimated = false;
        this.isAnimatingSixthCircle = false;
        this.isAnimatingSeventhCircle = false;

        this.SEVENTH_CIRCLE_SELECTOR = 'path[d="M296.919 651.403C302.329 652.473 305.359 658.378 303.536 664.69C301.714 671.003 295.785 675.135 290.375 674.064C284.965 672.994 281.934 667.089 283.757 660.776C285.58 654.464 291.509 650.332 296.919 651.403Z"]';
        this.SEVENTH_ELLIPSE_SELECTOR = 'ellipse[cx="290.445"][cy="655.823"], ellipse[transform*="290.445 655.823"]';
        this.SEVENTH_CIRCLE_RX = 5.54134;
        this.SEVENTH_CIRCLE_RY = 6.44785;

        this.LINE_ANIMATION_DURATION = '0.264s';
        this.LINE_ANIMATION_TIMEOUT = 264;
        this.CIRCLE_ANIMATION_SCALE = 0.5;

        this.elementsCache = {
            lines: new Map(),
            circles: new Map(),
            ellipses: new Map(),
            rectGroups: new Map(),
            panels: new Map()
        };


        this.isMobileView = window.innerWidth <= 750;

        if (this.isMobileView) {
            this.showAllElementsImmediately();
        } else {
            this.initializeElements();
            this.hideAllElements();
        }
    }

    showAllElementsImmediately() {
        if (!this.container) return;

        this.container.style.opacity = '1';
        this.container.style.visibility = 'visible';
        this.container.style.pointerEvents = 'auto';

        const svgElement = this.container.querySelector('svg');
        if (!svgElement) return;

        const allPaths = svgElement.querySelectorAll('path');
        allPaths.forEach(path => {
            path.style.opacity = '1';
            path.style.transition = 'none';
        });

        const allEllipses = svgElement.querySelectorAll('ellipse');
        allEllipses.forEach(ellipse => {
            ellipse.style.opacity = '1';
            ellipse.style.transition = 'none';
        });

        const allGroups = svgElement.querySelectorAll('g');
        allGroups.forEach(group => {
            group.style.opacity = '1';
            group.style.transition = 'none';
        });

        this.hasAnimated = true;
        this.container.classList.add('animation-complete');
    }

    initializeElements() {
        if (!this.container) return;

        const svgElement = this.container.querySelector('svg');
        if (!svgElement) return;

        const linesConfig = [
            {
                id: 'line1',
                selector: 'path[d="M660 216C812.115 192.347 886.782 180.653 1038.9 157"]',
                direction: -1
            },
            {
                id: 'line2',
                selector: 'path[d="M660 216L636.849 218.612C583.591 224.878 519.543 220.005 490.651 216.524C390.401 199.816 249.397 166.589 185 180.512"]',
                direction: 1
            },
            {
                id: 'line3',
                selector: 'path[d="M374.734 260.383C455.77 249.523 472.227 245.588 659.5 216"]',
                direction: -1
            },
            {
                id: 'line4',
                selector: 'path[d="M261 334.394C366.828 330.456 407.325 299.602 513.001 259.877C580.67 233.144 650.95 217.392 660 216"]',
                direction: -1
            },
            {
                id: 'line5',
                selector: 'path[d="M686.344 423.246C686.344 423.246 801.457 402.121 874.313 329.262C950.545 246.764 973.519 163.221 1038.26 158"]',
                direction: -1
            },
            {
                id: 'line6',
                selector: 'path[d="M310.398 483.814L664.5 427.5"]',
                direction: -1
            },
            {
                id: 'line7',
                selector: 'path[d="M302 662.841C415.776 638.543 408.062 536.878 514.124 484.271C615.558 433.96 677.291 424.638 686.342 423.246"]',
                direction: -1
            }
        ];

        linesConfig.forEach(config => {
            const line = svgElement.querySelector(config.selector);
            if (line) {
                const length = line.getTotalLength();
                this.elementsCache.lines.set(config.id, {
                    element: line,
                    length: length,
                    direction: config.direction,
                    startOffset: config.direction * length
                });
            }
        });

        const circlesConfig = [
            {
                id: 'circle1',
                circleSelector: 'path[d="M687.164 193.102C697.318 195.111 702.928 206.159 699.544 217.877C696.16 229.595 685.12 237.348 674.966 235.339C664.813 233.33 659.203 222.282 662.587 210.564C665.971 198.846 677.01 191.093 687.164 193.102Z"]',
                ellipseSelector: 'ellipse[transform*="675.148 200.69"]',
                rx: 10.1763,
                ry: 11.841,
                fillColor: '#BBDFFD'
            },
            {
                id: 'circle2',
                circleSelector: 'path[d="M181.334 171.093C185.881 171.993 188.443 176.963 186.904 182.293C185.365 187.622 180.365 191.096 175.817 190.197C171.269 189.296 168.708 184.326 170.247 178.997C171.787 173.667 176.786 170.194 181.334 171.093Z"]',
                ellipseSelector: 'ellipse[transform*="175.859 174.786"]',
                rx: 4.69862,
                ry: 5.46727,
                fillColor: '#BBDFFD'
            },
            {
                id: 'circle3',
                circleSelector: 'path[d="M369.919 249.403C375.329 250.473 378.359 256.378 376.536 262.69C374.714 269.003 368.785 273.135 363.375 272.064C357.965 270.994 354.934 265.089 356.757 258.776C358.58 252.464 364.509 248.332 369.919 249.403Z"]',
                ellipseSelector: 'ellipse[transform*="363.383 254.197"]',
                rx: 5.28345,
                ry: 6.14777,
                fillColor: '#BBDFFD'
            },
            {
                id: 'circle4',
                circleSelector: 'path[d="M263.334 324.093C267.881 324.993 270.443 329.963 268.904 335.293C267.365 340.622 262.365 344.096 257.817 343.197C253.269 342.296 250.708 337.326 252.247 331.997C253.787 326.667 258.786 323.194 263.334 324.093Z"]',
                ellipseSelector: 'ellipse[transform*="257.859 327.786"]',
                rx: 4.69862,
                ry: 5.46727,
                fillColor: '#BBDFFD'
            },
            {
                id: 'circle5',
                circleSelector: 'path[d="M689.164 400.102C699.318 402.111 704.928 413.159 701.544 424.877C698.16 436.595 687.12 444.348 676.966 442.339C666.813 440.33 661.203 429.282 664.587 417.564C667.971 405.846 679.01 398.093 689.164 400.102Z"]',
                ellipseSelector: 'ellipse[transform*="677.188 408.531"]',
                rx: 10.1763,
                ry: 11.841,
                fillColor: '#FFC838'
            }
        ];

        circlesConfig.forEach(config => {
            const circle = svgElement.querySelector(config.circleSelector);
            const ellipse = svgElement.querySelector(config.ellipseSelector);

            if (circle && ellipse) {
                this.elementsCache.circles.set(config.id, {
                    element: circle,
                    bbox: circle.getBBox()
                });
                this.elementsCache.ellipses.set(`${config.id}_ellipse`, {
                    element: ellipse,
                    rx: config.rx,
                    ry: config.ry,
                    fillColor: config.fillColor
                });
            }
        });

        const sixthCircle = svgElement.querySelector(
            'path[d="M300.172 462.102C310.325 464.111 315.936 475.159 312.552 486.877C309.168 498.595 298.128 506.348 287.974 504.339C277.821 502.33 272.21 491.282 275.594 479.564C278.979 467.846 290.018 460.093 300.172 462.102Z"]'
        );
        const sixthEllipse = svgElement.querySelector(
            'ellipse[transform*="288.195 470.531"]'
        );
        if (sixthCircle && sixthEllipse) {
            this.elementsCache.circles.set('circle6', {
                element: sixthCircle,
                bbox: sixthCircle.getBBox()
            });
            this.elementsCache.ellipses.set('ellipse6', {
                element: sixthEllipse,
                rx: 10.1763,
                ry: 11.841
            });
        }

        const seventhCircle = svgElement.querySelector(this.SEVENTH_CIRCLE_SELECTOR);
        const seventhEllipse = svgElement.querySelector(this.SEVENTH_ELLIPSE_SELECTOR);
        if (seventhCircle && seventhEllipse) {
            this.elementsCache.circles.set('circle7', {
                element: seventhCircle,
                bbox: seventhCircle.getBBox()
            });
            this.elementsCache.ellipses.set('ellipse7', {
                element: seventhEllipse,
                rx: this.SEVENTH_CIRCLE_RX,
                ry: this.SEVENTH_CIRCLE_RY
            });
        }

        this.initializeRectGroups(svgElement);
    }

    initializeRectGroups(svgElement) {
        const firstRectGroup = svgElement.querySelector('g[opacity="0.8"]');
        if (firstRectGroup) {
            this.elementsCache.rectGroups.set('rectGroup1', firstRectGroup);

            const allGroups = svgElement.querySelectorAll('g');
            for (let i = 0; i < allGroups.length; i++) {
                if (allGroups[i] === firstRectGroup && allGroups[i + 1]) {
                    this.elementsCache.panels.set('panel1', allGroups[i + 1]);
                    break;
                }
            }
        }

        const allOpacityGroups = svgElement.querySelectorAll('g[opacity="0.8"]');
        for (let group of allOpacityGroups) {
            const path = group.querySelector('path[d="M108.422 280.772C108.422 272.252 115.164 263.847 123.482 261.998L316.893 219.018C325.21 217.17 331.953 222.578 331.953 231.099V259.771C331.953 268.291 325.21 276.697 316.893 278.545L123.482 321.525C115.164 323.374 108.422 317.965 108.422 309.445V280.772Z"]');
            if (path) {
                this.elementsCache.rectGroups.set('rectGroup2', group);

                const sixthPanel = this.findSixthPanel();
                if (sixthPanel) {
                    this.elementsCache.panels.set('panel2', sixthPanel);
                }
                break;
            }
        }

        if (allOpacityGroups.length >= 3) {
            this.elementsCache.rectGroups.set('rectGroup3', allOpacityGroups[2]);

            const thirdPanel = this.findThirdPanel(svgElement);
            if (thirdPanel) {
                this.elementsCache.panels.set('panel3', thirdPanel);
            }
        }

        for (let group of allOpacityGroups) {
            const path = group.querySelector('path[d="M127.711 615.542C127.711 607.022 134.453 598.617 142.771 596.768L336.182 553.788C344.499 551.94 351.242 557.348 351.242 565.869V594.541C351.242 603.061 344.499 611.467 336.182 613.315L142.771 656.295C134.453 658.144 127.711 652.735 127.711 644.215V615.542Z"]');
            if (path) {
                this.elementsCache.rectGroups.set('rectGroup4', group);

                const fourthPanel = this.findFourthPanelElement(svgElement);
                if (fourthPanel) {
                    this.elementsCache.panels.set('panel4', fourthPanel);
                }
                break;
            }
        }
    }

    hideAllElements() {
        if (!this.container) return;

        this.container.style.transition = 'none';
        this.container.style.opacity = '0';
        this.container.style.visibility = 'hidden';
        this.container.style.pointerEvents = 'none';

        this.container.getBoundingClientRect();

        const svgElement = this.container.querySelector('svg');
        if (!svgElement) return;

        this.elementsCache.lines.forEach((lineData, key) => {
            const line = lineData.element;
            const startOffset = lineData.startOffset;

            line.style.transition = 'none';
            line.style.strokeDasharray = `${lineData.length}`;
            line.style.strokeDashoffset = `${startOffset}`;
            line.style.opacity = '0';
            line.style.willChange = 'stroke-dashoffset';
        });

        ['circles', 'ellipses'].forEach(cacheName => {
            this.elementsCache[cacheName].forEach((elementData, key) => {
                const element = elementData.element;
                element.style.transition = 'none';
                element.style.opacity = '0';
            });
        });

        this.elementsCache.rectGroups.forEach((group, key) => {
            group.style.transition = 'none';
            group.style.opacity = '0';
        });

        this.elementsCache.panels.forEach((panel, key) => {
            panel.style.transition = 'none';
            panel.style.opacity = '0';
        });

        svgElement.getBoundingClientRect();
    }

    start() {
        if (this.isMobileView) {
            return;
        }

        if (this.hasAnimated || this.isAnimating) return;

        this.isAnimating = true;
        this.animationStartTime = performance.now();

        requestAnimationFrame(() => {
            if (this.container) {
                this.container.style.transition = 'none';
                this.container.style.opacity = '1';
                this.container.style.visibility = 'visible';
                this.container.style.pointerEvents = 'auto';

                this.container.getBoundingClientRect();

                requestAnimationFrame(() => {
                    this.animateFirstLine();
                });
            }
        });
    }

    animateLine(lineData) {
        return new Promise((resolve) => {
            const line = lineData.element;
            const startOffset = lineData.startOffset;

            requestAnimationFrame(() => {
                line.style.transition = 'none';
                line.style.strokeDasharray = `${lineData.length}`;
                line.style.strokeDashoffset = `${startOffset}`;
                line.style.opacity = '1';
                line.style.willChange = 'stroke-dashoffset';

                line.getBoundingClientRect();

                requestAnimationFrame(() => {
                    line.style.transition = `stroke-dashoffset ${this.LINE_ANIMATION_DURATION} cubic-bezier(0.25, 0.46, 0.45, 0.94)`;

                    line.getBoundingClientRect();

                    requestAnimationFrame(() => {
                        line.style.strokeDashoffset = '0';

                        setTimeout(() => {
                            line.style.willChange = 'auto';
                            resolve();
                        }, this.LINE_ANIMATION_TIMEOUT);
                    });
                });
            });
        });
    }

    animateFirstLine() {
        const lineData = this.elementsCache.lines.get('line1');

        if (!lineData) {
            this.onAnimationComplete();
            return;
        }

        this.animateLine(lineData).then(() => {
            setTimeout(() => {
                this.animateCachedCircle('circle1', this.animateSecondLine.bind(this));
            }, 100);
        });
    }

    animateSecondLine() {
        const lineData = this.elementsCache.lines.get('line2');

        if (!lineData) {
            this.onAnimationComplete();
            return;
        }

        this.animateLine(lineData).then(() => {
            setTimeout(() => {

                this.animateCachedCircle('circle2', () => {});
                this.animateFirstRectElement();
            }, 100);
        });
    }

    animateFirstRectElement() {
        const rectGroup = this.elementsCache.rectGroups.get('rectGroup1');
        const panel = this.elementsCache.panels.get('panel1');

        if (!rectGroup || !panel) {
            this.animateThirdLine();
            return;
        }

        rectGroup.classList.add('animate-first-rect');
        panel.classList.add('animate-first-panel');

        setTimeout(() => {
            this.animateThirdLine();
        }, 1000);
    }

    animateThirdLine() {
        const lineData = this.elementsCache.lines.get('line3');

        if (!lineData) {
            this.onAnimationComplete();
            return;
        }

        this.animateLine(lineData).then(() => {
            setTimeout(() => {

                this.animateCachedCircle('circle3', () => {});
                this.animateSecondRectElement();
            }, 100);
        });
    }

    animateSecondRectElement() {
        const rectGroup = this.elementsCache.rectGroups.get('rectGroup2');
        const panel = this.elementsCache.panels.get('panel2');

        if (!rectGroup || !panel) {
            this.animateFourthLine();
            return;
        }

        rectGroup.style.opacity = '0';
        panel.style.opacity = '0';

        setTimeout(() => {
            rectGroup.classList.add('animate-second-rect');
            panel.classList.add('animate-second-panel');

            setTimeout(() => {
                this.animateFourthLine();
            }, 1000);
        }, 10);
    }

    animateFourthLine() {
        const lineData = this.elementsCache.lines.get('line4');

        if (!lineData) {
            this.onAnimationComplete();
            return;
        }

        this.animateLine(lineData).then(() => {
            setTimeout(() => {
                this.animateCachedCircle('circle4', this.animateFifthLine.bind(this));
            }, 100);
        });
    }

    animateFifthLine() {
        const lineData = this.elementsCache.lines.get('line5');

        if (!lineData) {
            this.onAnimationComplete();
            return;
        }

        this.animateLine(lineData).then(() => {
            setTimeout(() => {
                this.animateCachedCircle('circle5', this.animateSixthLine.bind(this));
            }, 100);
        });
    }

    animateSixthLine() {
        const lineData = this.elementsCache.lines.get('line6');

        if (!lineData) {
            this.animateSixthCircleWithRect();
            return;
        }

        this.animateLine(lineData).then(() => {
            setTimeout(() => {
                this.animateSixthCircleWithRect();
            }, 100);
        });
    }

    animateSixthCircleWithRect() {
        const circleData = this.elementsCache.circles.get('circle6');
        const ellipseData = this.elementsCache.ellipses.get('ellipse6');

        if (!circleData || !ellipseData) {
            this.animateSeventhLine();
            return;
        }

        if (this.isAnimatingSixthCircle) return;
        this.isAnimatingSixthCircle = true;

        const outerCircle = circleData.element;
        const innerEllipse = ellipseData.element;

        this.animateCircleWithClone(outerCircle, innerEllipse,
            ellipseData.rx, ellipseData.ry, '#FFC838', '#D4D4D4')
            .then(() => {
                this.isAnimatingSixthCircle = false;
            });

        this.animateThirdRectElement();
    }

    animateThirdRectElement() {
        const rectGroup = this.elementsCache.rectGroups.get('rectGroup3');
        const panel = this.elementsCache.panels.get('panel3');

        if (!rectGroup || !panel) {
            this.animateSeventhLine();
            return;
        }

        rectGroup.style.opacity = '0';
        panel.style.opacity = '0';

        setTimeout(() => {
            rectGroup.classList.add('animate-third-rect');
            panel.classList.add('animate-third-panel');

            setTimeout(() => {
                this.animateSeventhLine();
            }, 1000);
        }, 10);
    }

    animateSeventhLine() {
        const lineData = this.elementsCache.lines.get('line7');

        if (!lineData) {
            this.animateSeventhCircleWithRect();
            return;
        }

        this.animateLine(lineData).then(() => {
            setTimeout(() => {
                this.animateSeventhCircleWithRect();
            }, 100);
        });
    }

    animateSeventhCircleWithRect() {
        const circleData = this.elementsCache.circles.get('circle7');
        const ellipseData = this.elementsCache.ellipses.get('ellipse7');

        if (!circleData || !ellipseData) {
            this.animateFourthRectElement();
            return;
        }

        if (this.isAnimatingSeventhCircle) return;
        this.isAnimatingSeventhCircle = true;

        const outerCircle = circleData.element;
        const innerEllipse = ellipseData.element;

        this.animateCircleWithClone(outerCircle, innerEllipse,
            ellipseData.rx, ellipseData.ry, '#FFC838', '#FFC838')
            .then(() => {
                this.isAnimatingSeventhCircle = false;
            });

        this.animateFourthRectElement();
    }

    animateFourthRectElement() {
        const rectGroup = this.elementsCache.rectGroups.get('rectGroup4');
        const panel = this.elementsCache.panels.get('panel4');

        if (!rectGroup || !panel) {
            this.onAnimationComplete();
            return;
        }

        rectGroup.style.opacity = '0';
        panel.style.opacity = '0';

        setTimeout(() => {
            rectGroup.classList.add('animate-fourth-rect');
            panel.classList.add('animate-fourth-panel');

            setTimeout(() => {
                this.onAnimationComplete();
            }, 1000);
        }, 10);
    }

    animateCachedCircle(circleId, callback) {
        const circleData = this.elementsCache.circles.get(circleId);
        const ellipseData = this.elementsCache.ellipses.get(`${circleId}_ellipse`);

        if (!circleData || !ellipseData) {
            if (callback) callback();
            return;
        }

        const outerCircle = circleData.element;
        const innerEllipse = ellipseData.element;
        const fillColor = ellipseData.fillColor || '#BBDFFD';

        this.animateCircleWithClone(outerCircle, innerEllipse,
            ellipseData.rx, ellipseData.ry, fillColor, fillColor, true)
            .then(() => {
                if (callback) callback();
            });
    }

    animateCircleWithClone(outerCircle, innerEllipse, originalRx, originalRy,
                           ellipseFillColor, circleStrokeColor, isWhiteFill = false) {
        return new Promise((resolve) => {
            outerCircle.style.fill = isWhiteFill ? 'white' : 'transparent';
            outerCircle.style.stroke = circleStrokeColor;
            outerCircle.style.strokeWidth = '0.77136px';
            innerEllipse.style.fill = ellipseFillColor;

            outerCircle.style.opacity = '0';
            innerEllipse.style.opacity = '0';
            innerEllipse.setAttribute('rx', '0.1');
            innerEllipse.setAttribute('ry', '0.1');
            innerEllipse.style.transition = 'none';

            const circleBox = outerCircle.getBBox();
            const centerX = circleBox.x + circleBox.width / 2;
            const centerY = circleBox.y + circleBox.height / 2;

            const circleClone = outerCircle.cloneNode(true);
            circleClone.style.cssText = '';
            circleClone.style.stroke = circleStrokeColor;
            circleClone.style.fill = isWhiteFill ? 'white' : 'transparent';
            circleClone.style.strokeWidth = '0.77136px';
            circleClone.style.transformOrigin = `${centerX}px ${centerY}px`;
            circleClone.style.transform = 'scale(0.1)';
            circleClone.style.transition = 'none';
            circleClone.style.opacity = '0';
            circleClone.style.pointerEvents = 'none';

            outerCircle.parentNode.insertBefore(circleClone, outerCircle.nextSibling);

            setTimeout(() => {
                circleClone.style.transition = `all ${this.CIRCLE_ANIMATION_SCALE}s cubic-bezier(0.34, 1.56, 0.64, 1)`;
                circleClone.style.opacity = '1';
                circleClone.style.transform = 'scale(1)';

                innerEllipse.style.transition = `all ${this.CIRCLE_ANIMATION_SCALE}s cubic-bezier(0.34, 1.56, 0.64, 1)`;
                innerEllipse.style.opacity = '1';
                innerEllipse.setAttribute('rx', originalRx.toString());
                innerEllipse.setAttribute('ry', originalRy.toString());

                setTimeout(() => {
                    outerCircle.style.opacity = '1';
                    outerCircle.style.transition = 'opacity 0.3s ease-out';

                    setTimeout(() => {
                        circleClone.remove();
                        resolve();
                    }, 300);
                }, this.CIRCLE_ANIMATION_SCALE * 1000);
            }, 50);
        });
    }

    onAnimationComplete() {
        this.isAnimating = false;
        this.hasAnimated = true;
        this.cleanupAnimationStyles();
        this.dispatchAnimationCompleteEvent();
    }

    cleanupAnimationStyles() {
        const svgElement = this.container?.querySelector('svg');
        if (svgElement && this.container) {
            this.elementsCache.lines.forEach(lineData => {
                const line = lineData.element;
                line.style.transition = '';
                line.style.strokeDasharray = '';
                line.style.strokeDashoffset = '';
                line.style.willChange = 'auto';
            });

            this.container.classList.add('animation-complete');
        }
    }

    dispatchAnimationCompleteEvent() {
        const event = new CustomEvent('animationComplete', {
            detail: {
                container: this.container,
                animationTime: performance.now() - this.animationStartTime
            }
        });

        if (this.container) {
            this.container.dispatchEvent(event);
        }
    }

    findSixthPanel() {
        const svgElement = this.container?.querySelector('svg');
        if (!svgElement) return null;

        const allGroups = svgElement.querySelectorAll('g');
        for (let i = 0; i < allGroups.length; i++) {
            if (allGroups[i].getAttribute('clip-path') === 'url(#clip1_421_1180)') {
                return allGroups[i];
            }
        }
        return null;
    }

    findThirdPanel(svgElement = null) {
        if (!svgElement) {
            svgElement = this.container?.querySelector('svg');
        }
        if (!svgElement) return null;

        const allGroups = svgElement.querySelectorAll('g');
        for (let i = 0; i < allGroups.length; i++) {
            if (allGroups[i].getAttribute('clip-path') === 'url(#clip2_421_1180)') {
                return allGroups[i];
            }
        }
        return null;
    }

    findFourthPanelElement(svgElement = null) {
        if (!svgElement) {
            svgElement = this.container?.querySelector('svg');
        }
        if (!svgElement) return null;

        const allGroups = svgElement.querySelectorAll('g');
        for (let i = 0; i < allGroups.length; i++) {
            if (allGroups[i].getAttribute('clip-path') === 'url(#clip3_421_1180)') {
                return allGroups[i];
            }
        }
        return null;
    }
}

export default Animation;