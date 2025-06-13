'use strict';

let SimonGame = {
  gameMoves: [],
  playerMoves: [],

  playerTurn: false,

  gameScore: 0,

  flashSpeed: 600,
  turnDelay: 500,

  buttons: {
    1: document.getElementById('button1'),
    2: document.getElementById('button2'),
    3: document.getElementById('button3'),
    4: document.getElementById('button4'),
  },
};

// Attach click listener to each game button
Object.entries(SimonGame.buttons).forEach(([buttonIndex, buttonValue]) => {
  buttonValue.addEventListener('click', () => playerTurnMoves(Number(buttonIndex)));
});

// Attach click listener to the “New Game” button
document.querySelector('.button').addEventListener('click', newGame);

/** Reset game state and start the first round. */
function newGame() {
  // Resetting moves, score and player turn
  SimonGame.gameMoves = [];
  SimonGame.playerMoves = [];
  SimonGame.gameScore = 0;

  SimonGame.playerTurn = false;

  // Updating score
  document.getElementById('score').textContent = SimonGame.gameScore;

  // Starting a new round
  nextRound();
}

/** Add one random move, play the full sequence, then allow the player to click. */
function nextRound() {
  // Add a random number between 1 and 4 to the game sequence
  const nextMove = Math.floor(Math.random() * 4) + 1;
  SimonGame.gameMoves.push(nextMove);

  // Setting player turn to false
  SimonGame.playerTurn = false;

  // Playing the flash on all game moves
  SimonGame.gameMoves.forEach((move, i) => {
    setTimeout(() => {
      const gameButtonClick = SimonGame.buttons[move];
      gameButtonClick.classList.add('light');
      setTimeout(() => gameButtonClick.classList.remove('light'), SimonGame.flashSpeed / 2);
    }, i * SimonGame.flashSpeed);
  });

  // After the last flash, enable player input and reset their moves
  const totalGameTime = SimonGame.gameMoves.length * SimonGame.flashSpeed;
  setTimeout(() => {
    SimonGame.playerTurn = true;
    SimonGame.playerMoves = [];
  }, totalGameTime + SimonGame.turnDelay);
}

/** Handle the player's click: flash button, save move, check for wrong or next round. */
function playerTurnMoves(move) {
  if (!SimonGame.playerTurn) return;

  // Flashing the player's click move
  const playerButtonClick = SimonGame.buttons[move];
  playerButtonClick.classList.add('light');
  setTimeout(() => playerButtonClick.classList.remove('light'), SimonGame.flashSpeed / 2);

  // Saving the player's move
  SimonGame.playerMoves.push(move);
  const i = SimonGame.playerMoves.length - 1;

  // Checking if the player's move matches the game's move
  if (SimonGame.playerMoves[i] !== SimonGame.gameMoves[i]) {
    alert('Wrong move! Starting over.');
    newGame();
    return;
  }

  // Go to next round if the player guess the right move
  if (SimonGame.playerMoves.length === SimonGame.gameMoves.length) {
    SimonGame.gameScore++;
    document.getElementById('score').textContent = SimonGame.gameScore;
    setTimeout(nextRound, SimonGame.flashSpeed + SimonGame.turnDelay);
  }
}
