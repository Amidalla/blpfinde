export default class CircleAnimator {
    constructor() {
        this.circles = [];
        this.isMobile = window.innerWidth <= 768;
        this.svgCenter = { x: 201.53, y: 203.03 };
    }


    init() {
        this.findCircles();
        this.startAnimation();

        window.addEventListener('resize', this.handleResize.bind(this));
        return this;
    }


    findCircles() {
        const controlUnitsSection = document.querySelector('.control-units');
        if (!controlUnitsSection) return;

        const svg = controlUnitsSection.querySelector('svg');
        if (!svg) return;

        const pathElements = svg.querySelectorAll('path');

        pathElements.forEach(path => {
            const d = path.getAttribute('d') || '';

            if (d.includes('353.804 201.535') || d.includes('347.832 201.533')) {
                const circleClass = this.getCircleClassByPath(d);
                path.classList.add(circleClass);

                this.circles.push({
                    element: path,
                    class: circleClass
                });
            }
        });
    }

    getCircleClassByPath(d) {
        if (d.includes('353.804 201.535')) {
            return 'circle-rotate-right';
        }
        if (d.includes('347.832 201.533')) {
            return 'circle-rotate-left';
        }
        return '';
    }


    startAnimation() {
        if (this.circles.length === 0) return;

        this.circles.forEach(circle => {
            circle.element.style.transformOrigin = `${this.svgCenter.x}px ${this.svgCenter.y}px`;

            if (circle.class === 'circle-rotate-right') {
                circle.element.style.transform = 'scale(1.025)'; // Наружу 5px
            } else {
                circle.element.style.transform = 'scale(0.975)'; // Внутрь 5px
            }
        });


        this.circles.forEach(circle => {
            circle.element.style.opacity = '1';
            circle.element.classList.add('animate');
        });
    }


    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;

        if (wasMobile !== this.isMobile) {
            this.circles.forEach(circle => {
                if (this.isMobile) {
                    circle.element.style.transform = circle.class === 'circle-rotate-right' ? 'scale(1.025)' : 'scale(0.975)';
                    circle.element.classList.add('animate');
                } else {
                    circle.element.style.transform = circle.class === 'circle-rotate-right' ? 'scale(1.025)' : 'scale(0.975)';
                    circle.element.classList.add('animate');
                }
            });
        }
    }

    destroy() {
        this.circles.forEach(circle => {
            circle.element.classList.remove('animate');
            circle.element.style.transformOrigin = '';
            circle.element.style.transform = '';
            circle.element.style.opacity = '';
        });

        window.removeEventListener('resize', this.handleResize.bind(this));
    }
}