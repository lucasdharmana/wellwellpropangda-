// Character Animation Script for WELL WELL Website
// Coordinated animation: 3 characters run from right to logo at top

(function() {
    'use strict';

    // Configuration - EDIT IMAGE PATHS IF YOUR IMAGES ARE IN A DIFFERENT LOCATION
    const characterImages = {
        jew: 'images/wellwell12347_jew.png',
        africa: 'images/wellwell12347_africa.png',
        india: 'images/wellwell12347_india.png'
    };

    const config = {
        initialDelay: 3000,
        staggerDelay: 400,
        animationDuration: 4500,
        characterSize: 120,
        logoSelector: '.speech-bubble',
    };

    function spawnCharacter(imagePath, targetY) {
        const character = document.createElement('div');
        character.className = 'character flip';
        
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = 'Running character';
        
        img.onerror = function() {
            console.error('Failed to load:', imagePath);
        };
        
        img.onload = function() {
            console.log('Loaded:', imagePath);
        };
        
        character.appendChild(img);
        document.body.appendChild(character);

        const screenWidth = window.innerWidth;
        const startX = screenWidth + config.characterSize;
        const startY = targetY;
        const endX = -config.characterSize;
        const endY = targetY;

        character.style.left = startX + 'px';
        character.style.top = startY + 'px';
        character.style.opacity = '1';
        character.classList.add('running');
        character.style.animation = `runAcross ${config.animationDuration}ms linear`;

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

            if (logoLeft !== null && logoRight !== null && logoTop !== null && logoBottom !== null) {
                const characterRight = currentX + config.characterSize;
                const characterBottom = currentY + config.characterSize;
                
                const isOverlapping = 
                    characterRight > logoLeft &&
                    currentX < logoRight &&
                    characterBottom > logoTop &&
                    currentY < logoBottom;

                if (isOverlapping) {
                    character.style.opacity = '0';
                    character.style.transition = 'opacity 0.1s ease';
                } else {
                    character.style.opacity = '1';
                }
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                character.remove();
            }
        }

        animate();
    }

    function getTargetY() {
        let targetY;

        if (config.logoSelector) {
            const logo = document.querySelector(config.logoSelector);
            if (logo) {
                const rect = logo.getBoundingClientRect();
                targetY = rect.top + (rect.height / 2) - (config.characterSize / 2);
                console.log('Logo found at Y:', targetY);
            } else {
                console.warn('Logo not found:', config.logoSelector);
                targetY = 100;
            }
        } else {
            targetY = 100;
        }

        return targetY;
    }

    function startSequence() {
        const targetY = getTargetY();

        setTimeout(() => {
            spawnCharacter(characterImages.jew, targetY - 40);
        }, 0);

        setTimeout(() => {
            spawnCharacter(characterImages.africa, targetY);
        }, config.staggerDelay);

        setTimeout(() => {
            spawnCharacter(characterImages.india, targetY + 40);
        }, config.staggerDelay * 2);
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
