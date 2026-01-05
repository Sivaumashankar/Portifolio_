/**
 * Background JavaScript - Particle System and Animated Gradient
 * DevOps Portfolio - Shankar
 * 
 * Creates a live wallpaper-style background with:
 * - Floating particles with depth effect
 * - Subtle animated gradient
 * - Tech-inspired motion
 */

(function () {
    'use strict';

    // ============================================
    // Configuration
    // ============================================
    const CONFIG = {
        particleCount: 80,
        particleMinSize: 1,
        particleMaxSize: 4,
        particleMinSpeed: 0.1,
        particleMaxSpeed: 0.3,
        connectionDistance: 150,
        connectionOpacity: 0.15,
        gradientSpeed: 0.0005,
        colors: {
            primary: { r: 0, g: 212, b: 255 },      // Cyan
            secondary: { r: 124, g: 58, b: 237 },    // Purple
            background: { r: 10, g: 10, b: 15 }      // Dark
        }
    };

    // ============================================
    // Canvas Setup
    // ============================================
    const canvas = document.getElementById('background-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];
    let gradientOffset = 0;
    let mouseX = 0;
    let mouseY = 0;

    // ============================================
    // Resize Handler
    // ============================================
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }

    // ============================================
    // Particle Class
    // ============================================
    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = random(CONFIG.particleMinSize, CONFIG.particleMaxSize);
            this.speedX = random(-CONFIG.particleMaxSpeed, CONFIG.particleMaxSpeed);
            this.speedY = random(-CONFIG.particleMaxSpeed, CONFIG.particleMaxSpeed);
            this.opacity = random(0.2, 0.6);
            this.depth = this.size / CONFIG.particleMaxSize; // Depth based on size

            // Color variation
            const colorMix = Math.random();
            this.color = {
                r: lerp(CONFIG.colors.primary.r, CONFIG.colors.secondary.r, colorMix),
                g: lerp(CONFIG.colors.primary.g, CONFIG.colors.secondary.g, colorMix),
                b: lerp(CONFIG.colors.primary.b, CONFIG.colors.secondary.b, colorMix)
            };
        }

        update() {
            // Movement with depth parallax
            this.x += this.speedX * this.depth;
            this.y += this.speedY * this.depth;

            // Slight attraction to mouse (very subtle)
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 200) {
                const force = (200 - distance) / 200 * 0.01;
                this.x += dx * force * this.depth;
                this.y += dy * force * this.depth;
            }

            // Boundary wrapping
            if (this.x < -10) this.x = canvas.width + 10;
            if (this.x > canvas.width + 10) this.x = -10;
            if (this.y < -10) this.y = canvas.height + 10;
            if (this.y > canvas.height + 10) this.y = -10;

            // Subtle floating motion
            this.y += Math.sin(Date.now() * 0.001 + this.x * 0.01) * 0.1 * this.depth;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;
            ctx.fill();

            // Glow effect for larger particles
            if (this.size > 2) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.size * 2
                );
                gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity * 0.3})`);
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.fill();
            }
        }
    }

    // ============================================
    // Particle System
    // ============================================
    function initParticles() {
        particles = [];
        for (let i = 0; i < CONFIG.particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < CONFIG.connectionDistance) {
                    const opacity = (1 - distance / CONFIG.connectionDistance) * CONFIG.connectionOpacity;

                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    // ============================================
    // Gradient Background
    // ============================================
    function drawGradientBackground() {
        gradientOffset += CONFIG.gradientSpeed;

        // Create animated radial gradient
        const centerX = canvas.width / 2 + Math.sin(gradientOffset) * 200;
        const centerY = canvas.height / 2 + Math.cos(gradientOffset * 0.7) * 100;

        const gradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, Math.max(canvas.width, canvas.height)
        );

        // Very subtle gradient colors
        gradient.addColorStop(0, 'rgba(124, 58, 237, 0.08)');
        gradient.addColorStop(0.3, 'rgba(0, 212, 255, 0.04)');
        gradient.addColorStop(0.6, 'rgba(124, 58, 237, 0.02)');
        gradient.addColorStop(1, 'rgba(10, 10, 15, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Secondary gradient for depth
        const gradient2 = ctx.createRadialGradient(
            canvas.width - centerX, canvas.height - centerY, 0,
            canvas.width - centerX, canvas.height - centerY, canvas.width * 0.7
        );
        gradient2.addColorStop(0, 'rgba(0, 212, 255, 0.05)');
        gradient2.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient2;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // ============================================
    // Grid Pattern (Tech-inspired)
    // ============================================
    function drawGrid() {
        const gridSize = 50;
        const gridOpacity = 0.02;

        ctx.strokeStyle = `rgba(0, 212, 255, ${gridOpacity})`;
        ctx.lineWidth = 0.5;

        // Vertical lines
        for (let x = 0; x < canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y < canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }

    // ============================================
    // Animation Loop
    // ============================================
    function animate() {
        // Clear canvas
        ctx.fillStyle = `rgb(${CONFIG.colors.background.r}, ${CONFIG.colors.background.g}, ${CONFIG.colors.background.b})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw background elements
        drawGradientBackground();
        drawGrid();
        drawConnections();

        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        animationId = requestAnimationFrame(animate);
    }

    // ============================================
    // Mouse Tracking
    // ============================================
    function handleMouseMove(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }

    // ============================================
    // Utility Functions
    // ============================================
    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    // ============================================
    // Performance Optimization
    // ============================================
    function handleVisibilityChange() {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    }

    // ============================================
    // Initialize
    // ============================================
    function init() {
        resizeCanvas();

        // Event listeners
        window.addEventListener('resize', debounce(resizeCanvas, 250));
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Start animation
        animate();
    }

    // Debounce utility
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
