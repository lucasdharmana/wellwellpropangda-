// Character Animation Script for WELL WELL Website
// Characters emerge from behind logo and run to screen edges

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
        animationDuration: 2000,
        characterSize: 120,
        logoSelector: '.speech-bubble',
        edgePadding: 20,
    };

    // Create and animate a single character
    function spawnCharacter(imagePath, direction, stackPosition) {
        const character = document.createElement('div');
        character.className = 'character';
        
        // Flip characters going right
        if (direction === 'right') {
            character.classList.add('flip');
        }
        
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
        let startX, startY, endX, endY;

        if (logo) {
            const rect = logo.getBoundingClientRect();
            const logoCenterX = rect.left + (rect.width / 2);
            const logoCenterY = rect.top + (rect.height / 2) - (config.characterSize / 2);
            
            startX = logoCenterX - (config.characterSize / 2);
            startY = logoCenterY;

            if (direction === 'left') {
                // Jew goes to left edge
                endX = config.edgePadding;
                endY = startY;
            } else {
                // Africa and India go to right edge, stacked
                const screenWidth = window.innerWidth;
                endX = screenWidth - config.characterSize - config.edgePadding - (stackPosition * 120);
                endY = startY;
            }
        } else {
            console.warn('Logo not found');
            startX = window.innerWidth / 2;
            startY = 100;
            endX = direction === 'left' ? config.edgePadding : window.innerWidth - config.characterSize - config.edgePadding;
            endY = startY;
        }

        // Set initial position (behind logo, invisible)
        character.style.left = startX + 'px';
        character.style.top = startY + 'px';
        character.style.opacity = '0';

        const startTime = Date.now();
        
        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / config.animationDuration, 1);

            const currentX = startX + (endX - startX) * progress;
            const currentY = startY;

            character.style.left = currentX + 'px';
            character.style.top = currentY + 'px';
            
            // Fade in as they emerge
            if (progress < 0.2) {
                character.style.opacity = (progress / 0.2).toString();
            } else {
                character.style.opacity = '1';
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Animation complete - character stays on screen
                character.style.left = endX + 'px';
                character.style.top = endY + 'px';
                character.style.opacity = '1';
            }
        }

        animate();
    }

    // Start the coordinated animation sequence
    function startSequence() {
        // Jew emerges from left side of logo, runs left
        setTimeout(() => {
            spawnCharacter(characterImages.jew, 'left', 0);
        }, 0);

        // Africa emerges from right side of logo, runs right
        setTimeout(() => {
            spawnCharacter(characterImages.africa, 'right', 0);
        }, 100);

        // India emerges from right side of logo, runs right (stacked with Africa)
        setTimeout(() => {
            spawnCharacter(characterImages.india, 'right', 1);
        }, 200);
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
