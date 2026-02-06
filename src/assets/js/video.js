export function initAllVideos() {
    document.querySelectorAll('.media-element').forEach((video) => {
        const container = video.closest('.main-video');
        if (!container) return;

        const playButton = container.querySelector('.play-button');
        if (!playButton) return;

        container.classList.add('on-poster');

        const videoWrapper = document.createElement('div');
        videoWrapper.className = 'video-wrapper';
        videoWrapper.style.position = 'relative';
        videoWrapper.style.width = '100%';
        videoWrapper.style.height = '100%';

        const posterOverlay = document.createElement('div');
        posterOverlay.className = 'poster-overlay';
        posterOverlay.style.position = 'absolute';
        posterOverlay.style.top = '0';
        posterOverlay.style.left = '0';
        posterOverlay.style.width = '100%';
        posterOverlay.style.height = '100%';
        posterOverlay.style.backgroundImage = `url(${video.poster})`;
        posterOverlay.style.backgroundSize = 'cover';
        posterOverlay.style.backgroundPosition = 'center';
        posterOverlay.style.pointerEvents = 'none';
        posterOverlay.style.zIndex = '2';
        posterOverlay.style.opacity = '1';
        posterOverlay.style.transition = 'opacity 0.3s ease';

        video.parentNode.insertBefore(videoWrapper, video);
        videoWrapper.appendChild(video);
        videoWrapper.appendChild(posterOverlay);

        const fullscreenButton = document.createElement('button');
        fullscreenButton.className = 'fullscreen-button';
        fullscreenButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
        `;
        fullscreenButton.setAttribute('aria-label', 'Полноэкранный режим');
        fullscreenButton.style.opacity = '0';
        fullscreenButton.style.pointerEvents = 'none';
        fullscreenButton.style.zIndex = '3';
        container.appendChild(fullscreenButton);

        function toggleFullscreen() {
            if (!document.fullscreenElement) {
                container.requestFullscreen?.();
            } else {
                document.exitFullscreen?.();
            }
        }

        function showFullscreenButton() {
            fullscreenButton.style.opacity = '1';
            fullscreenButton.style.pointerEvents = 'auto';
        }

        function hideFullscreenButton() {
            if (!document.fullscreenElement) {
                fullscreenButton.style.opacity = '0';
                fullscreenButton.style.pointerEvents = 'none';
            }
        }

        fullscreenButton.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFullscreen();
        });

        function updateFullscreenUI() {
            if (document.fullscreenElement) {
                fullscreenButton.style.display = 'none';
                if (!video.paused) {
                    playButton.style.opacity = '0';
                }
            } else {
                fullscreenButton.style.display = 'flex';
                playButton.style.opacity = '';
                if (video.paused || video.ended) {
                    posterOverlay.style.opacity = '1';
                    container.classList.add('on-poster');
                }
            }
        }

        document.addEventListener('fullscreenchange', updateFullscreenUI);

        video.addEventListener('play', () => {
            playButton.classList.add('playing');
            container.classList.remove('on-poster');
            showFullscreenButton();
            setTimeout(hideFullscreenButton, 3000);
            posterOverlay.style.opacity = '0';
        });

        video.addEventListener('pause', () => {
            playButton.classList.remove('playing');
            container.classList.add('on-poster');
            showFullscreenButton();
            if (!document.fullscreenElement) {
                posterOverlay.style.opacity = '1';
            }
        });

        video.addEventListener('ended', () => {
            playButton.classList.remove('playing');
            container.classList.add('on-poster');
            if (!document.fullscreenElement) {
                posterOverlay.style.opacity = '1';
            }
        });

        container.addEventListener('mouseenter', () => {
            if (!video.paused) showFullscreenButton();
        });

        container.addEventListener('mouseleave', hideFullscreenButton);

        video.addEventListener('click', (e) => {
            e.stopPropagation();
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });

        playButton.addEventListener('click', (e) => {
            e.stopPropagation();
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });
    });

    initVideoDownload();
}

function initVideoDownload() {
    const downloadLink = document.getElementById('downloadLink');
    if (!downloadLink) return;

    downloadLink.addEventListener('click', function(e) {
        e.preventDefault();

        const video = document.querySelector('.media-element source');
        if (!video || !video.src) return;

        const link = document.createElement('a');
        link.href = video.src;
        link.download = 'video-presentation.mp4';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}