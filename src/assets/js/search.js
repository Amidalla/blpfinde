export function initSearch() {
    const searchToggle = document.getElementById('searchToggle');
    const searchBox = document.getElementById('searchBox');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.querySelector('.search-input');

    if (!searchToggle || !searchBox || !searchClose || !searchInput) {
        return;
    }

    let isSearchOpen = false;

    searchToggle.addEventListener('click', (e) => {
        e.stopPropagation();

        if (!isSearchOpen) {
            searchBox.classList.add('active');
            isSearchOpen = true;
            setTimeout(() => {
                searchInput.focus();
            }, 300);
        } else {
            const query = searchInput.value.trim();
            if (query) {
                searchBox.classList.remove('active');
                isSearchOpen = false;
                setTimeout(() => {
                    searchInput.value = '';
                }, 300);
            }
        }
    });

    searchClose.addEventListener('click', (e) => {
        e.stopPropagation();
        searchBox.classList.remove('active');
        isSearchOpen = false;
        setTimeout(() => {
            searchInput.value = '';
        }, 300);
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                searchBox.classList.remove('active');
                isSearchOpen = false;
                setTimeout(() => {
                    searchInput.value = '';
                }, 300);
            }
        }
    });

    document.addEventListener('click', (event) => {
        if (isSearchOpen &&
            !searchBox.contains(event.target) &&
            !searchToggle.contains(event.target)) {
            searchBox.classList.remove('active');
            isSearchOpen = false;
            setTimeout(() => {
                searchInput.value = '';
            }, 300);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && isSearchOpen) {
            searchBox.classList.remove('active');
            isSearchOpen = false;
            setTimeout(() => {
                searchInput.value = '';
            }, 300);
        }
    });
}