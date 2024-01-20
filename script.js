"use strict";

const modal = document.querySelector(".modal");
const ContainerEl = document.querySelector(".container");
let playerTxt = document.querySelector(".message");
let restartBtn = document.querySelector("#restartbtn");
let boxes = document.querySelectorAll(".box");
let para = document.querySelector(".content p");
const start = document.querySelector(".start-game");
const startbtn = document.querySelector(".startbtn");
const gameboard = document.getElementById("gameboard");
const player = document.querySelector(".players");
const undo = document.querySelector(".undo");
const undoX = document.getElementById("undoX");
const undoO = document.getElementById("undoO");
var x = document.getElementById("x");
var o = document.getElementById("o");

var c1 = 0;
var c2 = 0;
var games_palyed = 0;
var total_games = 0;
var stack = [];

const O_TXT = "O";
const X_TXT = "X";

let currentPlayer = X_TXT;
var spaces = Array(9).fill(null);

let winnerindicator = getComputedStyle(document.body).getPropertyValue('--dark-color');

var player1 = "";
var player2 = "";

startbtn.addEventListener("click", function () {
    player1 = document.querySelector("#player1").value;
    player2 = document.querySelector("#player2").value;
    total_games = document.querySelector("#numberofgames").value;

    if (player1 == "" || player2 == "") {
        alert("Please enter your name");
    } else {
        document.querySelector("#player1").innerHTML = player1;
        document.querySelector("#player2").innerHTML = player2;
    }

    if (total_games > 0) {
        start.style.display = "none";
        gameboard.style.display = "flex";
        player.style.display = "flex";
    } else if (total_games === "") {
        alert("Please enter number of games");
    } else if (total_games <= 0) {
        alert("Tu thoda sa....ganda hai kya!");
    }

    player.innerHTML = `<div class="p1">
                        <h1>${player1}</h1>
                        <h2>${c1}</h2>
                    </div>
                    <div class="p2">
                        <h1>${player2}</h1>
                        <h2>${c2}</h2>
                    </div>`;
});

const startGame = () => {
    boxes.forEach((boxs) => boxs.addEventListener("click", boxClicked));
};

function boxClicked(e) {
    const id = e.target.id;

    if (spaces[id] == null) {
        if (!playerHasWon()) {
            spaces[id] = currentPlayer;
            e.target.innerText = currentPlayer;
            stack.push(id);
        }

        if (playerHasWon() != false) {
            winnerindicator = playerHasWon();
            winnerindicator.map((box) => (boxes[box].style.backgroundColor = "#f5f5f5"));

            if (currentPlayer == 'X') c1++;
            else if (currentPlayer == 'O') c2++;

            modal.classList.remove('modal');
            modal.classList.add('success');
            player.innerHTML = `<div class="p1">
                                <h1>${player1}</h1>
                                <h2>${c1}</h2>
                            </div>
                            <div class="p2">
                                <h1>${player2}</h1>
                                <h2>${c2}</h2>
                            </div>`;
        }

        if (Draw() == true) {
            playerTxt.innerHTML = `<h2 class="message">Draw !</h2>`;
            para.innerText = "No one wins";
            modal.classList.remove('modal');
            modal.classList.add('success');
            Draw() = false;
        }

        if (playerHasWon() || Draw()) {
            games_palyed++;
            console.log("Games Played: ", games_palyed, "of", total_games);

            if (games_palyed == total_games) {
                if (c1 > c2) {
                    playerTxt.innerHTML = `<h2 class="message">Congratulations ${player1}</h2>`;
                    para.innerText = `You won the game ;) `;
                } else if (c1 < c2) {
                    playerTxt.innerHTML = `<h2 class="message">Congratulations ${player2}</h2>`;
                    para.innerText = `You won the game ;) `;
                } else {
                    playerTxt.innerHTML = `<h2 class="message">Draw !</h2>`;
                    para.innerText = "No one wins";
                }

                modal.classList.remove('modal');
                modal.classList.add('success');
                ContainerEl.classList.remove('success');
                restartBtn.innerText = "Play Again";
            }
        }

        currentPlayer = currentPlayer === X_TXT ? O_TXT : X_TXT;
        if (playerHasWon()) currentPlayer = null;
    } else {
        alert("Cell already taken by " + spaces[id]);
    }
}

const winningCombos = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 4, 6],
    [2, 5, 8],
    [3, 4, 5],
    [6, 7, 8]
];

function playerHasWon() {
    for (let condition of winningCombos) {
        let [a, b, c] = condition;

        if (spaces[a] && spaces[a] === spaces[b] && spaces[a] === spaces[c]) {
            return [a, b, c];
        }
    }
    return false;
}

function Draw() {
    for (var i = 0; i < 9; i++) {
        if (spaces[i] == null) {
            return false;
        }
    }
    if (playerHasWon() == false) {
        return true;
    }
    return false;
}

undo.style.display = 'none';

undo.addEventListener('click', function () {
    if (stack.length > 0) {
        if (currentPlayer === 'X') {
            var delid = stack.pop();
            spaces[delid] = null;
            currentPlayer = 'O';
            undoX.style.display = "none";
            x.className = "fa-rotate-left";
        } else {
            var delid = stack.pop();
            document.getElementById(delid).innerHTML = "";
            spaces[delid] = null;
            currentPlayer = 'X';
            undoO.style.display = "none";
            o.className = "fa-rotate-left";
        }
    }
});

restartbtn.addEventListener("click", restartGame);

function restartGame() {
    if (games_palyed - total_games == 0) {
        window.location.reload();
        return;
    }

    spaces.fill(null);

    boxes.forEach((box) => {
        box.innerHTML = "";
        box.style.backgroundColor = "";
    });

    currentPlayer = X_TXT;
    modal.classList.remove('success');
    modal.classList.add('modal');
    ContainerEl.classList.remove('success');
}

startGame();
