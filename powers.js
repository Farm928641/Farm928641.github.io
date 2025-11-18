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


// Enable Buckshot
function activateBuckshot() {
    buckshotActive = true;
}

// Disable Buckshot
function disableBuckshot() {
    buckshotActive = false;
}