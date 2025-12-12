// 무뮤(MoodMusic) - 테마별 장식 효과

(function() {
    'use strict';

    // 페이지 로드 시 초기화
    document.addEventListener('DOMContentLoaded', () => {
        // sessionStorage로 효과 초기화 여부 확인
        const effectsInitialized = sessionStorage.getItem('themeEffectsInitialized');
        
        if (!effectsInitialized) {
            // 새로고침이거나 첫 방문 - 효과 초기화
            sessionStorage.setItem('themeEffectsInitialized', 'true');
            initThemeEffects();
        } else {
            // 페이지 이동 - 효과 유지, 테마 변경 감지만 활성화
            observeThemeChanges();
            
            // 기존 효과가 없으면 생성 (방어적 코드)
            if (!document.querySelector('.theme-decoration')) {
                createThemeDecorations();
            }
            if (!document.querySelector('.sparkle') && window.innerWidth >= 768) {
                createSparkles();
            }
        }
    });

    function initThemeEffects() {
        createThemeDecorations();
        createSparkles();
        observeThemeChanges();
    }

    // === 테마별 장식 요소 생성 ===
    function createThemeDecorations() {
        // 모바일에서는 장식 요소 최소화
        if (window.innerWidth < 768) return;
        
        const themes = {
            'happy': ['🎵', '🎶', '🎸', '🎹', '🎺', '🎻', '🎤', '🎧'],
            'calm': ['🌊', '🍃', '☁️', '🌙', '⭐', '🌸', '🦋', '🌺'],
            'sad': ['💧', '🌧️', '☔', '🌫️', '💙', '🌌', '💤', '🌙'],
            'angry': ['🔥', '⚡', '💥', '🌪️', '🔴', '💢', '⚠️', '💨']
        };
        
        function updateDecorations() {
            // 기존 장식 제거
            document.querySelectorAll('.theme-decoration').forEach(el => el.remove());
            
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (!currentTheme || !themes[currentTheme]) return;
            
            const emojis = themes[currentTheme];
            const decorationCount = 12; // 8에서 12개로 증가
            
            for (let i = 0; i < decorationCount; i++) {
                const decoration = document.createElement('div');
                decoration.className = `theme-decoration ${currentTheme}`; // 테마별 클래스 추가
                decoration.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                
                // 더 자연스러운 배치 (화면 가장자리와 중앙에 골고루)
                const leftPos = 5 + Math.random() * 90;
                const topPos = 5 + Math.random() * 90;
                
                decoration.style.left = `${leftPos}%`;
                decoration.style.top = `${topPos}%`;
                decoration.style.animationDelay = `${Math.random() * 5}s`;
                
                // 크기 다양성 추가
                const scale = 0.8 + Math.random() * 0.6; // 0.8 ~ 1.4
                decoration.style.transform = `scale(${scale})`;
                
                document.body.appendChild(decoration);
            }
        }
        
        updateDecorations();
        
        return updateDecorations;
    }

    // === 반짝이는 효과 ===
    let sparkleInterval = null;
    
    function createSparkles() {
        if (window.innerWidth < 768) return;
        
        // 이미 실행 중이면 중복 생성 방지
        if (sparkleInterval) return;
        
        function addSparkle() {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            
            // 더 다양한 위치에 배치
            const leftPos = 10 + Math.random() * 80;
            const topPos = 10 + Math.random() * 80;
            
            sparkle.style.left = `${leftPos}%`;
            sparkle.style.top = `${topPos}%`;
            sparkle.style.animationDelay = `${Math.random() * 0.5}s`;
            sparkle.style.animationDuration = `${1.5 + Math.random() * 1}s`; // 1.5-2.5초
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => {
                sparkle.remove();
            }, 2500);
        }
        
        // 더 빈번하게 반짝임 추가 (800ms -> 500ms)
        sparkleInterval = setInterval(addSparkle, 500);
        
        // 초기에 여러 개 생성
        for (let i = 0; i < 5; i++) {
            setTimeout(addSparkle, i * 100);
        }
    }

    // === 테마 변경 감지 ===
    function observeThemeChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    const updateDecorations = createThemeDecorations();
                    if (updateDecorations) updateDecorations();
                }
            });
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
    }

})();
