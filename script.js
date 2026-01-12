// Basic page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Game elements
    const playFlappyBtn = document.getElementById('play-flappy-bird');
    const playChickenBtn = document.getElementById('play-chicken-run');
    const playFlappyLegacyBtn = document.getElementById('play-flappy-legacy');
    const playHomoSapiensBtn = document.getElementById('play-homo-sapiens');
    const welcomeMessage = document.getElementById('welcome-message');
    const flappyBirdGame = document.getElementById('flappy-bird');
    const chickenRunGame = document.getElementById('chicken-run');
    const flappyLegacyGame = document.getElementById('flappy-legacy');
    const homoSapiensGame = document.getElementById('homo-sapiens');
    const header = document.querySelector('header');
    const allGames = document.querySelectorAll('.game');

    // Flappy Bird play button
    playFlappyBtn.addEventListener('click', function() {
        openFullscreenGame(flappyBirdGame);
    });

    // Chicken Run play button
    playChickenBtn.addEventListener('click', function() {
        openFullscreenGame(chickenRunGame);
    });

    // Flappy Legacy play button
    playFlappyLegacyBtn.addEventListener('click', function() {
        openFullscreenGame(flappyLegacyGame);
    });

    // Homo Sapiens play button
    playHomoSapiensBtn.addEventListener('click', function() {
        openFullscreenGame(homoSapiensGame);
    });

    function openFullscreenGame(gameElement) {
        // Hide welcome message and header
        welcomeMessage.classList.add('hidden');
        header.style.display = 'none';

        // Hide all games
        allGames.forEach(game => game.classList.add('hidden'));

        // Show selected game in fullscreen
        gameElement.classList.remove('hidden');
        gameElement.classList.add('fullscreen');

        // Load iframe src
        const iframe = gameElement.querySelector('iframe');
        if (iframe && !iframe.src) {
            const gameId = gameElement.id;
            switch(gameId) {
                case 'flappy-bird':
                    iframe.src = 'FlappyBird/index.html';
                    break;
                case 'chicken-run':
                    iframe.src = 'ChickenRun/index.html';
                    break;
                case 'flappy-legacy':
                    iframe.src = 'Flappy Legacy/index.html';
                    break;
                case 'homo-sapiens':
                    iframe.src = 'HomoSapiens/index.html';
                    break;
            }
        }
    }

    // Exit fullscreen on Escape key or exit button click
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            exitFullscreenGame();
        }
    });

    function exitFullscreenGame() {
        const fullscreenGames = document.querySelectorAll('.game.fullscreen');
        fullscreenGames.forEach(game => {
            game.classList.remove('fullscreen');
            game.classList.add('hidden');
            // Unload iframe src to stop music
            const iframe = game.querySelector('iframe');
            if (iframe) {
                iframe.src = '';
            }
        });
        header.style.display = 'block';
        welcomeMessage.classList.remove('hidden');
    }

    // Exit buttons
    const exitButtons = document.querySelectorAll('.exit-btn');
    exitButtons.forEach(btn => {
        btn.addEventListener('click', exitFullscreenGame);
    });

    // Tic-Tac-Toe game logic
    const ticTacToeBoard = document.querySelector('#tic-tac-toe .board');
    const ticTacToeCells = document.querySelectorAll('#tic-tac-toe .cell');
    const restartTicTacToeBtn = document.getElementById('restart-tic-tac-toe');

    let currentPlayer = 'X';
    let gameActive = true;
    let gameState = ['', '', '', '', '', '', '', '', ''];

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }

        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;

        checkResult();
    }

    function checkResult() {
        let roundWon = false;

        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            let a = gameState[winCondition[0]];
            let b = gameState[winCondition[1]];
            let c = gameState[winCondition[2]];

            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            alert(`Игрок ${currentPlayer} выиграл!`);
            gameActive = false;
            return;
        }

        let roundDraw = !gameState.includes('');
        if (roundDraw) {
            alert('Ничья!');
            gameActive = false;
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }

    function restartTicTacToeGame() {
        gameActive = true;
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        ticTacToeCells.forEach(cell => cell.textContent = '');
    }

    // Add data-cell-index to cells
    ticTacToeCells.forEach((cell, index) => {
        cell.setAttribute('data-cell-index', index);
        cell.addEventListener('click', handleCellClick);
    });

    restartTicTacToeBtn.addEventListener('click', restartTicTacToeGame);

    // Snake game placeholder (basic setup)
    const snakeCanvas = document.getElementById('snake-canvas');
    const snakeCtx = snakeCanvas.getContext('2d');

    // Basic snake setup (placeholder)
    function drawSnakePlaceholder() {
        snakeCtx.fillStyle = '#4CAF50';
        snakeCtx.fillRect(50, 50, 20, 20);
        snakeCtx.fillStyle = '#333';
        snakeCtx.font = '16px Arial';
        snakeCtx.fillText('Змейка (заготовка)', 100, 70);
    }

    // Draw placeholder initially
    drawSnakePlaceholder();
});