let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

let keys = {}; // This is used to track which keys are being pressed

// Sounds
const debugSound = new Audio("./sounds/debug.wav");

// VERY IMPORTANT TIME VARIABLE
let last = performance.now();

// ------------ Game Logic -----------------
window.onload = function() {
    board = this.document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");
    

    //load player images
    playerRightImg = new Image();
    playerRightImg.src = "./images/debug_player.png";
    player.img = playerRightImg;

    // draw player
    playerRightImg.onload = function() {
        context.drawImage(player.img, player.x, player.y, player.width, player.height);
    }

    // Load Platform Images
    platformImg = new Image();
    platformImg.src = "./images/debug_platform.png"; //uses the debug image for the platform

    // Draw Platforms
    placePlatforms();

    velocityY = initialVelocityY; // Sets player's velocity to starting velo

    this.requestAnimationFrame(update); 
    this.addEventListener("keydown", movePlayer); //Listens for a key press that moves the player
    this.addEventListener("keyup", stopPlayer); // Listens for the keys to be unpressed that will stop player
}

// ----------- Object Definitions -------------

//player
let playerWidth = 46;
let playerHeight = 46;
let playerX = boardWidth / 2 - playerWidth / 2;
let playerY = boardHeight*7/8 - playerHeight;
let playerRightImg;

// Physics
let velocityX = 0;
let velocityY = 0; // Player jump speed
let initialVelocityY = -8; // Player's starting velocity
let gravity = 0.4; // Gravity strength

let player = {
    img: null,
    x : playerX,
    y : playerY,
    width : playerWidth,
    height : playerHeight,
}

// Platforms
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;



// -------- Functions -----------
function update() {

    const now = performance.now();
    const delta = (now - last) / (1000/60); // normalized to ~60fps
    last = now;

    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height); // Clears the canvas before drawing next frame


    player.x += velocityX * delta; // Updates the player's position if they are moving

    // This teleports the player to the opposite side when they go off screen
    if (player.x > boardWidth) {
        player.x = 0;
    } else if (player.x + player.width < 0) {
        player.x = boardWidth;
    }

    player.y += velocityY * delta; // Adds the current Y-Velocity to the player's Y coordinates
    velocityY += gravity * delta; // Adding the gravity factor stops him from flying away

    // Draw the player (currently glep smiling friends) over and over again
    context.drawImage(player.img, player.x, player.y, player.width, player.height);


    // platforms
    for (i = 0; i < platformArray.length; i++) {
        let currentPlatform = platformArray[i];
        if (detectCollisions(player, currentPlatform)) {
            velocityY = initialVelocityY //jump
        }
       
        context.drawImage(currentPlatform.img, currentPlatform.x, currentPlatform.y,
            currentPlatform.width, currentPlatform.height);
    }
}

// Player Movement Logic
function movePlayer(e) {
    keys[e.code] = true; // marks that this key was pressed

    if (keys["KeyD"] || keys["ArrowRight"]) { // If Player presses right buttons
        velocityX = 8; // Note: this is 4 pixels per FRAME
    }
    else if (keys["KeyA"] || keys["ArrowLeft"]) { // If Player presses left buttons
        velocityX = -8;
    }

    // play sound when spacebar pressed for testing purposes
    if (e.code === "Space") {
        debugSound.currentTime = 0; // rewind to start if held repeatedly
        debugSound.play();
    }
}


function stopPlayer(e) {
    keys[e.code] = false; // mark that this key was released

    // check if the opposite movement key is still pressed
    if (keys["KeyD"] || keys["ArrowRight"]) {
        velocityX = 8;
    } else if (keys["KeyA"] || keys["ArrowLeft"]) {
        velocityX = -8;
    } else {
        velocityX = 0; // only stop if neither is pressed
    }
}


// Platforms
function placePlatforms() {
    platformArray = []; // A list of our platforms

    // Starting Platforms
    let platform = {
        img : platformImg,
        width : platformWidth,
        height : platformHeight,
        x : boardWidth / 2, // Located in the middle of the screen
        y : boardHeight - 50 
    }

    platformArray.push(platform); //Adds the starting platform to the array

    for (let i = 0; i < 6; i++) { // Generates six platforms
        let randomX = Math.floor(Math.random() * boardWidth * 3/4); // Creates random x-position
        let platform = {
        img : platformImg,
        width : platformWidth,
        height : platformHeight,
        x : randomX,
        y : boardHeight - 75 * i - 150 // Creates 75 pixels of space between each platform
    }

    platformArray.push(platform);
    
    }
}


// Collision formula for detecting the intersection between two rectangles
function detectCollisions(a, b) {
    return a.x < b.x + b.width && //a's top left corner doesnt reach b's top right corner
         a.x + a.width > b.x && //a's top right corner passes b's top left corner
         a.y < b.y + b.height && //a's top left corner doesnt reach b's bottom left corner
         a.y + a.height > b.y; //a's bottom left corner passes b's top left corner
}       