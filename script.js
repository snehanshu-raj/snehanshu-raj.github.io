document.addEventListener('DOMContentLoaded', () => {
    initializePortfolio();
});

function initializePortfolio() {
    initializeSmoothScrolling();
    initializeMobileMenu();
    initializeScrollEffects();
    initializeAnimations();
    initializeTypingAnimation();
    initializeCursorEffects();
    initializeParticles();
    initializeScrollProgress();
}

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
                const mobileMenu = document.querySelector('.nav-menu');
                const hamburger = document.querySelector('.hamburger');
                if (mobileMenu && hamburger) {
                    mobileMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            }
        });
    });
}

function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(n => 
            n.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            })
        );
    }
}

function initializeScrollEffects() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

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
        const increment = target / 100;
        const showPlus = counter.textContent.includes('+');
        
        const updateCounter = () => {
            if (count < target) {
                count += increment;
                counter.textContent = Math.ceil(count) + (showPlus ? '+' : '');
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target + (showPlus ? '+' : '');
            }
        };
        
        updateCounter();
    });
}

function animateSkills() {
    const skillLevels = document.querySelectorAll('.skill-level');
    
    skillLevels.forEach((skill, index) => {
        const level = skill.getAttribute('data-level');
        
        setTimeout(() => {
            skill.style.setProperty('--skill-width', level + '%');
        }, index * 150);
    });
}

function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                if (entry.target.querySelector('.stat-number')) {
                    animateCounters();
                }
                
                if (entry.target.classList.contains('skills')) {
                    animateSkills();
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elements = document.querySelectorAll('section, .project-card, .skill-category, .hobby-card, .timeline-item, .education-card');
    
    elements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

function initializeTypingAnimation() {
    const typingText = document.querySelector('.typing-text');
    
    if (typingText && window.innerWidth > 768) {
        typingText.style.animation = 'none';
        setTimeout(() => {
            typingText.style.animation = 'typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite';
        }, 100);
    }
}

function initializeCursorEffects() {
    if (window.innerWidth > 768) {
        const cursor = document.createElement('div');
        cursor.classList.add('custom-cursor');
        document.body.appendChild(cursor);

        const cursorFollower = document.createElement('div');
        cursorFollower.classList.add('cursor-follower');
        document.body.appendChild(cursorFollower);

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        let followerX = 0;
        let followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;
            cursorX += dx * 0.3;
            cursorY += dy * 0.3;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';

            const fdx = mouseX - followerX;
            const fdy = mouseY - followerY;
            followerX += fdx * 0.1;
            followerY += fdy * 0.1;
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';

            requestAnimationFrame(animateCursor);
        }

        animateCursor();

        const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .skill-item');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('active');
                cursorFollower.classList.add('active');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('active');
                cursorFollower.classList.remove('active');
            });
        });

        const style = document.createElement('style');
        style.textContent = `
            .custom-cursor {
                position: fixed;
                width: 10px;
                height: 10px;
                background: var(--primary-color);
                border-radius: 50%;
                pointer-events: none;
                z-index: 10000;
                mix-blend-mode: difference;
                transition: transform 0.3s ease;
            }
            .custom-cursor.active {
                transform: scale(1.5);
            }
            .cursor-follower {
                position: fixed;
                width: 40px;
                height: 40px;
                border: 2px solid var(--primary-color);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                opacity: 0.5;
                transform: translate(-50%, -50%);
                transition: transform 0.3s ease;
            }
            .cursor-follower.active {
                transform: translate(-50%, -50%) scale(1.5);
            }
        `;
        document.head.appendChild(style);
    }
}

function initializeParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    hero.insertBefore(canvas, hero.firstChild);

    const ctx = canvas.getContext('2d');
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;

    const particles = [];
    const particleCount = 50;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = `rgba(0, 240, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.strokeStyle = `rgba(0, 240, 255, ${0.2 * (1 - distance / 100)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animateParticles);
    }

    animateParticles();

    window.addEventListener('resize', () => {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    });
}

function initializeScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.height = '3px';
    progressBar.style.background = 'linear-gradient(90deg, var(--primary-color), var(--accent-color))';
    progressBar.style.zIndex = '10001';
    progressBar.style.transformOrigin = 'left';
    progressBar.style.boxShadow = '0 0 10px var(--primary-color)';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

function isMobile() {
    return window.innerWidth <= 768;
}

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

window.addEventListener('resize', throttle(() => {
    if (window.innerWidth <= 768) {
        const floatingItems = document.querySelectorAll('.floating-item');
        floatingItems.forEach(item => {
            item.style.transform = 'none';
        });
    }
}, 250));

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });
    card.addEventListener('mouseleave', function() {
        this.style.zIndex = '1';
    });
});

document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        const icon = this.querySelector('i');
        if (icon) {
            icon.style.transform = 'scale(1.3) rotate(10deg)';
            icon.style.transition = 'transform 0.3s ease';
        }
    });
    item.addEventListener('mouseleave', function() {
        const icon = this.querySelector('i');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }
    });
});
