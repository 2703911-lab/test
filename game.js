const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let timeLeft = 1500;  // 25 minutes in seconds
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

// Game loop interval
let gameInterval = setInterval(gameLoop, 1000 / 60); // 60 FPS

// Set up UI
const scoreElement = document.getElementById('score');
const timeElement = document.getElementById('time');
const shopButton = document.getElementById('shopButton');
const shopElement = document.getElementById('shop');
const buyWeapon1Button = document.getElementById('buyWeapon1');
const buyWeapon2Button = document.getElementById('buyWeapon2');

// Keydown listener
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

// Keyup listener
window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Shop button toggle
shopButton.addEventListener('click', () => {
    isShopOpen = !isShopOpen;
    if (isShopOpen) {
        shopElement.classList.remove('hidden');
    } else {
        shopElement.classList.add('hidden');
    }
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

// Ball creation and movement
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

    balls.forEach((ball, index) => {
        ball.y += ball.speed;
        if (ball.y > canvas.height) {
            balls.splice(index, 1); // Remove ball if it goes off-screen
        }
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
        alert("Game Over! Time's up!");
        window.location.reload();
    }
}
