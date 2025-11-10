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
        animationDuration: 4000,  // Even slower
        startSize: 30,            // Small at start (far away)
        endSize: 180,             // 50% BIGGER than original (was 120, now 180)
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
        
        // Starting positions: at the CORNERS of the bubble (where it curves)
        let startX, startY;
        
        if (side === 'left') {
            // Start at LEFT CORNER/EDGE of bubble (where it curves on left side)
            startX = logoRect.left - 20;  // Slightly outside the left edge
            startY = logoRect.top + (logoRect.height * 0.4); // Upper-middle of bubble
            character.classList.remove('flip');
        } else {
            // Start at RIGHT CORNER/EDGE of bubble (where it curves on right side)
            startX = logoRect.right - config.startSize + 20; // Slightly outside right edge
            startY = logoRect.top + (logoRect.height * 0.4); // Upper-middle of bubble
            character.classList.add('flip');
        }

        // Find the EXACT black line above AMERICAS, EUROPE, ASIA
        let targetY;
        
        // Method 1: Look for text containing region names
        const allElements = document.querySelectorAll('*');
        let regionElement = null;
        
        for (let el of allElements) {
            const text = el.textContent.trim();
            if (text.includes('AMERICAS') || text.includes('AMERICA')) {
                regionElement = el;
                break;
            }
        }
        
        if (regionElement) {
            const rect = regionElement.getBoundingClientRect();
            // Stop at the line ABOVE these labels (the black line)
            targetY = rect.top - config.endSize - 30;
            console.log('Found AMERICAS at Y:', rect.top, '- Characters stop at:', targetY);
        } else {
            // Method 2: The black line is below "CA: COMING SOON" banner
            const bubbleBottom = logoRect.bottom;
            const comingSoon = document.querySelector('[class*="coming"]') || 
                             Array.from(document.querySelectorAll('*')).find(el => 
                                 el.textContent.includes('COMING SOON')
                             );
            
            if (comingSoon) {
                const csRect = comingSoon.getBoundingClientRect();
                targetY = csRect.bottom + 30; // Just below coming soon banner
                console.log('Using COMING SOON position, stop at:', targetY);
            } else {
                // Fallback
                targetY = bubbleBottom + 140;
                console.log('Using fallback position:', targetY);
            }
        }

        // End positions: spread out along the black line
        let targetX;
        const screenWidth = window.innerWidth;
        
        if (side === 'left') {
            // Jew stops on the far left (near AMERICAS)
            targetX = screenWidth * 0.12;
        } else if (side === 'center') {
            // India stops in center (near ASIA)
            targetX = screenWidth * 0.48;
        } else {
            // Africa stops on the right (near AFRICA)
            targetX = screenWidth * 0.72;
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
