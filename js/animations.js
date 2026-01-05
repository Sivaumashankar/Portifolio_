/**
 * Animations JavaScript - Scroll Effects, Staggered Reveals, and Hover Effects
 * DevOps Portfolio - Shankar
 */

(function () {
    'use strict';

    // ============================================
    // Configuration
    // ============================================
    const CONFIG = {
        observerThreshold: 0.1,
        observerRootMargin: '0px 0px -50px 0px',
        staggerDelay: 100,
        counterDuration: 2000
    };

    // ============================================
    // Intersection Observer for Scroll Animations
    // ============================================
    class ScrollAnimator {
        constructor() {
            this.observer = null;
            this.init();
        }

        init() {
            if (!('IntersectionObserver' in window)) {
                // Fallback for older browsers
                this.showAllElements();
                return;
            }

            this.observer = new IntersectionObserver(
                this.handleIntersection.bind(this),
                {
                    threshold: CONFIG.observerThreshold,
                    rootMargin: CONFIG.observerRootMargin
                }
            );

            this.observeElements();
        }

        handleIntersection(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');

                    // Handle staggered children
                    this.animateChildren(entry.target);

                    // Unobserve after animation (optional)
                    // this.observer.unobserve(entry.target);
                }
            });
        }

        animateChildren(parent) {
            const staggeredChildren = parent.querySelectorAll('.stagger-item');
            staggeredChildren.forEach((child, index) => {
                setTimeout(() => {
                    child.classList.add('is-visible');
                }, index * CONFIG.staggerDelay);
            });
        }

        observeElements() {
            const animatedElements = document.querySelectorAll(
                '.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale, .stagger-container'
            );
            animatedElements.forEach(el => this.observer.observe(el));
        }

        showAllElements() {
            const elements = document.querySelectorAll(
                '.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale'
            );
            elements.forEach(el => el.classList.add('is-visible'));
        }

        refresh() {
            if (this.observer) {
                this.observeElements();
            }
        }
    }

    // ============================================
    // Typed Text Effect
    // ============================================
    class TypedText {
        constructor(element, strings, options = {}) {
            this.element = element;
            this.strings = strings;
            this.currentString = 0;
            this.currentChar = 0;
            this.isDeleting = false;
            this.typeSpeed = options.typeSpeed || 100;
            this.deleteSpeed = options.deleteSpeed || 50;
            this.pauseDuration = options.pauseDuration || 2000;

            if (this.element) {
                this.type();
            }
        }

        type() {
            const current = this.strings[this.currentString];

            if (this.isDeleting) {
                this.element.textContent = current.substring(0, this.currentChar - 1);
                this.currentChar--;
            } else {
                this.element.textContent = current.substring(0, this.currentChar + 1);
                this.currentChar++;
            }

            let delay = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

            if (!this.isDeleting && this.currentChar === current.length) {
                delay = this.pauseDuration;
                this.isDeleting = true;
            } else if (this.isDeleting && this.currentChar === 0) {
                this.isDeleting = false;
                this.currentString = (this.currentString + 1) % this.strings.length;
                delay = this.typeSpeed;
            }

            setTimeout(() => this.type(), delay);
        }
    }

    // ============================================
    // Counter Animation
    // ============================================
    class CounterAnimation {
        constructor(element) {
            this.element = element;
            this.target = parseInt(element.dataset.count) || 0;
            this.duration = parseInt(element.dataset.duration) || CONFIG.counterDuration;
            this.started = false;
        }

        start() {
            if (this.started) return;
            this.started = true;

            const start = 0;
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / this.duration, 1);

                // Easing function (ease out)
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(eased * this.target);

                this.element.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    this.element.textContent = this.target;
                }
            };

            requestAnimationFrame(animate);
        }
    }

    // ============================================
    // Parallax Effect
    // ============================================
    class ParallaxEffect {
        constructor() {
            this.elements = [];
            this.ticking = false;
            this.init();
        }

        init() {
            this.elements = document.querySelectorAll('[data-parallax]');
            if (this.elements.length === 0) return;

            window.addEventListener('scroll', () => this.requestTick(), { passive: true });
        }

        requestTick() {
            if (!this.ticking) {
                requestAnimationFrame(() => this.update());
                this.ticking = true;
            }
        }

        update() {
            const scrollY = window.scrollY;

            this.elements.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.5;
                const offset = scrollY * speed;
                el.style.transform = `translateY(${offset}px)`;
            });

            this.ticking = false;
        }
    }

    // ============================================
    // Tilt Effect on Cards
    // ============================================
    class TiltEffect {
        constructor() {
            this.init();
        }

        init() {
            document.addEventListener('mousemove', (e) => {
                const cards = document.querySelectorAll('.tilt-effect');
                cards.forEach(card => this.handleTilt(e, card));
            });

            document.addEventListener('mouseleave', () => {
                const cards = document.querySelectorAll('.tilt-effect');
                cards.forEach(card => this.resetTilt(card));
            }, true);
        }

        handleTilt(e, card) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / centerY * -5;
            const rotateY = (x - centerX) / centerX * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        }

        resetTilt(card) {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        }
    }

    // ============================================
    // Magnetic Button Effect
    // ============================================
    class MagneticButton {
        constructor() {
            this.init();
        }

        init() {
            const buttons = document.querySelectorAll('.magnetic-btn');

            buttons.forEach(btn => {
                btn.addEventListener('mousemove', (e) => this.attract(e, btn));
                btn.addEventListener('mouseleave', () => this.reset(btn));
            });
        }

        attract(e, btn) {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        }

        reset(btn) {
            btn.style.transform = 'translate(0, 0)';
        }
    }

    // ============================================
    // Cursor Trail Effect (Optional)
    // ============================================
    class CursorTrail {
        constructor() {
            this.dots = [];
            this.mousePos = { x: 0, y: 0 };
            this.enabled = false; // Disabled by default for performance

            if (this.enabled) {
                this.init();
            }
        }

        init() {
            // Create trail dots
            for (let i = 0; i < 10; i++) {
                const dot = document.createElement('div');
                dot.className = 'cursor-dot';
                dot.style.cssText = `
                    position: fixed;
                    width: 8px;
                    height: 8px;
                    background: var(--accent-primary);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    opacity: ${1 - i * 0.1};
                    transform: scale(${1 - i * 0.08});
                `;
                document.body.appendChild(dot);
                this.dots.push({ el: dot, x: 0, y: 0 });
            }

            window.addEventListener('mousemove', (e) => {
                this.mousePos.x = e.clientX;
                this.mousePos.y = e.clientY;
            });

            this.animate();
        }

        animate() {
            let x = this.mousePos.x;
            let y = this.mousePos.y;

            this.dots.forEach((dot, index) => {
                const nextDot = this.dots[index + 1] || this.dots[0];

                dot.x += (x - dot.x) * 0.3;
                dot.y += (y - dot.y) * 0.3;

                dot.el.style.left = `${dot.x - 4}px`;
                dot.el.style.top = `${dot.y - 4}px`;

                x = dot.x;
                y = dot.y;
            });

            requestAnimationFrame(() => this.animate());
        }
    }

    // ============================================
    // Initialize Everything
    // ============================================
    let scrollAnimator;

    function init() {
        scrollAnimator = new ScrollAnimator();
        new ParallaxEffect();
        new TiltEffect();
        new MagneticButton();

        // Initialize typed text if element exists
        const typedElement = document.querySelector('.typed-text');
        if (typedElement) {
            new TypedText(typedElement, [
                'DevOps Engineer',
                'Cloud Architect',
                'Automation Expert',
                'Linux Enthusiast'
            ]);
        }

        // Initialize counters
        const counters = document.querySelectorAll('[data-count]');
        counters.forEach(counter => {
            const counterInstance = new CounterAnimation(counter);

            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    counterInstance.start();
                    observer.unobserve(counter);
                }
            });

            observer.observe(counter);
        });
    }

    // Expose refresh method for dynamic content
    window.refreshAnimations = function () {
        if (scrollAnimator) {
            scrollAnimator.refresh();
        }
    };

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
