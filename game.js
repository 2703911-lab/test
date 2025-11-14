const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let timeLeft = 1500; // Default is 25 minutes
let playerHealth = 100;
let currentWeapon = "Aura Pistol";
let isShopOpen = false;
let player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 20,
    color: 'rgba(255, 255, 255, 0.8)',
    glowColor: 'rgba(255, 255, 255, 0.6)',
    glowIntensity: 1
};
let bullets = [];
let balls = [];
let keys = {};

// Main Menu Elements
const mainMenu = document.getElementById('mainMenu');
const easyModeButton = document.getElementById('easyMode');
const hardModeButton = document.getElementById('hardMode');

// Game UI Elements
const gameContainer = document.getElementById('gameContainer');
const ui = document.getElementById('ui');
const scoreElement = document.getElementById('score');
const timeElement = document.getElementById('time');
const shopButton = document.getElementById('shopButton');
const shopElement = document.getElementById('shop');
const buyWeapon1Button = document.getElementById('buyWeapon1');
const buyWeapon2Button = document.getElementById('buyWeapon2');

// Start Game with selected mode
easyModeButton.addEventListener('click', () => startGame('easy'));
hardModeButton.addEventListener('click', () => startGame('hard'));

// Shop button toggle
shopButton.addEventListener('click', () => {
    isShopOpen = !isShopOpen;
    shopElement.classList.toggle('hidden', !isShopOpen);
});

// Weapon purchase logic
buyWeapon1Button.addEventListener('click', () => {
    if (score >= 10000 && currentWeapon !== "Aura Pistol") {
        score -= 10000;
        currentWeapon = "Aura Pistol";
    }
});
buyWeapon2Button.addEventListener('click', () => {
    if (score >= 20000 && currentWeapon !== "God Blaster") {
        score -= 20000;
        currentWeapon = "God Blaster";
    }
});

// Game loop interval
let gameInterval;

function startGame(mode) {
    // Hide the main menu and show the game container
    mainMenu.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    ui.classList.remove('hidden');

    // Set the mode difficulty
    if (mode === 'easy') {
        timeLeft = 1500; // 25 minutes
        player.shootSpeed = 10;
    } else {
        timeLeft = 600; // 10 minutes
        player.shootSpeed = 5;
    }

    // Initialize the game loop
    gameInterval = setInterval(gameLoop, 1000 / 60); // 60 FPS
}

function gameLoop() {
    // Update game state
    updateTime();
    updatePlayer();
    updateBullets();
    updateBalls();

    // Check for collisions
    checkCollisions();

    // Redraw everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBullets();
    drawBalls();
    drawUI();
}

// Player movement
function updatePlayer() {
    if (keys['w'] && player.y > 0) player.y -= 5;
    if (keys['s'] && player.y < canvas.height) player.y += 5;
    if (keys['a'] && player.x > 0) player.x -= 5;
    if (keys['d'] && player.x < canvas.width) player.x += 5;
}

// Bullet shooting
function updateBullets() {
    if (keys[' '] && currentWeapon === "Aura Pistol") {
        bullets.push({
            x: player.x,
            y: player.y,
            radius: 5,
            color: "white",
            speed: 10
        });
    }
}

// Ball creation and movement (flying towards the player)
function updateBalls() {
    if (Math.random() < 0.02) {
        balls.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: 15,
            color: "red",
            speed: Math.random() * 2 + 2
        });
    }

    balls.forEach(ball => {
        const angle = Math.atan2(player.y - ball.y, player.x - ball.x);
        ball.x += Math.cos(angle) * ball.speed;
        ball.y += Math.sin(angle) * ball.speed;
    });
}

// Collision detection between bullets and balls
function checkCollisions() {
    bullets.forEach((bullet, bIndex) => {
        balls.forEach((ball, ballIndex) => {
            const dist = Math.hypot(bullet.x - ball.x, bullet.y - ball.y);
            if (dist < bullet.radius + ball.radius) {
                balls.splice(ballIndex, 1);  // Remove ball
                bullets.splice(bIndex, 1);   // Remove bullet
                score += 100;                // Increase score
            }
        });
    });
}

// Draw the player with glowing effect
function drawPlayer() {
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = player.glowColor;
    ctx.shadowBlur = 20;
    ctx.shadowColor = player.glowColor;
    ctx.fill();
}

// Draw bullets
function drawBullets() {
    bullets.forEach(bullet => {
        bullet.y -= bullet.speed;
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fillStyle = bullet.color;
        ctx.fill();
    });
}

// Draw balls
function drawBalls() {
    balls.forEach(ball => {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
    });
}

// Draw UI (score, time)
function drawUI() {
    scoreElement.textContent = `Score: ${score}`;
    timeElement.textContent = `Time: ${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`;
}

// Update the timer
function updateTime() {
    timeLeft -= 1 / 60;
    if (timeLeft <= 0) {
        clearInterval(gameInterval);
        alert("Game Over! Time's up!");
        window.location.reload();
    }
}

