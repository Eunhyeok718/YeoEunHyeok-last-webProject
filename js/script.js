// 무뮤(MoodMusic) - 동적 효과 스크립트

(function() {
    'use strict';

    // === 페이지 로드 애니메이션 ===
    document.addEventListener('DOMContentLoaded', () => {
        // 페이드인 애니메이션
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 50);

        // 요소들 순차 애니메이션
        animateElements();
        
        // 스크롤 이벤트
        initScrollEffects();
        
        // 마우스 효과
        initMouseEffects();
        
        // 카드 호버 3D 효과
        init3DCardEffect();
    });

    // === 요소 순차 애니메이션 ===
    function animateElements() {
        const elementsToAnimate = document.querySelectorAll('.mood-grid button, .song-card, .shared-song-card, .random-card, .suggest-form-card');
        
        elementsToAnimate.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(10px)';
            el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 80 + (index * 30));
        });
    }

    // === 스크롤 효과 ===
    function initScrollEffects() {
        let lastScroll = 0;
        const header = document.querySelector('.site-header');
        const footer = document.querySelector('.site-footer');
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // 헤더 숨김/표시
            if (currentScroll > lastScroll && currentScroll > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            // 푸터(라이선스) 표시: 페이지 끝에 도달했을 때만 표시
            const isNearBottom = (window.innerHeight + currentScroll) >= (document.body.offsetHeight - 100);
            if (footer) {
                if (isNearBottom) {
                    footer.classList.add('visible');
                } else {
                    footer.classList.remove('visible');
                }
            }
            
            lastScroll = currentScroll;
            
            // 스크롤 진행 표시
            updateScrollProgress();
        }, { passive: true });
    }

    // === 스크롤 진행 표시 ===
    function updateScrollProgress() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        let progressBar = document.getElementById('scrollProgress');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.id = 'scrollProgress';
            progressBar.style.cssText = 'position:fixed;top:64px;left:0;width:0;height:3px;background:var(--accent);z-index:1001;transition:width 0.1s ease';
            document.body.appendChild(progressBar);
        }
        progressBar.style.width = scrolled + '%';
    }

    // === 마우스 효과 ===
    function initMouseEffects() {
        // 버튼 클릭 리플 효과
        const buttons = document.querySelectorAll('button, .play-btn, .mood-grid button');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.5);
                    left: ${x}px;
                    top: ${y}px;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    // === 3D 카드 효과 ===
    function init3DCardEffect() {
        applyCardEffects();
    }
    
    function applyCardEffects() {
        const cards = document.querySelectorAll('.song-card, .shared-song-card');
        const isMobile = window.innerWidth <= 768;
        
        cards.forEach(card => {
            // 기존 이벤트 리스너 제거를 위한 클론 방식 대신 플래그 사용
            if (card.dataset.effectsApplied) return;
            card.dataset.effectsApplied = 'true';
            
            // 모바일에서는 3D 효과 비활성화 (성능 최적화)
            if (isMobile) return;
            
            card.addEventListener('mouseenter', function() {
                this.style.transition = 'transform 0.1s ease';
            });
            
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transition = 'transform 0.3s ease';
                this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }
    
    // MutationObserver로 DOM 변경 감지
    const observer = new MutationObserver(() => {
        applyCardEffects();
    });
    
    // DOM 변경 감지 시작
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // === 배경 파티클 효과 ===
    function createParticles() {
        // 모바일에서는 파티클 효과 비활성화 (배터리/성능)
        if (window.innerWidth <= 768) return;
        
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        particlesContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            overflow: hidden;
        `;
        document.body.insertBefore(particlesContainer, document.body.firstChild);
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: var(--accent);
                opacity: ${Math.random() * 0.3 + 0.1};
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 10 + 5}s infinite ease-in-out;
            `;
            particlesContainer.appendChild(particle);
        }
    }

    // === 감정 버튼 강조 효과 ===
    const moodButtons = document.querySelectorAll('.mood-grid button');
    moodButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.02)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        button.addEventListener('mouseleave', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.transition = 'transform 0.2s ease';
            }
        });
    });

    // === 로딩 인디케이터 ===
    function showLoading() {
        const loader = document.createElement('div');
        loader.id = 'loader';
        loader.innerHTML = '<div class="spinner"></div>';
        loader.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
        `;
        document.body.appendChild(loader);
        
        setTimeout(() => loader.remove(), 1000);
    }

    // === CSS 애니메이션 추가 ===
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to { transform: scale(4); opacity: 0; }
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0) translateX(0); }
            25% { transform: translateY(-20px) translateX(10px); }
            50% { transform: translateY(-40px) translateX(-10px); }
            75% { transform: translateY(-20px) translateX(5px); }
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.03); }
        }
        
        .mood-grid button.selected {
            animation: pulse 2.5s ease-in-out infinite;
        }
        
        .heart-btn:active {
            animation: heartbeat 0.3s;
        }
        
        @keyframes heartbeat {
            0%, 100% { transform: scale(1); }
            25% { transform: scale(1.15); }
            50% { transform: scale(0.95); }
            75% { transform: scale(1.1); }
        }
        
        .site-header {
            transition: transform 0.3s ease;
        }
        
        .song-card, .shared-song-card {
            transform-style: preserve-3d;
        }
    `;
    document.head.appendChild(style);

    // 페이지별 특수 효과
    createParticles();
    
    // 모바일 뷰포트 설정 확인
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes';
        document.head.appendChild(meta);
    }
    
    // 윈도우 리사이즈 시 3D 효과 재적용
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            document.querySelectorAll('[data-effects-applied]').forEach(el => {
                delete el.dataset.effectsApplied;
            });
            applyCardEffects();
        }, 250);
    });

})();