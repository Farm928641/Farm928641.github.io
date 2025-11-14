// background.js
// Handles background scrolling

let backgroundOffset = 0;
let backgroundSpeed = 0.3;

// Updates the background
function updateBackground(delta) {
    // Scroll downward
    backgroundOffset += backgroundSpeed * delta;

    // Loop it so it never grows too large
    if (backgroundOffset > boardHeight) {
        backgroundOffset = 0;
    }

    // Apply to the board background
    board.style.backgroundPositionY = backgroundOffset + "px"; // Specifies in pixels
}



// Reset the background's position
function resetBackground() {
    backgroundOffset = 0;
    board.style.backgroundPositionY = "0px"; // Resets the y-position
}