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
        startSize: 20,      // Very small start (far away effect)
        endSize: 300,       // DOUBLED AGAIN - now 4x original size
        logoSelector: '.speech-bubble',
        stopPositionOffset: 20  // MOVED UP (was 120, now 90 to raise them)
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
            // Left edge of bubble
            startX = logoRect.left + 20;
            startY = logoRect.top + (logoRect.height * 0.6);
        } else if (characterType === 'india') {
            // Right edge of bubble - middle height
            startX = logoRect.right - 40;
            startY = logoRect.top + (logoRect.height * 0.5);
        } else { // africa
            // Right edge of bubble - lower height
            startX = logoRect.right - 40;
            startY = logoRect.top + (logoRect.height * 0.7);
        }

        // Target Y - adjusted to be higher
        const targetY = logoRect.top + config.stopPositionOffset;
        
        // Mobile responsive sizing - scale down significantly on mobile
        const isMobile = window.innerWidth < 768;
        const actualEndSize = isMobile ? config.endSize * 0.3 : config.endSize; // Only 30% size on mobile
        
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

        // Initial state - tiny and hidden
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
            
            // Smooth PowerPoint-style easing (ease-in-out)
            const easeProgress = progress < 0.5 
                ? 2 * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;

            // STRAIGHT DIAGONAL PATHS - No curves!
            const currentX = startX + (targetX - startX) * easeProgress;
            const currentY = startY + (targetY - startY) * easeProgress;

            // Dramatic size growth from tiny to huge
            const currentSize = config.startSize + (actualEndSize - config.startSize) * easeProgress;

            character.style.left = currentX + 'px';
            character.style.top = currentY + 'px';
            character.style.width = currentSize + 'px';
            character.style.height = currentSize + 'px';

            // Smooth fade in as they emerge
            if (progress < 0.15) {
                // Gradual fade in
                character.style.opacity = (progress / 0.15).toString();
                character.style.zIndex = '999';
            } else {
                // Fully visible and in front
                character.style.opacity = '1';
                character.style.zIndex = '9999';
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Lock final position
                character.style.left = targetX + 'px';
                character.style.top = targetY + 'px';
                character.style.width = actualEndSize + 'px';
                character.style.height = actualEndSize + 'px';
                console.log(`${characterType} locked at X: ${targetX}, Y: ${targetY}, Size: ${actualEndSize}`);
            }
        }

        requestAnimationFrame(animate);
    }

    function startSequence() {
        console.log('Starting character animation');
        console.log('Position offset:', config.stopPositionOffset);
        console.log('End size:', config.endSize);
        
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
        },
        testSize: function(size) {
            config.endSize = size;
            document.querySelectorAll('.character').forEach(c => c.remove());
            startSequence();
        }
    };

})();
