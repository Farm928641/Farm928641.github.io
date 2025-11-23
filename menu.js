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