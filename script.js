// Basic page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Theme switching functionality
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    console.log('Theme toggle button found:', themeToggle);

    if (themeToggle) {
        // Load saved theme or default to light
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);

        themeToggle.addEventListener('click', function() {
            console.log('Theme toggle clicked');
            const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            console.log('Switching from', currentTheme, 'to', newTheme);
            setTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    } else {
        console.error('Theme toggle button not found!');
    }

    function setTheme(theme) {
        console.log('Setting theme to:', theme);
        // Remove all theme classes
        body.classList.remove('light-theme', 'dark-theme');
        document.documentElement.classList.remove('light-theme', 'dark-theme');
        // Add new theme class
        body.classList.add(theme + '-theme');
        document.documentElement.classList.add(theme + '-theme');
        console.log('Body classes after adding:', body.className);
        console.log('HTML classes after adding:', document.documentElement.className);
        console.log('Body has dark-theme class:', body.classList.contains('dark-theme'));
        
        // Update button text and icon
        if (theme === 'light') {
            themeToggle.innerHTML = '🌙';
        } else {
            themeToggle.innerHTML = '☀️';
        }
    }

    // Language switching functionality
    const languageToggle = document.getElementById('language-toggle');
    const languages = ['ru', 'us', 'es'];
    const languageFlags = {
        'ru': '<img src="flags/ru.png" alt="RU" style="width:20px; height:15px;">',
        'us': '<img src="flags/us.png" alt="US" style="width:20px; height:15px;">',
        'es': '<img src="flags/es.png" alt="ES" style="width:20px; height:15px;">'
    };

    // Translation object
    const translations = {
        ru: {
            title: "DimensionX GameFactory",
            welcome: "DimensionX GameFactory — это фабрика цифровых миров.",
            description: "Здесь ты найдёшь онлайн-игры, уникальные проекты и эксклюзивные скины для Minecraft.",
            description2: "Мы создаём собственные игровые вселенные, экспериментируем с механиками и разрабатываем контент для игроков, которые любят новое, необычное и атмосферное.",
            description3: "На сайте тебя ждёт:<br>🎮 Онлайн-игры прямо в браузере<br>🧩 Уникальные игровые проекты<br>🧍‍♂️ Авторские Minecraft-скины<br>🌌 Вселенная NoClip и тематические карты<br>⚙️ Инди-разработка и эксперименты",
            gamesTab: "DimensionX GameFactory — место, где измерения превращаются в игры.",
            allGames: "Все игры",
            play: "Играть",
            home: "Главная",
            games: "Онлайн-игры",
            flappyBird: "Flappy Bird",
            flappyLegacy: "Flappy Legacy", 
            chickenRun: "Chicken Run",
            homoSapiens: "Homo Sapiens",
            langName: "Русский",
            minecraft: "MINECRAFT"
        },
        us: {
            title: "DimensionX GameFactory",
            welcome: "DimensionX GameFactory is a factory of digital worlds.",
            description: "Here you will find online games, unique projects, and exclusive Minecraft skins.",
            description2: "We create our own gaming universes, experiment with mechanics, and develop content for players who love new, unusual, and atmospheric things.",
            description3: "The site awaits you:<br>🎮 Online games right in the browser<br>🧩 Unique gaming projects<br>🧍‍♂️ Original Minecraft skins<br>🌌 NoClip universe and thematic maps<br>⚙️ Indie development and experiments",
            gamesTab: "DimensionX GameFactory is a place where dimensions turn into games.",
            allGames: "All Games",
            play: "Play",
            home: "Home",
            games: "Online Games",
            flappyBird: "Flappy Bird",
            flappyLegacy: "Flappy Legacy",
            chickenRun: "Chicken Run", 
            homoSapiens: "Homo Sapiens",
            langName: "English",
            minecraft: "MINECRAFT"
        },
        es: {
            title: "DimensionX GameFactory",
            welcome: "DimensionX GameFactory es una fábrica de mundos digitales.",
            description: "Aqui encontras juegos en linea, proyectos unicos y skins exclusivos para Minecraft.",
            description2: "Creamos nuestros propios universos de juegos, experimentamos con mecanicas y desarrollamos contenido para jugadores que aman lo nuevo, inusual y atmosferico.",
            description3: "El sitio te espera:<br>🎮 Juegos en linea directamente en el navegador<br>🧩 Proyectos de juegos unicos<br>🧍‍♂️ Skins originales de Minecraft<br>🌌 Universo NoClip y mapas tematicos<br>⚙️ Desarrollo indie y experimentos",
            gamesTab: "DimensionX GameFactory es un lugar donde las dimensiones se convierten en juegos.",
            allGames: "Todos los Juegos",
            play: "Jugar",
            home: "Inicio",
            games: "Juegos en Linea",
            flappyBird: "Flappy Bird",
            flappyLegacy: "Flappy Legacy",
            chickenRun: "Chicken Run",
            homoSapiens: "Homo Sapiens",
            langName: "Español",
            minecraft: "MINECRAFT"
        }
    };

    function setLanguage(lang) {
        console.log('Setting language to:', lang);
        
        // Update page title
        document.title = translations[lang].title;
        
        // Update header
        document.querySelector('h1').textContent = "DimensionX";
        document.querySelector('h2').textContent = "GameFactory";
        
        // Update navigation tabs
        document.querySelector('[data-tab="home"]').textContent = translations[lang].home;
        document.querySelector('[data-tab="games"]').textContent = translations[lang].games;
        document.querySelector('[data-tab="minecraft"]').textContent = translations[lang].minecraft;
        
        // Update hero section
        const heroTitle = document.querySelector('.hero-section-bottom h2');
        const heroParas = document.querySelectorAll('.hero-section-bottom p');
        
        if (heroTitle) heroTitle.textContent = translations[lang].welcome;
        if (heroParas[0]) heroParas[0].innerHTML = translations[lang].description;
        if (heroParas[1]) heroParas[1].innerHTML = translations[lang].description2;
        if (heroParas[2]) heroParas[2].innerHTML = translations[lang].description3;
        if (heroParas[3]) heroParas[3].innerHTML = translations[lang].gamesTab;
        
        // Update games section
        const gamesTitle = document.querySelector('#games-tab h3');
        if (gamesTitle) gamesTitle.textContent = translations[lang].allGames;
        
        // Update game titles
        const gameTitles = document.querySelectorAll('.game-preview h2');
        gameTitles.forEach(title => {
            const gameName = title.textContent.toLowerCase().replace(' ', '');
            if (translations[lang][gameName]) {
                title.textContent = translations[lang][gameName];
            }
        });
        
        // Update play buttons
        const playButtons = document.querySelectorAll('.play-btn');
        playButtons.forEach(button => {
            button.textContent = translations[lang].play;
        });
        
        // Save language preference
        localStorage.setItem('language', lang);
        console.log('Language saved to localStorage:', lang);
    }

    // Load saved language or default to Russian
    const savedLanguage = localStorage.getItem('language') || 'ru';
    let normalizedLanguage = savedLanguage;
    if (savedLanguage === 'en') {
        normalizedLanguage = 'us';
        localStorage.setItem('language', 'us'); // Update stored value
    }
    let currentLangIndex = languages.indexOf(normalizedLanguage);
    languageToggle.innerHTML = languageFlags[normalizedLanguage];
    languageToggle.title = translations[normalizedLanguage].langName;
    setLanguage(normalizedLanguage);

    // Language toggle button event listener
    languageToggle.addEventListener('click', function() {
        console.log('Language button clicked');
        currentLangIndex = (currentLangIndex + 1) % languages.length;
        const newLang = languages[currentLangIndex];
        console.log('Switching to language:', newLang);
        languageToggle.innerHTML = languageFlags[newLang];
        languageToggle.title = translations[newLang].langName;
        setLanguage(newLang);
    });

    // Tab switching functionality
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    navTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Remove active class from all tabs
            navTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(content => content.classList.remove('active'));
            // Show selected tab content
            document.getElementById(tabName + '-tab').classList.add('active');
        });
    });

    // Game elements
    const welcomeMessage = document.getElementById('welcome-message');
    const flappyBirdGame = document.getElementById('flappy-bird');
    const chickenRunGame = document.getElementById('chicken-run');
    const flappyLegacyGame = document.getElementById('flappy-legacy');
    const homoSapiensGame = document.getElementById('homo-sapiens');
    const header = document.querySelector('header');
    const allGames = document.querySelectorAll('.game');

    // Games tab play buttons
    const playFlappyGamesBtn = document.getElementById('play-flappy-bird-games');
    const playChickenGamesBtn = document.getElementById('play-chicken-run-games');
    const playFlappyLegacyGamesBtn = document.getElementById('play-flappy-legacy-games');
    const playHomoSapiensGamesBtn = document.getElementById('play-homo-sapiens-games');

    // Flappy Bird games tab play button
    playFlappyGamesBtn.addEventListener('click', function() {
        console.log('Flappy Bird play button clicked');
        openFullscreenGame(flappyBirdGame);
    });

    // Chicken Run games tab play button
    playChickenGamesBtn.addEventListener('click', function() {
        console.log('Chicken Run play button clicked');
        openFullscreenGame(chickenRunGame);
    });

    // Flappy Legacy games tab play button
    playFlappyLegacyGamesBtn.addEventListener('click', function() {
        console.log('Flappy Legacy play button clicked');
        openFullscreenGame(flappyLegacyGame);
    });

    // Homo Sapiens games tab play button
    playHomoSapiensGamesBtn.addEventListener('click', function() {
        console.log('Homo Sapiens play button clicked');
        openFullscreenGame(homoSapiensGame);
    });

    function openFullscreenGame(gameElement) {
        console.log('Opening fullscreen game:', gameElement.id);
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
        const gameId = gameElement.id;
        switch(gameId) {
            case 'flappy-bird':
                iframe.src = 'online/FlappyBird/index.html';
                break;
            case 'chicken-run':
                iframe.src = 'online/ChickenRun/index.html';
                break;
            case 'flappy-legacy':
                iframe.src = 'online/Flappy Legacy/index.html';
                break;
            case 'homo-sapiens':
                iframe.src = 'online/HomoSapiens/index.html';
                break;
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