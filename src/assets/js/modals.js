function initModal(config) {
    const {
        modalSelector,
        openButtonsSelector,
        closeButtonSelector = '.modal-form__close',
        onOpen = null,
        onClose = null
    } = config;

    const modal = document.querySelector(modalSelector);
    const overlay = document.querySelector('.overlay');
    const openButtons = document.querySelectorAll(openButtonsSelector);

    if (!modal || !overlay || openButtons.length === 0) {
        return null;
    }

    let isModalOpen = false;
    let scrollbarWidth = 0;

    function calculateScrollbarWidth() {
        return window.innerWidth - document.documentElement.clientWidth;
    }

    function disableBodyScroll() {
        scrollbarWidth = calculateScrollbarWidth();


        const scrollY = window.scrollY;


        document.documentElement.classList.add('modal-open');


        if (scrollbarWidth > 0) {
            document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
        }


        document.documentElement.dataset.scrollY = scrollY;
    }

    function enableBodyScroll() {

        const scrollY = document.documentElement.dataset.scrollY;


        document.documentElement.classList.remove('modal-open');
        document.documentElement.style.paddingRight = '';


        if (scrollY) {
            window.scrollTo(0, parseInt(scrollY));
            delete document.documentElement.dataset.scrollY;
        }
    }

    function openModal() {
        disableBodyScroll();

        modal.classList.add('active');
        overlay.classList.add('active');
        isModalOpen = true;

        if (onOpen) onOpen();
    }

    function closeModal() {
        modal.classList.remove('active');
        overlay.classList.remove('active');
        enableBodyScroll();

        isModalOpen = false;

        if (onClose) onClose();
    }


    openButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openModal();
        });
    });


    const closeBtn = modal.querySelector(closeButtonSelector);
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        });
    }


    overlay.addEventListener('click', (e) => {
        if (isModalOpen) {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        }
    });


    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isModalOpen) {
            closeModal();
        }
    });


    modal.addEventListener('click', (e) => {
        e.stopPropagation();
    });


    window.addEventListener('resize', () => {
        if (isModalOpen) {
            const newScrollbarWidth = calculateScrollbarWidth();
            if (newScrollbarWidth !== scrollbarWidth) {
                scrollbarWidth = newScrollbarWidth;
                if (scrollbarWidth > 0) {
                    document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
                } else {
                    document.documentElement.style.paddingRight = '';
                }
            }
        }
    });

    return {
        open: openModal,
        close: closeModal,
        isOpen: () => isModalOpen
    };
}

export function initMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const burgerBtns = document.querySelectorAll('.header__burger');

    if (!burgerBtns.length || !mobileMenu) {
        return;
    }

    let isMobileMenuOpen = false;
    let activeBurgerBtn = null;
    let dropdownsInitialized = false;
    let scrollbarWidth = 0;

    function calculateScrollbarWidth() {
        return window.innerWidth - document.documentElement.clientWidth;
    }

    function disableBodyScroll() {
        scrollbarWidth = calculateScrollbarWidth();

        const scrollY = window.scrollY;
        document.documentElement.classList.add('modal-open');

        if (scrollbarWidth > 0) {
            document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
        }

        document.documentElement.dataset.scrollY = scrollY;
    }

    function enableBodyScroll() {
        const scrollY = document.documentElement.dataset.scrollY;
        document.documentElement.classList.remove('modal-open');
        document.documentElement.style.paddingRight = '';

        if (scrollY) {
            window.scrollTo(0, parseInt(scrollY));
            delete document.documentElement.dataset.scrollY;
        }
    }

    function openMobileMenu(clickedBtn) {
        disableBodyScroll();
        mobileMenu.classList.add('active');
        isMobileMenuOpen = true;
        activeBurgerBtn = clickedBtn;

        clickedBtn.classList.add('is-open');

        burgerBtns.forEach(btn => {
            if (btn !== clickedBtn) {
                btn.classList.add('hidden');
            }
        });

        if (!dropdownsInitialized) {
            initMobileDropdowns();
            dropdownsInitialized = true;
        }
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        enableBodyScroll();

        burgerBtns.forEach(btn => {
            btn.classList.remove('is-open', 'hidden');
        });

        closeAllDropdowns();

        isMobileMenuOpen = false;
        activeBurgerBtn = null;
    }

    function closeAllDropdowns() {
        const openDropdowns = mobileMenu.querySelectorAll('.header__item.dropdown.open');
        openDropdowns.forEach(dropdown => {
            dropdown.classList.remove('open');

            const arrowSvg = dropdown.querySelector('.header__dropdown-arrow svg');
            if (arrowSvg) {
                arrowSvg.style.transform = 'rotate(180deg)';
            }
        });
    }

    function toggleDropdown(dropdownItem, arrowSvg) {
        if (dropdownItem.classList.contains('open')) {
            dropdownItem.classList.remove('open');
            arrowSvg.style.transform = 'rotate(180deg)';
        } else {
            closeAllDropdowns();
            dropdownItem.classList.add('open');
            arrowSvg.style.transform = 'rotate(0deg)';
        }
    }

    function initMobileDropdowns() {
        const dropdownItems = mobileMenu.querySelectorAll('.header__item.dropdown');

        dropdownItems.forEach(item => {
            const link = item.querySelector('.header__link');
            const arrow = link?.querySelector('svg');

            if (!arrow) return;

            const arrowClone = arrow.cloneNode(true);
            arrow.remove();

            const linkContainer = document.createElement('div');
            linkContainer.className = 'header__link-container';

            const newLink = link.cloneNode(true);
            newLink.innerHTML = link.querySelector('span').outerHTML;

            const arrowButton = document.createElement('button');
            arrowButton.className = 'header__dropdown-arrow';
            arrowButton.innerHTML = arrowClone.outerHTML;

            linkContainer.appendChild(newLink);
            linkContainer.appendChild(arrowButton);
            link.replaceWith(linkContainer);

            const arrowSvg = arrowButton.querySelector('svg');

            arrowButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleDropdown(item, arrowSvg);
            });

            newLink.addEventListener('click', (e) => {
                e.preventDefault();
            });
        });
    }

    burgerBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (isMobileMenuOpen) {
                if (btn === activeBurgerBtn) {
                    closeMobileMenu();
                }
            } else {
                openMobileMenu(btn);
            }
        });
    });

    const closeBtn = mobileMenu.querySelector('.mobile-menu__close');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeMobileMenu();
        });
    }

    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            closeMobileMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMobileMenuOpen) {
            closeMobileMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (isMobileMenuOpen) {
            const newScrollbarWidth = calculateScrollbarWidth();
            if (newScrollbarWidth !== scrollbarWidth) {
                scrollbarWidth = newScrollbarWidth;
                if (scrollbarWidth > 0) {
                    document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
                } else {
                    document.documentElement.style.paddingRight = '';
                }
            }
        }
    });
}


export function initModals() {

    initModal({
        modalSelector: '.form-solution',
        openButtonsSelector: '.header__btn, .technology__btn.color-btn, .footer-btn.color-btn, .tasks__btn.color-btn, .cases__btn.color-btn',
        closeButtonSelector: '.modal-form__close'
    });

    initModal({
        modalSelector: '.form-question',
        openButtonsSelector: '.main-about__btn.color-btn, .uniqueness__btn.color-btn',
        closeButtonSelector: '.modal-form__close'
    });

    const authModal = initModal({
        modalSelector: '.form-authorization',
        openButtonsSelector: '.access-link',
        closeButtonSelector: '.modal-form__close'
    });


    const regModal = initModal({
        modalSelector: '.form-registration',
        openButtonsSelector: '.registration-link',
        closeButtonSelector: '.modal-form__close'
    });


    if (authModal && regModal) {

        const registrationLinks = document.querySelectorAll('.registration-link');
        registrationLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();


                if (authModal.isOpen()) {
                    authModal.close();
                }


                regModal.open();
            });
        });


        const accessLinks = document.querySelectorAll('.access-link');
        accessLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();


                if (regModal.isOpen()) {
                    regModal.close();
                }

            });
        });
    }
}