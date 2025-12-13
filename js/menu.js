// menu.js
// handles the menu :o

let gameState = "menu";
let playButton = null;

// Draw the menu screen
function drawMenu(context, boardWidth, boardHeight) {
    context.clearRect(0, 0, boardWidth, boardHeight); // Clear the screen before drawing

    // Title
    context.fillStyle = "yellow";
    context.font = "32px sans-serif";
    context.fillText("BOX JUMP", boardWidth / 2 - 120, 150);

    // Play button dimensions
    const btnX = boardWidth / 2 - 60;
    const btnY = 260;
    const btnW = 120;
    const btnH = 50;

    // Button background
    context.fillStyle = "black";
    context.fillRect(btnX, btnY, btnW, btnH);

    // Button text
    context.fillStyle = "yellow";
    context.font = "24px sans-serif";
    context.fillText("PLAY", btnX + 27, btnY + 33);

    playButton = { x: btnX, y: btnY, w: btnW, h: btnH };
}


// Start the game
function startGame() {
    gameState = "playing";

    // Reset everything so the game always starts fresh
    score = 0;
    maxScore = 0;
    placePlatforms();
    resetEnemies();
    resetBullets();
    resetPowers();
    disableBuckshot();
    resetBackground(); // If we add any new features that can be reset we HAVE to add it here. I think. Best to just play it safe.

    velocityY = initialVelocityY;
}

// Mouse click handler
window.addEventListener("mousedown", function(e) {
    if (gameState != "menu" || playButton == null) {
        return;
    }
    const rect = board.getBoundingClientRect();
    const scaleX = board.width / rect.width;
    const scaleY = board.height / rect.height; // because of stupid scaling issues i do stuff to fix

    const mouseX = (e.clientX - rect.left) * scaleX; 
    const mouseY = (e.clientY - rect.top) * scaleY; // hate

    // If the mouse is inside the button
    if (mouseX > playButton.x && mouseX < playButton.x + playButton.w && 
        mouseY > playButton.y && mouseY < playButton.y + playButton.h) { 

        // Start the game
        startGame();
    }
});