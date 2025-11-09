(function() {
    'use strict';

    const characters = [
        'images/wellwell12347_india.png',
        'images/wellwell12347_jew.png',
        'images/wellwell12347_africa.png'
    ];

    const config = {
        minInterval: 3000,
        maxInterval: 8000,
        minDuration: 4000,
        maxDuration: 8000,
        characterSize: 120,
        enabled: true,
    };

    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getRandomCharacter() {
        return characters[random(0, characters.length - 1)];
    }

    function spawnCharacter() {
        if (!config.enabled) return;

        const character = document.createElement('div');
        character.className = 'character';
        
        const img = document.createElement('img');
        img.src = getRandomCharacter();
        img.alt = 'Running character';
        character.appendChild(img);
        
        document.body.appendChild(character);

        const direction = random(0, 3);
        const duration = random(config.minDuration, config.maxDuration);
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        let startX, startY, endX, endY;

        switch(direction) {
            case 0:
                startX = -config.characterSize;
                startY = random(0, screenHeight - config.characterSize);
                endX = screenWidth + config.characterSize;
                endY = startY;
                break;
            case 1:
                startX = screenWidth + config.characterSize;
                startY = random(0, screenHeight - config.characterSize);
                endX = -config.characterSize;
                endY = startY;
                character.classList.add('flip');
                break;
            case 2:
                startX = random(0, screenWidth - config.characterSize);
                startY = -config.characterSize;
                endX = startX;
                endY = screenHeight + config.characterSize;
                break;
            case 3:
                startX = random(0, screenWidth - config.characterSize);
                startY = screenHeight + config.characterSize;
                endX = startX;
                endY = -config.characterSize;
                break;
        }

        character.style.left = startX + 'px';
        character.style.top = startY + 'px';
        character.style.opacity = '1';
        character.classList.add('running');
        character.style.animation = `runAcross ${duration}ms linear`;

        const startTime = Date.now();
        
        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const currentX = startX + (endX - startX) * progress;
            const currentY = startY + (endY - startY) * progress;

            character.style.left = currentX + 'px';
            character.style.top = currentY + 'px';

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                character.remove();
            }
        }

        animate();
    }

    function scheduleNextSpawn() {
        const interval = random(config.minInterval, config.maxInterval);
        setTimeout(() => {
            spawnCharacter();
            scheduleNextSpawn();
        }, interval);
    }

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startAnimation);
        } else {
            startAnimation();
        }
    }

    function startAnimation() {
        scheduleNextSpawn();
        setTimeout(() => spawnCharacter(), 500);
    }

    init();

    window.CharacterAnimation = {
        config: config,
        spawn: spawnCharacter
    };

})();
