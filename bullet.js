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