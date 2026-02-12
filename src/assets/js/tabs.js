export class NewsTabs {
    constructor(container) {
        this.container = container;
        this.activeTabId = null;
        this.isAnimating = false;
        this.observer = null;
        this.animationFrameId = null;

        this.init();
        this.initResizeObserver();
    }

    init() {

        this.buttons = Array.from(this.container.querySelectorAll('.news-tabs__btn'));
        this.panes = Array.from(this.container.querySelectorAll('.news-tabs__pane'));
        this.content = this.container.querySelector('.news-tabs__content');

        if (this.buttons.length === 0 || this.panes.length === 0) return;


        this.bindEvents();


        this.activateInitialTab();


        this.initHoverEffects();


        setTimeout(() => this.adjustPaneHeight(), 100);
    }


    bindEvents() {

        this.buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchToTab(btn.dataset.tab);
            });
        });
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

        this.buttons.forEach(btn => {
            btn.classList.remove('active');
        });


        targetBtn.classList.add('active');


        await this.animatePaneTransition(targetPane);


        this.updateMediaInPane(targetPane);

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
                if (activePane) {
                    this.observer.observe(activePane);
                }
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


    destroy() {
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