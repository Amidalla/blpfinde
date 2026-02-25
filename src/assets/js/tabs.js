export class NewsTabs {
    constructor(container) {
        this.container = container;
        this.activeTabId = null;
        this.isAnimating = false;
        this.observer = null;
        this.animationFrameId = null;
        this.isExpanded = false;
        this.swiper = null;
        this.breakpoint = 1350;
        this.isCases = container.classList.contains('cases-tabs');

        this.init();
        this.initResizeObserver();
        if (this.isCases) {
            this.initResponsiveBehavior();
        }
    }

    init() {
        this.buttons = Array.from(this.container.querySelectorAll('.news-tabs__btn'));
        this.panes = Array.from(this.container.querySelectorAll('.news-tabs__pane'));
        this.content = this.container.querySelector('.news-tabs__content');

        if (this.buttons.length === 0 || this.panes.length === 0) return;

        if (this.isCases) {
            this.hiddenButtons = Array.from(this.container.querySelectorAll('.news-tabs__btn--hidden'));
            this.moreButton = this.container.querySelector('.news-tabs__more');
            this.hideButton = this.createHideButton();
            this.tabsNav = this.container.querySelector('.news-tabs__nav');
        }

        this.bindEvents();
        this.activateInitialTab();
        this.initHoverEffects();

        setTimeout(() => this.adjustPaneHeight(), 100);
    }

    createHideButton() {
        if (!this.moreButton) return null;
        const hideBtn = document.createElement('button');
        hideBtn.className = 'cases-hide-button';
        hideBtn.innerHTML = `
            Скрыть
            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
                <path d="M1 16L11.5 8L22 16" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        hideBtn.style.display = 'none';
        this.moreButton.parentNode.insertBefore(hideBtn, this.moreButton.nextSibling);
        return hideBtn;
    }

    bindEvents() {
        if (this.isCases && this.tabsNav) {
            this.tabsNav.addEventListener('click', (e) => {
                const btn = e.target.closest('.news-tabs__btn, .cases-hide-button');
                if (!btn) return;
                e.preventDefault();

                if (btn.classList.contains('cases-hide-button')) {
                    this.toggleExpand(false);
                    return;
                }
                if (btn.classList.contains('news-tabs__more')) {
                    this.toggleExpand(true);
                    return;
                }
                if (btn.classList.contains('news-tabs__btn') && btn.dataset.tab) {
                    this.switchToTab(btn.dataset.tab);
                }
            });
        } else {
            this.buttons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.switchToTab(btn.dataset.tab);
                });
            });
        }
    }

    toggleExpand(expand) {
        if (this.isExpanded === expand) return;
        this.isExpanded = expand;

        this.hiddenButtons.forEach(btn => {
            if (expand) {
                btn.classList.remove('hidden');
                btn.classList.add('visible');
                btn.style.animation = 'slideIn 0.3s ease forwards';
            } else {
                btn.classList.remove('visible');
                btn.classList.add('hidden');
                btn.style.animation = 'slideOut 0.3s ease forwards';
            }
        });

        if (this.moreButton && this.hideButton) {
            if (expand) {
                this.moreButton.style.display = 'none';
                this.hideButton.style.display = 'inline-flex';
            } else {
                this.moreButton.style.display = 'inline-flex';
                this.hideButton.style.display = 'none';
            }
        }

        setTimeout(() => this.adjustPaneHeight(), 300);
    }

    initHoverEffects() {
        this.buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.createRippleEffect(e, btn);
            });
        });
    }

    createRippleEffect(e, btn) {
        const ripple = document.createElement('span');
        const rect = btn.getBoundingClientRect();

        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.className = 'news-tabs__ripple';

        const oldRipple = btn.querySelector('.news-tabs__ripple');
        if (oldRipple) oldRipple.remove();

        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    activateInitialTab() {
        const activeBtn = this.buttons.find(btn => btn.classList.contains('active'));
        if (activeBtn) {
            this.switchToTab(activeBtn.dataset.tab);
        } else if (this.buttons.length > 0) {
            this.switchToTab(this.buttons[0].dataset.tab);
        }
    }

    async switchToTab(tabId) {
        if (this.isAnimating || this.activeTabId === tabId) return;
        this.isAnimating = true;

        const targetBtn = this.buttons.find(btn => btn.dataset.tab === tabId);
        const targetPane = this.panes.find(pane => pane.id === tabId);

        if (!targetBtn || !targetPane) {
            this.isAnimating = false;
            return;
        }

        this.buttons.forEach(btn => btn.classList.remove('active'));
        targetBtn.classList.add('active');

        await this.animatePaneTransition(targetPane);
        this.updateMediaInPane(targetPane);
        this.updateCasesSlidersInPane(targetPane);
        this.adjustPaneHeight();

        this.activeTabId = tabId;
        this.isAnimating = false;
    }

    animatePaneTransition(targetPane) {
        return new Promise((resolve) => {
            const currentActivePane = this.panes.find(pane => pane.classList.contains('active'));

            if (currentActivePane && currentActivePane !== targetPane) {
                currentActivePane.classList.remove('active');
                currentActivePane.classList.add('exiting');

                setTimeout(() => {
                    currentActivePane.classList.remove('exiting');
                }, 400);
            }

            setTimeout(() => {
                targetPane.classList.add('active');
                targetPane.style.animation = 'none';
                targetPane.offsetHeight;
                this.animateContentItems(targetPane);
                resolve();
            }, currentActivePane ? 50 : 0);
        });
    }

    animateContentItems(pane) {
        const items = pane.children;
        Array.from(items).forEach((item, index) => {
            item.style.animation = 'none';
            item.offsetHeight;
            item.style.animation = `fadeInUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.08}s backwards`;
        });
    }

    updateMediaInPane(pane) {
        const swipers = pane.querySelectorAll('.news-swiper');
        swipers.forEach(swiperEl => {
            if (swiperEl.swiper) {
                setTimeout(() => {
                    try {
                        swiperEl.swiper.update();
                        swiperEl.swiper.slideTo(0, 0);
                    } catch (e) {
                        console.warn('Swiper update error:', e);
                    }
                }, 100);
            }
        });
    }

    updateCasesSlidersInPane(pane) {
        const casesSliders = pane.querySelectorAll('.cases-slider.swiper');
        casesSliders.forEach(swiperEl => {
            if (swiperEl.swiper) {
                setTimeout(() => {
                    try {
                        swiperEl.swiper.update();
                        swiperEl.swiper.slideTo(0, 0);
                    } catch (e) {
                        console.warn('Cases slider update error:', e);
                    }
                }, 100);
            }
        });
    }

    initResponsiveBehavior() {
        this.handleResize = this.handleResize.bind(this);
        window.addEventListener('resize', this.debounce(this.handleResize, 150));
        setTimeout(() => this.handleResize(), 100);
    }

    handleResize() {
        const width = window.innerWidth;
        if (width <= this.breakpoint) {
            this.enableSwiperMode();
        } else {
            this.disableSwiperMode();
        }
    }

    enableSwiperMode() {
        if (this.moreButton) this.moreButton.style.display = 'none';
        if (this.hideButton) this.hideButton.style.display = 'none';

        if (this.isExpanded) {
            this.isExpanded = false;
            this.hiddenButtons.forEach(btn => {
                btn.classList.remove('visible');
                btn.classList.add('hidden');
            });
        }

        this.buttons.forEach(btn => {
            btn.style.display = '';
            if (btn.classList.contains('news-tabs__btn--hidden')) {
                btn.classList.remove('hidden');
                btn.classList.add('visible');
            }
        });

        if (!this.swiper && this.tabsNav) {
            this.initSwiper();
        } else if (this.swiper) {
            this.swiper.update();
        }
    }

    disableSwiperMode() {
        if (this.moreButton) this.moreButton.style.display = '';
        if (this.hideButton) this.hideButton.style.display = 'none';

        if (this.swiper) {
            this.swiper.destroy(true, true);
            this.swiper = null;
            this.restoreOriginalStructure();
        }

        this.buttons.forEach(btn => {
            btn.style.display = '';
            if (btn.classList.contains('news-tabs__btn--hidden') && !this.isExpanded) {
                btn.classList.remove('visible');
                btn.classList.add('hidden');
            }
        });
    }

    initSwiper() {
        this.tabsNav.classList.add('swiper-container');
        let wrapper = this.tabsNav.querySelector('.swiper-wrapper');

        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.className = 'swiper-wrapper';
            const buttons = Array.from(this.tabsNav.children);

            buttons.forEach(btn => {
                const slide = document.createElement('div');
                slide.className = 'swiper-slide';
                btn.parentNode.insertBefore(slide, btn);
                slide.appendChild(btn);
            });

            const slides = Array.from(this.tabsNav.querySelectorAll('.swiper-slide'));
            slides.forEach(slide => wrapper.appendChild(slide));
            this.tabsNav.appendChild(wrapper);
        }

        import('swiper').then(({ Swiper }) => {
            this.swiper = new Swiper(this.tabsNav, {
                slidesPerView: 'auto',
                spaceBetween: 12,
                freeMode: true,
                watchSlidesProgress: true,
                touchRatio: 0.8,
                slideClass: 'swiper-slide',
                wrapperClass: 'swiper-wrapper',
                breakpoints: {
                    320: { spaceBetween: 8 },
                    768: { spaceBetween: 12 },
                    1024: { spaceBetween: 16 }
                }
            });
        }).catch(error => {
            console.warn('Swiper import failed:', error);
        });
    }

    restoreOriginalStructure() {
        if (!this.tabsNav) return;
        this.tabsNav.classList.remove('swiper-container');
        const wrapper = this.tabsNav.querySelector('.swiper-wrapper');

        if (wrapper) {
            const slides = Array.from(wrapper.children);
            slides.forEach(slide => {
                const btn = slide.querySelector('.news-tabs__btn');
                if (btn) this.tabsNav.appendChild(btn);
                slide.remove();
            });
            wrapper.remove();
        }
    }

    initResizeObserver() {
        if (window.ResizeObserver) {
            try {
                this.observer = new ResizeObserver((entries) => {
                    if (this.animationFrameId) {
                        cancelAnimationFrame(this.animationFrameId);
                    }
                    this.animationFrameId = requestAnimationFrame(() => {
                        entries.forEach(entry => {
                            if (entry.target === this.container || entry.target.classList.contains('news-tabs__pane')) {
                                this.adjustPaneHeight();
                            }
                        });
                    });
                });

                this.observer.observe(this.container);
                const activePane = this.panes.find(pane => pane.classList.contains('active'));
                if (activePane) this.observer.observe(activePane);
            } catch (e) {
                console.warn('ResizeObserver failed to initialize:', e);
            }
        }
    }

    adjustPaneHeight() {
        if (!this.content) return;
        const activePane = this.panes.find(pane => pane.classList.contains('active'));
        if (activePane) {
            const height = activePane.offsetHeight;
            requestAnimationFrame(() => {
                this.content.style.minHeight = `${height}px`;
            });
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    destroy() {
        if (this.isCases) {
            window.removeEventListener('resize', this.handleResize);
            if (this.swiper) {
                this.swiper.destroy(true, true);
                this.swiper = null;
            }
        }

        if (this.observer) {
            try {
                this.observer.disconnect();
                this.observer = null;
            } catch (e) {
                console.warn('ResizeObserver disconnect error:', e);
            }
        }

        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        this.buttons = null;
        this.panes = null;
        this.container = null;
        this.content = null;
    }
}

export function initNewsTabs() {
    const containers = document.querySelectorAll('.news-tabs');
    const instances = [];

    containers.forEach(container => {
        if (!container._newsTabsInstance && container.offsetParent !== null) {
            const instance = new NewsTabs(container);
            container._newsTabsInstance = instance;
            instances.push(instance);
        }
    });

    return instances;
}

if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => initNewsTabs());
    } else {
        setTimeout(() => initNewsTabs(), 0);
    }
}

export default NewsTabs;