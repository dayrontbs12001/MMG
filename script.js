const gameBoard = document.querySelector('.game-board');
const scoreElement = document.getElementById('score');
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let score = 1000;
let playerName = '';
let timerInterval;
let elapsedTime = 0;

const difficulties = {
  easy: ['😀', '😀', '🚀', '🚀', '🍕', '🍕', '🐱', '🐱'],
  medium: ['😀', '😀', '🚀', '🚀', '🍕', '🍕', '🐱', '🐱', '🌕', '🌕', '🌟', '🌟'],
  hard: ['😀', '😀', '🚀', '🚀', '🍕', '🍕', '🐱', '🐱', '🌕', '🌕', '🌟', '🌟', '🌈', '🌈', '❤️', '❤️'],
};

const maxTimes = {
  easy: 60, // e.g., 60 seconds for easy mode
  medium: 90, // 90 seconds for medium
  hard: 120, // 120 seconds for hard
};

function calculateTimeBonus() {
  const difficulty = document.getElementById('difficulty').value;
  const maxTime = maxTimes[difficulty];

  if (elapsedTime < maxTime) {
    // Let's say, for each second saved, the player gets 5 bonus points
    const bonus = (maxTime - elapsedTime) * 5;
    updateScore(bonus);
  }
}

function startTimer() {
  // Reset timer
  elapsedTime = 0;
  document.getElementById('timer').textContent = 'Time: 0s';

  // Start interval to update the timer every second
  timerInterval = setInterval(function () {
    elapsedTime++;
    document.getElementById('timer').textContent = `Time: ${elapsedTime}s`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function setPlayerName() {
  playerName = document.getElementById('playerName').value;
  if (playerName) {
    document.getElementById('displayName').textContent = `Player: ${playerName}`;
  } else {
    alert('Please enter a valid name!');
  }
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
}

function updateScore(points) {
  score += points;
  scoreElement.textContent = 'Score: ' + score;
}

function initGame() {
  shuffle(cards);
  cards.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');

    const frontFace = document.createElement('div');
    frontFace.classList.add('card-face', 'front');
    cardElement.appendChild(frontFace);

    const backFace = document.createElement('div');
    backFace.classList.add('card-face', 'back');
    backFace.dataset.value = card;
    backFace.textContent = card;
    cardElement.appendChild(backFace);

    cardElement.addEventListener('click', handleCardClick);
    gameBoard.appendChild(cardElement);
  });
}

function handleCardClick(event) {
  const target = event.currentTarget;
  if (flippedCards.length < 2 && !target.classList.contains('flipped')) {
    target.classList.add('flipped');
    updateScore(-10); // Deducting 10 points for every flip
    flippedCards.push(target);
    if (flippedCards.length === 2) {
      setTimeout(checkMatch, 1000);
    }
  }
}

function checkMatch() {
  if (flippedCards[0].querySelector('.back').dataset.value === flippedCards[1].querySelector('.back').dataset.value) {
    matchedPairs++;
    updateScore(50);

    if (matchedPairs === cards.length / 2) {
      stopTimer();
      calculateTimeBonus(); // Calculate the bonus points before showing the final score
      alert(`${playerName}, you won! Your score is: ${score}. Time taken: ${elapsedTime}s`);
    }
  } else {
    flippedCards[0].classList.remove('flipped');
    flippedCards[1].classList.remove('flipped');
  }
  flippedCards.length = 0;
}

function resetGame() {
  const isConfirmed = confirm('Are you sure you want to reset the game?');
  if (isConfirmed) {
    // Stop the timer when the game is reset
    stopTimer();
    startGame();
  }
}

function startGame() {
  // Reset game parameters
  flippedCards.length = 0;
  matchedPairs = 0;
  score = 1000;
  updateScore(0);

  // Clear current game board
  while (gameBoard.firstChild) {
    gameBoard.removeChild(gameBoard.lastChild);
  }

  // Set the difficulty and initialize game
  const difficulty = document.getElementById('difficulty').value;
  cards = difficulties[difficulty];
  initGame();

  // Start the timer when the game starts
  startTimer();
}
