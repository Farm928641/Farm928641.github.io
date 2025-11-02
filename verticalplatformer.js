let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

window.onload = function() {
    board = this.document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");
    

    //load player images
    playerRightImg = new Image();
    playerRightImg.src = "./images/debug_player.png"
    player.img = playerRightImg;

    // draw player
    playerRightImg.onload = function() {
        context.drawImage(player.img, player.x, player.y, player.width, player.height);
    }


    this.requestAnimationFrame(update); 
    this.addEventListener("keydown", movePlayer); //Listens for a key press that moves the player 
}


//player
let playerWidth = 46;
let playerHeight = 46;
let playerX = boardWidth / 2 - playerWidth / 2;
let playerY = boardHeight*7/8 - playerHeight;
let playerRightImg;

// Physics
let velocityX = 0; 

let player = {
    img: null,
    x : playerX,
    y : playerY,
    width : playerWidth,
    height : playerHeight,
}

function update() {
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height); // Clears the canvas before drawing next frame


    player.x += velocityX; // Updates the player's position if they are moving

    // This teleports the player to the opposite side when they go off screen
    if (player.x > boardWidth) {
        player.x = 0;
    } else if (player.x + player.width < 0) {
        player.x = boardWidth;
    }

    // Draw the player (currently glep smiling friends) over and over again
    context.drawImage(player.img, player.x, player.y, player.width, player.height);
}

function movePlayer(e) {
    if (e.code == "KeyD" || e.code == "ArrowRight") { // If Player presses right buttons
        velocityX = 4; // Note: this is 4 pixels per FRAME
    }
    else if (e.code == "KeyA" || e.code == "ArrowLeft") { // If Player presses left buttons
        velocityX = -4;
    }
}