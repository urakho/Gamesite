// Игровые переменные
let scene, camera, renderer, chicken, road, cars = [], particles = [];
let gameState = 'menu'; // 'menu', 'playing', 'gameOver'
let score = 0;
let gameSpeed = 0.1;
let chickenPosition = { x: 0, y: 0.5, z: 0 };
let chickenVelocity = { x: 0, y: 0, z: 0 };
let isJumping = false;
let keys = {};
let lastCarSpawnTime = 0;
let lastScoreTime = 0;
let roadSegments = [];
let lastRoadZ = 0;
let currentLane = 1; // 0 = левая, 1 = центральная, 2 = правая
let targetX = 0; // Целевая позиция по X
let barriers = []; // Массив для строительных ограждений
let lastBarrierSpawnTime = 0;
let buses = []; // Массив для автобусов
let lastBusSpawnTime = 0;
let brokenBuses = []; // Массив для сломанных автобусов
let lastBrokenBusSpawnTime = 0;
let onRamp = false; // Курица на пандусе
let rampHeight = 0.5; // Текущая высота на пандусе
let graphicsQuality = 'high'; // 'high', 'normal', 'low', 'awful'

// Константы игры
const ROAD_WIDTH = 6;
const LANE_WIDTH = 2;
const LANES = [-2, 0, 2]; // Позиции полос
const CAR_SPAWN_DISTANCE = 20;

// Инициализация игры
function init() {
    // Создание сцены
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x87CEEB, 10, 100);
    
    // Создание камеры
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 8);
    camera.lookAt(0, 0, 0);
    
    // Создание рендерера
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x87CEEB);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('gameContainer').appendChild(renderer.domElement);
    
    // Загрузка сохраненных настроек
    loadSettings();
    
    // Создание освещения
    createLighting();
    
    // Создание дороги
    createRoad();
    
    // Создание курицы
    createChicken();
    
    // Обработчики событий
    setupEventListeners();
    
    // Запуск игрового цикла
    animate();
}

// Загрузка сохраненных настроек
function loadSettings() {
    const savedQuality = localStorage.getItem('chickenRunGraphicsQuality');
    if (savedQuality) {
        graphicsQuality = savedQuality;
    }
    
    // Обновляем кнопку качества в меню
    updateQualityButton();
}

function updateQualityButton() {
    const qualityNames = { 'high': 'Высокое', 'normal': 'Среднее', 'low': 'Низкое', 'awful': 'Ультра-низкое' };
    const qualityButton = document.getElementById('qualityButton');
    if (qualityButton) {
        qualityButton.textContent = qualityNames[graphicsQuality] || 'Высокое';
    }
}

function createLighting() {
    // Окружающий свет
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    // Направленный свет
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
}

function createRoad() {
    // Создаем начальные сегменты дороги
    for (let i = 0; i < 10; i++) {
        createRoadSegment(i * 20 - 100);
    }
}

function createRoadSegment(zPosition) {
    const segmentGroup = new THREE.Group();
    
    // Основная дорога
    const roadGeometry = new THREE.PlaneGeometry(ROAD_WIDTH, 20);
    const roadMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const roadPiece = new THREE.Mesh(roadGeometry, roadMaterial);
    roadPiece.rotation.x = -Math.PI / 2;
    roadPiece.position.z = zPosition;
    roadPiece.receiveShadow = true;
    segmentGroup.add(roadPiece);
    
    // Разметка дороги
    for (let i = 0; i < 5; i++) {
        const lineGeometry = new THREE.PlaneGeometry(0.2, 2);
        const lineMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        
        // Левая линия
        const leftLine = new THREE.Mesh(lineGeometry, lineMaterial);
        leftLine.position.set(-1, 0.01, zPosition - 8 + i * 4);
        leftLine.rotation.x = -Math.PI / 2;
        segmentGroup.add(leftLine);
        
        // Правая линия
        const rightLine = new THREE.Mesh(lineGeometry, lineMaterial);
        rightLine.position.set(1, 0.01, zPosition - 8 + i * 4);
        rightLine.rotation.x = -Math.PI / 2;
        segmentGroup.add(rightLine);
    }
    
    // Обочины
    const grassGeometry = new THREE.PlaneGeometry(4, 20);
    const grassMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
    
    const leftGrass = new THREE.Mesh(grassGeometry, grassMaterial);
    leftGrass.position.set(-5, -0.01, zPosition);
    leftGrass.rotation.x = -Math.PI / 2;
    segmentGroup.add(leftGrass);
    
    const rightGrass = new THREE.Mesh(grassGeometry, grassMaterial);
    rightGrass.position.set(5, -0.01, zPosition);
    rightGrass.rotation.x = -Math.PI / 2;
    segmentGroup.add(rightGrass);
    
    segmentGroup.userData = { zPosition: zPosition };
    roadSegments.push(segmentGroup);
    scene.add(segmentGroup);
    
    lastRoadZ = Math.min(lastRoadZ, zPosition);
}

function createChicken() {
    const chickenGroup = new THREE.Group();
    
    switch(graphicsQuality) {
        case 'high':
            createHighQualityChicken(chickenGroup);
            break;
        case 'normal':
            createNormalQualityChicken(chickenGroup);
            break;
        case 'low':
            createLowQualityChicken(chickenGroup);
            break;
        case 'awful':
            createAwfulQualityChicken(chickenGroup);
            break;
        default:
            createHighQualityChicken(chickenGroup);
    }
    
    chicken = chickenGroup;
    chicken.position.set(chickenPosition.x, chickenPosition.y, chickenPosition.z);
    scene.add(chicken);
}

// Высокое качество курицы - все детали
function createHighQualityChicken(chickenGroup) {
    // Тело курицы
    const bodyGeometry = new THREE.SphereGeometry(0.4, 8, 6);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.4;
    body.castShadow = true;
    chickenGroup.add(body);
    
    // Голова
    const headGeometry = new THREE.SphereGeometry(0.25, 8, 6);
    const headMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0, 0.8, 0.2);
    head.castShadow = true;
    chickenGroup.add(head);
    
    // Клюв
    const beakGeometry = new THREE.ConeGeometry(0.05, 0.15, 4);
    const beakMaterial = new THREE.MeshLambertMaterial({ color: 0xffa500 });
    const beak = new THREE.Mesh(beakGeometry, beakMaterial);
    beak.position.set(0, 0.75, 0.4);
    beak.rotation.x = Math.PI / 2;
    chickenGroup.add(beak);
    
    // Гребешок
    const crestGeometry = new THREE.ConeGeometry(0.1, 0.2, 4);
    const crestMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    const crest = new THREE.Mesh(crestGeometry, crestMaterial);
    crest.position.set(0, 1, 0);
    chickenGroup.add(crest);
    
    // Хвост
    const tailGeometry = new THREE.ConeGeometry(0.2, 0.4, 4);
    const tailMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const tail = new THREE.Mesh(tailGeometry, tailMaterial);
    tail.position.set(0, 0.6, -0.4);
    tail.rotation.x = -Math.PI / 4;
    chickenGroup.add(tail);
}

// Среднее качество курицы - основные детали
function createNormalQualityChicken(chickenGroup) {
    // Тело
    const bodyGeometry = new THREE.SphereGeometry(0.4, 6, 4);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.4;
    body.castShadow = true;
    chickenGroup.add(body);
    
    // Голова
    const headGeometry = new THREE.SphereGeometry(0.25, 6, 4);
    const headMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0, 0.8, 0.2);
    chickenGroup.add(head);
    
    // Клюв
    const beakGeometry = new THREE.ConeGeometry(0.05, 0.15, 3);
    const beakMaterial = new THREE.MeshLambertMaterial({ color: 0xffa500 });
    const beak = new THREE.Mesh(beakGeometry, beakMaterial);
    beak.position.set(0, 0.75, 0.4);
    beak.rotation.x = Math.PI / 2;
    chickenGroup.add(beak);
    
    // Гребешок
    const crestGeometry = new THREE.ConeGeometry(0.1, 0.2, 3);
    const crestMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    const crest = new THREE.Mesh(crestGeometry, crestMaterial);
    crest.position.set(0, 1, 0);
    chickenGroup.add(crest);
}

// Низкое качество курицы - минимум деталей
function createLowQualityChicken(chickenGroup) {
    // Только тело и голова
    const bodyGeometry = new THREE.SphereGeometry(0.4, 4, 3);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.4;
    chickenGroup.add(body);
    
    const headGeometry = new THREE.SphereGeometry(0.25, 4, 3);
    const headMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0, 0.8, 0.2);
    chickenGroup.add(head);
}

// Ультра-низкое качество курицы - только куб
function createAwfulQualityChicken(chickenGroup) {
    const bodyGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.4;
    chickenGroup.add(body);
}

function createCar(lane, distance) {
    const carGroup = new THREE.Group();
    const colors = [0xff0000, 0x0000ff, 0x00ff00, 0xffff00, 0xff00ff, 0x00ffff, 0xffa500, 0x800080];
    const carColor = colors[Math.floor(Math.random() * colors.length)];
    
    switch(graphicsQuality) {
        case 'high':
            createHighQualityCar(carGroup, carColor);
            break;
        case 'normal':
            createNormalQualityCar(carGroup, carColor);
            break;
        case 'low':
            createLowQualityCar(carGroup, carColor);
            break;
        case 'awful':
            createAwfulQualityCar(carGroup, carColor);
            break;
        default:
            createHighQualityCar(carGroup, carColor);
    }
    
    carGroup.position.set(LANES[lane], 0, chickenPosition.z - distance);
    carGroup.userData = { lane: lane, speed: gameSpeed * (1 + Math.random() * 0.5) };
    
    cars.push(carGroup);
    scene.add(carGroup);
}

// ВЫСОКОЕ КАЧЕСТВО - детализированные машины
function createHighQualityCar(carGroup, carColor) {
    // Основной кузов машины (больше и детальнее)
    const bodyGeometry = new THREE.BoxGeometry(2.0, 1.0, 4.5);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: carColor });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.5;
    body.castShadow = true;
    carGroup.add(body);
    
    // Крыша машины
    const roofGeometry = new THREE.BoxGeometry(1.8, 0.8, 2.8);
    const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(0, 1.3, 0.3);
    roof.castShadow = true;
    carGroup.add(roof);
    
    // Лобовое стекло
    const windshieldGeometry = new THREE.BoxGeometry(1.7, 0.7, 0.1);
    const windshieldMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x87ceeb, 
        transparent: true, 
        opacity: 0.6 
    });
    const windshield = new THREE.Mesh(windshieldGeometry, windshieldMaterial);
    windshield.position.set(0, 1.3, 1.4);
    carGroup.add(windshield);
    
    // Заднее стекло
    const rearGlass = new THREE.Mesh(windshieldGeometry, windshieldMaterial);
    rearGlass.position.set(0, 1.3, -0.8);
    carGroup.add(rearGlass);
    
    // Боковые окна
    const sideWindowGeometry = new THREE.BoxGeometry(0.1, 0.6, 1.5);
    const leftWindow = new THREE.Mesh(sideWindowGeometry, windshieldMaterial);
    leftWindow.position.set(0.85, 1.3, 0.3);
    carGroup.add(leftWindow);
    
    const rightWindow = new THREE.Mesh(sideWindowGeometry, windshieldMaterial);
    rightWindow.position.set(-0.85, 1.3, 0.3);
    carGroup.add(rightWindow);
    
    // Передние фары
    const headlightGeometry = new THREE.SphereGeometry(0.15, 8, 8);
    const headlightMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    
    const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    leftHeadlight.position.set(-0.6, 0.7, 2.3);
    carGroup.add(leftHeadlight);
    
    const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    rightHeadlight.position.set(0.6, 0.7, 2.3);
    carGroup.add(rightHeadlight);
    
    // Задние фонари
    const taillightMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    const leftTaillight = new THREE.Mesh(headlightGeometry, taillightMaterial);
    leftTaillight.position.set(-0.6, 0.7, -2.3);
    carGroup.add(leftTaillight);
    
    const rightTaillight = new THREE.Mesh(headlightGeometry, taillightMaterial);
    rightTaillight.position.set(0.6, 0.7, -2.3);
    carGroup.add(rightTaillight);
    
    // Колеса (больше и детальнее)
    const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 12);
    const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
    
    // Диски колес
    const rimGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.32, 8);
    const rimMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });
    
    const wheelPositions = [
        [-0.9, 0.4, 1.8], [0.9, 0.4, 1.8],
        [-0.9, 0.4, -1.8], [0.9, 0.4, -1.8]
    ];
    
    wheelPositions.forEach(pos => {
        // Колесо
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.set(pos[0], pos[1], pos[2]);
        wheel.rotation.z = Math.PI / 2;
        wheel.castShadow = true;
        carGroup.add(wheel);
        
        // Диск
        const rim = new THREE.Mesh(rimGeometry, rimMaterial);
        rim.position.set(pos[0], pos[1], pos[2]);
        rim.rotation.z = Math.PI / 2;
        carGroup.add(rim);
    });
    
    // Бампер
    const bumperGeometry = new THREE.BoxGeometry(2.1, 0.3, 0.3);
    const bumperMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const frontBumper = new THREE.Mesh(bumperGeometry, bumperMaterial);
    frontBumper.position.set(0, 0.3, 2.4);
    carGroup.add(frontBumper);
    
    const rearBumper = new THREE.Mesh(bumperGeometry, bumperMaterial);
    rearBumper.position.set(0, 0.3, -2.4);
    carGroup.add(rearBumper);
    
    // Номерной знак
    const plateGeometry = new THREE.BoxGeometry(0.8, 0.2, 0.05);
    const plateMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const plate = new THREE.Mesh(plateGeometry, plateMaterial);
    plate.position.set(0, 0.3, 2.45);
    carGroup.add(plate);
}

// СРЕДНЕЕ КАЧЕСТВО - упрощенные машины
function createNormalQualityCar(carGroup, carColor) {
    // Кузов машины
    const bodyGeometry = new THREE.BoxGeometry(1.8, 0.9, 4);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: carColor });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.45;
    body.castShadow = true;
    carGroup.add(body);
    
    // Крыша
    const roofGeometry = new THREE.BoxGeometry(1.6, 0.6, 2.5);
    const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(0, 1.1, 0.5);
    roof.castShadow = true;
    carGroup.add(roof);
    
    // Простые окна
    const windowGeometry = new THREE.BoxGeometry(1.5, 0.5, 0.1);
    const windowMaterial = new THREE.MeshLambertMaterial({ color: 0x87ceeb, transparent: true, opacity: 0.5 });
    const frontWindow = new THREE.Mesh(windowGeometry, windowMaterial);
    frontWindow.position.set(0, 1.1, 1.2);
    carGroup.add(frontWindow);
    
    // Колеса
    const wheelGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.25, 8);
    const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
    
    const wheelPositions = [
        [-0.8, 0.35, 1.5], [0.8, 0.35, 1.5],
        [-0.8, 0.35, -1.5], [0.8, 0.35, -1.5]
    ];
    
    wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.set(pos[0], pos[1], pos[2]);
        wheel.rotation.z = Math.PI / 2;
        carGroup.add(wheel);
    });
}

// НИЗКОЕ КАЧЕСТВО - очень простые машины
function createLowQualityCar(carGroup, carColor) {
    // Простой кузов
    const bodyGeometry = new THREE.BoxGeometry(1.6, 0.8, 3.5);
    const bodyMaterial = new THREE.MeshBasicMaterial({ color: carColor });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.4;
    carGroup.add(body);
    
    // Простая крыша
    const roofGeometry = new THREE.BoxGeometry(1.4, 0.5, 2);
    const roofMaterial = new THREE.MeshBasicMaterial({ color: 0x555555 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(0, 0.9, 0.3);
    carGroup.add(roof);
    
    // Очень простые колеса
    const wheelGeometry = new THREE.BoxGeometry(0.3, 0.6, 0.3);
    const wheelMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    
    const wheelPositions = [
        [-0.7, 0.3, 1.2], [0.7, 0.3, 1.2],
        [-0.7, 0.3, -1.2], [0.7, 0.3, -1.2]
    ];
    
    wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.set(pos[0], pos[1], pos[2]);
        carGroup.add(wheel);
    });
}

// УЛЬТРА-НИЗКОЕ КАЧЕСТВО - примитивные блоки
function createAwfulQualityCar(carGroup, carColor) {
    // Один большой блок
    const carGeometry = new THREE.BoxGeometry(1.4, 0.7, 3);
    const carMaterial = new THREE.MeshBasicMaterial({ color: carColor });
    const car = new THREE.Mesh(carGeometry, carMaterial);
    car.position.y = 0.35;
    carGroup.add(car);
    
    // "Колеса" - просто черные кубики
    const wheelGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const wheelMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    
    const wheelPositions = [
        [-0.6, 0.1, 1], [0.6, 0.1, 1],
        [-0.6, 0.1, -1], [0.6, 0.1, -1]
    ];
    
    wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.set(pos[0], pos[1], pos[2]);
        carGroup.add(wheel);
    });
}

function createBus(lane, distance) {
    const busGroup = new THREE.Group();
    
    switch(graphicsQuality) {
        case 'high':
            createHighQualityBus(busGroup);
            break;
        case 'normal':
            createNormalQualityBus(busGroup);
            break;
        case 'low':
            createLowQualityBus(busGroup);
            break;
        case 'awful':
            createAwfulQualityBus(busGroup);
            break;
        default:
            createHighQualityBus(busGroup);
    }
    
    busGroup.position.set(LANES[lane], 0, chickenPosition.z - distance);
    busGroup.userData = { lane: lane, speed: gameSpeed * (0.8 + Math.random() * 0.3), type: 'bus' };
    
    buses.push(busGroup);
    scene.add(busGroup);
}

// Высокое качество автобуса - все детали
function createHighQualityBus(busGroup) {
    // Основной кузов автобуса
    const bodyGeometry = new THREE.BoxGeometry(1.9, 1.6, 8);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xdc143c });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.8;
    body.castShadow = true;
    busGroup.add(body);
    
    // Крыша
    const roofGeometry = new THREE.BoxGeometry(1.9, 0.2, 8);
    const roofMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 1.7;
    roof.castShadow = true;
    busGroup.add(roof);
    
    // Бампер
    const bumperGeometry = new THREE.BoxGeometry(1.9, 0.3, 0.3);
    const bumperMaterial = new THREE.MeshLambertMaterial({ color: 0x555555 });
    const bumper = new THREE.Mesh(bumperGeometry, bumperMaterial);
    bumper.position.set(0, 0.3, 4.15);
    busGroup.add(bumper);
    
    // Фары
    const headlightGeometry = new THREE.SphereGeometry(0.15, 8, 6);
    const headlightMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xffffe0, emissive: 0x222200 
    });
    
    const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    leftHeadlight.position.set(-0.6, 0.8, 4.2);
    busGroup.add(leftHeadlight);
    
    const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    rightHeadlight.position.set(0.6, 0.8, 4.2);
    busGroup.add(rightHeadlight);
    
    // Белые полосы
    [0.4, 1.0, 1.6].forEach(height => {
        const stripeGeometry = new THREE.BoxGeometry(1.91, 0.08, 8.1);
        const stripeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
        stripe.position.set(0, height, 0);
        busGroup.add(stripe);
    });
    
    // Окна
    const windowPositions = [
        [0, 1.3, 3.2], [0, 1.3, 1.8], [0, 1.3, 0.4], 
        [0, 1.3, -1.0], [0, 1.3, -2.4], [0, 1.3, -3.8]
    ];
    
    windowPositions.forEach(pos => {
        const windowGeometry = new THREE.BoxGeometry(1.92, 0.6, 1.3);
        const windowMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x1a1a2e, transparent: true, opacity: 0.8 
        });
        const window = new THREE.Mesh(windowGeometry, windowMaterial);
        window.position.set(pos[0], pos[1], pos[2]);
        busGroup.add(window);
    });
    
    // Лобовое стекло
    const windshieldGeometry = new THREE.BoxGeometry(1.7, 1.0, 0.1);
    const windshieldMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x333366, transparent: true, opacity: 0.7 
    });
    const windshield = new THREE.Mesh(windshieldGeometry, windshieldMaterial);
    windshield.position.set(0, 1.2, 4.05);
    windshield.rotation.x = -0.1;
    busGroup.add(windshield);
    
    // Заднее стекло
    const rearGlass = new THREE.Mesh(windshieldGeometry, windshieldMaterial);
    rearGlass.position.set(0, 1.2, -4.05);
    busGroup.add(rearGlass);
    
    // Двери
    const doorGeometry = new THREE.BoxGeometry(0.05, 1.4, 1.0);
    const doorMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });
    
    const frontDoor = new THREE.Mesh(doorGeometry, doorMaterial);
    frontDoor.position.set(0.95, 0.9, 2.5);
    busGroup.add(frontDoor);
    
    const rearDoor = new THREE.Mesh(doorGeometry, doorMaterial);
    rearDoor.position.set(0.95, 0.9, -1.5);
    busGroup.add(rearDoor);
    
    // Колеса
    const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 12);
    const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
    const rimGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.32, 8);
    const rimMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });
    
    [[-0.9, 0.5, 2.5], [0.9, 0.5, 2.5], [-0.9, 0.5, -2.5], [0.9, 0.5, -2.5]].forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.set(pos[0], pos[1], pos[2]);
        wheel.rotation.z = Math.PI / 2;
        wheel.castShadow = true;
        busGroup.add(wheel);
        
        const rim = new THREE.Mesh(rimGeometry, rimMaterial);
        rim.position.set(pos[0], pos[1], pos[2]);
        rim.rotation.z = Math.PI / 2;
        busGroup.add(rim);
    });
    
    // Номерной знак
    const plateGeometry = new THREE.BoxGeometry(0.6, 0.2, 0.05);
    const plateMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const plate = new THREE.Mesh(plateGeometry, plateMaterial);
    plate.position.set(0, 0.5, 4.1);
    busGroup.add(plate);
    
    // Зеркала
    const mirrorGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.2);
    const mirrorMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 });
    
    const leftMirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
    leftMirror.position.set(-1.0, 1.5, 3.5);
    busGroup.add(leftMirror);
    
    const rightMirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
    rightMirror.position.set(1.0, 1.5, 3.5);
    busGroup.add(rightMirror);
}

// Среднее качество автобуса - основные детали
function createNormalQualityBus(busGroup) {
    // Основной кузов
    const bodyGeometry = new THREE.BoxGeometry(1.9, 1.6, 8);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xdc143c });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.8;
    body.castShadow = true;
    busGroup.add(body);
    
    // Крыша
    const roofGeometry = new THREE.BoxGeometry(1.9, 0.2, 8);
    const roofMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 1.7;
    busGroup.add(roof);
    
    // Фары (упрощенные)
    const headlightGeometry = new THREE.SphereGeometry(0.15, 6, 4);
    const headlightMaterial = new THREE.MeshLambertMaterial({ color: 0xffffe0 });
    
    const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    leftHeadlight.position.set(-0.6, 0.8, 4.2);
    busGroup.add(leftHeadlight);
    
    const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    rightHeadlight.position.set(0.6, 0.8, 4.2);
    busGroup.add(rightHeadlight);
    
    // Основные окна
    const windowGeometry = new THREE.BoxGeometry(1.92, 0.6, 6);
    const windowMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x1a1a2e, transparent: true, opacity: 0.8 
    });
    const window = new THREE.Mesh(windowGeometry, windowMaterial);
    window.position.set(0, 1.3, 0);
    busGroup.add(window);
    
    // Колеса (упрощенные)
    const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 8);
    const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
    
    [[-0.9, 0.5, 2.5], [0.9, 0.5, 2.5], [-0.9, 0.5, -2.5], [0.9, 0.5, -2.5]].forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.set(pos[0], pos[1], pos[2]);
        wheel.rotation.z = Math.PI / 2;
        busGroup.add(wheel);
    });
}

// Низкое качество автобуса - минимум деталей
function createLowQualityBus(busGroup) {
    // Только основной кузов
    const bodyGeometry = new THREE.BoxGeometry(1.9, 1.6, 8);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xdc143c });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.8;
    busGroup.add(body);
    
    // Упрощенные фары
    const headlightGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.1);
    const headlightMaterial = new THREE.MeshLambertMaterial({ color: 0xffffe0 });
    
    const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    leftHeadlight.position.set(-0.6, 0.8, 4.05);
    busGroup.add(leftHeadlight);
    
    const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    rightHeadlight.position.set(0.6, 0.8, 4.05);
    busGroup.add(rightHeadlight);
    
    // Упрощенные колеса
    const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 6);
    const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
    
    [[-0.9, 0.5, 2.5], [0.9, 0.5, 2.5], [-0.9, 0.5, -2.5], [0.9, 0.5, -2.5]].forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.set(pos[0], pos[1], pos[2]);
        wheel.rotation.z = Math.PI / 2;
        busGroup.add(wheel);
    });
}

// Ультра-низкое качество автобуса - только куб
function createAwfulQualityBus(busGroup) {
    const bodyGeometry = new THREE.BoxGeometry(1.9, 1.6, 8);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xdc143c });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.8;
    busGroup.add(body);
}

function createBrokenBus(lane, distance) {
    const brokenBusGroup = new THREE.Group();
    
    switch(graphicsQuality) {
        case 'high':
            createHighQualityBrokenBus(brokenBusGroup);
            break;
        case 'normal':
            createNormalQualityBrokenBus(brokenBusGroup);
            break;
        case 'low':
            createLowQualityBrokenBus(brokenBusGroup);
            break;
        case 'awful':
            createAwfulQualityBrokenBus(brokenBusGroup);
            break;
        default:
            createHighQualityBrokenBus(brokenBusGroup);
    }
    
    brokenBusGroup.position.set(LANES[lane], 0, chickenPosition.z - distance);
    brokenBusGroup.userData = { lane: lane, speed: gameSpeed * (0.8 + Math.random() * 0.3), type: 'brokenBus' };
    
    brokenBuses.push(brokenBusGroup);
    scene.add(brokenBusGroup);
}

// Высокое качество сломанного автобуса
function createHighQualityBrokenBus(brokenBusGroup) {
    const bodyGeometry = new THREE.BoxGeometry(1.9, 1.6, 6);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x8b0000 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.8;
    body.castShadow = true;
    brokenBusGroup.add(body);
    
    const rampGeometry = new THREE.BoxGeometry(1.9, 0.4, 4);
    const rampMaterial = new THREE.MeshLambertMaterial({ color: 0x555555 });
    const ramp = new THREE.Mesh(rampGeometry, rampMaterial);
    ramp.position.set(0, 0.7, 4.5);
    ramp.rotation.x = 0.5;
    ramp.castShadow = true;
    brokenBusGroup.add(ramp);
}

// Среднее качество сломанного автобуса
function createNormalQualityBrokenBus(brokenBusGroup) {
    const bodyGeometry = new THREE.BoxGeometry(1.9, 1.6, 6);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x8b0000 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.8;
    brokenBusGroup.add(body);
    
    const rampGeometry = new THREE.BoxGeometry(1.9, 0.4, 4);
    const rampMaterial = new THREE.MeshLambertMaterial({ color: 0x555555 });
    const ramp = new THREE.Mesh(rampGeometry, rampMaterial);
    ramp.position.set(0, 0.7, 4.5);
    ramp.rotation.x = 0.5;
    brokenBusGroup.add(ramp);
}

// Низкое качество сломанного автобуса
function createLowQualityBrokenBus(brokenBusGroup) {
    const bodyGeometry = new THREE.BoxGeometry(1.9, 1.6, 6);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x8b0000 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.8;
    brokenBusGroup.add(body);
    
    const rampGeometry = new THREE.BoxGeometry(1.9, 0.4, 4);
    const rampMaterial = new THREE.MeshLambertMaterial({ color: 0x555555 });
    const ramp = new THREE.Mesh(rampGeometry, rampMaterial);
    ramp.position.set(0, 0.7, 4.5);
    ramp.rotation.x = 0.5;
    brokenBusGroup.add(ramp);
}

// Ультра-низкое качество сломанного автобуса
function createAwfulQualityBrokenBus(brokenBusGroup) {
    const bodyGeometry = new THREE.BoxGeometry(1.9, 1.6, 6);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x8b0000 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.8;
    brokenBusGroup.add(body);
    
    const rampGeometry = new THREE.BoxGeometry(1.9, 0.4, 4);
    const rampMaterial = new THREE.MeshLambertMaterial({ color: 0x555555 });
    const ramp = new THREE.Mesh(rampGeometry, rampMaterial);
    ramp.position.set(0, 0.7, 4.5);
    ramp.rotation.x = 0.5;
    brokenBusGroup.add(ramp);
}

function createBarrier(lane, distance) {
    const barrierGroup = new THREE.Group();
    
    switch(graphicsQuality) {
        case 'high':
            createHighQualityBarrier(barrierGroup);
            break;
        case 'normal':
            createNormalQualityBarrier(barrierGroup);
            break;
        case 'low':
            createLowQualityBarrier(barrierGroup);
            break;
        case 'awful':
            createAwfulQualityBarrier(barrierGroup);
            break;
        default:
            createHighQualityBarrier(barrierGroup);
    }
    
    barrierGroup.position.set(LANES[lane], 0, chickenPosition.z - distance);
    barrierGroup.userData = { lane: lane, type: 'barrier' };
    
    barriers.push(barrierGroup);
    scene.add(barrierGroup);
}

// Высокое качество барьера - все детали
function createHighQualityBarrier(barrierGroup) {
    // Металлическая основа
    const baseGeometry = new THREE.BoxGeometry(1.8, 0.8, 0.1);
    const baseMaterial = new THREE.MeshLambertMaterial({ color: 0xffff00 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.6;
    base.castShadow = true;
    barrierGroup.add(base);
    
    // Черные полосы
    for (let i = 0; i < 3; i++) {
        const stripeGeometry = new THREE.BoxGeometry(1.81, 0.1, 0.11);
        const stripeMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
        const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
        stripe.position.set(0, 0.4 + i * 0.25, 0);
        barrierGroup.add(stripe);
    }
    
    // Верхняя и нижняя балки
    const beamGeometry = new THREE.BoxGeometry(1.9, 0.1, 0.15);
    const beamMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
    
    const topBeam = new THREE.Mesh(beamGeometry, beamMaterial);
    topBeam.position.y = 1.1;
    topBeam.castShadow = true;
    barrierGroup.add(topBeam);
    
    const bottomBeam = new THREE.Mesh(beamGeometry, beamMaterial);
    bottomBeam.position.y = 0.1;
    barrierGroup.add(bottomBeam);
    
    // Основания столбов
    const foundationGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.3);
    const foundationMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
    
    const leftFoundation = new THREE.Mesh(foundationGeometry, foundationMaterial);
    leftFoundation.position.set(-0.8, 0.05, 0);
    leftFoundation.castShadow = true;
    barrierGroup.add(leftFoundation);
    
    const rightFoundation = new THREE.Mesh(foundationGeometry, foundationMaterial);
    rightFoundation.position.set(0.8, 0.05, 0);
    rightFoundation.castShadow = true;
    barrierGroup.add(rightFoundation);
    
    // Вертикальные столбы
    const postGeometry = new THREE.BoxGeometry(0.1, 1.2, 0.1);
    const postMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });
    
    const leftPost = new THREE.Mesh(postGeometry, postMaterial);
    leftPost.position.set(-0.8, 0.6, 0);
    leftPost.castShadow = true;
    barrierGroup.add(leftPost);
    
    const rightPost = new THREE.Mesh(postGeometry, postMaterial);
    rightPost.position.set(0.8, 0.6, 0);
    rightPost.castShadow = true;
    barrierGroup.add(rightPost);
    
    // Сигнальные огни
    const lightGeometry = new THREE.SphereGeometry(0.05, 6, 4);
    const lightMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xff4444, emissive: 0x220000 
    });
    
    const leftLight = new THREE.Mesh(lightGeometry, lightMaterial);
    leftLight.position.set(-0.8, 1.15, 0);
    barrierGroup.add(leftLight);
    
    const rightLight = new THREE.Mesh(lightGeometry, lightMaterial);
    rightLight.position.set(0.8, 1.15, 0);
    barrierGroup.add(rightLight);
}

// Среднее качество барьера
function createNormalQualityBarrier(barrierGroup) {
    // Основа
    const baseGeometry = new THREE.BoxGeometry(1.8, 0.8, 0.1);
    const baseMaterial = new THREE.MeshLambertMaterial({ color: 0xffff00 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.6;
    base.castShadow = true;
    barrierGroup.add(base);
    
    // Упрощенные полосы
    const stripeGeometry = new THREE.BoxGeometry(1.81, 0.1, 0.11);
    const stripeMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
    const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
    stripe.position.set(0, 0.6, 0);
    barrierGroup.add(stripe);
    
    // Упрощенные столбы
    const postGeometry = new THREE.BoxGeometry(0.1, 1.2, 0.1);
    const postMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });
    
    [[-0.8, 0.6, 0], [0.8, 0.6, 0]].forEach(pos => {
        const post = new THREE.Mesh(postGeometry, postMaterial);
        post.position.set(pos[0], pos[1], pos[2]);
        barrierGroup.add(post);
    });
}

// Низкое качество барьера
function createLowQualityBarrier(barrierGroup) {
    // Только основа и одна полоса
    const baseGeometry = new THREE.BoxGeometry(1.8, 0.8, 0.1);
    const baseMaterial = new THREE.MeshLambertMaterial({ color: 0xffff00 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.6;
    barrierGroup.add(base);
    
    const stripeGeometry = new THREE.BoxGeometry(1.81, 0.1, 0.11);
    const stripeMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
    const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
    stripe.position.set(0, 0.6, 0);
    barrierGroup.add(stripe);
}

// Ультра-низкое качество барьера
function createAwfulQualityBarrier(barrierGroup) {
    // Только желтый блок
    const baseGeometry = new THREE.BoxGeometry(1.8, 0.8, 0.1);
    const baseMaterial = new THREE.MeshLambertMaterial({ color: 0xffff00 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.6;
    barrierGroup.add(base);
}

function setupEventListeners() {
    const platformMaterial = new THREE.MeshLambertMaterial({ color: 0x777777 });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.set(0, 1.8, 1.5); // На крыше, ближе к пандусу
    platform.castShadow = true;
    platform.receiveShadow = true;
    brokenBusGroup.add(platform);
    
    // Обломки передней части (вокруг пандуса)
    for (let i = 0; i < 3; i++) {
        const debrisGeometry = new THREE.BoxGeometry(
            0.2 + Math.random() * 0.3, 
            0.2 + Math.random() * 0.3, 
            0.2 + Math.random() * 0.3
        );
        const debrisMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 });
        const debris = new THREE.Mesh(debrisGeometry, debrisMaterial);
        debris.position.set(
            (Math.random() - 0.5) * 2, 
            0.1 + Math.random() * 0.3, 
            6.5 + Math.random() * 1.5 // Впереди автобуса, вокруг пандуса
        );
        debris.rotation.set(
            Math.random() * Math.PI, 
            Math.random() * Math.PI, 
            Math.random() * Math.PI
        );
        debris.castShadow = true;
        brokenBusGroup.add(debris);
    }
    
    // Разбитые окна (осколки)
    const windowPositions = [
        [0, 1.3, 2], [0, 1.3, 0.5], [0, 1.3, -1], [0, 1.3, -2.5]
    ];
    
    windowPositions.forEach((pos, index) => {
        // Рамы окон
        const frameGeometry = new THREE.BoxGeometry(1.92, 0.7, 1.2);
        const frameMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.set(pos[0], pos[1], pos[2]);
        brokenBusGroup.add(frame);
        
        // Осколки стекла (некоторые окна)
        if (index % 2 === 0) {
            for (let j = 0; j < 2; j++) {
                const glassGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.02);
                const glassMaterial = new THREE.MeshLambertMaterial({ 
                    color: 0x88ccff,
                    transparent: true,
                    opacity: 0.3
                });
                const glass = new THREE.Mesh(glassGeometry, glassMaterial);
                glass.position.set(
                    pos[0] + (Math.random() - 0.5) * 0.8,
                    pos[1] + (Math.random() - 0.5) * 0.4,
                    pos[2]
                );
                glass.rotation.z = Math.random() * Math.PI;
                brokenBusGroup.add(glass);
            }
        }
    });
    
    // Поврежденные колеса (некоторые спущены)
    const wheelGeometry = new THREE.CylinderGeometry(0.45, 0.45, 0.25, 12);
    const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x222222 });
    const flatWheelGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.25, 12); // Спущенное колесо
    
    const wheelPositions = [
        [-0.95, 0.45, 2.0], [0.95, 0.45, 2.0],   // Передние колеса
        [-0.95, 0.45, -1.5], [0.95, 0.45, -1.5], // Задние колеса
    ];
    
    wheelPositions.forEach((pos, index) => {
        const isFlat = index % 2 === 1; // Каждое второе колесо спущено
        const geometry = isFlat ? flatWheelGeometry : wheelGeometry;
        const wheel = new THREE.Mesh(geometry, wheelMaterial);
        wheel.position.set(pos[0], isFlat ? 0.35 : pos[1], pos[2]);
        wheel.rotation.z = Math.PI / 2;
        wheel.castShadow = true;
        brokenBusGroup.add(wheel);
    });
    
    // Ржавчина и повреждения
    for (let i = 0; i < 5; i++) {
        const rustGeometry = new THREE.SphereGeometry(0.1 + Math.random() * 0.1, 6, 4);
        const rustMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 }); // Коричневая ржавчина
        const rust = new THREE.Mesh(rustGeometry, rustMaterial);
        rust.position.set(
            (Math.random() - 0.5) * 1.8,
            0.3 + Math.random() * 1.2,
            (Math.random() - 0.5) * 5
        );
        brokenBusGroup.add(rust);
    }
    
    // Дым или пар (эффект)
    const smokeGeometry = new THREE.SphereGeometry(0.2, 6, 4);
    const smokeMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x666666,
        transparent: true,
        opacity: 0.3
    });
    const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial);
    smoke.position.set(0, 1.8, 1);
    brokenBusGroup.add(smoke);
    
    // Убираем поворот - автобус стоит нормально (передом вперед)
    // brokenBusGroup.rotation.y = Math.PI;
    
    brokenBusGroup.position.set(LANES[lane], 0, chickenPosition.z - distance);
    brokenBusGroup.userData = { lane: lane, type: 'brokenBus' };
    
    brokenBuses.push(brokenBusGroup);
    scene.add(brokenBusGroup);
}

function setupEventListeners() { // Ярко-желтый
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.6;
    base.castShadow = true;
    barrierGroup.add(base);
    
    // Диагональные черно-желтые полосы
    for (let i = 0; i < 4; i++) {
        const stripeGeometry = new THREE.BoxGeometry(0.3, 0.8, 0.11);
        const isBlack = i % 2 === 0;
        const stripeMaterial = new THREE.MeshLambertMaterial({ 
            color: isBlack ? 0x000000 : 0xffff00 
        });
        const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
        stripe.position.set(-0.75 + i * 0.5, 0.6, 0);
        stripe.rotation.z = Math.PI / 8; // Диагональный наклон
        barrierGroup.add(stripe);
    }
    
    // Усиливающие металлические балки (черные)
    const beamGeometry = new THREE.BoxGeometry(1.9, 0.08, 0.12);
    const beamMaterial = new THREE.MeshLambertMaterial({ color: 0x222222 }); // Темно-черный
    
    const topBeam = new THREE.Mesh(beamGeometry, beamMaterial);
    topBeam.position.set(0, 1.0, 0);
    topBeam.castShadow = true;
    barrierGroup.add(topBeam);
    
    const bottomBeam = new THREE.Mesh(beamGeometry, beamMaterial);
    bottomBeam.position.set(0, 0.2, 0);
    bottomBeam.castShadow = true;
    barrierGroup.add(bottomBeam);
    
    // Бетонные основания (темно-серые)
    const foundationGeometry = new THREE.BoxGeometry(0.4, 0.3, 0.4);
    const foundationMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 }); // Темно-серый бетон
    
    const leftFoundation = new THREE.Mesh(foundationGeometry, foundationMaterial);
    leftFoundation.position.set(-0.8, 0.15, 0);
    leftFoundation.castShadow = true;
    barrierGroup.add(leftFoundation);
    
    const rightFoundation = new THREE.Mesh(foundationGeometry, foundationMaterial);
    rightFoundation.position.set(0.8, 0.15, 0);
    rightFoundation.castShadow = true;
    barrierGroup.add(rightFoundation);
    
    // Металлические стойки (черные)
    const postGeometry = new THREE.BoxGeometry(0.12, 1.2, 0.12);
    const postMaterial = new THREE.MeshLambertMaterial({ color: 0x111111 }); // Черный металл
    
    const leftPost = new THREE.Mesh(postGeometry, postMaterial);
    leftPost.position.set(-0.8, 0.75, 0);
    leftPost.castShadow = true;
    barrierGroup.add(leftPost);
    
    const rightPost = new THREE.Mesh(postGeometry, postMaterial);
    rightPost.position.set(0.8, 0.75, 0);
    rightPost.castShadow = true;
    barrierGroup.add(rightPost);
    
    // Предупреждающие огни (желтые)
    const lightGeometry = new THREE.SphereGeometry(0.08, 8, 6);
    const lightMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xffff00,
        emissive: 0x333300 // Желтое свечение
    });
    
    const leftLight = new THREE.Mesh(lightGeometry, lightMaterial);
    leftLight.position.set(-0.8, 1.3, 0);
    barrierGroup.add(leftLight);
    
    const rightLight = new THREE.Mesh(lightGeometry, lightMaterial);
    rightLight.position.set(0.8, 1.3, 0);
    barrierGroup.add(rightLight);
    
    barrierGroup.position.set(LANES[lane], 0, chickenPosition.z - distance);
    barrierGroup.userData = { lane: lane, type: 'barrier' };
    
    barriers.push(barrierGroup);
    scene.add(barrierGroup);
}

function setupEventListeners() {
    // Обработка клавиатуры
    document.addEventListener('keydown', (event) => {
        keys[event.code] = true;
    });
    
    document.addEventListener('keyup', (event) => {
        keys[event.code] = false;
    });
    
    // Изменение размера окна
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function handleInput() {
    if (gameState !== 'playing') return;
    
    // Движение по полосам
    if ((keys['KeyA'] || keys['ArrowLeft']) && currentLane > 0) {
        currentLane--;
        targetX = LANES[currentLane];
        // Убираем повторное нажатие
        keys['KeyA'] = false;
        keys['ArrowLeft'] = false;
    } else if ((keys['KeyD'] || keys['ArrowRight']) && currentLane < LANES.length - 1) {
        currentLane++;
        targetX = LANES[currentLane];
        // Убираем повторное нажатие
        keys['KeyD'] = false;
        keys['ArrowRight'] = false;
    }
    
    // Прыжок
    if (keys['Space'] && !isJumping) {
        chickenVelocity.y = 0.4; // Увеличили силу прыжка
        isJumping = true;
        keys['Space'] = false; // Убираем повторное нажатие
    }
}

function updateChicken() {
    if (gameState !== 'playing') return;
    
    // Курица автоматически бежит вперед (медленнее)
    chickenPosition.z -= gameSpeed * 1.5;
    
    // Плавное движение к целевой позиции по X
    const moveSpeed = 0.15;
    if (Math.abs(chickenPosition.x - targetX) > 0.1) {
        if (chickenPosition.x < targetX) {
            chickenPosition.x += moveSpeed;
        } else {
            chickenPosition.x -= moveSpeed;
        }
    } else {
        chickenPosition.x = targetX; // Точное позиционирование
    }
    
    // Проверяем коллизию с пандусом для определения высоты
    const targetRampHeight = checkRampCollision();
    
    // Применение скорости по Y (прыжки)
    chickenPosition.y += chickenVelocity.y;
    
    // Гравитация и обработка пандуса
    if (isJumping) {
        chickenVelocity.y -= 0.02;
        // Если курица на пандусе, минимальная высота = высота пандуса
        const minHeight = onRamp ? targetRampHeight : 0.5;
        if (chickenPosition.y <= minHeight) {
            chickenPosition.y = minHeight;
            chickenVelocity.y = 0;
            isJumping = false;
        }
    } else {
        // Если курица не прыгает, плавно адаптируем её высоту к пандусу
        if (onRamp) {
            const heightDiff = targetRampHeight - chickenPosition.y;
            if (Math.abs(heightDiff) > 0.05) {
                chickenPosition.y += heightDiff * 0.2; // Плавное поднятие/опускание
            } else {
                chickenPosition.y = targetRampHeight;
            }
        } else {
            // Плавное опускание на землю, если курица не на пандусе
            if (chickenPosition.y > 0.5) {
                chickenPosition.y = Math.max(0.5, chickenPosition.y - 0.1);
            }
        }
    }
    
    // Обновление позиции курицы
    chicken.position.set(chickenPosition.x, chickenPosition.y, chickenPosition.z);
    
    // Анимация курицы
    chicken.rotation.y = Math.sin(Date.now() * 0.01) * 0.1;
    
    // Наклон курицы при движении по пандусу
    if (onRamp && targetRampHeight > 0.5) {
        // Курица на пандусе или на крыше автобуса
        if (targetRampHeight < 1.8) {
            chicken.rotation.x = -0.2; // Легкий наклон вперед при подъеме по пандусу
        } else {
            chicken.rotation.x = 0; // Прямо на крыше (обычный или сломанный автобус)
        }
    } else {
        chicken.rotation.x = 0; // Обычное положение
    }
    
    chicken.children[0].rotation.x = Math.sin(Date.now() * 0.02) * 0.1; // Качание тела
}

function updateCars() {
    for (let i = cars.length - 1; i >= 0; i--) {
        const car = cars[i];
        car.position.z += car.userData.speed;
        
        // Удаление машин, которые ушли за курицу
        if (car.position.z > 10) {
            scene.remove(car);
            cars.splice(i, 1);
            continue;
        }
        
        // Проверка столкновения с курицей
        const distance = Math.sqrt(
            Math.pow(car.position.x - chickenPosition.x, 2) +
            Math.pow(car.position.z - chickenPosition.z, 2)
        );
        
        // Столкновение происходит только если курица достаточно низко (не прыгает)
        // Высота машины примерно 1.4, поэтому если курица выше 1.8 - она перепрыгивает
        if (distance < 1.2 && chickenPosition.y < 1.8) {
            gameOver();
        }
    }
}

function updateBarriers() {
    for (let i = barriers.length - 1; i >= 0; i--) {
        const barrier = barriers[i];
        
        // Удаление ограждений, которые ушли за курицу (уменьшили расстояние)
        if (barrier.position.z > chickenPosition.z + 5) {
            scene.remove(barrier);
            barriers.splice(i, 1);
            continue;
        }
        
        // Проверка столкновения с курицей
        const distance = Math.sqrt(
            Math.pow(barrier.position.x - chickenPosition.x, 2) +
            Math.pow(barrier.position.z - chickenPosition.z, 2)
        );
        
        // Столкновение происходит только если курица достаточно низко (не прыгает)
        // Высота ограждения 1.2, поэтому если курица выше 1.5 - она перепрыгивает
        if (distance < 1.0 && chickenPosition.y < 1.5) {
            gameOver();
        }
    }
}

function updateBuses() {
    for (let i = buses.length - 1; i >= 0; i--) {
        const bus = buses[i];
        bus.position.z += bus.userData.speed;
        
        // Удаление автобусов, которые ушли за курицу
        if (bus.position.z > chickenPosition.z + 15) {
            scene.remove(bus);
            buses.splice(i, 1);
            continue;
        }
        
        // Проверка возможности запрыгнуть на автобус
        const distance = Math.sqrt(
            Math.pow(bus.position.x - chickenPosition.x, 2) +
            Math.pow(bus.position.z - chickenPosition.z, 2)
        );
        
        // Если курица достаточно высоко (прыгает) и близко к автобусу
        if (distance < 1.5) {
            if (chickenPosition.y > 1.5) {
                // Курица прыгает достаточно высоко - может приземлиться на автобус
                // Не убиваем курицу, позволяем ей бегать по автобусу
                continue;
            } else {
                // Курица на уровне земли - столкновение с автобусом
                gameOver();
            }
        }
    }
}

function updateBrokenBuses() {
    for (let i = brokenBuses.length - 1; i >= 0; i--) {
        const brokenBus = brokenBuses[i];
        
        // Удаление сломанных автобусов, которые ушли за курицу
        if (brokenBus.position.z > chickenPosition.z + 15) {
            scene.remove(brokenBus);
            brokenBuses.splice(i, 1);
            continue;
        }
        
        // Сломанные автобусы статичны - не двигаются
        // Не проверяем столкновение - курица может забираться на них как на пандус
    }
}

// Функция для проверки и обработки движения курицы по пандусу
function checkRampCollision() {
    onRamp = false; // Сброс состояния
    let targetHeight = 0.5; // Высота земли по умолчанию
    
    for (let brokenBus of brokenBuses) {
        const busX = brokenBus.position.x;
        const busZ = brokenBus.position.z;
        
        // Проверяем, находится ли курица в зоне сломанного автобуса
        const distanceX = Math.abs(chickenPosition.x - busX);
        
        if (distanceX < 1.2) { // В правильной полосе
            
            // Зона пандуса - пандус расположен от busZ + 2.5 до busZ + 6.5
            if (chickenPosition.z <= busZ + 6.5 && chickenPosition.z >= busZ + 2.5) {
                onRamp = true;
                
                // Простой линейный расчет высоты пандуса
                // В начале пандуса (busZ + 6.5) высота = 0.5 (земля)
                // В конце пандуса (busZ + 2.5) высота = 2.0 (подводит к крыше)
                const rampStart = busZ + 6.5;  // Начало (низко)
                const rampEnd = busZ + 2.5;    // Конец (высоко)
                const progress = (rampStart - chickenPosition.z) / (rampStart - rampEnd); // 0 до 1
                
                targetHeight = 0.5 + progress * 1.5; // От 0.5 до 2.0
                rampHeight = targetHeight;
                return targetHeight;
            }
            
            // Зона на крыше автобуса
            if (chickenPosition.z >= busZ - 3 && chickenPosition.z <= busZ + 2.5) {
                onRamp = true;
                targetHeight = 2.0; // НА крыше
                rampHeight = targetHeight;
                return targetHeight;
            }
        }
    }
    
    // Проверяем обычные автобусы (можно запрыгнуть на них)
    for (let bus of buses) {
        const busX = bus.position.x;
        const busZ = bus.position.z;
        
        // Проверяем, находится ли курица в зоне обычного автобуса
        const distanceX = Math.abs(chickenPosition.x - busX);
        const distanceZ = Math.abs(chickenPosition.z - busZ);
        
        if (distanceX < 1.2 && distanceZ < 4.5) { // В зоне автобуса
            
            // Зона на крыше обычного автобуса
            if (chickenPosition.z >= busZ - 4 && chickenPosition.z <= busZ + 4) {
                onRamp = true;
                targetHeight = 1.9; // НА крыше обычного автобуса (крыша на 1.7 + 0.2)
                rampHeight = targetHeight;
                return targetHeight;
            }
        }
    }
    
    return targetHeight;
}

function createCoinEffect(position) {
    const particleCount = 10;
    for (let i = 0; i < particleCount; i++) {
        const particleGeometry = new THREE.SphereGeometry(0.05);
        const particleMaterial = new THREE.MeshLambertMaterial({ color: 0xffd700 });
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        particle.position.copy(position);
        particle.userData = {
            velocity: {
                x: (Math.random() - 0.5) * 0.3,
                y: Math.random() * 0.3,
                z: (Math.random() - 0.5) * 0.3
            },
            life: 1.0
        };
        
        particles.push(particle);
        scene.add(particle);
    }
}

function updateRoad() {
    // Создаем новые сегменты дороги впереди курицы
    while (lastRoadZ > chickenPosition.z - 100) {
        createRoadSegment(lastRoadZ - 20);
    }
    
    // Удаляем старые сегменты дороги позади курицы
    for (let i = roadSegments.length - 1; i >= 0; i--) {
        const segment = roadSegments[i];
        if (segment.userData.zPosition > chickenPosition.z + 50) {
            scene.remove(segment);
            roadSegments.splice(i, 1);
        }
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        const userData = particle.userData;
        
        // Обновление позиции
        particle.position.x += userData.velocity.x;
        particle.position.y += userData.velocity.y;
        particle.position.z += userData.velocity.z;
        
        // Гравитация для частиц
        userData.velocity.y -= 0.01;
        
        // Уменьшение жизни
        userData.life -= 0.05;
        particle.material.opacity = userData.life;
        
        // Удаление мертвых частиц
        if (userData.life <= 0) {
            scene.remove(particle);
            particles.splice(i, 1);
        }
    }
}

function spawnCars() {
    const currentTime = Date.now();
    // Машины появляются раз в 3 секунды (3000 миллисекунд)
    if (currentTime - lastCarSpawnTime > 3000) {
        lastCarSpawnTime = currentTime;
        
        // Выбираем случайную свободную полосу (одна полоса всегда остается свободной)
        const freeLane = Math.floor(Math.random() * LANES.length);
        const availableLanes = [];
        
        // Добавляем все полосы кроме свободной
        for (let i = 0; i < LANES.length; i++) {
            if (i !== freeLane) {
                availableLanes.push(i);
            }
        }
        
        // Создаем машины на доступных полосах (максимум 2 из 3 полос)
        const numCars = Math.floor(Math.random() * availableLanes.length) + 1;
        const shuffledLanes = availableLanes.sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < numCars; i++) {
            createCar(shuffledLanes[i], CAR_SPAWN_DISTANCE + Math.random() * 5);
        }
    }
}

function spawnBarriers() {
    const currentTime = Date.now();
    // Ограждения появляются раз в 4 секунды (4000 миллисекунд)
    if (currentTime - lastBarrierSpawnTime > 4000) {
        lastBarrierSpawnTime = currentTime;
        
        // Проверяем, нет ли уже активных ограждений впереди курицы
        const hasActiveBarriers = barriers.some(barrier => 
            barrier.position.z < chickenPosition.z - 10
        );
        
        // Создаем новое ограждение только если нет активных ограждений впереди
        if (!hasActiveBarriers) {
            // Выбираем только ОДНУ случайную полосу для ограждения
            const selectedLane = Math.floor(Math.random() * LANES.length);
            createBarrier(selectedLane, 25 + Math.random() * 5);
        }
    }
}

function spawnBuses() {
    const currentTime = Date.now();
    // Автобусы появляются редко - раз в 8 секунд (8000 миллисекунд)
    if (currentTime - lastBusSpawnTime > 8000) {
        lastBusSpawnTime = currentTime;
        
        // Проверяем, нет ли уже активного автобуса
        const hasActiveBus = buses.length > 0;
        
        // Создаем автобус только если нет активного автобуса (максимум 1)
        if (!hasActiveBus && Math.random() < 0.7) { // 70% шанс появления
            // Выбираем случайную полосу для автобуса
            const selectedLane = Math.floor(Math.random() * LANES.length);
            createBus(selectedLane, 30 + Math.random() * 10);
        }
    }
}

function spawnBrokenBuses() {
    const currentTime = Date.now();
    // Сломанные автобусы появляются чаще - раз в 6 секунд (6000 миллисекунд)
    if (currentTime - lastBrokenBusSpawnTime > 6000) {
        lastBrokenBusSpawnTime = currentTime;
        
        // Проверяем, нет ли уже активного сломанного автобуса
        const hasActiveBrokenBus = brokenBuses.length > 0;
        
        // Создаем сломанный автобус только если нет активного (максимум 1)
        if (!hasActiveBrokenBus && Math.random() < 0.8) { // 80% шанс появления
            // Выбираем случайную полосу для сломанного автобуса
            const selectedLane = Math.floor(Math.random() * LANES.length);
            createBrokenBus(selectedLane, 35 + Math.random() * 10);
        }
    }
}

function updateCamera() {
    if (gameState === 'playing') {
        // Камера следует за курицей
        camera.position.x = chickenPosition.x * 0.3;
        camera.position.z = chickenPosition.z + 8;
        camera.lookAt(chickenPosition.x, chickenPosition.y + 1, chickenPosition.z - 2);
    }
}

function updateUI() {
    if (gameState === 'playing') {
        const currentTime = Date.now();
        // Добавляем 1 очко каждые 250 миллисекунд
        if (currentTime - lastScoreTime >= 250) {
            score++;
            lastScoreTime = currentTime;
        }
        document.getElementById('score').textContent = score;
    }
}

function gameOver() {
    gameState = 'gameOver';
    
    // Сохраняем рекорд
    saveHighScore(score);
    
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOver').style.display = 'block';
}

function startGame() {
    gameState = 'playing';
    
    // Скрываем все меню
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameOver').style.display = 'none';
    
    // Сброс игровых переменных
    score = 0;
    coinCount = 0;
    gameSpeed = 0.1;
    chickenPosition = { x: 0, y: 0.5, z: 0 };
    chickenVelocity = { x: 0, y: 0, z: 0 };
    isJumping = false;
    lastCarSpawnTime = Date.now(); // Сброс времени появления машин
    lastBusSpawnTime = Date.now(); // Сброс времени появления автобусов
    lastBrokenBusSpawnTime = Date.now(); // Сброс времени появления сломанных автобусов
    lastBarrierSpawnTime = Date.now(); // Сброс времени появления ограждений
    lastScoreTime = Date.now(); // Сброс времени для начисления очков
    lastRoadZ = 0;
    currentLane = 1; // Начинаем с центральной полосы
    targetX = LANES[currentLane]; // Устанавливаем целевую позицию
    
    // Очистка объектов
    cars.forEach(car => scene.remove(car));
    cars = [];
    buses.forEach(bus => scene.remove(bus));
    buses = [];
    brokenBuses.forEach(brokenBus => scene.remove(brokenBus));
    brokenBuses = [];
    barriers.forEach(barrier => scene.remove(barrier));
    barriers = [];
    particles.forEach(particle => scene.remove(particle));
    particles = [];
    roadSegments.forEach(segment => scene.remove(segment));
    roadSegments = [];
    
    // Создание новой дороги
    createRoad();
    
    // Сброс позиции курицы
    chicken.position.set(0, 0.5, 0);
}

function restartGame() {
    startGame();
}

function animate() {
    requestAnimationFrame(animate);
    
    if (gameState === 'playing') {
        handleInput();
        updateChicken();
        updateRoad();
        updateCars();
        updateBuses();
        updateBrokenBuses();
        updateBarriers();
        updateParticles();
        updateCamera();
        updateUI();
        spawnCars();
        spawnBuses();
        spawnBrokenBuses();
        spawnBarriers();
        
        // Убираем автоматическое увеличение скорости
        // gameSpeed += 0.0001;
    }
    
    renderer.render(scene, camera);
}

// Инициализация игры при загрузке страницы
window.addEventListener('load', init);

// ===============================
// ФУНКЦИИ УПРАВЛЕНИЯ ГЛАВНЫМ МЕНЮ
// ===============================

function showInstructions() {
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('instructionsScreen').classList.remove('hidden');
}

function showHighScores() {
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('highScoresScreen').classList.remove('hidden');
    
    // Здесь можно добавить загрузку рекордов из localStorage
    updateHighScoresDisplay();
}

function showSettings() {
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('settingsScreen').classList.remove('hidden');
    
    // Обновляем кнопку качества при открытии настроек
    updateQualityButton();
}

function backToMainMenu() {
    // Скрываем все экраны
    document.getElementById('instructionsScreen').classList.add('hidden');
    document.getElementById('highScoresScreen').classList.add('hidden');
    document.getElementById('settingsScreen').classList.add('hidden');
    document.getElementById('gameOver').style.display = 'none';
    
    // Показываем главное меню
    document.getElementById('mainMenu').classList.remove('hidden');
    
    // Сбрасываем состояние игры
    gameState = 'menu';
}

function updateHighScoresDisplay() {
    // Получаем рекорды из localStorage или используем пустой массив
    let highScores = JSON.parse(localStorage.getItem('chickenRunHighScores')) || [];
    
    let scoresHTML = '';
    if (highScores.length === 0) {
        scoresHTML = '<p style="text-align: center; opacity: 0.7;">Пока нет рекордов. Начните играть!</p>';
    } else {
        scoresHTML = '<ol>';
        highScores.slice(0, 10).forEach((score, index) => {
            scoresHTML += `<li>Счёт: ${score.score}</li>`;
        });
        scoresHTML += '</ol>';
    }
    
    document.getElementById('scoresTable').innerHTML = scoresHTML;
}

function saveHighScore(score) {
    let highScores = JSON.parse(localStorage.getItem('chickenRunHighScores')) || [];
    
    // Добавляем новый результат
    highScores.push({ score: score, date: new Date().toLocaleDateString() });
    
    // Сортируем по убыванию счёта
    highScores.sort((a, b) => b.score - a.score);
    
    // Оставляем только топ-10
    highScores = highScores.slice(0, 10);
    
    // Сохраняем в localStorage
    localStorage.setItem('chickenRunHighScores', JSON.stringify(highScores));
}

// Функции настроек
function toggleQuality() {
    const qualityLevels = ['high', 'normal', 'low', 'awful'];
    const qualityNames = ['Высокое', 'Среднее', 'Низкое', 'Ультра-низкое'];
    
    const currentIndex = qualityLevels.indexOf(graphicsQuality);
    const nextIndex = (currentIndex + 1) % qualityLevels.length;
    
    graphicsQuality = qualityLevels[nextIndex];
    
    // Обновляем текст кнопки
    const qualityButton = document.getElementById('qualityButton');
    if (qualityButton) {
        qualityButton.textContent = qualityNames[nextIndex];
    }
    
    // Сохраняем настройку в localStorage
    localStorage.setItem('chickenRunGraphicsQuality', graphicsQuality);
    
    console.log('Качество графики изменено на:', qualityNames[nextIndex]);
}

function toggleDifficulty() {
    console.log('Переключение сложности (пока не реализовано)');
}