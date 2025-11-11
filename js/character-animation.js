// Character Animation Script for WELL WELL Website
// Characters emerge from behind bubble and follow curved paths to section border

(function() {
    'use strict';

    const characterImages = {
        jew: 'images/wellwell12347_jew.png',
        africa: 'images/wellwell12347_africa.png',
        india: 'images/wellwell12347_india.png'
    };

    const config = {
        initialDelay: 3000,
        animationDuration: 2500,  // Slower for dramatic effect
        startSize: 25,            // Tiny (far away)
        endSize: 120,             // Larger when close
        logoSelector: '.speech-bubble',
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
        
        // Starting positions - AT the bubble edges (appearing from behind)
        let startX, startY;
        
        if (characterType === 'jew') {
            // Left edge of bubble, slightly behind
            startX = logoRect.left + 10;
            startY = logoRect.top + (logoRect.height * 0.6);
        } else if (characterType === 'india') {
            // Right edge of bubble, middle position
            startX = logoRect.right - 30;
            startY = logoRect.top + (logoRect.height * 0.5);
        } else { // africa
            // Right edge of bubble, lower position
            startX = logoRect.right - 30;
            startY = logoRect.top + (logoRect.height * 0.7);
        }

        // Find the section headers to determine stop position
        const sectionHeaders = document.querySelectorAll('[class*="AMERICAS"], [class*="EUROPE"], [class*="ASIA"], [class*="OCEANIA"], [class*="AFRICA"], [class*="GLOBAL"]');
        let sectionBorderY = logoRect.bottom + 200; // Default fallback
        
        // Try to find the actual section border
        if (sectionHeaders.length > 0) {
            sectionBorderY = sectionHeaders[0].getBoundingClientRect().top - config.endSize - 20;
        } else {
            // Look for the colored section boxes
            const breakingNews = document.querySelector('[class*="BREAKING"], h1, h2');
            if (breakingNews) {
                sectionBorderY = breakingNews.getBoundingClientRect().bottom + 40;
            }
        }

        // End positions - spread across the width above sections
        let targetX, targetY = sectionBorderY;
        const screenWidth = window.innerWidth;
        
        if (characterType === 'jew') {
            targetX = screenWidth * 0.22;  // Above AMERICAS
        } else if (characterType === 'india') {
            targetX = screenWidth * 0.60;  // Above ASIA  
        } else { // africa
            targetX = screenWidth * 0.78;  // Above AFRICA
        }

        // Initial setup - hidden behind bubble
        character.style.left = startX + 'px';
        character.style.top = startY + 'px';
        character.style.width = config.startSize + 'px';
        character.style.height = config.startSize + 'px';
        character.style.opacity = '0';
        character.style.zIndex = '999'; // Behind bubble initially

        // Flip characters on right side
        if (characterType !== 'jew') {
            character.style.transform = 'scaleX(-1)';
        }

        const startTime = Date.now();
        
        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / config.animationDuration, 1);
            
            // Smooth easing for natural movement
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            // Calculate position with slight curve (following your drawn paths)
            let currentX, currentY;
            
            if (characterType === 'jew') {
                // Curved path going left and down
                const curveAmount = Math.sin(progress * Math.PI) * 30;
                currentX = startX + (targetX - startX) * easeProgress - curveAmount;
                currentY = startY + (targetY - startY) * easeProgress;
            } else {
                // Curved paths going right and down
                const curveAmount = Math.sin(progress * Math.PI) * 40;
                currentX = startX + (targetX - startX) * easeProgress + curveAmount;
                currentY = startY + (targetY - startY) * easeProgress;
            }

            // Size grows as they get closer
            const currentSize = config.startSize + (config.endSize - config.startSize) * easeProgress;

            // Apply transformations
            character.style.left = currentX + 'px';
            character.style.top = currentY + 'px';
            character.style.width = currentSize + 'px';
            character.style.height = currentSize + 'px';

            // Emerge from behind bubble
            if (progress < 0.15) {
                // Still behind bubble
                character.style.opacity = progress / 0.15;
                character.style.zIndex = '999';
            } else {
                // Now in front
                character.style.opacity = '1';
                character.style.zIndex = '10000';
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    }

    function startSequence() {
        console.log('Starting character animation sequence');

        // Stagger the animations for visual interest
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

    window.CharacterAnimation = {
        config: config,
        startSequence: startSequence
    };

})();
