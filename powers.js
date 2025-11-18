// powers.js
// Handles the power-up stuff

// Setup
let powerArray = [];
let powerWidth = 48;
let powerHeight = 48;
let buckshotImg;
let buckshotActive = false;

// Load the power-up image
function loadPowerImage() {
    buckshotImg = new Image();
    buckshotImg.src = "./images/shotgun.png";
}

// This will be called from the newPlatform() function in verticalplatformer.js
// so that way we can get the correct x and y values
function spawnPowerup(x, y) {
    powerArray.push({
        x: x,
        y: y,
        width: powerWidth,
        height: powerHeight,
        img: buckshotImg // We will have to change this to be some random power-up chooser later, for now just use buckshot
    });
}


// ------------------------------------- Update Logic -------------------------------------------
function updatePowers(scrollSpeed) {
    for (let i = powerArray.length - 1; i >= 0; i--) { // For each powerup
        const currentPower = powerArray[i];

        // Scroll downwards with the rest of the world
        currentPower.y += scrollSpeed;

        // Draw the power
        context.drawImage(currentPower.img, currentPower.x, currentPower.y, currentPower.width, currentPower.height);


        // Check collision between player and power
        if (detectCollisions(player, currentPower)) {
            activateBuckshot();
            powerArray.splice(i, 1);
            continue; // This skips to the next iteration of the loop, preventing the game from checking if a powerup that
                      // was already removed went offscreen. It stops the game from breaking.
        }

        // Delete the power when it goes offscreen
        if (currentPower.y > boardHeight) {
            powerArray.splice(i, 1);
        }
    }
}




// Enable Buckshot
function activateBuckshot() {
    buckshotActive = true;
}

// Disable Buckshot
function disableBuckshot() {
    buckshotActive = false;
}