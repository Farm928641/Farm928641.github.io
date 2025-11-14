let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

let inMovingRegion = false;
const movingStart = 50000; // Score to enter zone
const movingEnd = 75000; // Score to exit

let keys = {}; // This is used to track which keys are being pressed

// Sounds
const debugSound = new Audio("./sounds/debug.wav");
const restartSound = new Audio("./sounds/restart.mp3");

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

    // Draw Enemies
    loadEnemyImage();

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
let initialVelocityY = -10; // Player's starting velocity
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

// Data and Stuff
let score = 0;
let maxScore = 0;
let gameOver = false; // Will occur when player dies


// ---------------------------------------------------------- Update -----------------------------------------------------
function update() {

    const now = performance.now();
    const delta = (now - last) / (1000/60); // normalized to ~60fps
    last = now;

    requestAnimationFrame(update);

    if (gameOver) {
        return; // Stops canvas from drawing if game over
    }

    context.clearRect(0, 0, board.width, board.height); // Clears the canvas before drawing next frame
    updateBackground(delta); // Updates the background


    player.x += velocityX * delta; // Updates the player's position if they are moving

    // This teleports the player to the opposite side when they go off screen
    if (player.x > boardWidth) {
        player.x = 0;
    } else if (player.x + player.width < 0) {
        player.x = boardWidth;
    }

    player.y += velocityY * delta; // Adds the current Y-Velocity to the player's Y coordinates
    velocityY += gravity * delta; // Adding the gravity factor stops him from flying away

    if (player.y > board.height) { // if the palyer falls off the screen
        gameOver = true;
    }

    // Determine if we need to scroll the world (player moving up)
    let scrollSpeed = 0;
    if (velocityY < 0 && player.y < boardHeight * 5/8) {
        scrollSpeed = -velocityY * delta; // slide the world down based on player’s upward speed
        player.y += scrollSpeed;          // keep player visually steady
    }

    // Update and draw each platform
    for (let i = 0; i < platformArray.length; i++) {
        let currentPlatform = platformArray[i];
        currentPlatform.y += scrollSpeed; // apply scrolling to platforms


        // Move if platform is flagged as moving
        if (currentPlatform.isMoving) {
            currentPlatform.x += currentPlatform.speed * currentPlatform.direction * delta; // Moves it at the speed in the right direction
            if (currentPlatform.x <= 0 || currentPlatform.x + currentPlatform.width >= boardWidth) { // Changes direction when it hits the edge
                currentPlatform.direction *= -1;
            }
        }


        // Only check collisions when falling directly onto a platform - this is different than check collisions
        if (
            velocityY > 0 &&
            player.y + player.height <= currentPlatform.y + velocityY * delta && // player was above last frame
            player.y + player.height >= currentPlatform.y &&                      // now intersecting top
            player.x + player.width > currentPlatform.x + 5 &&                    // avoid edge bounces
            player.x < currentPlatform.x + currentPlatform.width - 5
         && currentPlatform.visible) { // Also only check if the platform is visible
            player.y = currentPlatform.y - player.height; // gently align
            velocityY = initialVelocityY; // bounce

            if (currentPlatform.isBreakable && !currentPlatform.broken) { // Destroy the platform if it is breakable and not broken
                currentPlatform.broken = true;
                
                setTimeout(() => {
                    currentPlatform.visible = false; // Make invisible after delay
                }, 150); // Delay ~0.15s so player visibly bounces off first
            }
        }

        if (currentPlatform.visible) { // Only draw platforms if it is visible
            context.drawImage(currentPlatform.img, currentPlatform.x, currentPlatform.y,
                currentPlatform.width, currentPlatform.height);
        }
    }

    // Draw the player (currently glep smiling friends) over and over again
    context.drawImage(player.img, player.x, player.y, player.width, player.height);

    // Remove Platform and add new one
    while (platformArray.length > 0 && platformArray[0].y >= boardHeight) { // When platform goes off screen
        platformArray.shift(); // Remove the first platform element from the array
        newPlatform();
    }

    // also update the enemies too, i guess
    updateEnemies(context, player, scrollSpeed);

    // Update bullets
    updateBullets(context, scrollSpeed);
    handleBulletCollisions();

    // UI Display
    updateScore();
    context.fillStyle = "white";
    context.font = "16px sans-serif";
    context.fillText(score, 5, 20);

    checkRegionStatus(); // Do we need to switch zones?

    if (gameOver) {
        context.fillText("Game Over: Press 'Space' to Restart", boardWidth / 7, boardHeight * 7/8)
    }
}


// -------------------------------------------- Functions ---------------------------------------------
// Player Movement Logic
function movePlayer(e) {
    keys[e.code] = true; // marks that this key was pressed

    if (keys["KeyD"] || keys["ArrowRight"]) { // If Player presses right buttons
        velocityX = 6; // Note: this is 4 pixels per FRAME
    }
    else if (keys["KeyA"] || keys["ArrowLeft"]) { // If Player presses left buttons
        velocityX = -6;
    }

    
    if (e.code == "Space" && gameOver) { // Reset the game

        restartSound.play(); // Play the Restart Sound

        player = {
            img : playerRightImg,
            x : playerX,
            y : playerY,
            width : playerWidth,
            height : playerHeight
        }

        velocityX = 0;
        velocityY = initialVelocityY;
        score = 0;
        maxScore = 0;
        gameOver = false;
        placePlatforms();
        resetEnemies(); // kill
        resetBullets()

        resetBackground() // Reset the background position

    } else if (e.code == "Space" || e.code == "KeyW") {
        shoot(player); // Shoot a bullet
        debugSound.currentTime = 0; // rewind to start if held repeatedly
        debugSound.play();
    }
}


function stopPlayer(e) {
    keys[e.code] = false; // mark that this key was released

    // check if the opposite movement key is still pressed
    if (keys["KeyD"] || keys["ArrowRight"]) {
        velocityX = 6;
    } else if (keys["KeyA"] || keys["ArrowLeft"]) {
        velocityX = -6;
    } else {
        velocityX = 0; // only stop if neither is pressed
    }
}


// ---------------------- Platforms ------------------------

// The first 6 or 7 platforms
function placePlatforms() {
    platformArray = []; // A list of our platforms

    // Starting Platforms
    let platform = {
        img : platformImg,
        width : platformWidth,
        height : platformHeight,
        x : boardWidth / 2 - 30, // Located in the middle of the screen (subtract half of platform length so middle platform is in middle)
        y : boardHeight - 50,
        visible : true
    }

    platformArray.push(platform); //Adds the starting platform to the array

    for (let i = 0; i < 6; i++) { // Generates six platforms
        let randomX = Math.floor(Math.random() * boardWidth * 3/4); // Creates random x-position
        let platform = {
        img : platformImg,
        width : platformWidth,
        height : platformHeight,
        x : randomX,
        y : boardHeight - 75 * i - 150, // Creates 75 pixels of space between each platform
        visible : true
    }

    platformArray.push(platform);
    
    }
}


// Every platform that arent the starting ones
function newPlatform() {
    let randomX = Math.floor(Math.random() * boardWidth * 3/4); // Creates random x-position
    let platform = {
        img : platformImg,
        width : platformWidth,
        height : platformHeight,
        x : randomX,
        y : -platformHeight, // Creates the platform at the top of the canvas so it can slide down
        isMoving : Math.random() < 0.05,           // 5% chance to be moving
        direction : Math.random() < 0.5 ? 1 : -1,  // start going left or right
        speed : 1 + Math.random() * 1.5,            // small random speed
        isBreakable : Math.random() < 0.05, // 5% chance to be breakable
        broken : false,
        visible : true
    }

    if (platform.isMoving == true) { // If is moving
        platform.isBreakable = false; // Then make it not be breakable
    }

    if (inMovingRegion) { // If in the moving zone
        platform.isMoving = true;
    }


    platformArray.push(platform);

    // Only spawn if platfrom isnt moving
    if (platform.isMoving == false) {
        maybeSpawnEnemy(platform); // Quite possibly adds an enemy to the platform 
    }
}


// Collision formula for detecting the intersection between two rectangles
function detectCollisions(a, b) {
    return a.x < b.x + b.width && //a's top left corner doesnt reach b's top right corner
         a.x + a.width > b.x && //a's top right corner passes b's top left corner
         a.y < b.y + b.height && //a's top left corner doesnt reach b's bottom left corner
         a.y + a.height > b.y; //a's bottom left corner passes b's top left corner
}

function updateScore() {
    let points = Math.floor(50 * Math.random()) // Random Number from 0 - 50
    if (velocityY < 0) { // Going Up
        maxScore += points;
        if (score < maxScore) {
            score = maxScore; 
        }
    } else if (velocityY >= 0) { //Stand still or going down
        maxScore -= points;
    }
}



// Checks if we have to switch to a new zone
function checkRegionStatus() {
    const boardElement = document.getElementById("board");

    if (score >= movingStart && score < movingEnd) { // if the score is in the Moving Range
        if (!inMovingRegion) {
            inMovingRegion = true;
            boardElement.classList.add("moving-region"); // swap CSS background
        }
    } else {
        if (inMovingRegion) {
            inMovingRegion = false;
            boardElement.classList.remove("moving-region"); // revert background to normal
        }
    }
}