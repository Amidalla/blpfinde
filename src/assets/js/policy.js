export class PolicyNavigation {
    constructor(container) {
        this.container = container;
        this.sections = [];
        this.navLinks = [];
        this.navPoints = [];
        this.headerHeight = 0;
        this.scrollTimeout = null;
        this.isScrolling = false;
        this.observer = null;
        this.breakpoint = 1350;
        this.isActive = window.innerWidth > this.breakpoint;

        this.init();
    }

    init() {

        if (!this.isActive) {
            return;
        }


        this.sections = Array.from(document.querySelectorAll('.policy__item'));
        this.navLinks = Array.from(document.querySelectorAll('.policy__link'));
        this.navPoints = Array.from(document.querySelectorAll('.policy__point'));

        if (this.sections.length === 0 || this.navLinks.length === 0) return;


        this.updateHeaderHeight();


        this.ensureSectionIds();


        this.bindEvents();


        this.initIntersectionObserver();


        setTimeout(() => this.setActiveSection(), 100);
    }

    updateHeaderHeight() {
        const header = document.querySelector('.header');
        if (header) {
            this.headerHeight = header.offsetHeight;
        }
    }

    ensureSectionIds() {
        this.sections.forEach((section, index) => {
            if (!section.id) {
                section.id = `policy-section-${index + 1}`;
            }
        });


        this.navLinks.forEach((link, index) => {
            if (this.sections[index] && (!link.getAttribute('href') || link.getAttribute('href') === '#')) {
                link.setAttribute('href', `#${this.sections[index].id}`);
            }
        });
    }

    bindEvents() {

        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleLinkClick(e, link));
        });


        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });


        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 150));
    }

    handleResize() {
        const wasActive = this.isActive;
        this.isActive = window.innerWidth > this.breakpoint;


        if (wasActive !== this.isActive) {
            if (this.isActive) {

                this.init();
            } else {

                this.disable();
            }
        } else if (this.isActive) {

            this.updateHeaderHeight();
            this.setActiveSection();
        }
    }

    disable() {

        this.navPoints.forEach(point => {
            point.classList.remove('active');
        });


        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }


        if (this.scrollTimeout) {
            window.cancelAnimationFrame(this.scrollTimeout);
            this.scrollTimeout = null;
        }
    }

    initIntersectionObserver() {
        if (!window.IntersectionObserver || !this.isActive) return;

        const options = {
            root: null,
            rootMargin: `-${this.headerHeight + 20}px 0px -100px 0px`,
            threshold: [0, 0.5, 1]
        };

        this.observer = new IntersectionObserver((entries) => {
            if (this.isScrolling || !this.isActive) return;

            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    this.activateNavItem(sectionId);
                }
            });
        }, options);

        this.sections.forEach(section => {
            if (section) {
                this.observer.observe(section);
            }
        });
    }

    handleLinkClick(e, link) {
        e.preventDefault();

        if (!this.isActive) return;

        const targetId = link.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const targetSection = document.querySelector(targetId);
        if (!targetSection) return;


        this.isScrolling = true;

        const targetPosition = targetSection.offsetTop - this.headerHeight - 20;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });


        if (history.pushState) {
            history.pushState(null, null, targetId);
        }


        this.activateNavItem(targetId.substring(1));


        setTimeout(() => {
            this.isScrolling = false;
        }, 500);
    }

    handleScroll() {
        if (!this.isActive) return;

        if (this.scrollTimeout) {
            window.cancelAnimationFrame(this.scrollTimeout);
        }

        this.scrollTimeout = window.requestAnimationFrame(() => {
            if (!this.isScrolling) {
                this.setActiveSection();
            }
        });
    }

    setActiveSection() {
        if (this.isScrolling || !this.isActive) return;

        const scrollPosition = window.scrollY;
        let currentSectionId = '';


        for (let i = 0; i < this.sections.length; i++) {
            const section = this.sections[i];
            if (!section) continue;

            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;


            const offset = this.headerHeight + 50;

            if (scrollPosition >= sectionTop - offset && scrollPosition < sectionBottom - offset) {
                currentSectionId = section.id;
                break;
            }


            if (i === this.sections.length - 1 &&
                (scrollPosition + window.innerHeight) >= document.documentElement.scrollHeight - 100) {
                currentSectionId = section.id;
            }
        }

        if (currentSectionId) {
            this.activateNavItem(currentSectionId);


            if (history.replaceState && !this.isScrolling) {
                history.replaceState(null, null, `#${currentSectionId}`);
            }
        }
    }

    activateNavItem(sectionId) {
        if (!this.isActive) return;


        this.navPoints.forEach(point => {
            point.classList.remove('active');
        });


        const activeLink = this.navLinks.find(link => {
            const href = link.getAttribute('href');
            return href === `#${sectionId}`;
        });

        if (activeLink) {
            const activePoint = activeLink.closest('.policy__point');
            if (activePoint) {
                activePoint.classList.add('active');
            }
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    refresh() {
        if (!this.isActive) return;


        this.sections = Array.from(document.querySelectorAll('.policy__item'));
        this.navLinks = Array.from(document.querySelectorAll('.policy__link'));
        this.navPoints = Array.from(document.querySelectorAll('.policy__point'));

        this.updateHeaderHeight();
        this.ensureSectionIds();
        this.setActiveSection();


        if (this.observer) {
            this.observer.disconnect();
            this.initIntersectionObserver();
        }
    }

    destroy() {
        if (this.scrollTimeout) {
            window.cancelAnimationFrame(this.scrollTimeout);
        }

        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }

        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);

        this.navLinks.forEach(link => {
            link.removeEventListener('click', this.handleLinkClick);
        });

        this.sections = null;
        this.navLinks = null;
        this.navPoints = null;
        this.container = null;
    }
}

export function initPolicyNavigation() {
    const containers = document.querySelectorAll('.policy__nav, .privacy-policy .policy__nav');
    const instances = [];

    containers.forEach(container => {
        if (!container._policyNavInstance && container.offsetParent !== null) {
            const instance = new PolicyNavigation(container);
            container._policyNavInstance = instance;
            instances.push(instance);
        }
    });

    return instances;
}


if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => initPolicyNavigation());
    } else {
        setTimeout(() => initPolicyNavigation(), 0);
    }
}

export default PolicyNavigation;