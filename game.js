// Get the canvas and its context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = 900;
canvas.height = 500;

// Define the gecko (player)
const gecko = {
    x: 50,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    color: "green",
    velocityY: 0,
    gravity: 0.5,
    jumpPower: -10,
    isJumping: false
};

// Define obstacles
const obstacles = [];
const obstacleWidth = 20;
const obstacleHeight = 40;
const obstacleSpeed = 4;

// Score
let score = 0;
let gameOver = false;

// Audio elements
const backgroundMusic = document.getElementById("backgroundMusic");
const jumpSound = document.getElementById("jumpSound");
const collisionSound = document.getElementById("collisionSound");

// Mute button
const muteButton = document.getElementById("muteButton");
let isMuted = false;

// Create a stylish restart button
const restartButton = document.createElement("button");
restartButton.innerText = "Restart Game";
restartButton.style.position = "absolute";
restartButton.style.top = "65%";
restartButton.style.left = "50%";
restartButton.style.transform = "translate(-50%, -50%)";
restartButton.style.padding = "15px 30px";
restartButton.style.fontSize = "22px";
restartButton.style.fontWeight = "bold";
restartButton.style.color = "white";
restartButton.style.background = "linear-gradient(135deg, #ff416c, #ff4b2b)";
restartButton.style.border = "none";
restartButton.style.borderRadius = "30px";
restartButton.style.cursor = "pointer";
restartButton.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.3)";
restartButton.style.transition = "0.3s";
restartButton.style.display = "none"; // Hidden until game over
document.body.appendChild(restartButton);

// Hover effect
restartButton.addEventListener("mouseover", function () {
    restartButton.style.background = "linear-gradient(135deg, #ff4b2b, #ff416c)";
    restartButton.style.boxShadow = "0px 6px 12px rgba(0, 0, 0, 0.4)";
});
restartButton.addEventListener("mouseout", function () {
    restartButton.style.background = "linear-gradient(135deg, #ff416c, #ff4b2b)";
    restartButton.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.3)";
});

// Handle jumping
document.addEventListener("keydown", function (event) {
    if (event.code === "Space") {
        gecko.velocityY = gecko.jumpPower;
        gecko.isJumping = true;
        jumpSound.play(); // Play jump sound
    }
});

// Restart game when button is clicked
restartButton.addEventListener("click", function () {
    restartGame();
});

// Mute button functionality
muteButton.addEventListener("click", function () {
    isMuted = !isMuted;
    backgroundMusic.muted = isMuted;
    jumpSound.muted = isMuted;
    collisionSound.muted = isMuted;
    muteButton.innerText = isMuted ? "Unmute" : "Mute";
});

// Update game state
function update() {
    if (gameOver) return;

    // Apply gravity
    gecko.velocityY += gecko.gravity;
    gecko.y += gecko.velocityY;

    // Prevent falling below the ground
    if (gecko.y >= canvas.height - gecko.height) {
        gecko.y = canvas.height - gecko.height;
        gecko.isJumping = false;
    }

    // Move obstacles
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= obstacleSpeed;

        // Check collision
        if (
            gecko.x < obstacles[i].x + obstacleWidth &&
            gecko.x + gecko.width > obstacles[i].x &&
            gecko.y < obstacles[i].y + obstacleHeight &&
            gecko.y + gecko.height > obstacles[i].y
        ) {
            gameOver = true;
            restartButton.style.display = "block"; // Show restart button
            collisionSound.play(); // Play collision sound
            backgroundMusic.pause(); // Pause background music
        }
    }

    // Remove off-screen obstacles
    if (obstacles.length > 0 && obstacles[0].x + obstacleWidth < 0) {
        obstacles.shift();
        score++;
    }

    // Spawn new obstacles
    if (Math.random() < 0.02) {
        obstacles.push({
            x: canvas.width,
            y: canvas.height - obstacleHeight,
            width: obstacleWidth,
            height: obstacleHeight,
            color: "red"
        });
    }
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw gecko
    ctx.fillStyle = gecko.color;
    ctx.fillRect(gecko.x, gecko.y, gecko.width, gecko.height);

    // Draw obstacles
    ctx.fillStyle = "red";
    for (let i = 0; i < obstacles.length; i++) {
        ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacleWidth, obstacleHeight);
    }

    // Draw score
    ctx.fillStyle = "white";
    ctx.font = "bold 32px Arial";
    ctx.fillText("Score: " + score, 10, 30);

    // Draw game over message
    if (gameOver) {
        ctx.fillStyle = "orange";
        ctx.font = "bold 48px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.shadowColor = "black";
        ctx.shadowBlur = 10;

        ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 40);
        ctx.fillText("Click Restart to Play Again", canvas.width / 2, canvas.height / 2 + 10);

        ctx.shadowBlur = 0;
    }
}

// Restart game function
function restartGame() {
    // Reset game state
    gameOver = false;
    score = 0;
    gecko.x = 50;
    gecko.y = canvas.height - 50;
    gecko.velocityY = 0;
    obstacles.length = 0; // Clear obstacles

    restartButton.style.display = "none"; // Hide restart button

    backgroundMusic.play(); // Restart background music
    gameLoop(); // Restart game loop
}

// Game loop
function gameLoop() {
    update();
    draw();
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

// Start the game and music
backgroundMusic.play();
gameLoop();