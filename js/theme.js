/**
 * Theme Toggle - Light/Dark Mode with localStorage Persistence
 * DevOps Portfolio - Shankar
 */

(function () {
    'use strict';

    const THEME_KEY = 'portfolio-theme';
    const DARK_CLASS = 'dark';
    const LIGHT_CLASS = 'light';

    // Get saved theme or default to dark
    function getSavedTheme() {
        return localStorage.getItem(THEME_KEY) || DARK_CLASS;
    }

    // Apply theme to body
    function applyTheme(theme) {
        document.body.classList.remove(DARK_CLASS, LIGHT_CLASS);
        document.body.classList.add(theme);
        localStorage.setItem(THEME_KEY, theme);
    }

    // Toggle theme
    function toggleTheme() {
        const currentTheme = document.body.classList.contains(LIGHT_CLASS) ? LIGHT_CLASS : DARK_CLASS;
        const newTheme = currentTheme === DARK_CLASS ? LIGHT_CLASS : DARK_CLASS;
        applyTheme(newTheme);
    }

    // Initialize theme on page load
    function initTheme() {
        const savedTheme = getSavedTheme();
        applyTheme(savedTheme);

        // Attach event listener to toggle button
        const toggleButton = document.getElementById('theme-toggle');
        if (toggleButton) {
            toggleButton.addEventListener('click', toggleTheme);
        }
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
})();
