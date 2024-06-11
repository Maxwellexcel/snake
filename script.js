const gameArea = document.getElementById('gameArea');
const startButton = document.getElementById('startButton');
const currentScoreElement = document.getElementById('currentScore');
const highScoreElement = document.getElementById('highScore');
const messageElement = document.getElementById('message');

let snake = [{x: 10, y: 10}];
let food = {x: 5, y: 5};
let dx = 0;
let dy = 0;
let interval;
let gameActive = false;
let currentScore = 0;
let highScore = 0;

// Display demo on page load
window.onload = displayDemo;

function displayDemo() {
    gameArea.innerHTML = '';
    // Display demo snake
    const demoSnake = [{x: 10, y: 10}, {x: 9, y: 10}, {x: 8, y: 10}];
    demoSnake.forEach(segment => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = segment.y;
        snakeElement.style.gridColumnStart = segment.x;
        snakeElement.classList.add('demo-snake');
        gameArea.appendChild(snakeElement);
    });
    // Display demo food
    const demoFood = {x: 5, y: 5};
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = demoFood.y;
    foodElement.style.gridColumnStart = demoFood.x;
    foodElement.classList.add('demo-food');
    gameArea.appendChild(foodElement);
}

function startGame() {
    if (!gameActive) {
        gameActive = true;
        snake = [{x: 10, y: 10}];
        dx = 1;
        dy = 0;
        food = getRandomFoodPosition();
        currentScore = 0;
        currentScoreElement.textContent = currentScore;
        messageElement.textContent = '';
        clearInterval(interval);
        interval = setInterval(updateGame, 100);
    }
}

function updateGame() {
    clearCanvas();
    moveSnake();
    drawSnake();
    drawFood();
    checkCollision();
}

function clearCanvas() {
    gameArea.innerHTML = '';
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        food = getRandomFoodPosition();
        currentScore++;
        currentScoreElement.textContent = currentScore;
        if (currentScore > highScore) {
            highScore = currentScore;
            highScoreElement.textContent = highScore;
        }
    } else {
        snake.pop();
    }
}

function drawSnake() {
    snake.forEach(segment => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = segment.y;
        snakeElement.style.gridColumnStart = segment.x;
        snakeElement.classList.add('snake');
        gameArea.appendChild(snakeElement);
    });
}

function drawFood() {
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    gameArea.appendChild(foodElement);
}

function getRandomFoodPosition() {
    let newFoodPosition;
    while (newFoodPosition == null || snake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y)) {
        newFoodPosition = {
            x: Math.floor(Math.random() * 20) + 1,
            y: Math.floor(Math.random() * 20) + 1
        };
    }
    return newFoodPosition;
}

function checkCollision() {
    if (
        snake[0].x < 1 || 
        snake[0].x > 20 || 
        snake[0].y < 1 || 
        snake[0].y > 20 || 
        snake.slice(1).some(segment => segment.x === snake[0].x && segment.y === snake[0].y)
    ) {
        endGame();
    }
}

function endGame() {
    clearInterval(interval);
    gameActive = false;
    messageElement.textContent = 'Game Over! Your score: ' + currentScore;
}

document.addEventListener('keydown', changeDirection);
function changeDirection(event) {
    const keyPressed = event.keyCode;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (keyPressed === 37 && !goingRight) { // left arrow key
        dx = -1;
        dy = 0;
    }

    if (keyPressed === 38 && !goingDown) { // up arrow key
        dx = 0;
        dy = -1;
    }

    if (keyPressed === 39 && !goingLeft) { // right arrow key
        dx = 1;
        dy = 0;
    }

    if (keyPressed === 40 && !goingUp) { // down arrow key
        dx = 0;
        dy = 1;
    }
}

// Touch controls
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', handleTouchStart);
document.addEventListener('touchmove', handleTouchMove);

function handleTouchStart(event) {
    const firstTouch = event.touches[0];
    touchStartX = firstTouch.clientX;
    touchStartY = firstTouch.clientY;
}

function handleTouchMove(event) {
    if (!gameActive) return;
    if (event.touches.length > 1) return;

    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;

    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0 && dx !== -1) {
            dx = 1;
            dy = 0;
        } else if (diffX < 0 && dx !== 1) {
            dx = -1;
            dy = 0;
        }
    } else {
        if (diffY > 0 && dy !== -1) {
            dx = 0;
            dy = 1;
        } else if (diffY < 0 && dy !== 1) {
            dx = 0;
            dy = -1;
        }
    }
}

startButton.addEventListener('click', startGame);
