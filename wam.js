let currMoleTile;
let currAllyTile;
let score = 0;
let gameOver = true;
let timer;
let timeLeft = 60; // 60-second timer

window.onload = function () {
    setGame();
    
   
    const startButton = document.getElementById("startButton");
    if (startButton) {
        startButton.addEventListener("click", startGame);
    }
}

function startGame() {
    if (gameOver) {
        gameOver = false;
        setGame();
        startTimer();
    }
}

function startTimer() {
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            document.getElementById("timer").innerText = "Time Left: " + timeLeft.toString() + "s";
        } else {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearInterval(timer);
    document.getElementById("score").innerText = "GAME OVER: " + score.toString();
    gameOver = true;
}

function setGame() {
    document.getElementById("board").innerHTML = '';
    score = 0;
    timeLeft = 60;
    document.getElementById("score").innerText = score.toString();
    document.getElementById("timer").innerText = "Time Left: " + timeLeft.toString() + "s";

    for (let i = 0; i < 9; i++) {
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.addEventListener("click", selectTile);
        document.getElementById("board").appendChild(tile);
    }

    setInterval(setMole, 2500);
    setInterval(setAlly, 1500);
}

function selectTile(event) {
    if (gameOver) {
        return;
    }

    if (this == currMoleTile) {
        score += 10;
        document.getElementById("score").innerText = score.toString();
        currMoleTile.innerHTML = "";
        currMoleTile = null;
    } else if (this == currAllyTile) {
        clearInterval(timer); 
        endGame(); 
    }
}


function getRandomTile() {
    let num = Math.floor(Math.random() * 9);
    return num.toString();
}

function setMole() {
    if (gameOver) {
        return;
    }

    if (currMoleTile) {
        currMoleTile.innerHTML = "";
    }

    let mole = document.createElement("img");
    mole.src = "https://pngfre.com/wp-content/uploads/Joker-9.png";

    let num = getRandomTile();
    if (currAllyTile && currAllyTile.id == num) {
        return;
    }

    currMoleTile = document.getElementById(num);
    currMoleTile.appendChild(mole);
}

function setAlly() {
    if (gameOver) {
        return;
    }

    if (currAllyTile) {
        currAllyTile.innerHTML = "";
    }

    let ally = document.createElement("img");
    ally.src = "https://cdn0.iconfinder.com/data/icons/faces-set-01/64/superhero-catwoman-african-black-costume-512.png";

    let num = getRandomTile();
    if (currMoleTile && currMoleTile.id == num) {
        return;
    }

    currAllyTile = document.getElementById(num);
    currAllyTile.appendChild(ally);
}