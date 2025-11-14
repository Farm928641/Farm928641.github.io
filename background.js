// background.js
// Handles background scrolling

let backgroundOffset = 0;
let backgroundSpeed = 0.3;





// Reset the background's position
function resetBackground() {
    backgroundOffset = 0;
    board.style.backgroundPositionY = "0px"; // Resets the y-position
}