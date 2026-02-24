/* ============================================
   ASTRON FILMS — Script
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => preloader.classList.add('hidden'), 800);
    });
    // Fallback if load doesn't fire
    setTimeout(() => preloader.classList.add('hidden'), 3000);

    // --- Navbar scroll effect ---
    const navbar = document.getElementById('navbar');
    const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // --- Hamburger menu ---
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu on link click
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // --- Scroll reveal with Intersection Observer ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Showreel video hover play ---
    document.querySelectorAll('.showreel-item').forEach(item => {
        const video = item.querySelector('video');
        if (!video) return;

        item.addEventListener('mouseenter', () => {
            video.play().catch(() => { });
            item.querySelector('.showreel-overlay').style.opacity = '0';
        });
        item.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
            item.querySelector('.showreel-overlay').style.opacity = '1';
        });
        // Touch: toggle play on click
        item.addEventListener('click', () => {
            if (video.paused) {
                video.play().catch(() => { });
                item.querySelector('.showreel-overlay').style.opacity = '0';
            } else {
                video.pause();
                item.querySelector('.showreel-overlay').style.opacity = '1';
            }
        });
    });

    // --- Extreme Image Protection ---

    // 1. Global Blocking (Right-click, Save, View Source, DevTools)
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    document.addEventListener('keydown', (e) => {
        // Block Ctrl+S (Save), Ctrl+U (View Source), Ctrl+P (Print)
        // Block Ctrl+Shift+I / F12 (DevTools)
        if (
            (e.ctrlKey && (e.key === 's' || e.key === 'u' || e.key === 'p')) ||
            (e.ctrlKey && e.shiftKey && (e.key === 'i' || e.key === 'j' || e.key === 'c')) ||
            (e.key === 'F12')
        ) {
            e.preventDefault();
            return false;
        }
    });

    // 2. Canvas-Based Air-Gap Image Loader (Ghost Rendering)
    // Draws pixels directly to canvas, hiding links from browser scanners
    function loadProtectedAssets() {
        const protectedItems = document.querySelectorAll('[data-src-protected]');

        protectedItems.forEach(item => {
            const obfuscatedPath = item.getAttribute('data-src-protected');
            const realPath = obfuscatedPath.split('').reverse().join('');

            // Create a ghost image object
            const img = new Image();
            img.src = realPath;

            img.onload = () => {
                // Create canvas
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Add canvas to container
                item.innerHTML = ''; // Clear fallback pixels
                item.appendChild(canvas);

                // Function to draw image with "cover" logic
                const drawCanvas = () => {
                    const w = item.offsetWidth;
                    const h = item.offsetHeight;
                    if (w === 0 || h === 0) return; // Prevent 0 size errors

                    canvas.width = w;
                    canvas.height = h;

                    const imgRatio = img.width / img.height;
                    const containerRatio = w / h;

                    let drawWidth, drawHeight, offsetX, offsetY;

                    if (containerRatio > imgRatio) {
                        drawWidth = w;
                        drawHeight = w / imgRatio;
                        offsetX = 0;
                        offsetY = (h - drawHeight) / 2;
                    } else {
                        drawWidth = h * imgRatio;
                        drawHeight = h;
                        offsetX = (w - drawWidth) / 2;
                        offsetY = 0;
                    }

                    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
                };

                drawCanvas();

                // Handle resize
                window.addEventListener('resize', drawCanvas);
            };
        });
    }

    // Load assets after screen is ready
    loadProtectedAssets();

    // --- Counter animation for stats ---
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'));
                animateCounter(el, target);
                revealObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => revealObserver.observe(el));

    function animateCounter(el, target) {
        const duration = 1500;
        const start = performance.now();
        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased) + '+';
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }

    // --- Contact form handler ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            const scriptURL = 'https://script.google.com/macros/s/AKfycbylaVk0t-G8ONYTOTFDXBtnFGuIiE-Q494C1tGXvxVA-v-ccxsHH97DjRgKrQ4DGzlm/exec';

            fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                cache: 'no-cache',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(data)
            })
                .then(() => {
                    alert('Thank you! Your message has been sent successfully. We will update the details on the excel sheet.');
                    contactForm.reset();
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    alert('There was an error sending your message. Please try again.');
                })
                .finally(() => {
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }

});
