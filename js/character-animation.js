// Character Animation Script for WELL WELL Website
// Characters emerge from behind bubble and stop at section border line

(function() {
    'use strict';

    const characterImages = {
        jew: 'images/wellwell12347_jew.png',
        africa: 'images/wellwell12347_africa.png',
        india: 'images/wellwell12347_india.png'
    };

    const config = {
        initialDelay: 3000,
        animationDuration: 2500,
        startSize: 20,
        endSize: 150,
        logoSelector: '.speech-bubble',
        // MANUAL ADJUSTMENT: Change this value to move characters up or down
        // Negative values = move up, Positive values = move down
        stopPositionOffset: 80  // Start with 80px below logo bottom, adjust as needed
    };

    function spawnCharacter(imagePath, characterType) {
        const character = document.createElement('div');
        character.className = 'character';
        character.style.cssText = `
            position: fixed;
            pointer-events: none;
            will-change: transform;
        `;
        
        const img = document.createElement('img');
        img.src = imagePath;
        img.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: contain;
        `;
        
        character.appendChild(img);
        document.body.appendChild(character);

        const logo = document.querySelector(config.logoSelector);
        if (!logo) return;

        const logoRect = logo.getBoundingClientRect();
        
        // Starting positions - at bubble edges
        let startX, startY;
        
        if (characterType === 'jew') {
            startX = logoRect.left + 10;
            startY = logoRect.top + (logoRect.height * 0.6);
        } else if (characterType === 'india') {
            startX = logoRect.right - 30;
            startY = logoRect.top + (logoRect.height * 0.5);
        } else { // africa
            startX = logoRect.right - 30;
            startY = logoRect.top + (logoRect.height * 0.7);
        }

        // SIMPLIFIED TARGET Y POSITION
        // This puts them in the white space between logo and sections
        const targetY = logoRect.bottom + config.stopPositionOffset - config.endSize;
        
        // Log for debugging
        console.log(`Logo bottom: ${logoRect.bottom}, Target Y: ${targetY}`);

        // Mobile responsive sizing
        const isMobile = window.innerWidth < 768;
        const actualEndSize = isMobile ? config.endSize * 0.6 : config.endSize;

        // End X positions
        let targetX;
        const screenWidth = window.innerWidth;
        
        if (characterType === 'jew') {
            targetX = isMobile ? screenWidth * 0.15 : screenWidth * 0.18;
        } else if (characterType === 'india') {
            targetX = isMobile ? screenWidth * 0.50 : screenWidth * 0.55;
        } else { // africa
            targetX = isMobile ? screenWidth * 0.75 : screenWidth * 0.78;
        }

        // Initial state
        character.style.left = startX + 'px';
        character.style.top = startY + 'px';
        character.style.width = config.startSize + 'px';
        character.style.height = config.startSize + 'px';
        character.style.opacity = '0';
        character.style.zIndex = '999';

        // Flip right-side characters
        if (characterType !== 'jew') {
            character.style.transform = 'scaleX(-1)';
        }

        const startTime = Date.now();
        
        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / config.animationDuration, 1);
            
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            // Calculate positions with curves
            let currentX, currentY;
            
            if (characterType === 'jew') {
                const curve = Math.sin(progress * Math.PI) * 15;
                currentX = startX + (targetX - startX) * easeProgress - curve;
            } else {
                const curve = Math.sin(progress * Math.PI) * 15;
                currentX = startX + (targetX - startX) * easeProgress + curve;
            }
            
            currentY = startY + (targetY - startY) * easeProgress;

            // Grow in size
            const currentSize = config.startSize + (actualEndSize - config.startSize) * easeProgress;

            character.style.left = currentX + 'px';
            character.style.top = currentY + 'px';
            character.style.width = currentSize + 'px';
            character.style.height = currentSize + 'px';

            // Emerge from behind bubble
            if (progress < 0.1) {
                character.style.opacity = progress / 0.1;
                character.style.zIndex = '999';
            } else {
                character.style.opacity = '1';
                character.style.zIndex = '9999';
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    }

    function startSequence() {
        console.log('Starting character animation');
        console.log('Adjust config.stopPositionOffset to fine-tune position');
        
        setTimeout(() => spawnCharacter(characterImages.jew, 'jew'), 0);
        setTimeout(() => spawnCharacter(characterImages.india, 'india'), 300);
        setTimeout(() => spawnCharacter(characterImages.africa, 'africa'), 600);
    }

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(startSequence, config.initialDelay);
            });
        } else {
            setTimeout(startSequence, config.initialDelay);
        }
    }

    init();

    // Expose for easy testing in console
    window.CharacterAnimation = {
        config: config,
        startSequence: startSequence,
        testPosition: function(offset) {
            config.stopPositionOffset = offset;
            document.querySelectorAll('.character').forEach(c => c.remove());
            startSequence();
        }
    };

})();
