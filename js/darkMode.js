// 무뮤(MoodMusic) - 다크모드 토글

(function() {
    'use strict';

    const COLOR_MODE_KEY = 'colorMode';
    const DARK_MODE = 'dark';
    const LIGHT_MODE = 'light';

    // 페이지 로드 시 저장된 모드 적용
    function initColorMode() {
        const savedMode = localStorage.getItem(COLOR_MODE_KEY) || LIGHT_MODE;
        applyColorMode(savedMode, false); // 초기 로드시에는 UI 업데이트 스킵
    }

    // 모드 적용
    function applyColorMode(mode, updateUI = true) {
        if (mode === DARK_MODE) {
            document.documentElement.setAttribute('data-color-mode', DARK_MODE);
        } else {
            document.documentElement.removeAttribute('data-color-mode');
        }
        if (updateUI) {
            updateToggleUI(mode);
        }
    }

    // 토글 UI 업데이트 (스위치 + 레이블)
    function updateToggleUI(mode) {
        const toggleSlider = document.querySelector('.theme-toggle-slider');
        const toggleLabel = document.getElementById('themeLabel');
        
        if (toggleSlider) {
            toggleSlider.textContent = mode === DARK_MODE ? '☀️' : '🌙';
        }
        
        if (toggleLabel) {
            toggleLabel.textContent = mode === DARK_MODE ? 'Dark' : 'Light';
        }
    }

    // 모드 전환
    function toggleColorMode() {
        const currentMode = document.documentElement.getAttribute('data-color-mode');
        const newMode = currentMode === DARK_MODE ? LIGHT_MODE : DARK_MODE;
        
        localStorage.setItem(COLOR_MODE_KEY, newMode);
        applyColorMode(newMode);
    }

    // 초기화 (페이지 로드 전에 실행)
    initColorMode();

    // DOM 로드 후 이벤트 리스너 등록 및 UI 동기화
    document.addEventListener('DOMContentLoaded', () => {
        // 현재 모드에 맞게 UI 동기화
        const currentMode = localStorage.getItem(COLOR_MODE_KEY) || LIGHT_MODE;
        updateToggleUI(currentMode);
        
        const toggleButton = document.getElementById('themeToggle');
        if (toggleButton) {
            toggleButton.addEventListener('click', toggleColorMode);
        }
    });

})();
