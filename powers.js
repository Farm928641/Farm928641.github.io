// powers.js
// Handles the power-up stuff

// Setup
let powerArray = [];
let powerWidth = 48;
let powerHeight = 48;

let buckshotImg;
let buckshotActive = false;
let buckShots = 0; // How many shots with buckshots

let laserImg;
let laserActive = false;
let laserCharge = 0; // % charge of laser left
let laserMaxCharge = 100; // Maximum % of charge

const LASER_DRAIN_RATE = 35;     // % per second


const buckshotSound = new Audio("./sounds/guncock.mp3");

// Load the power-up image
function loadPowerImage() {
    buckshotImg = new Image();
    buckshotImg.src = "./images/shotgun.png";

    laserImg = new Image();
    laserImg.src = "./images/eyeball.png";
}

// This will be called from the newPlatform() function in verticalplatformer.js
// so that way we can get the correct x and y values
function spawnPowerup(x, y) {
    // const powerChance = Math.random();
    // if (powerChance < 0.5) { //  50% its a laser
    //     powerArray.push({
    //         x: x,
    //         y: y,
    //         width: powerWidth,
    //         height: powerHeight,
    //         img: laserImg,
    //         type: "laser" // This is the type of power up
    //     });
    // } else { // Is Buckshot
    //     powerArray.push({
    //         x: x,
    //         y: y,
    //         width: powerWidth,
    //         height: powerHeight,
    //         img: buckshotImg,
    //         type: "buckshot"
    //     });
    // }
    powerArray.push({
        x: x,
        y: y,
        width: powerWidth,
        height: powerHeight,
        img: buckshotImg,
        type: "buckshot"
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
            disableAllPowers(); // Turn off previous power

            if (currentPower.type == "buckshot") { // if the power is the buckshot
                activateBuckshot();
                buckshotSound.play(); // play sound when collected
                
            } else if (currentPower.type == "laser") {
                activateLaser();
            }

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

function updateLaser(delta) { // update the laser
    if (!laserActive) { // quit if laser isnt active
        return
    }

    const seconds = delta / 60; // # of seconds

    const firing = keys["Space"] || keys["KeyW"];

    if (firing) {
        laserCharge -= LASER_DRAIN_RATE * seconds;
        if (laserCharge <= 0) {
            laserCharge = 0;
            disableLaser();
        }
    }

}

// ------------- Helpers ---------------

// Enable Buckshot
function activateBuckshot() {
    buckshotActive = true;
    buckShots = 5;
}

function activateLaser() {
    laserActive = true;
    laserCharge = laserMaxCharge;
}

// Disable Buckshot
function disableBuckshot() {
    buckshotActive = false;
}

// Disable Laser
function disableLaser() {
    laserActive = false;
}

// Clears all enemies (use when restarting game)
function resetPowers() {
    powerArray = [];
}

function disableAllPowers() {
    disableBuckshot();
    disableLaser();
}