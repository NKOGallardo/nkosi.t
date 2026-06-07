/* ============================================
   NKOSI T - COMPLETE JAVASCRIPT FILE
   GSAP Animations, Filtering, Interactions
   Production-Ready Code
   ============================================ */

'use strict';

// ============================================
// GLOBAL STATE & CONFIG
// ============================================
const config = {
    animationDuration: 0.3,
    scrollOffset: 100,
    debounceDelay: 200,
    statsDuration: 2000,
    isMobile: window.innerWidth < 768,
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

const state = {
    mobileMenuOpen: false,
    currentPage: window.location.pathname,
    statsAnimated: false,
    activeFilter: '*',
    scrollPosition: 0
};

// ============================================
// DOM READY - INITIALIZE ALL FEATURES
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎬 Initializing Nkosi T Portfolio...');
    
    // Initialize in order
    initializeLoadingScreen();
    initializeAOS();
    initializeGSAP();
    initializeHeader();
    initializeMobileMenu();
    initializeScrollProgress();
    initializeBackToTop();
    initializeHeroAnimations();
    initializeGlightbox();
    initializePortfolioFilter();
    initializeStatCounters();
    initializeFormHandling();
    initializeScrollAnimations();
    initializeParallaxEffects();
    initializeLazyLoading();
    initializeAccessibility();
    
    console.log('✅ All features initialized');
});

// ============================================
// 1. LOADING SCREEN
// ============================================
function initializeLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    
    if (!loadingScreen) return;
    
    // Auto-hide after animation
    setTimeout(() => {
        gsap.to(loadingScreen, {
            opacity: 0,
            duration: 0.5,
            pointerEvents: 'none',
            onComplete: () => {
                loadingScreen.style.display = 'none';
            }
        });
    }, 1500);
}

// ============================================
// 2. AOS INITIALIZATION
// ============================================
function initializeAOS() {
    if (typeof AOS === 'undefined') {
        console.warn('AOS library not loaded');
        return;
    }
    
    AOS.init({
        duration: config.prefersReducedMotion ? 0 : 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100,
        disable: config.prefersReducedMotion ? 'phone' : false
    });
}

// ============================================
// 3. GSAP SETUP
// ============================================
function initializeGSAP() {
    if (typeof gsap === 'undefined') {
        console.warn('GSAP library not loaded');
        return;
    }
    
    // Register plugins
    if (gsap.registerPlugin && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }
    
    // Disable animations if reduced motion is preferred
    if (config.prefersReducedMotion) {
        gsap.globalTimeline.timeScale(0);
    }
}

// ============================================
// 4. HEADER & NAVIGATION
// ============================================
function initializeHeader() {
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menu-toggle');
    const navMobile = document.getElementById('nav-mobile');
    const navLinks = document.querySelectorAll('.nav-link, .nav-mobile-link');
    let lastScrollY = 0;
    let ticking = false;
    
    if (!header) return;
    
    // Sticky header on scroll with performance optimization
    const updateHeaderOnScroll = () => {
        state.scrollPosition = window.scrollY;
        
        if (state.scrollPosition > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        ticking = false;
    };
    
    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(updateHeaderOnScroll);
            ticking = true;
        }
    }, { passive: true });
    
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (state.mobileMenuOpen && 
            !e.target.closest('.header') && 
            !e.target.closest('.nav-mobile')) {
            closeMobileMenu();
        }
    });
    
    // Update active nav link on scroll
    updateActiveNavLink();
    window.addEventListener('scroll', debounce(updateActiveNavLink, config.debounceDelay), { passive: true });
}

function toggleMobileMenu() {
    state.mobileMenuOpen = !state.mobileMenuOpen;
    const menuToggle = document.getElementById('menu-toggle');
    const navMobile = document.getElementById('nav-mobile');
    
    if (!menuToggle || !navMobile) return;
    
    menuToggle.classList.toggle('active');
    navMobile.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', state.mobileMenuOpen);
    
    // Animate menu appearance
    if (state.mobileMenuOpen) {
        gsap.from(navMobile, {
            y: -20,
            opacity: 0,
            duration: config.animationDuration,
            ease: 'power2.out'
        });
    }
}

function closeMobileMenu() {
    if (!state.mobileMenuOpen) return;
    
    state.mobileMenuOpen = false;
    const menuToggle = document.getElementById('menu-toggle');
    const navMobile = document.getElementById('nav-mobile');
    
    if (menuToggle) {
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
    }
    
    if (navMobile) {
        navMobile.classList.remove('active');
    }
}

function updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id], main > div[id]');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 200) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(currentSection)) {
            link.classList.add('active');
        }
    });
}

// ============================================
// 5. MOBILE MENU
// ============================================
function initializeMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMobile = document.getElementById('nav-mobile');
    
    if (!menuToggle || !navMobile) return;
    
    // Handle keyboard navigation
    menuToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMobileMenu();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && state.mobileMenuOpen) {
            closeMobileMenu();
        }
    });
}

// ============================================
// 6. SCROLL PROGRESS BAR
// ============================================
function initializeScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress-bar');
    
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / docHeight) * 100;
        progressBar.style.width = scrolled + '%';
    }, { passive: true });
}

// ============================================
// 7. BACK TO TOP BUTTON
// ============================================
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (!backToTopBtn) return;
    
    // Show/hide button on scroll
    window.addEventListener('scroll', debounce(() => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }, config.debounceDelay), { passive: true });
    
    // Smooth scroll to top
    backToTopBtn.addEventListener('click', () => {
        gsap.to(window, {
            scrollTo: 0,
            duration: 1,
            ease: 'power2.inOut'
        });
    });
}

// ============================================
// 8. HERO ANIMATIONS (GSAP)
// ============================================
function initializeHeroAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroCta = document.querySelector('.hero-cta');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (!heroTitle || config.prefersReducedMotion) return;
    
    // Create staggered animation timeline
    const heroTimeline = gsap.timeline({
        delay: 1.5,
        defaults: { ease: 'power3.out' }
    });
    
    heroTimeline
        .from(heroTitle, {
            y: 50,
            opacity: 0,
            duration: 1
        }, 0)
        .from(heroSubtitle, {
            y: 50,
            opacity: 0,
            duration: 1
        }, 0.2)
        .from(heroCta, {
            y: 50,
            opacity: 0,
            duration: 1
        }, 0.4);
    
    // Animate scroll indicator
    if (scrollIndicator) {
        gsap.to(scrollIndicator, {
            y: 10,
            opacity: 0.5,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 2
        });
    }
}

// ============================================
// 9. GLIGHTBOX INITIALIZATION
// ============================================
function initializeGlightbox() {
    if (typeof GLightbox === 'undefined') {
        console.warn('GLightbox library not loaded');
        return;
    }
    
    const lightbox = GLightbox({
        selector: '.glightbox',
        touchNavigation: true,
        loop: true,
        autoplayVideos: true,
        openEffect: 'zoom',
        closeEffect: 'zoom',
        slideEffect: 'slide'
    });
}

// ============================================
// 10. PORTFOLIO FILTERING
// ============================================
function initializePortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const portfolioGrid = document.getElementById('portfolio-grid');
    
    if (filterBtns.length === 0) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => handleFilter(btn));
    });
    
    function handleFilter(clickedBtn) {
        const filterValue = clickedBtn.getAttribute('data-filter');
        
        // Update active button with animation
        filterBtns.forEach(btn => {
            btn.classList.remove('active');
            gsap.to(btn, {
                scale: 1,
                duration: config.animationDuration
            });
        });
        
        clickedBtn.classList.add('active');
        gsap.to(clickedBtn, {
            scale: 1.05,
            duration: config.animationDuration
        });
        
        // Update state
        state.activeFilter = filterValue;
        
        // Create animation timeline
        const filterTimeline = gsap.timeline({
            defaults: { duration: config.animationDuration }
        });
        
        // Fade out all items
        filterTimeline.to(portfolioItems, {
            opacity: 0,
            y: 20,
            duration: config.animationDuration / 2,
            stagger: 0.05
        });
        
        // Update display and fade in visible items
        filterTimeline.add(() => {
            portfolioItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                const isVisible = filterValue === '*' || filterValue === itemCategory;
                
                item.style.display = isVisible ? 'block' : 'none';
                item.style.opacity = isVisible ? '1' : '0';
            });
        });
        
        // Fade in filtered items with stagger
        filterTimeline.to(portfolioItems, {
            opacity: (index, target) => {
                const itemCategory = target.getAttribute('data-category');
                return (filterValue === '*' || filterValue === itemCategory) ? 1 : 0;
            },
            y: 0,
            duration: config.animationDuration / 2,
            stagger: 0.05
        });
        
        // Refresh AOS animations
        filterTimeline.add(() => {
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        });
    }
}

// ============================================
// 11. STATISTICS COUNTERS
// ============================================
function initializeStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length === 0) return;
    
    // Use Intersection Observer to trigger animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !state.statsAnimated) {
                animateStatCounters();
                state.statsAnimated = true;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    // Observe first stat element
    const statsContainer = statNumbers[0]?.closest('.stats-grid');
    if (statsContainer) {
        observer.observe(statsContainer);
    }
    
    function animateStatCounters() {
        statNumbers.forEach((stat, index) => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            
            gsap.to(stat, {
                textContent: target,
                duration: config.statsDuration / 1000,
                ease: 'power2.out',
                snap: { textContent: 1 },
                delay: index * 0.1,
                onUpdate: function() {
                    stat.textContent = Math.floor(gsap.getProperty(stat, 'textContent'));
                }
            });
        });
    }
}

// ============================================
// 12. FORM HANDLING (MULTI-STEP)
// ============================================
function initializeFormHandling() {
    const bookingForm = document.getElementById('booking-form');
    const contactForm = document.getElementById('contact-form');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleFormSubmit);
        setupFormValidation();
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    console.log('📤 Booking form submitted:', data);
    
    // Animate success message
    const formWrapper = document.querySelector('.booking-form');
    const successMessage = document.getElementById('success-message');
    
    if (formWrapper && successMessage) {
        gsap.to(formWrapper, {
            opacity: 0,
            duration: 0.3,
            pointerEvents: 'none',
            onComplete: () => {
                formWrapper.style.display = 'none';
                successMessage.style.display = 'block';
                
                gsap.from(successMessage, {
                    opacity: 0,
                    y: 20,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
        });
    }
}

function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    console.log('📧 Contact form submitted:', data);
    
    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.textContent = 'Thank you! We\'ll get back to you within 24 hours.';
    successMessage.style.cssText = `
        padding: 16px;
        background: rgba(37, 211, 102, 0.1);
        border: 1px solid rgba(37, 211, 102, 0.3);
        border-radius: 8px;
        color: #25D366;
        text-align: center;
        margin-top: 16px;
        margin-bottom: 16px;
    `;
    
    form.insertBefore(successMessage, form.firstChild);
    
    // Fade form
    gsap.to(form, {
        opacity: 0.5,
        duration: 0.3
    });
    
    // Reset and show message
    setTimeout(() => {
        form.reset();
        gsap.to(form, {
            opacity: 1,
            duration: 0.3
        });
        
        // Remove success message after 3 seconds
        gsap.to(successMessage, {
            opacity: 0,
            duration: 0.3,
            delay: 2.5,
            onComplete: () => successMessage.remove()
        });
    }, 500);
}

function setupFormValidation() {
    const requiredInputs = document.querySelectorAll('[required]');
    
    requiredInputs.forEach(input => {
        input.addEventListener('invalid', (e) => {
            e.preventDefault();
            highlightInvalidField(input);
        });
        
        input.addEventListener('input', () => {
            removeFieldHighlight(input);
        });
    });
}

function highlightInvalidField(field) {
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
    
    gsap.to(field, {
        borderColor: '#ff6b6b',
        duration: 0.2,
        ease: 'power2.out'
    });
}

function removeFieldHighlight(field) {
    if (field.classList.contains('error')) {
        field.classList.remove('error');
        field.setAttribute('aria-invalid', 'false');
    }
}

// Step navigation functions (for booking form)
window.nextStep = function() {
    const form = document.getElementById('booking-form');
    if (!form) return;
    
    const currentStep = form.querySelector('.form-step.active');
    const nextStep = currentStep?.nextElementSibling;
    
    if (!currentStep || !nextStep) return;
    
    // Validate current step
    if (!validateStep(currentStep)) {
        showFormError('Please fill in all required fields');
        return;
    }
    
    hideFormError();
    animateStepTransition(currentStep, nextStep, 'next');
};

window.previousStep = function() {
    const form = document.getElementById('booking-form');
    if (!form) return;
    
    const currentStep = form.querySelector('.form-step.active');
    const prevStep = currentStep?.previousElementSibling;
    
    if (!currentStep || !prevStep) return;
    
    hideFormError();
    animateStepTransition(currentStep, prevStep, 'prev');
};

function animateStepTransition(currentStep, nextStep, direction) {
    const duration = config.animationDuration;
    
    gsap.to(currentStep, {
        opacity: 0,
        x: direction === 'next' ? -20 : 20,
        duration: duration,
        pointerEvents: 'none',
        onComplete: () => {
            currentStep.classList.remove('active');
            nextStep.classList.add('active');
            
            gsap.from(nextStep, {
                opacity: 0,
                x: direction === 'next' ? 20 : -20,
                duration: duration,
                ease: 'power2.out'
            });
            
            updateProgress(nextStep);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

function validateStep(step) {
    const requiredFields = step.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (field.type === 'radio') {
            const radioGroup = document.querySelector(`input[name="${field.name}"]:checked`);
            if (!radioGroup) {
                isValid = false;
                highlightInvalidField(field);
            }
        } else if (!field.value.trim()) {
            isValid = false;
            highlightInvalidField(field);
        }
    });
    
    return isValid;
}

function updateProgress(currentStep) {
    const stepNum = currentStep.getAttribute('data-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    
    progressSteps.forEach(step => {
        const num = step.getAttribute('data-step');
        if (parseInt(num) <= parseInt(stepNum)) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

function showFormError(message) {
    const errorDiv = document.getElementById('form-error');
    if (errorDiv) {
        errorDiv.textContent = message;
        gsap.to(errorDiv, {
            opacity: 1,
            duration: config.animationDuration,
            onStart: () => {
                errorDiv.style.display = 'block';
            }
        });
    }
}

function hideFormError() {
    const errorDiv = document.getElementById('form-error');
    if (errorDiv) {
        gsap.to(errorDiv, {
            opacity: 0,
            duration: config.animationDuration,
            onComplete: () => {
                errorDiv.style.display = 'none';
            }
        });
    }
}

// ============================================
// 13. SCROLL ANIMATIONS (Advanced GSAP)
// ============================================
function initializeScrollAnimations() {
    if (config.prefersReducedMotion || typeof ScrollTrigger === 'undefined') return;
    
    // Animate featured work cards on scroll
    const featuredCards = document.querySelectorAll('.featured-card');
    featuredCards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                end: 'top 20%',
                markers: false,
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out'
        });
    });
    
    // Animate service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 40,
            opacity: 0,
            duration: 0.6,
            delay: index * 0.08,
            ease: 'power2.out'
        });
    });
    
    // Animate testimonial cards with rotation
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 40,
            opacity: 0,
            rotateX: 10,
            duration: 0.6,
            delay: index * 0.08,
            ease: 'back.out'
        });
    });
    
    // Animate skill cards
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            },
            x: index % 2 === 0 ? -40 : 40,
            opacity: 0,
            duration: 0.6,
            delay: index * 0.06,
            ease: 'power2.out'
        });
    });
}

// ============================================
// 14. PARALLAX EFFECTS
// ============================================
function initializeParallaxEffects() {
    if (config.prefersReducedMotion || typeof ScrollTrigger === 'undefined') return;
    
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    parallaxElements.forEach(element => {
        gsap.to(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top center',
                end: 'bottom center',
                scrub: 1,
                markers: false
            },
            y: -50,
            ease: 'none'
        });
    });
    
    // Parallax for hero background (subtle effect)
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        gsap.to(heroVideo, {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
                markers: false
            },
            y: 100,
            ease: 'none'
        });
    }
}

// ============================================
// 15. LAZY LOADING
// ============================================
function initializeLazyLoading() {
    // Native lazy loading support
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                        
                        // Fade in animation
                        gsap.from(img, {
                            opacity: 0,
                            duration: 0.5,
                            ease: 'power2.out'
                        });
                    }
                    
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ============================================
// 16. ACCESSIBILITY
// ============================================
function initializeAccessibility() {
    // Keyboard navigation for interactive elements
    const interactiveElements = document.querySelectorAll('button, a[href], input, textarea, select');
    
    interactiveElements.forEach(element => {
        element.addEventListener('keydown', (e) => {
            // Skip for form inputs (except buttons)
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                return;
            }
            
            // Handle Enter key for buttons and links
            if ((element.tagName === 'BUTTON' || element.tagName === 'A') && 
                (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                element.click();
            }
        });
    });
    
    // Add focus visible styles
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-nav');
    });
}

// ============================================
// 17. SMOOTH SCROLLING FOR ANCHOR LINKS
// ============================================
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target && typeof gsap !== 'undefined') {
                e.preventDefault();
                
                gsap.to(window, {
                    scrollTo: {
                        y: target,
                        offsetY: 80
                    },
                    duration: 1,
                    ease: 'power2.inOut'
                });
            }
        });
    });
}

// ============================================
// 18. UTILITY FUNCTIONS
// ============================================

// Debounce function
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

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

// Performance measurement
function measurePerformance() {
    if (window.performance && window.performance.timing) {
        const timing = performance.timing;
        const navigationStart = timing.navigationStart;
        
        const metrics = {
            domContentLoaded: timing.domContentLoadedEventEnd - navigationStart,
            loadComplete: timing.loadEventEnd - navigationStart,
            resourcesLoaded: timing.responseEnd - navigationStart,
            domInteractive: timing.domInteractive - navigationStart
        };
        
        console.log('⏱️ Performance Metrics:', metrics);
        return metrics;
    }
}

// ============================================
// 19. PAGE LOAD COMPLETE
// ============================================
window.addEventListener('load', () => {
    // Initialize smooth scroll
    initializeSmoothScroll();
    
    // Log performance metrics
    setTimeout(() => {
        measurePerformance();
    }, 1000);
    
    console.log('🎬 Page fully loaded and ready!');
});

// ============================================
// 20. MOBILE DETECTION & RESPONSIVE HANDLING
// ============================================
function handleResponsiveChanges() {
    const wasDesktop = !config.isMobile;
    config.isMobile = window.innerWidth < 768;
    
    if (wasDesktop && config.isMobile) {
        console.log('📱 Switched to mobile view');
        closeMobileMenu();
    } else if (!wasDesktop && !config.isMobile) {
        console.log('🖥️ Switched to desktop view');
    }
}

window.addEventListener('resize', debounce(handleResponsiveChanges, 250));

// ============================================
// 21. ERROR HANDLING & LOGGING
// ============================================
window.addEventListener('error', (event) => {
    console.error('🚨 Error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 Unhandled promise rejection:', event.reason);
});

// ============================================
// 22. IDLE DETECTION
// ============================================
let idleTimer;
let isIdle = false;

function resetIdleTimer() {
    clearTimeout(idleTimer);
    isIdle = false;
    
    idleTimer = setTimeout(() => {
        isIdle = true;
        console.log('User is idle');
    }, 300000); // 5 minutes
}

['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, resetIdleTimer, true);
});

resetIdleTimer();

// ============================================
// 23. VISIBILITY CHANGE HANDLING
// ============================================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden');
        if (typeof gsap !== 'undefined') {
            gsap.globalTimeline.pause();
        }
    } else {
        console.log('Page visible');
        if (typeof gsap !== 'undefined') {
            gsap.globalTimeline.resume();
        }
    }
});

// ============================================
// EXPORT FUNCTIONS FOR EXTERNAL USE
// ============================================
window.NkositPortfolio = {
    nextStep,
    previousStep,
    toggleMobileMenu,
    closeMobileMenu,
    handleFilter: (category) => {
        const btn = document.querySelector(`[data-filter="${category}"]`);
        if (btn) btn.click();
    }
};

// ============================================
// INITIALIZATION COMPLETE
// ============================================
console.log('✨ Nkosi T Portfolio JavaScript fully initialized');