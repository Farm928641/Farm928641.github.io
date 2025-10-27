let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

window.onload = function() {
    board = this.document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");
}

//player
let playerWidth = 46;
let playerHeight = 46;
let playerX = boardWidth / 2 - playerWidth / 2;
let playerY = boardHeight*7/8 - playerHeight;

let player = {
    img: null,
    x : playerX,
    y : playerY,
    width : playerWidth,
    height : playerHeight,
}

//draw player
context.fillStyle = "green";
context.fillRect(player.x, player.y, player.width, player.height);