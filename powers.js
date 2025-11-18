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