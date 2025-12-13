// 무뮤(MoodMusic) - 동적 효과 스크립트 (최적화)

(function() {
    'use strict';

    // 상수
    const MOBILE_BREAKPOINT = 768;
    const ANIMATION_DELAY_BASE = 80;
    const ANIMATION_DELAY_INCREMENT = 30;
    const SCROLL_THROTTLE = 100;
    const RESIZE_DEBOUNCE = 250;

    // 유틸리티: throttle
    const throttle = (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    // 유틸리티: debounce
    const debounce = (func, delay) => {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    };

    // 유틸리티: isMobile
    const isMobile = () => window.innerWidth <= MOBILE_BREAKPOINT;

    // === 페이지 로드 애니메이션 ===
    document.addEventListener('DOMContentLoaded', () => {
        createPageTransitionOverlay();
        initPageTransitions();
        animateElements();
        initScrollEffects();
        initMouseEffects();
        init3DCardEffect();
        
        // 비필수 작업은 idle 시점에 실행
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                createParticles();
                injectStyles();
            });
        } else {
            setTimeout(() => {
                createParticles();
                injectStyles();
            }, 1000);
        }
    });

    // === 페이지 전환 오버레이 생성 ===
    function createPageTransitionOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        overlay.id = 'pageTransitionOverlay';
        document.body.appendChild(overlay);
    }

    // === 페이지 전환 효과 ===
    function initPageTransitions() {
        const navLinks = document.querySelectorAll('.nav a, .logo');
        const overlay = document.getElementById('pageTransitionOverlay');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // 현재 페이지면 전환 효과 없이 리턴
                if (href && (href === '#' || link.classList.contains('active'))) {
                    return;
                }
                
                // 외부 링크나 앵커 링크는 제외
                if (!href || href.startsWith('http') || href.startsWith('#')) {
                    return;
                }
                
                e.preventDefault();
                
                // 오버레이 활성화
                overlay.classList.add('active');
                
                // 페이지 이동
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            });
        });
    }

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

    // === 스크롤 효과 (throttle 적용) ===
    function initScrollEffects() {
        let lastScroll = 0;
        const header = document.querySelector('.site-header');
        const footer = document.querySelector('.site-footer');
        
        const handleScroll = throttle(() => {
            const currentScroll = window.pageYOffset;
            
            // 헤더 숨김/표시
            if (header) {
                header.style.transform = (currentScroll > lastScroll && currentScroll > 100) 
                    ? 'translateY(-100%)' 
                    : 'translateY(0)';
            }
            
            // 푸터 표시
            if (footer) {
                const isNearBottom = (window.innerHeight + currentScroll) >= (document.body.offsetHeight - 100);
                footer.classList.toggle('visible', isNearBottom);
            }
            
            lastScroll = currentScroll;
        }, SCROLL_THROTTLE);
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // === 마우스 효과 (이벤트 위임) ===
    function initMouseEffects() {
        document.body.addEventListener('click', function(e) {
            const target = e.target.closest('button, .play-btn');
            if (!target) return;
            
            const ripple = document.createElement('span');
            const rect = target.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:rgba(255,255,255,0.5);left:${x}px;top:${y}px;transform:scale(0);animation:ripple 0.6s ease-out;pointer-events:none`;
            
            target.style.position = 'relative';
            target.style.overflow = 'hidden';
            target.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    }

    // === 3D 카드 효과 (최적화) ===
    function init3DCardEffect() {
        if (isMobile()) return;
        
        const observer = new MutationObserver(debounce(applyCardEffects, 100));
        observer.observe(document.body, { childList: true, subtree: true });
        
        applyCardEffects();
    }
    
    function applyCardEffects() {
        if (isMobile()) return;
        
        document.querySelectorAll('.song-card:not([data-3d])').forEach(card => {
            card.dataset['3d'] = 'true';
            
            const handleMouseMove = (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rotateX = ((y - rect.height / 2) / 10);
                const rotateY = ((rect.width / 2 - x) / 10);
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            };
            
            card.addEventListener('mouseenter', () => card.style.transition = 'transform 0.1s ease');
            card.addEventListener('mousemove', handleMouseMove);
            card.addEventListener('mouseleave', () => {
                card.style.transition = 'transform 0.3s ease';
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    // === 파티클 효과 (최적화) ===
    function createParticles() {
        if (isMobile()) return;
        
        const container = document.createElement('div');
        container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;overflow:hidden';
        document.body.insertBefore(container, document.body.firstChild);
        
        const fragment = document.createDocumentFragment();
        const particleCount = window.innerWidth > 1400 ? 20 : 12;
        for (let i = 0; i < particleCount; i++) {
            const p = document.createElement('div');
            const size = Math.random() * 4 + 2;
            p.style.cssText = `position:absolute;width:${size}px;height:${size}px;background:var(--accent);opacity:${Math.random() * 0.3 + 0.1};border-radius:50%;left:${Math.random() * 100}%;top:${Math.random() * 100}%;animation:float ${Math.random() * 10 + 5}s infinite ease-in-out`;
            fragment.appendChild(p);
        }
        container.appendChild(fragment);
    }

    // === 스타일 주입 ===
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `@keyframes ripple{to{transform:scale(4);opacity:0}}@keyframes float{0%,100%{transform:translateY(0) translateX(0)}25%{transform:translateY(-20px) translateX(10px)}50%{transform:translateY(-40px) translateX(-10px)}75%{transform:translateY(-20px) translateX(5px)}}@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}.mood-grid button.selected{animation:pulse 2.5s ease-in-out infinite}.heart-btn:active{animation:heartbeat .3s}@keyframes heartbeat{0%,100%{transform:scale(1)}25%{transform:scale(1.15)}50%{transform:scale(.95)}75%{transform:scale(1.1)}}.site-header{transition:transform .3s ease}.song-card{transform-style:preserve-3d}`;
        document.head.appendChild(style);
    }

    // === 리사이즈 핸들러 (debounce) ===
    window.addEventListener('resize', debounce(() => {
        document.querySelectorAll('[data-3d]').forEach(el => delete el.dataset['3d']);
        applyCardEffects();
    }, RESIZE_DEBOUNCE));

})();