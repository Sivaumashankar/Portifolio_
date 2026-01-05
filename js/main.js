/**
 * Main JavaScript - Component Loader, Navigation, and Page Init
 * DevOps Portfolio - Shankar
 */

(function () {
    'use strict';

    // ============================================
    // Configuration
    // ============================================
    const CONFIG = {
        componentsPath: './components/',
        pagesPath: './pages/',
        transitionDuration: 300
    };

    // ============================================
    // DOM Elements
    // ============================================
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');
    const mainContent = document.getElementById('main-content');

    // ============================================
    // Component Loader
    // ============================================
    async function loadComponent(elementId, componentPath) {
        const element = document.getElementById(elementId);
        if (!element) return;

        try {
            const response = await fetch(componentPath);
            if (!response.ok) throw new Error(`Failed to load ${componentPath}`);
            const html = await response.text();
            element.innerHTML = html;
            return true;
        } catch (error) {
            console.error(`Error loading component: ${error.message}`);
            return false;
        }
    }

    // ============================================
    // Page Loader
    // ============================================
    async function loadPage(pagePath) {
        if (!mainContent) return;

        // Add exit animation
        mainContent.classList.add('page-exit');

        await new Promise(resolve => setTimeout(resolve, CONFIG.transitionDuration));

        try {
            const response = await fetch(pagePath);
            if (!response.ok) throw new Error(`Failed to load ${pagePath}`);
            const html = await response.text();

            mainContent.innerHTML = html;
            mainContent.classList.remove('page-exit');
            mainContent.classList.add('page-enter');

            // Initialize animations for new content
            initScrollAnimations();

            // Remove enter class after animation
            setTimeout(() => {
                mainContent.classList.remove('page-enter');
            }, CONFIG.transitionDuration);

            return true;
        } catch (error) {
            console.error(`Error loading page: ${error.message}`);
            return false;
        }
    }

    // ============================================
    // Navigation Handler
    // ============================================
    function initNavigation() {
        // Handle navigation clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-page]');
            if (!link) return;

            e.preventDefault();
            const pagePath = link.dataset.page;

            // Update URL hash
            const pageName = pagePath.replace('./pages/', '').replace('.html', '');
            window.location.hash = pageName;

            // Update active state
            updateActiveNavLink(pageName);

            // Load the page
            loadPage(pagePath);

            // Close mobile menu if open
            closeMobileMenu();
        });

        // Handle hash changes
        window.addEventListener('hashchange', handleHashChange);

        // Initial page load based on hash
        handleHashChange();
    }

    function handleHashChange() {
        let hash = window.location.hash.slice(1) || 'home';
        const pagePath = `./pages/${hash}.html`;

        loadPage(pagePath);
        updateActiveNavLink(hash);
    }

    function updateActiveNavLink(pageName) {
        // Wait for navbar to be loaded
        setTimeout(() => {
            const navLinks = document.querySelectorAll('.navbar-link');
            navLinks.forEach(link => {
                link.classList.remove('active');
                const linkPage = link.dataset.page?.replace('./pages/', '').replace('.html', '');
                if (linkPage === pageName) {
                    link.classList.add('active');
                }
            });
        }, 100);
    }

    // ============================================
    // Mobile Menu
    // ============================================
    function initMobileMenu() {
        document.addEventListener('click', (e) => {
            const toggle = e.target.closest('.navbar-toggle');
            if (!toggle) return;

            const menu = document.querySelector('.navbar-menu');
            if (menu) {
                menu.classList.toggle('active');
                toggle.classList.toggle('active');
            }
        });
    }

    function closeMobileMenu() {
        const menu = document.querySelector('.navbar-menu');
        const toggle = document.querySelector('.navbar-toggle');
        if (menu) menu.classList.remove('active');
        if (toggle) toggle.classList.remove('active');
    }

    // ============================================
    // Scroll Animations
    // ============================================
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll(
            '.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale'
        );

        if (animatedElements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    }

    // ============================================
    // Smooth Scroll
    // ============================================
    function initSmoothScroll() {
        document.addEventListener('click', (e) => {
            const anchor = e.target.closest('a[href^="#"]');
            if (!anchor) return;

            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // ============================================
    // Form Handler
    // ============================================
    function initFormHandler() {
        document.addEventListener('submit', (e) => {
            const form = e.target.closest('#contact-form');
            if (!form) return;

            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Simulate form submission
            console.log('Form submitted:', data);

            // Show success message
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Message Sent!';
            submitBtn.disabled = true;

            setTimeout(() => {
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 3000);
        });
    }

    // ============================================
    // Resume Download Handler
    // ============================================
    function initResumeDownload() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-download-resume]');
            if (!btn) return;

            // Create a placeholder resume download
            // In production, this would link to an actual resume PDF
            alert('Resume download would start here. Add your resume PDF to the project.');
        });
    }

    // ============================================
    // Theme Toggle (Future Enhancement)
    // ============================================
    function initThemeToggle() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    // ============================================
    // Navbar Scroll Effect
    // ============================================
    function initNavbarScrollEffect() {
        let lastScrollY = window.scrollY;
        const navbar = document.querySelector('.navbar');

        window.addEventListener('scroll', () => {
            if (!navbar) return;

            const currentScrollY = window.scrollY;

            if (currentScrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            lastScrollY = currentScrollY;
        }, { passive: true });
    }

    // ============================================
    // Initialize All
    // ============================================
    async function init() {
        // Load components
        await loadComponent('navbar-placeholder', './components/navbar.html');
        await loadComponent('footer-placeholder', './components/footer.html');

        // Initialize features
        initNavigation();
        initMobileMenu();
        initSmoothScroll();
        initFormHandler();
        initResumeDownload();
        initThemeToggle();
        initNavbarScrollEffect();
        initScrollAnimations();

        // Mark page as loaded
        document.body.classList.add('loaded');
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
