class Accordion {
    constructor(containerSelector = '.questions-accordion .accordion') {
        this.container = document.querySelector(containerSelector);
        if (!this.container) {
            console.log('Accordion container not found');
            return;
        }

        this.headers = this.container.querySelectorAll('.accordion-header');
        this.panels = this.container.querySelectorAll('.accordion-panel');

        if (this.headers.length === 0) {
            console.log('No accordion headers found');
            return;
        }

        this.init();
        // Даем время на загрузку SVG через include
        setTimeout(() => {
            this.fixSvgIds();
        }, 100);
    }

    fixSvgIds() {
        document.querySelectorAll('.icon-plus svg, .icon-minus svg').forEach((svg, svgIndex) => {
            // Сначала собираем все ID и их новые значения
            const idMap = new Map();

            // Все элементы с ID внутри SVG
            const elementsWithId = svg.querySelectorAll('[id]');
            elementsWithId.forEach((el) => {
                const oldId = el.id;
                const newId = `${oldId}_${svgIndex}`;
                idMap.set(oldId, newId);
                el.id = newId;
            });

            // Обновляем ссылки через обход DOM
            idMap.forEach((newId, oldId) => {
                // Ищем все атрибуты, которые могут содержать ссылки на ID
                const allElements = svg.querySelectorAll('*');
                allElements.forEach(el => {
                    // Проверяем атрибуты, которые могут содержать URL ссылки
                    if (el.hasAttribute('clip-path')) {
                        const value = el.getAttribute('clip-path');
                        if (value.includes(`#${oldId}`)) {
                            el.setAttribute('clip-path', value.replace(`#${oldId}`, `#${newId}`));
                        }
                    }

                    if (el.hasAttribute('mask')) {
                        const value = el.getAttribute('mask');
                        if (value.includes(`#${oldId}`)) {
                            el.setAttribute('mask', value.replace(`#${oldId}`, `#${newId}`));
                        }
                    }

                    if (el.hasAttribute('href')) {
                        const value = el.getAttribute('href');
                        if (value === `#${oldId}`) {
                            el.setAttribute('href', `#${newId}`);
                        }
                    }

                    if (el.hasAttribute('xlink:href')) {
                        const value = el.getAttribute('xlink:href');
                        if (value === `#${oldId}`) {
                            el.setAttribute('xlink:href', `#${newId}`);
                        }
                    }

                    // Проверяем inline стили
                    if (el.hasAttribute('style')) {
                        const style = el.getAttribute('style');
                        if (style.includes(`url(#${oldId})`)) {
                            el.setAttribute('style', style.replace(`url(#${oldId})`, `url(#${newId})`));
                        }
                    }
                });
            });

            svg.classList.add(`svg-${svgIndex}`);
        });

        console.log('SVG IDs fixed, total icons:', document.querySelectorAll('.icon-plus svg, .icon-minus svg').length);
    }

    init() {
        this.headers.forEach((btn, idx) => {
            btn.removeEventListener('click', this.handleClick);
            btn.addEventListener('click', this.handleClick.bind(this));
            btn.dataset.index = idx;
        });
    }

    handleClick(e) {
        const btn = e.currentTarget;
        const panel = btn.nextElementSibling;

        if (!panel || !panel.classList.contains('accordion-panel')) return;

        btn.classList.toggle('active');
        panel.classList.toggle('open');

        const event = new CustomEvent('accordionToggle', {
            detail: {
                index: btn.dataset.index,
                isOpen: panel.classList.contains('open')
            }
        });
        this.container.dispatchEvent(event);
    }

    openItem(index) {
        const btn = this.headers[index];
        const panel = this.panels[index];
        if (btn && panel && !panel.classList.contains('open')) {
            btn.classList.add('active');
            panel.classList.add('open');
        }
    }

    closeItem(index) {
        const btn = this.headers[index];
        const panel = this.panels[index];
        if (btn && panel && panel.classList.contains('open')) {
            btn.classList.remove('active');
            panel.classList.remove('open');
        }
    }

    closeAll() {
        this.headers.forEach((btn, idx) => {
            btn.classList.remove('active');
            this.panels[idx].classList.remove('open');
        });
    }

    openAll() {
        this.headers.forEach((btn, idx) => {
            btn.classList.add('active');
            this.panels[idx].classList.add('open');
        });
    }

    refresh() {
        this.headers = this.container.querySelectorAll('.accordion-header');
        this.panels = this.container.querySelectorAll('.accordion-panel');
        this.init();
        this.fixSvgIds();
    }

    destroy() {
        this.headers.forEach(btn => {
            btn.removeEventListener('click', this.handleClick);
        });
    }
}

export default Accordion;