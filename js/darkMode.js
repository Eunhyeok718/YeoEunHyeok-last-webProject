// 무뮤(MoodMusic) - 다크모드 토글

(function() {
    'use strict';

    const COLOR_MODE_KEY = 'colorMode';
    const DARK_MODE = 'dark';
    const LIGHT_MODE = 'light';

    /**
     * 저장된 컬러 모드를 읽어 문서에 적용합니다.
     */
    function initColorMode() {
        const savedMode = localStorage.getItem(COLOR_MODE_KEY) || LIGHT_MODE;
        applyColorMode(savedMode, false); // 초기 로드시에는 UI 업데이트 스킵
    }

    /**
     * 컬러 모드 속성을 적용하고 필요 시 토글 UI를 동기화합니다.
     */
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

    /**
     * 토글 스위치 아이콘과 레이블 텍스트를 현재 모드와 일치시킵니다.
     */
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

    /**
     * 현재 모드를 반전하여 저장하고 즉시 적용합니다.
     */
    function toggleColorMode() {
        const currentMode = document.documentElement.getAttribute('data-color-mode');
        const newMode = currentMode === DARK_MODE ? LIGHT_MODE : DARK_MODE;
        
        localStorage.setItem(COLOR_MODE_KEY, newMode);
        applyColorMode(newMode);
    }

    // 초기 적용: FOUC 방지를 위해 DOMContentLoaded 이전에 실행
    initColorMode();

    // DOM 로드 후 토글 버튼 리스너 등록 및 UI 동기화
    document.addEventListener('DOMContentLoaded', () => {
        const currentMode = localStorage.getItem(COLOR_MODE_KEY) || LIGHT_MODE;
        updateToggleUI(currentMode);
        
        const toggleButton = document.getElementById('themeToggle');
        if (toggleButton) {
            toggleButton.addEventListener('click', toggleColorMode);
        }
    });

})();
