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

    // --- Lightbox for gallery images ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    let currentImages = [];
    let currentIndex = 0;

    // Collect all gallery images
    const allGalleryItems = document.querySelectorAll('.gallery-item img');
    const galleryImgs = Array.from(allGalleryItems);

    allGalleryItems.forEach((img, index) => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            currentImages = galleryImgs;
            currentIndex = index;
            openLightbox(img.src);
        });
    });

    function openLightbox(src) {
        lightboxImg.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigateLightbox(dir) {
        currentIndex = (currentIndex + dir + currentImages.length) % currentImages.length;
        lightboxImg.src = currentImages[currentIndex].src;
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext.addEventListener('click', () => navigateLightbox(1));
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    // --- Counter animation for stats ---
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'));
                animateCounter(el, target);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    function animateCounter(el, target) {
        const duration = 1500;
        const start = performance.now();
        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
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

            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            // --- GOOGLE SHEETS INTEGRATION ---
            const scriptURL = 'https://script.google.com/a/macros/voltairtech.com/s/AKfycbzBF93vjsyeTNhSGBAR-sEqDWnFdGTxybhuAh4Ir5lac7AD2gXsKGQwwldUUQB28sh9/exec';

            fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
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
