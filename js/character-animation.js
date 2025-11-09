// Character Animation Script for WELL WELL Website
// Coordinated animation: 3 characters run from right to logo at top

(function() {
    'use strict';

    // Configuration - EDIT THESE PATHS TO MATCH YOUR IMAGE LOCATIONS
    const characterImages = {
        jew: '/images/wellwell12347_jew.png',       // First to appear
        africa: '/images/wellwell12347_africa.png', // Second to appear
        india: '/images/wellwell12347_india.png'    // Third to appear
    };

    const config = {
        initialDelay: 3000,      // Wait 3 seconds after page load
        staggerDelay: 400,       // Delay between each character (ms)
        animationDuration: 2500, // How long they take to run across (ms)
        characterSize: 120,      // Size in pixels
        logoSelector: null,      // CSS selector for your logo (e.g., '#logo' or '.site-title')
        // IMPORTANT: Set logoSelector to make characters disappear behind your logo!
        // Example: logoSelector: '#logo' or logoSelector: '.thought-bubble'
    };

    // Create and animate a single character
    function spawnCharacter(imagePath, targetY) {
        const character = document.createElement('div');
        character.className = 'character flip'; // flip because running left
        
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = 'Running character';
        character.appendChild(img);
        
        document.body.appendChild(character);

        const screenWidth = window.innerWidth;
        
        // Start position: right side of screen, at the target Y height
        const startX = screenWidth + config.characterSize;
        const startY = targetY;
        
        // End position: left side of screen (run all the way across), same Y height
        const endX = -config.characterSize;
        const endY = targetY;

        // Set initial position
        character.style.left = startX + 'px';
        character.style.top = startY + 'px';
        character.style.opacity = '1';

        // Animate
        character.classList.add('running');
        character.style.animation = `runAcross ${config.animationDuration}ms linear`;

        // Get logo bounds for hiding characters behind it
        let logoLeft = null;
        let logoRight = null;
        let logoTop = null;
        let logoBottom = null;

        if (config.logoSelector) {
            const logo = document.querySelector(config.logoSelector);
            if (logo) {
                const rect = logo.getBoundingClientRect();
                logoLeft = rect.left;
                logoRight = rect.right;
                logoTop = rect.top;
                logoBottom = rect.bottom;
            }
        }

        const startTime = Date.now();
        
        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / config.animationDuration, 1);

            const currentX = startX + (endX - startX) * progress;
            const currentY = startY + (endY - startY) * progress;

            character.style.left = currentX + 'px';
            character.style.top = currentY + 'px';

            // Hide character when it's behind the logo (appears to run behind it)
            if (logoLeft !== null && logoRight !== null && logoTop !== null && logoBottom !== null) {
                const characterRight = currentX + config.characterSize;
                const characterBottom = currentY + config.characterSize;
                
                // Check if character is overlapping with logo area
                const isOverlapping = 
                    characterRight > logoLeft &&
                    currentX < logoRight &&
                    characterBottom > logoTop &&
                    currentY < logoBottom;

                if (isOverlapping) {
                    character.style.opacity = '0';
                    character.style.transition = 'opacity 0.1s ease'; // Smooth fade
                } else {
                    character.style.opacity = '1';
                }
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Remove character after animation
                character.remove();
            }
        }

        animate();
    }

    // Find the Y position to target (logo position or top-center)
    function getTargetY() {
        let targetY;

        if (config.logoSelector) {
            // Try to find the logo element
            const logo = document.querySelector(config.logoSelector);
            if (logo) {
                const rect = logo.getBoundingClientRect();
                targetY = rect.top + (rect.height / 2) - (config.characterSize / 2);
            } else {
                // Logo not found, use top of screen
                console.warn('Logo selector not found, using top-center position');
                targetY = 50;
            }
        } else {
            // No logo selector provided, aim for top area
            targetY = 50;
        }

        return targetY;
    }

    // Start the coordinated animation sequence
    function startSequence() {
        const targetY = getTargetY();

        // Character 1: Jew (appears first)
        setTimeout(() => {
            spawnCharacter(characterImages.jew, targetY - 40); // Slightly above
        }, 0);

        // Character 2: Africa (appears second)
        setTimeout(() => {
            spawnCharacter(characterImages.africa, targetY); // Center line
        }, config.staggerDelay);

        // Character 3: India (appears third)
        setTimeout(() => {
            spawnCharacter(characterImages.india, targetY + 40); // Slightly below
        }, config.staggerDelay * 2);
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

    // Start the animation system
    init();

    // Expose functions for external control if needed
    window.CharacterAnimation = {
        config: config,
        startSequence: startSequence
    };

})();
