let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

window.onload = function() {
    board = this.document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    //draw player
    context.fillStyle = "green";
    context.fillRect(player.x, player.y, player.width, player.height);

    //load player images



    this.requestAnimationFrame(update); 
    this.addEventListener("keydown", movePlayer); //Listens for a key press that moves the player 
}

function update(){
    requestAnimationFrame(update);
    
    
}



//player
let playerWidth = 46;
let playerHeight = 46;
let playerX = boardWidth / 2 - playerWidth / 2;
let playerY = boardHeight*7/8 - playerHeight;

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

    // Draw the player (currently a cube) over and over agin
    context.fillStyle = "green";
    context.fillRect(player.x, player.y, player.width, player.height);
}

function movePlayer(e) {
    if (e.code == "KeyD" || e.code == "ArrowRight") { // If Player presses right buttons
        velocityX = 4; // Note: this is 4 pixels per FRAME
    }
    else if (e.code == "KeyA" || e.code == "ArrowLeft") { // If Player presses left buttons
        velocityX = -4;
    }
}