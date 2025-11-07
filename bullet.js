// bullet.js
// Handles bullets

// Define Bullet Variables
let bulletArray = [];
let bulletWidth = 6;
let bulletHeight = 12;
let bulletSpeed = 8;
let bulletColor = "yellow";



// Create a new bullet when player attacks
function shoot(player) {
    const bullet = {
        x: player.x + player.width / 2 - bulletWidth / 2,
        y: player.y,
        width: bulletWidth,
        height: bulletHeight,
        color: bulletColor,
        speed: bulletSpeed
    };
    bulletArray.push(bullet); // Adds bullet to the bullet list
}


// Update
function updateBullets(context, scrollSpeed) {
    for (let i = bulletArray.length - 1; i >= 0; i--) { // for each bullet in bullets
        const currentBullet = bulletArray[i];

        // Move upward (relative to world)
        currentBullet.y -= currentBullet.speed + scrollSpeed;

        // Draw the bullet
        context.fillStyle = currentBullet.color;
        context.fillRect(currentBullet.x, currentBullet.y, currentBullet.width, currentBullet.height);

        // Remove offscreen bullets
        if (currentBullet.y + currentBullet.height < 0) {
            bulletArray.splice(i, 1);
        }
    }
}

// Handles Collisions
function handleBulletCollisions() {
    for (let i = bulletArray.length - 1; i >= 0; i--) { // For each bullet in bullets
        const currentBullet = bulletArray[i];

        for (let j = enemyArray.length - 1; j >= 0; j--) { // For each enemy in enemies
            const currentEnemy = enemyArray[j];
            if (detectCollisions(currentBullet, currentEnemy)) { // Checks the collision between the bullet and the enemy
                if (currentEnemy.isMoving) { // Check if it is moving enemy
                    movingEnemySound.play();
                } else {
                    enemySound.play();
                }
                // Remove both bullet and enemy
                bulletArray.splice(i, 1);
                enemyArray.splice(j, 1);
                break;
            }
        }
    }
}



// Clear all bullets when restarting
function resetBullets() {
    bulletArray = [];
}