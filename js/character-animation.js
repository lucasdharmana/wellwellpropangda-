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
        startSize: 20,              // Very small start
        endSize: 150,               // 50% bigger than before (was 100)
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

        // CRITICAL: Find the exact position of the section border line
        let targetY;
        
        // Method 1: Find section labels and position just above them
        const sectionElements = Array.from(document.querySelectorAll('*')).filter(el => {
            const text = el.textContent ? el.textContent.trim() : '';
            return text === 'AMERICAS' || text === 'EUROPE' || text === 'ASIA' || 
                   text === 'OCEANIA' || text === 'AFRICA' || text === 'GLOBAL';
        });

        if (sectionElements.length > 0) {
            // Get the top of the first section label
            const firstLabel = sectionElements[0];
            const labelRect = firstLabel.getBoundingClientRect();
            // Position character so bottom edge touches the line above labels
            targetY = labelRect.top - config.endSize;
            console.log('Found section label, positioning at:', targetY);
        } else {
            // Method 2: Look for the navigation container with the labels
            const navContainer = document.querySelector('[class*="navigation"]') ||
                               document.querySelector('[class*="sections"]') ||
                               document.querySelector('[class*="categories"]');
            
            if (navContainer) {
                const navRect = navContainer.getBoundingClientRect();
                targetY = navRect.top - config.endSize;
            } else {
                // Method 3: Calculate based on "CA: COMING SOON" position
                const comingSoon = Array.from(document.querySelectorAll('*')).find(el => 
                    el.textContent && el.textContent.includes('CA: COMING SOON')
                );
                
                if (comingSoon) {
                    const csRect = comingSoon.getBoundingClientRect();
                    // The section border is roughly 40-60px below the coming soon banner
                    targetY = csRect.bottom + 60;
                } else {
                    // Fallback based on logo
                    targetY = logoRect.bottom + 100;
                }
            }
        }

        // Ensure characters don't overlap on mobile by adjusting size based on viewport
        const isMobile = window.innerWidth < 768;
        const actualEndSize = isMobile ? config.endSize * 0.6 : config.endSize;
        
        // Adjust Y position for mobile to account for smaller size
        if (isMobile) {
            targetY = targetY - (config.endSize - actualEndSize);
        }

        // End X positions - spread across width
        let targetX;
        const screenWidth = window.innerWidth;
        
        if (characterType === 'jew') {
            // Above AMERICAS (left side)
            targetX = isMobile ? screenWidth * 0.15 : screenWidth * 0.18;
        } else if (characterType === 'india') {
            // Above ASIA (center-right)
            targetX = isMobile ? screenWidth * 0.50 : screenWidth * 0.55;
        } else { // africa
            // Above AFRICA (right side)
            targetX = isMobile ? screenWidth * 0.75 : screenWidth * 0.78;
        }

        // Initial state - hidden behind bubble
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

            // Simple curved paths
            let currentX, currentY;
            
            if (characterType === 'jew') {
                // Slight curve left
                const curve = Math.sin(progress * Math.PI) * 15;
                currentX = startX + (targetX - startX) * easeProgress - curve;
            } else {
                // Slight curve right  
                const curve = Math.sin(progress * Math.PI) * 15;
                currentX = startX + (targetX - startX) * easeProgress + curve;
            }
            
            currentY = startY + (targetY - startY) * easeProgress;

            // Grow in size (using adjusted size for mobile)
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
                character.style.zIndex = '9999'; // Below 10000 to not cover critical UI
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Final positioning adjustment to ensure they're right on the line
                character.style.top = targetY + 'px';
                console.log(`${characterType} final position - X: ${targetX}, Y: ${targetY}`);
            }
        }

        requestAnimationFrame(animate);
    }

    function startSequence() {
        console.log('Starting character animation');
        
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
