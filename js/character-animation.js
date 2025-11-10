// Character Animation Script for WELL WELL Website
// Characters emerge from behind bubble sides and run down to the black subject line

(function() {
    'use strict';

    // Configuration
    const characterImages = {
        jew: 'images/wellwell12347_jew.png',
        africa: 'images/wellwell12347_africa.png',
        india: 'images/wellwell12347_india.png'
    };

    const config = {
        initialDelay: 3000,
        animationDuration: 3500,  // Slower animation
        startSize: 30,
        endSize: 100,
        logoSelector: '.speech-bubble',
    };

    function spawnCharacter(imagePath, side) {
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

        // Get logo position
        const logo = document.querySelector(config.logoSelector);
        if (!logo) {
            console.warn('Logo not found');
            return;
        }

        const logoRect = logo.getBoundingClientRect();
        
        // Starting positions: at the left or right edge of the bubble
        let startX, startY;
        
        if (side === 'left') {
            // Start at LEFT edge of bubble
            startX = logoRect.left;
            startY = logoRect.top + (logoRect.height / 2);
            character.classList.remove('flip');
        } else {
            // Start at RIGHT edge of bubble
            startX = logoRect.right - config.startSize;
            startY = logoRect.top + (logoRect.height / 2);
            character.classList.add('flip');
        }

        // Find the black line (the region nav bar)
        // Look for the nav/section with AMERICAS, EUROPE, ASIA, etc.
        let targetY;
        const regionNav = document.querySelector('nav') || 
                         document.querySelector('.regions') ||
                         document.querySelector('[class*="region"]');
        
        if (regionNav) {
            const navRect = regionNav.getBoundingClientRect();
            targetY = navRect.top - config.endSize - 10; // Stop just above the nav
            console.log('Found region nav at Y:', targetY);
        } else {
            // Fallback: find the black line visually (look for elements near the bubble)
            const bubbleBottom = logoRect.bottom;
            // Estimate: black line is roughly 200-250px below the bubble
            targetY = bubbleBottom + 180;
            console.log('Using estimated target Y:', targetY);
        }

        // End positions: spread out along the black line
        let targetX;
        const screenWidth = window.innerWidth;
        
        if (side === 'left') {
            // Jew stops on the left side (near AMERICAS)
            targetX = screenWidth * 0.15;
        } else if (side === 'center') {
            // India stops in center-right (near ASIA)
            targetX = screenWidth * 0.5;
        } else {
            // Africa stops on the right side (near AFRICA)
            targetX = screenWidth * 0.75;
        }

        // Set initial state (small, invisible, behind bubble)
        character.style.left = startX + 'px';
        character.style.top = startY + 'px';
        character.style.width = config.startSize + 'px';
        character.style.height = config.startSize + 'px';
        character.style.opacity = '0';
        character.style.zIndex = '1';

        const startTime = Date.now();
        
        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / config.animationDuration, 1);

            // Ease-out for smooth deceleration
            const easeProgress = 1 - Math.pow(1 - progress, 2.5);

            // Calculate curved path (follows red arrow paths from image)
            const currentX = startX + (targetX - startX) * easeProgress;
            const currentY = startY + (targetY - startY) * easeProgress;

            // Size grows as they approach
            const currentSize = config.startSize + (config.endSize - config.startSize) * easeProgress;

            // Apply transformations
            character.style.left = currentX + 'px';
            character.style.top = currentY + 'px';
            character.style.width = currentSize + 'px';
            character.style.height = currentSize + 'px';

            // Fade in as they emerge from behind bubble
            if (progress < 0.1) {
                character.style.opacity = '0';
                character.style.zIndex = '1';
            } else if (progress < 0.25) {
                const fadeProgress = (progress - 0.1) / 0.15;
                character.style.opacity = fadeProgress.toString();
                character.style.zIndex = '10000';
            } else {
                character.style.opacity = '1';
                character.style.zIndex = '10000';
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Stop at final position
                character.style.left = targetX + 'px';
                character.style.top = targetY + 'px';
                character.style.width = config.endSize + 'px';
                character.style.height = config.endSize + 'px';
                character.style.opacity = '1';
                console.log('Character stopped at:', targetX, targetY);
            }
        }

        animate();
    }

    function startSequence() {
        console.log('Starting character animation');

        // Jew emerges from LEFT side of bubble
        setTimeout(() => {
            spawnCharacter(characterImages.jew, 'left');
        }, 0);

        // India emerges from RIGHT side of bubble (center target)
        setTimeout(() => {
            spawnCharacter(characterImages.india, 'center');
        }, 200);

        // Africa emerges from RIGHT side of bubble (right target)
        setTimeout(() => {
            spawnCharacter(characterImages.africa, 'right');
        }, 400);
    }

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
