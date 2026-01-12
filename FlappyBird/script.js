const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

let bird = {
    x: 50,
    y: 300,
    width: 34,
    height: 24,
    velocity: 0,
    gravity: 0.15,
    jump: -4.0,
    rotation: 0
};

let pipes = [];
let score = 0;
let gameRunning = false;
let gameOver = false;

function drawBird() {
    // Calculate rotation based on velocity
    let rotation = Math.min(Math.max(bird.velocity * 3, -25), 90) * Math.PI / 180;
    
    ctx.save();
    ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
    ctx.rotate(rotation);
    
    // Bird body
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();
    
    // Bird wing
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.ellipse(-2, 0, 8, 5, Math.sin(Date.now() / 100) * 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // Bird eye white
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(6, -3, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Bird eye pupil
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(7, -3, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Bird beak
    ctx.fillStyle = '#FF8C00';
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(16, -2);
    ctx.lineTo(16, 2);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
}

function drawPipes() {
    pipes.forEach(pipe => {
        // Top pipe
        let gradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipe.width, 0);
        gradient.addColorStop(0, '#3ab54a');
        gradient.addColorStop(0.5, '#4ddb5e');
        gradient.addColorStop(1, '#3ab54a');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
        
        // Top pipe cap
        ctx.fillRect(pipe.x - 3, pipe.topHeight - 30, pipe.width + 6, 30);
        
        // Bottom pipe
        ctx.fillStyle = gradient;
        ctx.fillRect(pipe.x, canvas.height - pipe.bottomHeight, pipe.width, pipe.bottomHeight);
        
        // Bottom pipe cap
        ctx.fillRect(pipe.x - 3, canvas.height - pipe.bottomHeight, pipe.width + 6, 30);
        
        // Pipe borders
        ctx.strokeStyle = '#2d8a3a';
        ctx.lineWidth = 2;
        ctx.strokeRect(pipe.x, 0, pipe.width, pipe.topHeight);
        ctx.strokeRect(pipe.x - 3, pipe.topHeight - 30, pipe.width + 6, 30);
        ctx.strokeRect(pipe.x, canvas.height - pipe.bottomHeight, pipe.width, pipe.bottomHeight);
        ctx.strokeRect(pipe.x - 3, canvas.height - pipe.bottomHeight, pipe.width + 6, 30);
    });
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
}

function updatePipes() {
    pipes.forEach(pipe => {
        pipe.x -= 2;
    });

    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        let topHeight = Math.random() * (canvas.height - 200) + 50;
        let bottomHeight = canvas.height - topHeight - 150;
        pipes.push({
            x: canvas.width,
            width: 52,
            topHeight: topHeight,
            bottomHeight: bottomHeight
        });
    }
}

function checkCollision() {
    if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
        return true;
    }

    for (let pipe of pipes) {
        if (bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.topHeight || bird.y + bird.height > canvas.height - pipe.bottomHeight)) {
            return true;
        }
    }

    return false;
}

function updateScore() {
    pipes.forEach(pipe => {
        if (!pipe.passed && pipe.x + pipe.width < bird.x) {
            pipe.passed = true;
            score++;
            scoreElement.textContent = `Score: ${score}`;
        }
    });
}

function drawBackground() {
    // Sky gradient
    let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#4ec0ca');
    gradient.addColorStop(1, '#87ceeb');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    let cloudOffset = (Date.now() / 50) % (canvas.width + 100);
    
    for (let i = 0; i < 3; i++) {
        let x = (i * 200 - cloudOffset) % (canvas.width + 100);
        let y = 50 + i * 60;
        
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.arc(x + 20, y - 5, 25, 0, Math.PI * 2);
        ctx.arc(x + 40, y, 20, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Ground
    ctx.fillStyle = '#ded895';
    ctx.fillRect(0, canvas.height - 60, canvas.width, 60);
    
    // Ground detail
    ctx.fillStyle = '#c9bc6d';
    for (let i = 0; i < canvas.width; i += 20) {
        ctx.fillRect(i, canvas.height - 60, 10, 5);
    }
}

function draw() {
    drawBackground();
    drawPipes();
    drawBird();
}

function gameLoop() {
    if (!gameRunning || gameOver) return;

    updateBird();
    updatePipes();
    updateScore();

    if (checkCollision()) {
        gameOver = true;
        gameOverScreen.style.display = 'block';
        finalScoreElement.textContent = `Score: ${score}`;
        return;
    }

    draw();
    requestAnimationFrame(gameLoop);
}

function jump() {
    if (!gameRunning) {
        startGame();
    } else if (!gameOver) {
        bird.velocity = bird.jump;
    }
}

function startGame() {
    gameRunning = true;
    gameOver = false;
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    bird.y = 300;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    scoreElement.textContent = 'Score: 0';
    gameLoop();
}

function restartGame() {
    startGame();
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        jump();
    }
});

canvas.addEventListener('click', jump);
restartBtn.addEventListener('click', restartGame);