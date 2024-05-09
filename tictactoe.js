var board;
var playerX = "X";
var playerO = "O";
var currtplayer = playerX;
var gameOver = false;

window.onload = function() {
    setGame();
    document.getElementById("restartButton").addEventListener("click", restartGame);
    document.getElementById("darkModeToggle").addEventListener("click", toggleDarkMode);
}

function setGame(){
    board = [
        [' ', ' ', ' '],
        [' ', ' ', ' '],
        [' ', ' ', ' ']
    ]
    //r is row c is column
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            if (r == 0 || r == 1) {
                tile.classList.add("hr-line");
            }
            if (c == 0 || c == 1) {
                tile.classList.add("vr-line");
            }
            tile.addEventListener("click", setTile);
            document.getElementById("board").appendChild(tile);
        }
    }
} 

function setTile() {
    if (gameOver) {
        return;
    }

    let coords = this.id.split("-");    //ex) "1-2" -> ["1", "2'"]
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
     
    if (board[r][c] != ' '){
        return;
    }

    board[r][c] = currtplayer;
    this.innerText = currtplayer;

    checkWinner();
    if(!gameOver){
        if(currtplayer == playerX){
            currtplayer = playerO;
        }
        else {
            currtplayer = playerX;
        }
        setTimeout(computerMove, 500);
    }
}

function checkWinner() {
    if (checkWin(playerX)) {
        displayResult("winner");
        gameOver = true;
    } else if (checkWin(playerO)) {
        displayResult("loser");
        gameOver = true;
    } else if (isDraw()) {
        displayResult("draw");
        gameOver = true;
    }
}
    
function isDraw() {
    // Check if the game board is full (no empty spaces)
    for (let row of board) {
        if (row.includes(' ')) {
            return false;
        }
    }
    return true;
}
function checkWin(player) {
    // Check rows, columns, and diagonals for a winning combination
    for (let i = 0; i < 3; i++) {
        if (
            (board[i][0] == player && board[i][1] == player && board[i][2] == player) || // Rows
            (board[0][i] == player && board[1][i] == player && board[2][i] == player) || // Columns
            (board[0][0] == player && board[1][1] == player && board[2][2] == player) || // Diagonal \
            (board[0][2] == player && board[1][1] == player && board[2][0] == player) ||   // Diagonal /
            (board[2][0] == player && board[1][1] == player && board[0][2] == player)
        ) {
            markWinningTiles(player);
            return true;
        }
    }
    return false;
}

function markWinningTiles(player) {
    // Check rows for winning combination
    for (let r = 0; r < 3; r++) {
        if (board[r][0] == player && board[r][1] == player && board[r][2] == player) {
            for (let c = 0; c < 3; c++) {
                let tile = document.getElementById(r.toString() + "-" + c.toString());
                tile.classList.add("winner");
            }
            return;
        }
    }

    // Check columns for winning combination
    for (let c = 0; c < 3; c++) {
        if (board[0][c] == player && board[1][c] == player && board[2][c] == player) {
            for (let r = 0; r < 3; r++) {
                let tile = document.getElementById(r.toString() + "-" + c.toString());
                tile.classList.add("winner");
            }
            return;
        }
    }

    // Check diagonal \
    if (board[0][0] == player && board[1][1] == player && board[2][2] == player) {
        for (let i = 0; i < 3; i++) {
            let tile = document.getElementById(i.toString() + "-" + i.toString());
            tile.classList.add("winner");
        }
        return;
    }

    // Check diagonal /
    if (board[0][2] == player && board[1][1] == player && board[2][0] == player) {
        let row = 0;
        let col = 2;
        for (let i = 0; i < 3; i++) {
            let tile = document.getElementById(row.toString() + "-" + col.toString());
            tile.classList.add("winner");
            row++;
            col--;
        }
        return;
    }
}

function displayResult(result) {
    // Display the result message
    let resultMessage = document.getElementById("result");
    if (result === "winner") {
        resultMessage.innerText = "Congratulations! You've won against the computer.";
    } else if (result === "loser") {
        resultMessage.innerText = "Oops! You've lost against the computer.";
    } else if (result === "draw") {
        resultMessage.innerText = "It's a draw!";
    }
    resultMessage.style.display = "block";

    // Disable further moves
    gameOver = true;
}

function computerMove() {
    // Check for potential winning moves for the computer
    let computerWinningMove = findWinningMove(playerX);
    if (computerWinningMove) {
        makeMove(computerWinningMove);
        return;
    }

    // Check for potential winning moves for the player and block them
    let playerWinningMove = findWinningMove(playerO);
    if (playerWinningMove) {
        makeMove(playerWinningMove);
        return;
    }

    // If no winning moves, make a random move
    makeRandomMove();
}

function findWinningMove(player) {
    // Check rows for potential winning moves
    for (let r = 0; r < 3; r++) {
        if (board[r][0] == player && board[r][1] == player && board[r][2] == ' ') {
            return [r, 2];
        }
        if (board[r][1] == player && board[r][2] == player && board[r][0] == ' ') {
            return [r, 0];
        }
        if (board[r][0] == player && board[r][2] == player && board[r][1] == ' ') {
            return [r, 1];
        }
    }

    // Check columns for potential winning moves
    for (let c = 0; c < 3; c++) {
        if (board[0][c] == player && board[1][c] == player && board[2][c] == ' ') {
            return [2, c];
        }
        if (board[1][c] == player && board[2][c] == player && board[0][c] == ' ') {
            return [0, c];
        }
        if (board[0][c] == player && board[2][c] == player && board[1][c] == ' ') {
            return [1, c];
        }
    }

    // Check diagonals for potential winning moves
    if (board[0][0] == player && board[1][1] == player && board[2][2] == ' ') {
        return [2, 2];
    }
    if (board[1][1] == player && board[2][2] == player && board[0][0] == ' ') {
        return [0, 0];
    }
    if (board[0][0] == player && board[2][2] == player && board[1][1] == ' ') {
        return [1, 1];
    }
    if (board[0][2] == player && board[1][1] == player && board[2][0] == ' ') {
        return [2, 0];
    }
    if (board[1][1] == player && board[2][0] == player && board[0][2] == ' ') {
        return [0, 2];
    }
    if (board[0][2] == player && board[2][0] == player && board[1][1] == ' ') {
        return [1, 1];
    }

    return null;
}

function makeMove(move) {
    let [r, c] = move;
    board[r][c] = playerO;
    let tile = document.getElementById(r.toString() + "-" + c.toString());
    tile.innerText = playerO;
    checkWinner();
    if (!gameOver) {
        currtplayer = playerX;
    }
}

function makeRandomMove() {
    // Randomly select an empty tile
    let emptyTiles = [];
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            if (board[r][c] == ' ') {
                emptyTiles.push([r, c]);
            }
        }
    }
    // Randomly choose an empty tile
    let randomIndex = Math.floor(Math.random() * emptyTiles.length);
    let [r, c] = emptyTiles[randomIndex];

    // Mark the board
    board[r][c] = playerO;
    let tile = document.getElementById(r.toString() + "-" + c.toString());
    tile.innerText = playerO;

    // Check for winner
    checkWinner();
    if (!gameOver) {
        currtplayer = playerX;
    }
}

function restartGame() {
    // Clear the game board and result message
    clearGame();
    
    // Reset game state
    gameOver = false;
    currtplayer = playerX;
}

function clearGame() {
    // Clear the board array
    board = [
        [' ', ' ', ' '],
        [' ', ' ', ' '],
        [' ', ' ', ' ']
    ];

    // Clear the visual board and result message
    let tiles = document.getElementsByClassName("tile");
    for (let tile of tiles) {
        tile.innerText = '';
        tile.classList.remove("winner");
    }

    let resultMessage = document.getElementById("result");
    resultMessage.innerText = '';
    resultMessage.style.display = "none";
}
// Toggle dark mode function
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}