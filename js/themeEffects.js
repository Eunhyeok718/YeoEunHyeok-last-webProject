// 무뮤(MoodMusic) - 테마별 장식 효과 (최적화)

(function() {
    'use strict';

    const MOBILE_BREAKPOINT = 768;
    const DECORATION_COUNT = 12;
    const SPARKLE_INTERVAL = 500;
    const SPARKLE_DURATION = 2500;
    const RESIZE_DEBOUNCE = 200;
    const THEMES = {
        happy: ['🎵', '🎶', '🎸', '🎹', '🎺', '🎻', '🎤', '🎧'],
        calm: ['🌊', '🍃', '☁️', '🌙', '⭐', '🌸', '🦋', '🌺'],
        sad: ['💧', '🌧️', '☔', '🌫️', '💙', '🌌', '💤', '🌙'],
        angry: ['🔥', '⚡', '💥', '🌪️', '🔴', '💢', '⚠️', '💨']
    };

    let sparkleInterval = null;
    let themeObserver = null;
    let resizeTimer = null;

    // 초기화: 첫 진입 시 효과 설정, 이후 페이지 이동에도 유지
    document.addEventListener('DOMContentLoaded', () => {
        const isInitialized = sessionStorage.getItem('themeEffectsInitialized');
        
        if (!isInitialized) {
            sessionStorage.setItem('themeEffectsInitialized', 'true');
            initEffects();
        } else {
            observeTheme();
            if (!document.querySelector('.theme-decoration')) createDecorations();
            if (!document.querySelector('.sparkle') && !isMobile()) createSparkles();
        }

        window.addEventListener('resize', handleResize, { passive: true });
    });

    /**
     * 모바일 환경(폭 기준) 여부를 반환합니다.
     */
    const isMobile = () => window.innerWidth < MOBILE_BREAKPOINT;

    /**
     * 테마 장식/스파클/감지자를 설정합니다.
     */
    function initEffects() {
        createDecorations();
        createSparkles();
        observeTheme();
    }

    /**
     * 현재 테마에 맞는 장식 요소를 생성합니다. 모바일에서는 생성하지 않습니다.
     */
    function createDecorations() {
        if (isMobile()) {
            clearDecorations();
            return;
        }
        updateDecorations();
        return updateDecorations;
    }

    /**
     * 기존 장식을 모두 제거하고 새로 렌더링합니다.
     */
    function updateDecorations() {
        clearDecorations();
        
        const theme = document.documentElement.getAttribute('data-theme');
        if (!theme || !THEMES[theme]) return;
        
        const fragment = document.createDocumentFragment();
        const emojis = THEMES[theme];
        
        for (let i = 0; i < DECORATION_COUNT; i++) {
            const decoration = document.createElement('div');
            decoration.className = `theme-decoration ${theme}`;
            decoration.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            decoration.style.cssText = `left:${5 + Math.random() * 90}%;top:${5 + Math.random() * 90}%;animation-delay:${Math.random() * 5}s;transform:scale(${0.8 + Math.random() * 0.6})`;
            fragment.appendChild(decoration);
        }
        
        document.body.appendChild(fragment);
    }

    /**
     * 화면에 반짝이는 점 효과를 주기적으로 추가합니다. 모바일에서는 비활성화합니다.
     */
    function createSparkles() {
        if (isMobile()) {
            clearSparkles();
            return;
        }
        if (sparkleInterval) return;
        
        const addSparkle = () => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.cssText = `left:${10 + Math.random() * 80}%;top:${10 + Math.random() * 80}%;animation-delay:${Math.random() * 0.5}s;animation-duration:${1.5 + Math.random()}s`;
            document.body.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), SPARKLE_DURATION);
        };
        
        sparkleInterval = setInterval(addSparkle, SPARKLE_INTERVAL);
        
        // 초기 생성
        for (let i = 0; i < 5; i++) setTimeout(addSparkle, i * 100);
    }

    /**
     * html[data-theme] 변경을 감지해 장식을 갱신합니다.
     */
    function observeTheme() {
        if (themeObserver) return;
        
        themeObserver = new MutationObserver((mutations) => {
            if (mutations.some(m => m.attributeName === 'data-theme')) {
                updateDecorations();
            }
        });
        
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
    }

    /**
     * 모든 장식 요소를 제거합니다.
     */
    function clearDecorations() {
        document.querySelectorAll('.theme-decoration').forEach(el => el.remove());
    }

    /**
     * 반짝임 인터벌을 해제하고 잔여 스파클을 제거합니다.
     */
    function clearSparkles() {
        if (sparkleInterval) {
            clearInterval(sparkleInterval);
            sparkleInterval = null;
        }
        document.querySelectorAll('.sparkle').forEach(el => el.remove());
    }

    /**
     * 리사이즈 시 모바일/데스크톱에 맞춰 효과를 재구성합니다.
     */
    function handleResize() {
        if (resizeTimer) cancelAnimationFrame(resizeTimer);
        resizeTimer = requestAnimationFrame(() => {
            if (isMobile()) {
                clearDecorations();
                clearSparkles();
            } else {
                createDecorations();
                createSparkles();
            }
        });
    }

})();
