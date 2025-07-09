// Skills Slider JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('skillsSlider');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicatorsContainer = document.getElementById('indicators');
    const skillCards = document.querySelectorAll('.skill-card');
    
    let currentSlide = 0;
    let cardsPerView = getCardsPerView();
    let maxSlide = Math.ceil(skillCards.length / cardsPerView) - 1;
    
    // Function to determine how many cards to show based on screen size
    function getCardsPerView() {
        const width = window.innerWidth;
        if (width >= 1200) return 4;
        if (width >= 768) return 3;
        if (width >= 480) return 2;
        return 1;
    }
    
    // Create indicators
    function createIndicators() {
        indicatorsContainer.innerHTML = '';
        for (let i = 0; i <= maxSlide; i++) {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (i === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToSlide(i));
            indicatorsContainer.appendChild(indicator);
        }
    }
    
    // Update slider position
    function updateSlider() {
        const cardWidth = skillCards[0].offsetWidth;
        const gap = 20; // Gap between cards
        const moveAmount = currentSlide * (cardWidth + gap) * cardsPerView;
        slider.style.transform = `translateX(-${moveAmount}px)`;
        
        // Update indicators
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
        
        // Update button states
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === maxSlide;
    }
    
    // Go to specific slide
    function goToSlide(slideIndex) {
        currentSlide = Math.max(0, Math.min(slideIndex, maxSlide));
        updateSlider();
    }
    
    // Next slide
    function nextSlide() {
        if (currentSlide < maxSlide) {
            currentSlide++;
            updateSlider();
        }
    }
    
    // Previous slide
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlider();
        }
    }
    
    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Touch/swipe support
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });
    
    slider.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        const diffX = startX - currentX;
        
        // Add some visual feedback during drag
        if (Math.abs(diffX) > 10) {
            slider.style.transform = `translateX(-${(currentSlide * (skillCards[0].offsetWidth + 20) * cardsPerView) + diffX}px)`;
        }
    });
    
    slider.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        const diffX = startX - currentX;
        const threshold = 50; // Minimum swipe distance
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        } else {
            updateSlider(); // Snap back to current position
        }
    });
    
    // Mouse drag support for desktop
    let mouseDown = false;
    
    slider.addEventListener('mousedown', (e) => {
        mouseDown = true;
        startX = e.clientX;
        slider.style.cursor = 'grabbing';
        e.preventDefault();
    });
    
    slider.addEventListener('mousemove', (e) => {
        if (!mouseDown) return;
        currentX = e.clientX;
        const diffX = startX - currentX;
        
        if (Math.abs(diffX) > 10) {
            slider.style.transform = `translateX(-${(currentSlide * (skillCards[0].offsetWidth + 20) * cardsPerView) + diffX}px)`;
        }
    });
    
    slider.addEventListener('mouseup', (e) => {
        if (!mouseDown) return;
        mouseDown = false;
        slider.style.cursor = 'grab';
        
        const diffX = startX - currentX;
        const threshold = 50;
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        } else {
            updateSlider();
        }
    });
    
    slider.addEventListener('mouseleave', () => {
        if (mouseDown) {
            mouseDown = false;
            slider.style.cursor = 'grab';
            updateSlider();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // Auto-play functionality (optional)
    let autoPlayInterval;
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            if (currentSlide === maxSlide) {
                goToSlide(0);
            } else {
                nextSlide();
            }
        }, 4000); // Change slide every 4 seconds
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    // Pause auto-play on hover
    const skillsSection = document.querySelector('.skills');
    skillsSection.addEventListener('mouseenter', stopAutoPlay);
    skillsSection.addEventListener('mouseleave', startAutoPlay);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const newCardsPerView = getCardsPerView();
        if (newCardsPerView !== cardsPerView) {
            cardsPerView = newCardsPerView;
            maxSlide = Math.ceil(skillCards.length / cardsPerView) - 1;
            currentSlide = Math.min(currentSlide, maxSlide);
            createIndicators();
            updateSlider();
        }
    });
    
    // Initialize
    createIndicators();
    updateSlider();
    
    // Start auto-play (uncomment if you want auto-play)
    startAutoPlay();
    
    // Animate skill bars on scroll (optional enhancement)
    function animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.width = entry.target.getAttribute('data-width') || entry.target.style.width;
                }
            });
        });
        
        skillBars.forEach(bar => {
            observer.observe(bar);
        });
    }
    
    // Initialize skill bar animation
    animateSkillBars();
});