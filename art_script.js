document.addEventListener('DOMContentLoaded', function() {
    // Initialize gallery
    initializeGallery();
    
    // Filter functionality
    initializeFilters();
    
    // Lightbox functionality
    initializeLightbox();
    
    // Add staggered animation delays
    addAnimationDelays();
});

function initializeGallery() {
    // You can add more art items dynamically here
    const artItems = document.querySelectorAll('.art-item');
    
    artItems.forEach((item, index) => {
        // Add click event for lightbox
        item.addEventListener('click', () => openLightbox(index));
        
        // Add random bounce delays
        item.style.animationDelay = `${Math.random() * 2}s`;
        
        // Add shine effect on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'itemBounce 2s ease-in-out infinite, shine 3s ease-in-out infinite';
                }
            });
        });
        
        observer.observe(item);
    });
}

function initializeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const artItems = document.querySelectorAll('.art-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            // Filter items with animation
            artItems.forEach((item, index) => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.animation = `fadeInScale 0.5s ease-out ${index * 0.1}s forwards`;
                } else {
                    item.style.animation = 'fadeOutScale 0.3s ease-out forwards';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

function initializeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxTitle = document.querySelector('.lightbox-title');
    const lightboxDescription = document.querySelector('.lightbox-description');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let currentIndex = 0;
    const artItems = document.querySelectorAll('.art-item');
    
    // Close lightbox
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    
    // Navigation
    prevBtn.addEventListener('click', () => navigateLightbox(-1));
    nextBtn.addEventListener('click', () => navigateLightbox(1));
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        }
    });
    
    function openLightbox(index) {
        currentIndex = index;
        updateLightboxContent();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    function navigateLightbox(direction) {
        currentIndex += direction;
        if (currentIndex >= artItems.length) currentIndex = 0;
        if (currentIndex < 0) currentIndex = artItems.length - 1;
        updateLightboxContent();
    }
    
    function updateLightboxContent() {
        const currentItem = artItems[currentIndex];
        const img = currentItem.querySelector('img');
        const overlay = currentItem.querySelector('.art-overlay');
        
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxTitle.textContent = overlay.querySelector('h3').textContent;
        lightboxDescription.textContent = overlay.querySelector('p').textContent;
    }
    
    // Make openLightbox globally accessible
    window.openLightbox = openLightbox;
}

function addAnimationDelays() {
    const artItems = document.querySelectorAll('.art-item');
    
    artItems.forEach((item, index) => {
        item.style.setProperty('--delay', `${index * 0.2}s`);
    });
}

// Add custom CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInScale {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @keyframes fadeOutScale {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.8);
        }
    }
    
    @keyframes shine {
        0% { filter: brightness(1) saturate(1); }
        50% { filter: brightness(1.2) saturate(1.3) hue-rotate(10deg); }
        100% { filter: brightness(1) saturate(1); }
    }
`;
document.head.appendChild(style);
