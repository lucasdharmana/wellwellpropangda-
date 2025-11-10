// Character Animation Script for WELL WELL Website
// Characters emerge from behind logo, run toward camera (getting bigger), stop at news sections

(function() {
    'use strict';

    // Configuration
    const characterImages = {
        jew: 'images/wellwell12347_jew.png',      // Goes to Americas (left)
        africa: 'images/wellwell12347_africa.png', // Goes to Africa (right)
        india: 'images/wellwell12347_india.png'    // Goes to Asia (right-center)
    };

    const config = {
        initialDelay: 3000,      // Wait 3 seconds after page load
        animationDuration: 2500, // How long animation takes
        startSize: 40,           // Starting size (small, far away)
        endSize: 120,            // Ending size (bigger, closer)
        logoSelector: '.speech-bubble',
    };

    // Create and animate a single character
    function spawnCharacter(imagePath, targetSection) {
        const character = document.createElement('div');
        character.className = 'character';
        
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = 'Character';
        
        img.onerror = function() {
            console.error('Failed to load:', imagePath);
        };
        
        character.appendChild(img);
        document.body.appendChild(character);

        // Get logo position (starting point - behind the bubble)
        const logo = document.querySelector(config.logoSelector);
        if (!logo) {
            console.warn('Logo not found');
            return;
        }

        const logoRect = logo.getBoundingClientRect();
        const logoCenterX = logoRect.left + (logoRect.width / 2);
        const logoCenterY = logoRect.top + (logoRect.height / 2);

        // Calculate target position based on section
        let targetX, targetY;
        const newsCardsContainer = document.querySelector('.news-grid') || document.querySelector('main');
        
        if (newsCardsContainer) {
            const containerRect = newsCardsContainer.getBoundingClientRect();
            targetY = containerRect.top - 80; // Stop just above the news cards
            
            // Position based on which character
            const screenWidth = window.innerWidth;
            if (targetSection === 'left') {
                // Jew goes to left side (Americas area)
                targetX = screenWidth * 0.15;
                character.classList.remove('flip'); // Face left
            } else if (targetSection === 'center') {
                // India goes to center-right (Asia area)
                targetX = screenWidth * 0.55;
                character.classList.add('flip'); // Face right
            } else {
                // Africa goes to far right (Africa area)
                targetX = screenWidth * 0.85;
                character.classList.add('flip'); // Face right
            }
        } else {
            // Fallback if news grid not found
            targetY = window.innerHeight * 0.6;
            targetX = targetSection === 'left' ? window.innerWidth * 0.2 : window.innerWidth * 0.8;
        }

        // Starting position (behind logo, centered)
        const startX = logoCenterX - (config.startSize / 2);
        const startY = logoCenterY - (config.startSize / 2);

        // Set initial state (small and invisible behind logo)
        character.style.left = startX + 'px';
        character.style.top = startY + 'px';
        character.style.width = config.startSize + 'px';
        character.style.height = config.startSize + 'px';
        character.style.opacity = '0';
        character.style.zIndex = '1'; // Behind logo initially

        const startTime = Date.now();
        
        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / config.animationDuration, 1);

            // Ease-out curve for more natural motion
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            // Calculate current position
            const currentX = startX + (targetX - startX - (config.endSize / 2)) * easeProgress;
            const currentY = startY + (targetY - startY) * easeProgress;

            // Calculate current size (grows as it approaches)
            const currentSize = config.startSize + (config.endSize - config.startSize) * easeProgress;

            // Apply position and size
            character.style.left = currentX + 'px';
            character.style.top = currentY + 'px';
            character.style.width = currentSize + 'px';
            character.style.height = currentSize + 'px';

            // Fade in smoothly after emerging from behind logo
            if (progress < 0.15) {
                // Stay invisible while behind logo
                character.style.opacity = '0';
                character.style.zIndex = '1';
            } else if (progress < 0.3) {
                // Fade in as emerging
                const fadeProgress = (progress - 0.15) / 0.15;
                character.style.opacity = fadeProgress.toString();
                character.style.zIndex = '10000'; // Now in front
            } else {
                // Fully visible
                character.style.opacity = '1';
                character.style.zIndex = '10000';
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Animation complete - stay at final position
                character.style.left = (targetX - (config.endSize / 2)) + 'px';
                character.style.top = targetY + 'px';
                character.style.width = config.endSize + 'px';
                character.style.height = config.endSize + 'px';
                character.style.opacity = '1';
            }
        }

        animate();
    }

    // Start the coordinated animation sequence
    function startSequence() {
        console.log('Starting character animation sequence');

        // Jew emerges and runs to left (Americas section)
        setTimeout(() => {
            spawnCharacter(characterImages.jew, 'left');
        }, 0);

        // India emerges and runs to center-right (Asia section)
        setTimeout(() => {
            spawnCharacter(characterImages.india, 'center');
        }, 150);

        // Africa emerges and runs to right (Africa section)
        setTimeout(() => {
            spawnCharacter(characterImages.africa, 'right');
        }, 300);
    }

    // Initialize when DOM is ready
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(startSequence, config.initialDelay);
            });
        } else {
            setTimeout(startSequence, config.initialDelay);
        }
    }

    init();

    window.CharacterAnimation = {
        config: config,
        startSequence: startSequence
    };

})();
