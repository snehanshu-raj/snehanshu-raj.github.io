// Consolidated DOMContentLoaded handler
document.addEventListener('DOMContentLoaded', () => {
    initializePortfolio();
});

function initializePortfolio() {
    // Smooth scrolling for navigation links
    initializeSmoothScrolling();
    
    // Mobile menu functionality
    initializeMobileMenu();
    
    // Scroll effects
    initializeScrollEffects();
    
    // Animations
    initializeAnimations();
    
    // Typing animation (if needed)
    initializeTypingAnimation();
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Mobile menu toggle
function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(n => 
            n.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            })
        );
    }
}

// Scroll effects
function initializeScrollEffects() {
    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        }
    });

    // Floating elements parallax effect (only on desktop)
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const floatingItems = document.querySelectorAll('.floating-item');
            
            floatingItems.forEach(item => {
                const speed = item.getAttribute('data-speed') || 1;
                const yPos = -(scrolled * speed / 10);
                item.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        let count = 0;
        const increment = target / 100; // Very fast counting
        const showPlus = counter.getAttribute('data-plus') === 'true';
        
        const updateCounter = () => {
            if (count < target) {
                count += increment;
                counter.innerText = Math.ceil(count) + (showPlus ? '+' : '');
                setTimeout(updateCounter, 10); // Very fast - 10ms intervals
            } else {
                counter.innerText = target + (showPlus ? '+' : '');
            }
        };
        
        updateCounter();
    });
}


// Improved skill level animations
function animateSkills() {
    const skillLevels = document.querySelectorAll('.skill-level');
    
    skillLevels.forEach((skill, index) => {
        const level = skill.getAttribute('data-level');
        
        setTimeout(() => {
            skill.style.setProperty('--skill-width', level + '%');
            
            // Trigger CSS animation
            if (skill.style.setProperty) {
                skill.style.setProperty('--level', level + '%');
            }
        }, index * 200); // Stagger animations
    });
}

// Initialize animations with Intersection Observer
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger specific animations
                if (entry.target.querySelector('.stat-number')) {
                    animateCounters();
                }
                
                if (entry.target.classList.contains('skills')) {
                    animateSkills();
                }
            }
        });
    }, observerOptions);

    // Add fade-in class to elements and observe them
    const elements = document.querySelectorAll('section, .project-card, .skill-category, .hobby-card, .timeline-item, .education-card');
    
    elements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Typing animation (optional - can be removed for mobile compatibility)
function initializeTypingAnimation() {
    const typingText = document.querySelector('.typing-text');
    
    // Only run typing animation on desktop
    if (typingText && window.innerWidth > 768) {
        typingText.style.animation = 'none';
        setTimeout(() => {
            typingText.style.animation = 'typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite';
        }, 100);
    }
}

// Utility function to check if device is mobile
function isMobile() {
    return window.innerWidth <= 768;
}

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Add resize handler for responsive adjustments
window.addEventListener('resize', throttle(() => {
    // Reinitialize animations if screen size changes significantly
    if (window.innerWidth <= 768) {
        // Disable parallax on mobile
        const floatingItems = document.querySelectorAll('.floating-item');
        floatingItems.forEach(item => {
            item.style.transform = 'none';
        });
    }
}, 250));
