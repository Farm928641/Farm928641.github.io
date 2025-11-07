// enemy.js
// This handles static enemy stuff

// Setup
let enemyArray = [];
let enemyWidth = 48;
let enemyHeight = 48;
let enemyImg;
let movingEnemyImg;


const enemySound = new Audio("./sounds/enemy_death.mp3");


// Load the enemy image
function loadEnemyImage() {
    enemyImg = new Image();
    enemyImg.src = "./images/gross_thing.png";

    movingEnemyImg = new Image();
    movingEnemyImg.src = "./images/eyeball.png";
}

// Quite possibly might spawn an enemy above the given platform
function maybeSpawnEnemy(platform) {
    // 10% chance to spawn an enemy above a platform
    if (Math.random() < 0.1) {
        const enemy = {
            img: enemyImg,
            width: enemyWidth,
            height: enemyHeight,
            x: platform.x + (platform.width / 2) - (enemyWidth / 2),
            y: platform.y - enemyHeight - 5, // Slightly above the platform
            // Moving Properties
            isMoving: Math.random() < 0.2, // 20% chance for a moving enemy
            direction: Math.random() < 0.5 ? 1 : -1,
            speed: 60 * (1 + Math.random() * 1.5)
        };

        enemyArray.push(enemy); // Adds to our list of enemies
    }
}

// ---------- update logic -------------------
function updateEnemies(context, player, scrollSpeed) {

    const now = performance.now();
    const delta = (now - last) / (1000 / 60); // The delta creation from verticalplatformer.js

    for (let i = 0; i < enemyArray.length; i++) { // For each enemy in our enemy list
        const currentEnemy = enemyArray[i];
        currentEnemy.y += scrollSpeed; // Scroll with the platforms

        // Check if it is moving
        if (currentEnemy.isMoving) {
            currentEnemy.x += currentEnemy.speed * currentEnemy.direction * delta; // Move horizontally

            // Flip direction if enemy hits the edges of the board
            if (currentEnemy.x <= 0 || currentEnemy.x + currentEnemy.width >= boardWidth) {
                currentEnemy.direction *= -1;
            }

            // Use the eyeball image for moving enemies
            currentEnemy.img = movingEnemyImg;
        } else {
            // Use the default image for static enemies
            currentEnemy.img = enemyImg;
        }

        // Draw the enemy
        context.drawImage(currentEnemy.img, currentEnemy.x, currentEnemy.y, currentEnemy.width, currentEnemy.height);

        // Check if two rectangles (palyer and enemy) are colliding
        if (detectCollisions(player, currentEnemy)) {
            enemySound.play();
            gameOver = true; // Ends game, shocker.
        }
    }

    // Remove enemies that fall off screen
    cleanEnemies();
}

function cleanEnemies() {
    for (let i = enemyArray.length - 1; i >= 0; i--) {
        if (enemyArray[i].y > boardHeight) {
            enemyArray.splice(i, 1);
        }
    }
}

// Clears all enemies (use when restarting game)
function resetEnemies() {
    enemyArray = [];
}