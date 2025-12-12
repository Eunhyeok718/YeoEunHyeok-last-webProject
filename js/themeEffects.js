// 무뮤(MoodMusic) - 테마별 장식 효과 (최적화)

(function() {
    'use strict';

    const MOBILE_BREAKPOINT = 768;
    const DECORATION_COUNT = 12;
    const SPARKLE_INTERVAL = 500;
    const SPARKLE_DURATION = 2500;
    const THEMES = {
        happy: ['🎵', '🎶', '🎸', '🎹', '🎺', '🎻', '🎤', '🎧'],
        calm: ['🌊', '🍃', '☁️', '🌙', '⭐', '🌸', '🦋', '🌺'],
        sad: ['💧', '🌧️', '☔', '🌫️', '💙', '🌌', '💤', '🌙'],
        angry: ['🔥', '⚡', '💥', '🌪️', '🔴', '💢', '⚠️', '💨']
    };

    let sparkleInterval = null;
    let themeObserver = null;

    // 페이지 로드 시 초기화
    document.addEventListener('DOMContentLoaded', () => {
        const isInitialized = sessionStorage.getItem('themeEffectsInitialized');
        
        if (!isInitialized) {
            sessionStorage.setItem('themeEffectsInitialized', 'true');
            initEffects();
        } else {
            // 페이지 이동 시 효과 유지
            observeTheme();
            if (!document.querySelector('.theme-decoration')) createDecorations();
            if (!document.querySelector('.sparkle') && !isMobile()) createSparkles();
        }
    });

    const isMobile = () => window.innerWidth < MOBILE_BREAKPOINT;

    function initEffects() {
        createDecorations();
        createSparkles();
        observeTheme();
    }

    // === 테마별 장식 요소 (최적화) ===
    function createDecorations() {
        if (isMobile()) return;
        
        updateDecorations();
        return updateDecorations;
    }

    function updateDecorations() {
        // 기존 장식 제거
        document.querySelectorAll('.theme-decoration').forEach(el => el.remove());
        
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

    // === 반짝임 효과 (최적화) ===
    function createSparkles() {
        if (isMobile() || sparkleInterval) return;
        
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

    // === 테마 변경 감지 (최적화) ===
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

})();
