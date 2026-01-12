// ==================== КОНФИГУРАЦИЯ ====================
const GAME_CONFIG = {
    canvasWidth: 800,
    canvasHeight: 600,
    gravity: 0.2,          // базовая гравитация
    jumpPower: 5,           // мощность прыжка (уменьшена)
    pipeSpeed: 5,           // скорость движения труб (базовая, 0.75 на старте)
    pipeSpacing: 200,       // минимальное расстояние между трубами
    pipeGapSize: 180,       // размер проёма между трубами (увеличено до 180)
    maxGapHeightDifference: 75, // максимальное изменение высоты зазора между соседними трубами
    baseSpeedMultiplier: 0.75,  // базовый множитель скорости (замедление на 25%)
    speedAcceleration: 0.0001,  // ускорение скорости со временем
};

// ==================== СИСТЕМА ПЕРСОНАЖЕЙ ====================
const CHARACTERS = {
    normal: {
        name: 'Обычный',
        price: 0,
        color: '#FF9500',
        description: 'Стандартная оранжевая птица',
        abilities: 'Стандартный полёт и прыжок'
    },
    knight: {
        name: 'Рыцарь',
        price: 40,
        color: '#C0C0C0',
        description: '2 брони, неуязвимость после спасения',
        abilities: '2 брони перед первым попаданием, неуязвимость 2 сек после спасения',
        debuffs: 'Гравитация +25%',
        armor: 2,
        gravityMultiplier: 1.25,
        invulnTime: 2000
    },
    ninja: {
        name: 'Ниндзя',
        price: 40,
        color: '#000000',
        description: 'Быстрая и ловкая птица',
        abilities: 'Скорость игры -25%',
        debuffs: 'Проём -15%',
        speedMultiplier: 0.75,
        gapMultiplier: 0.85
    },
    neon: {
        name: 'Неон',
        price: 60,
        color: '#a6ff00ff',
        description: 'Светящаяся птица неонового света',
        abilities: 'Проём +25%, неоновое свечение',
        debuffs: 'Скорость игры +10%',
        gapMultiplier: 1.25,
        speedMultiplier: 1.1,
        glowEffect: true
    },
    golden: {
        name: 'Золотая птица',
        price: 80,
        color: '#FFD700',
        description: 'Золотая птица, привлекающая монеты',
        abilities: 'Монеты x2',
        debuffs: 'Проём -15%',
        coinMultiplier: 2,
        gapMultiplier: 0.85
    },
    robot: {
        name: 'Робот',
        price: 100,
        color: '#808080',
        description: 'Механический робот-птица',
        abilities: 'Неуязвимый танк, автопилот (E) на 5 сек',
        debuffs: 'Гравитация +15%',
        hasAbility: 'autopilot',
        abilityDuration: 5000,
        isRobot: true,
        gravityMultiplier: 1.15
    },
    cloud: {
        name: 'Птица-облако',
        price: 150,
        color: '#ADD8E6',
        description: 'Лёгкая как облако птица',
        abilities: 'Гравитация -25%',
        gravityMultiplier: 0.75
    },
    phoenix: {
        name: 'Феникс',
        price: 200,
        color: '#FF4500',
        description: '4 жизни с разными эффектами огня',
        abilities: '4 жизни, эффекты огня при повреждениях',
        debuffs: 'Расстояние между трубами -15%',
        lives: 4,
        fireEffect: true,
        pipeDistanceMultiplier: 0.85
    },
    diamond: {
        name: 'Алмазная птица',
        price: 300,
        color: '#00CED1',
        description: 'Сияющая алмазная птица',
        abilities: 'Монеты x3, магнит для монет (радиус 100px), блеск алмазов',
        debuffs: 'Проём -10%',
        coinMultiplier: 3,
        magnetRadius: 100,
        sparkleEffect: true,
        gapMultiplier: 0.9
    },
    jelly: {
        name: 'Желейная птица',
        price: 700,
        color: '#FF0000',
        description: 'Мягкая и гибкая птица',
        abilities: 'Мягкая зона столкновения на краях труб',
        isJelly: true
    },
    astral: {
        name: 'Астральная птица',
        price: 800,
        color: '#9370DB',
        description: 'Мистическая птица другого измерения',
        abilities: 'Каждые 8 труб - одна пара астральных труб',
        isAstral: true
    },
    echo: {
        name: 'Птица-Эхо',
        price: 1000,
        color: '#20B2AA',
        description: 'Птица, контролирующая время',
        abilities: 'E: Замедлить время на 1 сек (cooldown 10 сек)',
        isEcho: true
    },
    primordial: {
        name: 'Первородная птица',
        price: 1200,
        color: '#8B4513',
        description: 'Древняя и мощная птица',
        abilities: 'E: Лететь прямо 5 секунд (одноразовая)',
        debuffs: '2 жизни вместо стандартных',
        hasAbility: 'straightFlight',
        abilityDuration: 5000,
        lives: 2,
        coinMultiplier: 2
    },
    spark: {
        name: 'Птица-Искра',
        price: 1500,
        color: '#FFFF00',
        description: 'Электрическая птица высокой энергии',
        abilities: 'Каждые 15 труб - искра, спасающая от столкновения',
        isSpark: true
    },
    greatPhoenix: {
        name: 'Великий Феникс',
        price: 2500,
        color: '#df4e00ff',
        description: 'Легендарная птица огня и возрождения',
        abilities: 'E: Режим ярости (одноразовая), огненная стена при 1 жизни',
        debuffs: '3 жизни, расстояние между трубами -15%',
        lives: 3,
        phoenixEffect: true
    }
};

// ==================== СИСТЕМА ТЕМ ====================
const THEMES = {
    day: {
        name: 'День',
        price: 0,
        background: 'linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 100%)',
        description: 'Стандартное дневное небо'
    },
    night: {
        name: 'Ночь',
        price: 50,
        background: 'linear-gradient(to bottom, #191970 0%, #000080 100%)',
        description: 'Тёмное ночное небо с луной'
    },
    sunset: {
        name: 'Закат',
        price: 50,
        background: 'linear-gradient(to bottom, #FF4500 0%, #FFA500 50%, #FFD700 100%)',
        description: 'Красивый закат с оранжевыми тонами'
    },
    neonCity: {
        name: 'Неон-Сити',
        price: 100,
        background: 'linear-gradient(to bottom, #000000 0%, #1a1a1a 50%, #000000 100%)',
        description: 'Неоновый город с яркими цветами'
    },
    moon: {
        name: 'Луна',
        price: 200,
        background: 'image', // Используется moon.png
        description: 'Лунная поверхность с шипами'
    },
    ash: {
        name: 'Пепел',
        price: 200,
        background: 'image', // Используется ash.png
        description: 'Серый пепельный фон с дождём пепла'
    }
};

// ==================== КЛАСС ПТИЦА ====================
class Bird {
    constructor(x, y, skin, theme, game) {
        this.x = x;
        this.y = y;
        this.width = 34 * (GAME_CONFIG.scale || 1);
        this.height = 24 * (GAME_CONFIG.scale || 1);
        this.velocityY = 0;
        this.skin = skin;
        this.theme = theme;
        this.game = game;
        
        // Параметры скина
        this.gravity = GAME_CONFIG.gravity * (skin.gravityMultiplier || 1);
        this.coinMultiplier = skin.coinMultiplier || 1;
        this.armor = skin.armor || 0;
        this.armorDamaged = 0; // сколько раз броня была повреждена (0, 1, 2)
        this.lives = (skin.lives || 1) - 1; // количество спасений
        this.maxLives = this.phoenixEffect ? 2 : (skin.lives || 1) - 1; // максимальное количество спасений для восстановления
        this.invulnerableUntil = 0;
        
        // Для визуализации Феникса (огонь зависит от жизней)
        this.fireIntensity = 3; // 3 - сильный, 2 - слабый, 1 - нет огня только пепел, 0 - нет эффекта
        
        this.fireParticles = [];
        this.ashParticles = [];
        
        // Способность робота
        this.hasAbility = skin.hasAbility === 'autopilot';
        this.abilityActive = false;
        this.abilityUsed = false;
        this.abilityEndTime = 0;
        
        // Новые супер-птицы
        this.isJelly = skin.isJelly || false;
        this.isAstral = skin.isAstral || false;
        this.isSpark = skin.isSpark || false;
        this.phoenixEffect = skin.phoenixEffect || false;
        this.isEcho = skin.isEcho || false;
        this.hasStraightFlight = skin.hasAbility === 'straightFlight';
        
        this.astralAngle = 0;
        this.phoenixFireMode = false;
        this.phoenixAbilityUsed = false; // флаг использования способности Великого Феникса
        this.straightFlightEndTime = 0;
        
        // Счетчики для астральной и искры
        this.pipesPassed = 0;
        this.astralCount = 0; // Количество астральных труб
        this.sparkAvailable = false;
        this.fireWallCount = 0; // Количество огненных стен для Феникса
        this.totalFireWalls = 0; // Общее количество созданных огненных стен
        
        // Частицы молний для Искры
        this.lightningParticles = [];
        
        // Команда /ignore
        this.ignorePipes = false;
        
        // Для эха: карта столкновений с трубами
        this.echoCollisions = new Map(); // pipeId -> count
        this.hasUsedEcho = false; // флаг, использовал ли эхо
        this.echoCooldownEndTime = 0; // время окончания cooldown способности эха
        
        // Для первородной: способность
        this.straightFlightActive = false;
        this.straightFlightUsed = false;
        this.straightFlightEndTime = 0;
        
        // Эффекты
        this.fireParticles = [];
        this.sparkles = [];
        this.ashParticles = [];
        
        // Поворот при падении
        this.rotation = 0;
        
        // Неон цвет
        this.neonColorIndex = 0;
        this.neonColors = ['#00FF00', '#FF00FF', '#00FFFF', '#FFFF00', '#FF0080', '#80FF00', '#00FF80', '#8000FF'];
    }

    // Прыжок (при нажатии Space/клик)
    jump() {
        // Неуязвимость не блокирует прыжок
        this.velocityY = -GAME_CONFIG.jumpPower;
        this.rotation = -0.3;
    }

    // Проверка неуязвимости
    isInvulnerable() {
        return Date.now() < this.invulnerableUntil;
    }

    // Получить неуязвимость на время
    setInvulnerable(ms) {
        this.invulnerableUntil = Date.now() + ms;
    }

    // Спасение от удара (используется броню или жизнь)
    takeDamage() {
        if (this.isInvulnerable()) return false;

        // Робот неуязвим только во время способности и 1 сек после
        if (this.skin.isRobot && (this.abilityActive || (Date.now() - this.abilityEndTime < 1000))) return false;

        // Попытка использовать броню (рыцарь)
        if (this.armor > 0) {
            this.armor--;
            this.armorDamaged++;
            this.setInvulnerable(this.skin.invulnTime || 1000);
            return false;
        }

        // Попытка использовать жизнь (феникс)
        if (this.lives > 0) {
            this.lives--;
            // Сброс скорости для revive (без изменения позиции Y)
            this.velocityY = 0;
            // Для первородной: только 1 сек неуязвимости (без иммунитета к трубам)
            if (this.hasStraightFlight) {
                this.setInvulnerable(1000);
            } else {
                this.setInvulnerable(3000); // Длинная неуязвимость для остальных
            }
            // Для первородной: после первой смерти coinMultiplier = 1
            if (this.hasStraightFlight && this.lives == 1) {
                this.coinMultiplier = 1;
            }
            if (this.phoenixEffect) {
                // Великий Феникс: больше не активируется автоматически при смерти
                // Способность теперь активируется вручную по E
            } else if (this.skin.fireEffect) {
                // Обычный Феникс: обновляем интенсивность огня
                if (this.lives === 3) {
                    this.fireIntensity = 3; // сильный огонь
                } else if (this.lives === 2) {
                    this.fireIntensity = 3; // сильный огонь
                } else if (this.lives === 1) {
                    this.fireIntensity = 2; // слабый огонь
                } else if (this.lives === 0) {
                    this.fireIntensity = 1; // пепел
                }
                const invulnTimes = [3000, 2000, 1000];
                const invulnIndex = Math.max(0, 3 - this.lives);
                this.setInvulnerable(invulnTimes[invulnIndex] || 1000);
            }
            return false;
        } else if (this.skin.name === 'Феникс' && this.lives === 0) {
            // Феникс на последней жизни становится обычной птицей с 1 жизнью
            this.skin = CHARACTERS.normal;
            this.lives = 0; // 1 жизнь (0 спасений)
            this.fireIntensity = 0; // убрать эффекты огня
            this.setInvulnerable(1000);
            return false;
        }

        // Искра для птицы-Искры
        if (this.isSpark && this.sparkAvailable) {
            this.sparkAvailable = false;
            this.setInvulnerable(1000); // Короткая неуязвимость
            return false;
        }

        return true; // Смерть
    }

    // Обработка прохождения трубы
    pipePassed() {
        this.pipesPassed++;
        
        // Астральная птица: каждые 8 труб - 2 астральные трубы
        if (this.isAstral && this.pipesPassed % 8 === 0) {
            this.astralCount = 2;
        }
        
        // Птица-Искра: каждые 15 труб - искра
        if (this.isSpark && this.pipesPassed % 15 === 0) {
            this.sparkAvailable = true;
        }
        
        // Великий Феникс: счетчик огненных стен (если осталась 1 жизнь)
        if (this.phoenixEffect && this.lives === 0) {
            this.fireWallCount++;
        }
        
        // Птица-Эхо: сброс столкновений при прохождении
        if (this.isEcho) {
            this.echoCollisions.clear();
        }
    }

    // Обновление положения и физики
    update() {
        // Способность первородной птицы / режим ярости Великого Феникса
        if (this.straightFlightActive || this.phoenixFireMode) {
            this.velocityY = 0; // Отключить гравитацию
            // Фиксированная вертикальная позиция
            // Горизонтальная скорость обычная
        } else {
            // Гравитация
            this.velocityY += this.gravity;
        }
        this.y += this.velocityY;

        // Ограничение максимальной скорости
        if (this.velocityY > 15) {
            this.velocityY = 15;
        }

        // Поворот при движении (кроме Феникса в режиме ярости)
        if (!this.phoenixFireMode) {
            if (this.velocityY > 0) {
                this.rotation = Math.min(0.5, this.rotation + 0.05);
            } else {
                this.rotation = Math.max(-0.3, this.rotation - 0.05);
            }
        } else {
            // Феникс в ярости: горизонтальное положение
            this.rotation = 0;
        }

        // Обновление эффектов
        this.updateFireParticles();
        this.updateAshParticles();
        this.updateSparkles();
        
        // Вращение астральных частиц
        if (this.isAstral) {
            this.astralAngle += 0.05;
        }
        
        // Проверка окончания режима огня Феникса
        if (this.phoenixFireMode && this.straightFlightEndTime && Date.now() > this.straightFlightEndTime) {
            this.phoenixFireMode = false;
            this.setInvulnerable(1000); // 1 сек неуязвимости
            this.straightFlightEndTime = 0;
        }
        
        // Обновление частиц молний для Искры
        this.lightningParticles = this.lightningParticles.filter(p => p.life > 0);
        for (let p of this.lightningParticles) {
            p.life--;
            p.length += 2; // Вылетать наружу
        }
        if (this.isSpark && this.sparkAvailable && Math.random() < 0.3) { // 30% шанс спавна
            this.lightningParticles.push({
                angle: Math.random() * Math.PI * 2,
                length: 10,
                life: 20
            });
        }
        
        // Обновление неонового цвета
        if (this.skin.glowEffect) {
            this.neonColorIndex = (this.neonColorIndex + 0.08) % this.neonColors.length;
        }
    }

    // Обновление частиц огня (феникс)
    updateFireParticles() {
        this.fireParticles = this.fireParticles.filter(p => p.life > 0);
        for (let p of this.fireParticles) {
            p.life--;
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.3;
        }
    }

    // Обновление частиц пепла (феникс при последней жизни)
    updateAshParticles() {
        this.ashParticles = this.ashParticles.filter(p => p.life > 0);
        for (let p of this.ashParticles) {
            p.life--;
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1;
        }
    }

    // Обновление блеска (алмаз)
    updateSparkles() {
        this.sparkles = this.sparkles.filter(s => s.life > 0);
        for (let s of this.sparkles) {
            s.life--;
            s.angle += s.angleVel;
            s.x = this.x + Math.cos(s.angle) * s.radius;
            s.y = this.y + Math.sin(s.angle) * s.radius;
        }
    }

    // Добавить огневой эффект (феникс)
    addFireEffect() {
        // Для Великого Феникса и обычного феникса
        const isPhoenix = this.skin.fireEffect || this.phoenixEffect;
        if (!isPhoenix) return;
        
        if (this.phoenixEffect) {
            // Великий Феникс: частицы сзади (назад) и крылья в ярости
            const particleColor = this.phoenixFireMode ? '#ff4a03' : '#ffaa00'; // Яркий оранжевый (режим ярости) или оранжево-красный
            const particleCount = this.phoenixFireMode ? 8 : 5; // Больше частиц в ярости
            const particleLife = this.phoenixFireMode ? 35 : 20; // Дольше живут в ярости
            const particleSize = this.phoenixFireMode ? 6 + Math.random() * 4 : 4 + Math.random() * 3; // Крупнее в ярости
            
            for (let i = 0; i < particleCount; i++) {
                this.fireParticles.push({
                    x: this.x - 10, // Сзади (назад)
                    y: this.y + Math.random() * 20 - 10,
                    vx: -(Math.random() * 2 + 1), // В сторону от птицы (назад)
                    vy: Math.random() * 2 - 1,
                    life: particleLife,
                    size: particleSize,
                    color: particleColor
                });
            }
            
            // Крылья в режиме ярости: частицы по бокам
            if (this.phoenixFireMode) {
                for (let i = 0; i < 6; i++) {
                    // Левое крыло
                    this.fireParticles.push({
                        x: this.x - 5 + Math.random() * 10, // Рядом с телом
                        y: this.y - 8 + Math.random() * 6, // Сверху
                        vx: -(Math.random() * 1.5 + 0.5), // Влево-назад
                        vy: -(Math.random() * 1 + 0.5), // Вверх
                        life: particleLife,
                        size: particleSize * 0.8, // Немного меньше
                        color: particleColor
                    });
                    
                    // Правое крыло
                    this.fireParticles.push({
                        x: this.x - 5 + Math.random() * 10, // Рядом с телом
                        y: this.y + 2 + Math.random() * 6, // Снизу
                        vx: -(Math.random() * 1.5 + 0.5), // Влево-назад
                        vy: Math.random() * 1 + 0.5, // Вниз
                        life: particleLife,
                        size: particleSize * 0.8, // Немного меньше
                        color: particleColor
                    });
                }
            }
        } else if (this.fireIntensity === 1) {
            // Обычный Феникс: на последней жизни только пепел и искры
            // Пепел
            for (let i = 0; i < 2; i++) {
                this.ashParticles.push({
                    x: this.x - 10,
                    y: this.y + Math.random() * 20 - 10,
                    vx: Math.random() * 1 - 0.5,
                    vy: Math.random() * 1 - 2,
                    life: 15,
                    size: 2 + Math.random() * 2
                });
            }
            // Искры
            for (let i = 0; i < 1; i++) {
                this.sparkles.push({
                    angle: Math.random() * Math.PI * 2,
                    angleVel: 0.2,
                    radius: 20,
                    x: this.x,
                    y: this.y,
                    life: 20,
                    size: 2
                });
            }
        } else {
            // Обычный Феникс: огонь (при fireIntensity 2 или 3)
            const intensity = this.fireIntensity === 3 ? 5 : 3; // сильный или слабый огонь
            for (let i = 0; i < intensity; i++) {
                this.fireParticles.push({
                    x: this.x - 10,
                    y: this.y + Math.random() * 20 - 10,
                    vx: Math.random() * 2 - 1,
                    vy: Math.random() * 3 - 4,
                    life: this.fireIntensity === 3 ? 25 : 15,
                    size: (this.fireIntensity === 3 ? 6 : 4) + Math.random() * 3
                });
            }
        }
    }

    // Добавить блеск эффект (алмаз)
    addSparkleEffect() {
        if (!this.skin.sparkleEffect) return;
        const sparkle = {
            angle: Math.random() * Math.PI * 2,
            angleVel: 0.1 + Math.random() * 0.1,
            radius: 30,
            x: this.x,
            y: this.y,
            life: 30,
            size: 3
        };
        this.sparkles.push(sparkle);
    }

    // Рисование птицы
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // Увеличение размера для Великого Феникса в режиме ярости
        if (this.phoenixEffect && this.phoenixFireMode) {
            ctx.scale(1.5, 1.5); // 50% увеличение
        }
        
        ctx.rotate(this.rotation);

        // Специальная отрисовка для Искры при наличии способности
        if (this.isSpark && this.sparkAvailable) {
            // Жёлтый шар с пульсацией
            const pulse = 1 + 0.1 * Math.sin(Date.now() / 200);
            ctx.fillStyle = '#FFFF00';
            ctx.beginPath();
            ctx.arc(0, 0, 20 * pulse, 0, Math.PI * 2);
            ctx.fill();
            
            // Молнии из шара (частицы, вылетающие и исчезающие)
            ctx.strokeStyle = '#FFFF00';
            ctx.lineWidth = 2;
            for (let p of this.lightningParticles) {
                ctx.beginPath();
                ctx.moveTo(0, 0);
                let x = 0, y = 0;
                const segments = 6;
                const step = p.length / segments;
                for (let j = 1; j <= segments; j++) {
                    const dir = (j % 2 === 0) ? 1 : -1;
                    const offset = dir * 8;
                    x += Math.cos(p.angle) * step + Math.sin(p.angle) * offset;
                    y += Math.sin(p.angle) * step - Math.cos(p.angle) * offset;
                    ctx.lineTo(x, y);
                }
                ctx.globalAlpha = p.life / 20; // Fade out
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
            
            // Злой чёрный глаз (круглый, чуть выше, меньше)
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(0, -8, 4, 0, Math.PI * 2);
            ctx.fill();
            
            // Большой клюв
            ctx.fillStyle = '#FF8C00';
            ctx.beginPath();
            ctx.moveTo(16, -3);
            ctx.lineTo(24, -1);
            ctx.lineTo(16, 3);
            ctx.fill();
            
            // Контур клюва
            ctx.strokeStyle = '#FF6347';
            ctx.lineWidth = 1;
            ctx.stroke();
            
            ctx.restore();
            return;
        }

        // Переменная для изображения рыцаря
        let knightImg = null;
        if (this.skin.name === 'Рыцарь') {
            if (this.armorDamaged === 0 && this.game.themeImages.knight1 && this.game.themeImages.knight1.complete && this.game.themeImages.knight1.naturalWidth > 0) {
                knightImg = this.game.themeImages.knight1;
            } else if (this.armorDamaged === 1 && this.game.themeImages.knight2 && this.game.themeImages.knight2.complete && this.game.themeImages.knight2.naturalWidth > 0) {
                knightImg = this.game.themeImages.knight2;
            }
        }

        // ОСНОВНОЕ ТЕЛО с изменяемым цветом для неона
        let bodyColor = this.skin.color;
        if (this.skin.name === 'Неон') {
            // Неон - только glow эффекты, без тела
            this.neonColorIndex = (this.neonColorIndex + 0.08) % this.neonColors.length;
            const colorIndex = Math.floor(this.neonColorIndex);
            bodyColor = this.neonColors[colorIndex];
            
            // Яркий glow эффект
            ctx.shadowColor = bodyColor;
            ctx.shadowBlur = 25;
            ctx.globalAlpha = 0.9;
            
            // Не рисуем тело, только эффекты
        } else if (this.isJelly) {
            // Желейная: красная полупрозрачная
            bodyColor = 'rgba(255, 0, 0, 0.5)';
            ctx.shadowColor = 'red';
            ctx.shadowBlur = 5;
        } else if (this.isAstral) {
            // Астральная: фиолетовая
            bodyColor = '#9370DB';
            ctx.shadowColor = '#9370DB';
            ctx.shadowBlur = 15;
        } else if (this.phoenixEffect) {
            // Великий Феникс: золотой с огнём, или красный в режиме ярости
            if (this.phoenixFireMode) {
                bodyColor = '#8B0000'; // Тёмно-красный в режиме ярости
                ctx.shadowColor = '#FF6347';
            } else {
                bodyColor = '#FFD700'; // Золотой обычно
                ctx.shadowColor = '#FF4500';
            }
            ctx.shadowBlur = 20;
        } else if (this.isEcho) {
            // Эхо: teal цвет
            bodyColor = '#20B2AA';
        } else if (this.skin.isRobot) {
            // Робот - серые цвета
            bodyColor = '#707070';
            ctx.fillStyle = bodyColor;
        } else {
            ctx.fillStyle = bodyColor;
        }
        
        // Рисуем тело только если не Неон и не Рыцарь с изображением
        if (this.skin.name !== 'Неон' && !(this.skin.name === 'Рыцарь' && this.armorDamaged < 2 && knightImg) && !this.sparkAvailable) {
            if (this.phoenixEffect) {
                // Великий Феникс: оранжево-красная птица с анимированным огнём
                ctx.fillStyle = '#FF4500'; // Оранжево-красный
                ctx.beginPath();
                ctx.ellipse(0, 0, this.width / 2 + 3, this.height / 2 + 1, 0, 0, Math.PI * 2);
                ctx.fill();
            } else if (this.isJelly) {
                // Желейная: красная полупрозрачная
                ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
                ctx.beginPath();
                ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
                ctx.fill();
            } else if (this.isAstral) {
                // Астральная: фиолетовая
                ctx.fillStyle = '#9370DB';
                ctx.beginPath();
                ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
                ctx.fill();
            } else if (this.isEcho) {
                // Эхо: teal
                ctx.fillStyle = '#20B2AA';
                ctx.beginPath();
                ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.beginPath();
                ctx.ellipse(0, 0, this.width / 2 + 3, this.height / 2 + 1, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Белая обводка для тем Закат и Неон-Сити
            if (this.theme === 'sunset' || this.theme === 'neonCity') {
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;

        // Тень/объём для разных скинов
        if (this.skin.name === 'Рыцарь') {
            // Рисуем изображение рыцаря в зависимости от повреждений
            if (this.armorDamaged < 2 && knightImg) {
                ctx.drawImage(knightImg, -this.width * 0.6, -this.height * 0.6, this.width * 1.2, this.height * 1.2);
            }
        } else if (this.skin.name === 'Неон') {
            // Неон - простой небольшой блеск, цвет уже применён к телу
            ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.beginPath();
            ctx.ellipse(3, -2, this.width / 3, this.height / 4, 0, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.skin.name === 'Золотая птица') {
            // Золотой блеск для золотой птицы
            ctx.fillStyle = 'rgba(255, 215, 0, 0.4)';
            ctx.beginPath();
            ctx.ellipse(4, -3, this.width / 2.8, this.height / 3.5, 0, 0, Math.PI * 2);
            ctx.fill();
            // Дополнительный блик
            ctx.fillStyle = 'rgba(255, 255, 200, 0.3)';
            ctx.beginPath();
            ctx.ellipse(-3, 3, this.width / 4, this.height / 4, 0, 0, Math.PI * 2);
            ctx.fill();
            // Дополнительная чёрная полоска для ниндзи
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.beginPath();
            ctx.ellipse(0, -2, this.width / 3, this.height / 5, 0, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.skin.name === 'Робот') {
            // Красный энергетический щит перед роботом
            ctx.fillStyle = 'rgba(255, 0, 0, 0.6)';
            ctx.beginPath();
            ctx.ellipse(-12, 0, 8, this.height / 2 + 2, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Линии на роботе
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(-8, 0);
            ctx.lineTo(8, 0);
            ctx.stroke();
        } else if (this.skin.name === 'Феникс') {
            // УНИКАЛЬНЫЙ ДИЗАЙН ФЕНИКСА
            // Корона из пламени сверху
            ctx.fillStyle = '#FF6347'; // томатный красный
            ctx.beginPath();
            ctx.ellipse(0, -8, 6, 4, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Языки пламени вокруг тела
            ctx.fillStyle = '#FFD700';
            for (let i = 0; i < 3; i++) {
                const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;
                const flameX = Math.cos(angle) * 8;
                const flameY = Math.sin(angle) * 7;
                ctx.beginPath();
                ctx.ellipse(flameX, flameY, 3, 5, angle, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Золотистый ореол вокруг тела
            ctx.strokeStyle = '#FFA500';
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.7;
            ctx.beginPath();
            ctx.ellipse(0, 0, this.width / 2 + 6, this.height / 2 + 3, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }

        // Перья рисуем только если не Рыцарь с изображением
        if (!(this.skin.name === 'Рыцарь' && this.armorDamaged < 2 && knightImg)) {
            // Крыло (верхнее)
            ctx.fillStyle = this.skin.color;
            ctx.globalAlpha = 0.9 * (this.isJelly ? 0.5 : 1);
            ctx.beginPath();
            ctx.ellipse(-2, -6, this.width / 2.2, this.height / 1.5, -0.25, 0, Math.PI * 2);
            ctx.fill();
        
        // Белая обводка для тем Закат и Неон-Сити
        if (this.theme === 'sunset' || this.theme === 'neonCity') {
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        // Крыло (нижнее)
        ctx.beginPath();
        ctx.ellipse(-2, 5, this.width / 2.5, this.height / 1.8, 0.15, 0, Math.PI * 2);
        ctx.fill();
        
        // Белая обводка
        if (this.theme === 'sunset' || this.theme === 'neonCity') {
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;

        // Грудка (белая)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.ellipse(3, 0, this.width / 2.5, this.height / 2.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Хвост (перья птицы)
        ctx.fillStyle = this.skin.color;
        ctx.globalAlpha = 0.9 * (this.isJelly ? 0.5 : 1);
        ctx.beginPath();
        ctx.moveTo(-16, -5);
        ctx.lineTo(-28, -12);
        ctx.lineTo(-26, -8);
        ctx.lineTo(-28, -4);
        ctx.lineTo(-24, 0);
        ctx.fill();
        
        // Белая обводка
        if (this.theme === 'sunset' || this.theme === 'neonCity') {
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        ctx.beginPath();
        ctx.moveTo(-16, 5);
        ctx.lineTo(-28, 12);
        ctx.lineTo(-26, 8);
        ctx.lineTo(-28, 4);
        ctx.lineTo(-24, 0);
        ctx.fill();
        
        // Белая обводка
        if (this.theme === 'sunset' || this.theme === 'neonCity') {
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
        }

        // Клюв, глаза, лапки рисуем для всех, кроме Рыцаря с изображением
        if (!(this.skin.name === 'Рыцарь' && this.armorDamaged < 2 && knightImg)) {
            const alpha = this.isJelly ? 0.5 : 1;
            ctx.globalAlpha = alpha;
            // Клюв (треугольник)
            ctx.fillStyle = '#FF8C00';
            ctx.beginPath();
            ctx.moveTo(16, -3);
            ctx.lineTo(24, -1);
            ctx.lineTo(16, 3);
            ctx.fill();
            
            // Контур клюва
            ctx.strokeStyle = '#FF6347';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Глаз - зависит от скина
            if (this.skin.isRobot) {
                // Узкий киберглаз для робота - красный прямоугольник
                ctx.fillStyle = '#FF4444';
                ctx.fillRect(8, -4, 8, 2);
                ctx.strokeStyle = '#FF0000';
                ctx.lineWidth = 1;
                ctx.strokeRect(8, -4, 8, 2);
            } else {
                // Обычный круглый глаз
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(10, -5, 6, 0, Math.PI * 2);
                ctx.fill();

                // Зрачок
                ctx.fillStyle = 'black';
                ctx.beginPath();
                ctx.arc(11, -4, 3, 0, Math.PI * 2);
                ctx.fill();

                // Блик в глазу
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(12, -5, 1.2, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Лапки для всех скинов
            ctx.strokeStyle = '#FF8C00';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(-5, 11);
            ctx.lineTo(-5, 14);
            ctx.lineTo(-8, 14);
            ctx.moveTo(-5, 14);
            ctx.lineTo(-2, 14);
            ctx.stroke();
            
            // Лапка (справа)
            ctx.beginPath();
            ctx.moveTo(5, 11);
            ctx.lineTo(5, 14);
            ctx.lineTo(2, 14);
            ctx.moveTo(5, 14);
            ctx.lineTo(8, 14);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }

        // Искра: птица в электричестве
        if (this.sparkAvailable) {
            // Электрические искры вокруг
            ctx.fillStyle = '#FFFF00';
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                const x = Math.cos(angle) * 30;
                const y = Math.sin(angle) * 30;
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Частицы для астральной птицы
        if (this.isAstral) {
            for (let i = 0; i < 5; i++) {
                const angle = (i / 5) * Math.PI * 2 + this.astralAngle;
                const px = Math.cos(angle) * 25;
                const py = Math.sin(angle) * 25;
                ctx.fillStyle = 'rgba(75, 0, 130, 0.7)';
                ctx.beginPath();
                ctx.arc(px, py, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.restore();
        
        // Рисование огня для Великого Феникса (как у обычного, но жёлтый или оранжево-красный в ярости)
        if (this.phoenixEffect) {
            // Огонь
            for (let p of this.fireParticles) {
                // Используем custom color из частицы, если есть
                if (p.color) {
                    const rgb = parseInt(p.color.slice(1), 16);
                    const r = (rgb >> 16) & 255;
                    const g = (rgb >> 8) & 255;
                    const b = rgb & 255;
                    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.9)`;
                } else {
                    ctx.fillStyle = 'rgba(255, 255, 0, 0.9)'; // Яркий жёлтый по умолчанию
                }
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Пепел
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            for (let p of this.ashParticles) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Алмазная птица - блестящая текстура без кольца
        if (this.skin.sparkleEffect) {
            const sparkleIntensity = 0.4 + 0.3 * Math.sin(Date.now() / 150);
            ctx.fillStyle = `rgba(255, 255, 255, ${sparkleIntensity})`;
            ctx.beginPath();
            ctx.ellipse(this.x + 5, this.y - 3, 8, 6, 0.3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = `rgba(255, 255, 255, ${sparkleIntensity * 0.7})`;
            ctx.beginPath();
            ctx.ellipse(this.x - 8, this.y + 5, 5, 4, -0.2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Рисование огня (феникс)
        if (this.skin.fireEffect) {
            // Огонь
            ctx.fillStyle = this.fireIntensity === 3 ? 'rgba(255, 100, 0, 0.8)' : 'rgba(255, 150, 50, 0.6)';
            for (let p of this.fireParticles) {
                // Если у частицы есть свой цвет (для Великого Феникса)
                if (p.color) {
                    const rgb = parseInt(p.color.slice(1), 16);
                    const r = (rgb >> 16) & 255;
                    const g = (rgb >> 8) & 255;
                    const b = rgb & 255;
                    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.7)`;
                }
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Пепел
            ctx.fillStyle = 'rgba(100, 100, 100, 0.5)';
            for (let p of this.ashParticles) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Рисование блеска
        if (this.skin.sparkleEffect) {
            for (let s of this.sparkles) {
                ctx.fillStyle = `rgba(0, 206, 209, ${s.life / 30})`;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Индикатор брони (кроме рыцаря)
        if (this.armor > 0 && this.skin.name !== 'Рыцарь') {
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.6;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width / 2 + 8, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }

        // Индикатор неуязвимости
        if (this.isInvulnerable()) {
            const remaining = this.invulnerableUntil - Date.now();
            const alpha = 0.3 + 0.3 * Math.sin(remaining / 50);
            let glowColor = '0, 255, 255'; // default cyan
            if (this.skin.name === 'Рыцарь') {
                if (this.armorDamaged === 1) {
                    glowColor = '0, 100, 255'; // blue
                } else if (this.armorDamaged === 2) {
                    glowColor = '255, 0, 0'; // red
                }
            }
            ctx.fillStyle = `rgba(${glowColor}, ${alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width / 2 + 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Проверка столкновения с прямоугольником (труба)
    collidesWith(x, y, width, height) {
        return !(this.x + this.width / 2 < x ||
                 this.x - this.width / 2 > x + width ||
                 this.y + this.height / 2 < y ||
                 this.y - this.height / 2 > y + height);
    }

    // Проверка если точка внутри птицы
    contains(x, y) {
        const dx = x - this.x;
        const dy = y - this.y;
        return dx * dx + dy * dy < (this.width / 2) * (this.width / 2);
    }
}

// ==================== КЛАСС ТРУБЫ ====================
class PipeManager {
    constructor(game) {
        this.game = game;
        this.pipes = [];
        this.spawnDistance = 0;
        this.nextSpawnX = 200;
        this.lastGapCenter = GAME_CONFIG.canvasHeight / 2; // память последнего зазора
        this.pipeIdCounter = 0; // счетчик ID труб
    }

    update() {
        // Скорость зависит от скина и текущего ускорения
        const skinSpeedMult = this.game.skin.speedMultiplier || 1;
        const gameSpeedMult = this.game.currentSpeedMultiplier || GAME_CONFIG.baseSpeedMultiplier;
        const speed = GAME_CONFIG.pipeSpeed * skinSpeedMult * gameSpeedMult;

        // Движение труб
        for (let pipe of this.pipes) {
            pipe.x -= speed;
        }

        // Удаление вышедших за экран труб и проверка прохода
        this.pipes = this.pipes.filter(pipe => {
            if (pipe.x + pipe.width < 0) {
                // Труба прошла, начисляем очки и монеты (кроме огненных стен)
                if (!pipe.scored && !pipe.isFireWall) {
                    pipe.scored = true;
                    this.game.score++;
                    this.game.addRunCoins(1); // базовая валюта монеты
                    this.game.bird.pipePassed(); // Обработка прохождения трубы для способностей
                }
                return false;
            }
            return true;
        });

        // Генерация новых труб
        const pipeSpacing = GAME_CONFIG.pipeSpacing * (this.game.skin.pipeDistanceMultiplier || 1);
        if (this.pipes.length === 0 || this.pipes[this.pipes.length - 1].x < GAME_CONFIG.canvasWidth - pipeSpacing) {
            this.spawnPipe();
        }
    }

    spawnPipe() {
        const gapSize = GAME_CONFIG.pipeGapSize * (this.game.skin.gapMultiplier || 1);
        const minTopHeight = 60;      // минимум для верхней трубы (видна)
        const maxTopHeight = GAME_CONFIG.canvasHeight - gapSize - 60; // минимум для нижней трубы (видна)
        
        // Плавное изменение высоты зазора (не более maxGapHeightDifference пикселей)
        const maxDiff = GAME_CONFIG.maxGapHeightDifference;
        const minNewGap = Math.max(minTopHeight, this.lastGapCenter - maxDiff);
        const maxNewGap = Math.min(maxTopHeight, this.lastGapCenter + maxDiff);
        
        // Убедимся, что диапазон корректен
        let topHeight;
        if (minNewGap <= maxNewGap) {
            topHeight = minNewGap + Math.random() * (maxNewGap - minNewGap);
        } else {
            // Если диапазон неверен, выбираем точку в середине
            topHeight = (minNewGap + maxNewGap) / 2;
        }
        
        // Гарантируем, что обе трубы видны
        topHeight = Math.max(minTopHeight, Math.min(topHeight, maxTopHeight));
        
        const gapCenter = topHeight + gapSize / 2;
        this.lastGapCenter = gapCenter;

        // Проверяем, должна ли быть огненная стена для Феникса
        const isFireWall = this.game.bird.fireWallCount >= 20 && this.game.bird.totalFireWalls < 2;
        if (isFireWall) {
            this.game.bird.fireWallCount = 0;
            this.game.bird.totalFireWalls++;
        }
        if (isFireWall) {
            this.game.bird.fireWallCount = 0;
        }
        
        this.pipes.push({
            id: this.pipeIdCounter++,
            x: GAME_CONFIG.canvasWidth,
            topHeight: isFireWall ? 0 : topHeight, // Огненная стена занимает весь экран
            gapSize: isFireWall ? 0 : gapSize, // Нет зазора
            width: 60 * (GAME_CONFIG.scale || 1),
            scored: false,
            hasSpawnedCoin: false,
            coinX: 0,
            coinY: 0,
            isAstral: this.game.bird.astralCount > 0 ? (this.game.bird.astralCount--, true) : false,
            isFireWall: isFireWall // Флаг огненной стены
        });
    }

    draw(ctx, theme) {
        for (let pipe of this.pipes) {
            // Огненная стена для Феникса
            if (pipe.isFireWall) {
                // Огненная анимация
                const time = Date.now() / 100;
                ctx.fillStyle = `rgba(255, ${100 + Math.sin(time) * 50}, 0, 0.9)`;
                ctx.fillRect(pipe.x, 0, pipe.width, GAME_CONFIG.canvasHeight);
                
                // Огненные частицы на стене
                for (let i = 0; i < 20; i++) {
                    const y = Math.random() * GAME_CONFIG.canvasHeight;
                    const size = 2 + Math.random() * 4;
                    ctx.fillStyle = `rgba(255, ${150 + Math.random() * 100}, 0, 0.8)`;
                    ctx.beginPath();
                    ctx.arc(pipe.x + pipe.width / 2 + (Math.random() - 0.5) * pipe.width, y, size, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                ctx.globalAlpha = 1;
                continue;
            }

            // Астральные трубы полупрозрачны
            const isAstral = pipe.isAstral;
            if (isAstral) {
                ctx.globalAlpha = 0.5;
            }

            let pipeColor = '#228B22'; // обычный зеленый
            let woodColor = '#1a5a1a';
            let woodStroke = '#0d3d0d';
            let pipeStroke = '#1a6b1a';

            // Неоновые цвета для Неон-Сити
            if (theme === 'neonCity') {
                pipeColor = '#00FF00'; // яркий неоновый зеленый
                woodColor = '#00DD00';
                woodStroke = '#00AA00';
                pipeStroke = '#00FF00';
            }

            // Серые цвета для Луны
            if (theme === 'moon') {
                pipeColor = '#808080'; // серый
                woodColor = '#606060';
                woodStroke = '#404040';
                pipeStroke = '#808080';
            }

            // Серые цвета для Пепла
            if (theme === 'ash') {
                pipeColor = '#808080'; // серый
                woodColor = '#606060';
                woodStroke = '#404040';
                pipeStroke = '#808080';
            }

            // Верхняя труба
            ctx.fillStyle = pipeColor;
            ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
            
            // Нижняя труба
            const bottomY = pipe.topHeight + pipe.gapSize;
            ctx.fillRect(pipe.x, bottomY, pipe.width, GAME_CONFIG.canvasHeight - bottomY);

            // Деревянный выступ сверху трубы (как в реальных трубах)
            ctx.fillStyle = woodColor;
            ctx.fillRect(pipe.x - 5, pipe.topHeight - 8, pipe.width + 10, 8);
            ctx.strokeStyle = woodStroke;
            ctx.lineWidth = 2;
            ctx.strokeRect(pipe.x - 5, pipe.topHeight - 8, pipe.width + 10, 8);
            
            // Деревянный выступ снизу трубы
            ctx.fillStyle = woodColor;
            ctx.fillRect(pipe.x - 5, bottomY, pipe.width + 10, 8);
            ctx.strokeStyle = woodStroke;
            ctx.strokeRect(pipe.x - 5, bottomY, pipe.width + 10, 8);

            // Окант основной трубы
            ctx.strokeStyle = pipeStroke;
            ctx.lineWidth = 3;
            ctx.strokeRect(pipe.x, 0, pipe.width, pipe.topHeight);
            ctx.strokeRect(pipe.x, bottomY, pipe.width, GAME_CONFIG.canvasHeight - bottomY);

            // Сброс прозрачности
            if (isAstral) {
                ctx.globalAlpha = 1;
            }
        }
    }
}

// ==================== КЛАСС МОНЕТЫ ====================
class CoinManager {
    constructor(game) {
        this.game = game;
        this.coins = [];
        this.magnetRadius = game.skin.magnetRadius || 0;
    }

    update() {
        // Скорость монет зависит от скина и текущего ускорения
        const skinSpeedMult = this.game.skin.speedMultiplier || 1;
        const gameSpeedMult = this.game.currentSpeedMultiplier || GAME_CONFIG.baseSpeedMultiplier;
        const speed = GAME_CONFIG.pipeSpeed * skinSpeedMult * gameSpeedMult;

        // Движение монет
        for (let coin of this.coins) {
            coin.x -= speed;

            // Магнит (алмазная птица)
            if (this.magnetRadius > 0) {
                const dx = this.game.bird.x - coin.x;
                const dy = this.game.bird.y - coin.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.magnetRadius) {
                    const angle = Math.atan2(dy, dx);
                    coin.x += Math.cos(angle) * 5;
                    coin.y += Math.sin(angle) * 5;
                }
            }

            // Анимация вращения
            coin.rotation += 0.1;
        }

        // Удаление монет вышедших за экран
        this.coins = this.coins.filter(coin => coin.x > -50);

        // Проверка подбора монет
        for (let i = this.coins.length - 1; i >= 0; i--) {
            if (this.game.bird.contains(this.coins[i].x, this.coins[i].y)) {
                // Проверка на гем для супер-птиц
                const isSuperBird = this.game.skin.price >= 700;
                if (isSuperBird && Math.random() < 0.10) {
                    this.game.addRunGems(1);
                } else {
                    this.game.addRunCoins(1);
                }
                this.game.bird.addSparkleEffect();
                this.coins.splice(i, 1);
            }
        }
    }

    spawnCoin(pipeX, gapY, gapSize) {
        this.coins.push({
            x: pipeX + 30 * (GAME_CONFIG.scale || 1),
            y: gapY + gapSize / 2,
            radius: 8 * (GAME_CONFIG.scale || 1),
            rotation: 0
        });
    }

    draw(ctx, theme) {
        for (let coin of this.coins) {
            ctx.save();
            ctx.translate(coin.x, coin.y);
            ctx.rotate(coin.rotation);

            // Монета
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(0, 0, coin.radius, 0, Math.PI * 2);
            ctx.fill();

            // Окант
            ctx.strokeStyle = '#FFA500';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Белая обводка для тем Закат и Неон-Сити
            if (theme === 'sunset' || theme === 'neonCity') {
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 3;
                ctx.stroke();
            }

            // Значок
            ctx.fillStyle = '#FFA500';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('$', 0, 0);

            ctx.restore();
        }
    }
}

// ==================== СИСТЕМА СКИНОВ И МАГАЗИНА ====================
class CharacterSystem {
    constructor() {
        this.totalCoins = this.loadTotalCoins();
        this.totalGems = this.loadTotalGems();
        this.ownedCharacters = this.loadOwnedCharacters();
        this.rentedCharacters = this.loadRentedCharacters();
        this.pipesPassedPerCharacter = this.loadPipesPassedPerCharacter();
        this.currentCharacter = 'normal';
        
        // Добавить начальные персонажи
        this.ownedCharacters['normal'] = true;
    }

    canBuyCharacter(characterKey) {
        if (this.ownedCharacters[characterKey]) return false;
        
        const character = CHARACTERS[characterKey];
        if (character.price > this.totalCoins) return false;
        
        // Для супер-птиц (цена >= 700): проверить, что все обычные птицы куплены и каждая прошла >= требуемое количество труб
        if (character.price >= 700) {
            const requiredPipes = (character.price >= 1200) ? 30 : 15; // Для primordial, spark, greatPhoenix - 30 труб, для остальных супер - 15
            for (const [key, char] of Object.entries(CHARACTERS)) {
                if (char.price < 700 && char.price > 0) { // Обычные птицы (кроме normal, которая бесплатна)
                    if (!this.ownedCharacters[key]) return false;
                    if ((this.pipesPassedPerCharacter[key] || 0) < requiredPipes) return false;
                }
            }
        }
        
        return true;
    }

    canRentCharacter(characterKey) {
        return !this.ownedCharacters[characterKey] && !this.rentedCharacters[characterKey];
    }

    buyCharacter(characterKey) {
        if (this.canBuyCharacter(characterKey)) {
            this.totalCoins -= CHARACTERS[characterKey].price;
            this.ownedCharacters[characterKey] = true;
            this.saveTotalCoins();
            this.saveOwnedCharacters();
            return true;
        }
        return false;
    }

    rentCharacter(characterKey) {
        const rentPrice = Math.floor(CHARACTERS[characterKey].price * 0.25);
        if (this.canRentCharacter(characterKey) && rentPrice <= this.totalCoins) {
            this.totalCoins -= rentPrice;
            this.rentedCharacters[characterKey] = true;
            this.saveTotalCoins();
            this.saveRentedCharacters();
            return true;
        }
        return false;
    }

    selectCharacter(characterKey) {
        if (this.ownedCharacters[characterKey] || this.rentedCharacters[characterKey]) {
            this.currentCharacter = characterKey;
            return true;
        }
        return false;
    }

    getCurrentCharacterData() {
        return CHARACTERS[this.currentCharacter] || CHARACTERS.normal;
    }

    addCoins(amount) {
        this.totalCoins += Math.floor(amount);
        this.saveTotalCoins();
    }

    addGems(amount) {
        this.totalGems += Math.floor(amount);
        this.saveTotalGems();
    }

    saveTotalCoins() {
        localStorage.setItem('flappy-coins', this.totalCoins.toString());
    }

    saveTotalGems() {
        localStorage.setItem('flappy-gems', this.totalGems.toString());
    }

    loadTotalCoins() {
        const saved = localStorage.getItem('flappy-coins');
        return saved ? parseInt(saved) : 0;
    }

    loadTotalGems() {
        const saved = localStorage.getItem('flappy-gems');
        return saved ? parseInt(saved) : 0;
    }

    saveOwnedCharacters() {
        localStorage.setItem('flappy-characters', JSON.stringify(this.ownedCharacters));
    }

    loadOwnedCharacters() {
        const saved = localStorage.getItem('flappy-characters');
        return saved ? JSON.parse(saved) : { normal: true };
    }

    saveRentedCharacters() {
        localStorage.setItem('flappy-rented-characters', JSON.stringify(this.rentedCharacters));
    }

    loadRentedCharacters() {
        const saved = localStorage.getItem('flappy-rented-characters');
        return saved ? JSON.parse(saved) : {};
    }

    savePipesPassedPerCharacter() {
        localStorage.setItem('flappy-pipes-passed', JSON.stringify(this.pipesPassedPerCharacter));
    }

    loadPipesPassedPerCharacter() {
        const saved = localStorage.getItem('flappy-pipes-passed');
        return saved ? JSON.parse(saved) : {};
    }

    clearRentals() {
        this.rentedCharacters = {};
        this.saveRentedCharacters();
    }

    removeRental(characterKey) {
        delete this.rentedCharacters[characterKey];
        this.saveRentedCharacters();
    }

    saveRecord(score) {
        const currentRecord = parseInt(localStorage.getItem('flappy-record') || '0');
        if (score > currentRecord) {
            localStorage.setItem('flappy-record', score.toString());
        }
    }

    getRecord() {
        return parseInt(localStorage.getItem('flappy-record') || '0');
    }
}

// ==================== СИСТЕМА ТЕМ ====================
class ThemeSystem {
    constructor(characterSystem) {
        this.characterSystem = characterSystem;
        this.ownedThemes = this.loadOwnedThemes();
        this.currentTheme = 'day';
        
        // Добавить начальную тему
        this.ownedThemes['day'] = true;
    }

    canBuyTheme(themeKey) {
        return !this.ownedThemes[themeKey] && THEMES[themeKey].price <= this.characterSystem.totalCoins;
    }

    buyTheme(themeKey) {
        if (this.canBuyTheme(themeKey)) {
            this.characterSystem.totalCoins -= THEMES[themeKey].price;
            this.ownedThemes[themeKey] = true;
            this.characterSystem.saveTotalCoins();
            this.saveOwnedThemes();
            return true;
        }
        return false;
    }

    selectTheme(themeKey) {
        if (this.ownedThemes[themeKey]) {
            this.currentTheme = themeKey;
            return true;
        }
        return false;
    }

    getCurrentThemeData() {
        return THEMES[this.currentTheme] || THEMES.day;
    }

    saveOwnedThemes() {
        localStorage.setItem('flappy-themes', JSON.stringify(this.ownedThemes));
    }

    loadOwnedThemes() {
        const saved = localStorage.getItem('flappy-themes');
        return saved ? JSON.parse(saved) : { day: true };
    }
}

// ==================== ГЛАВНЫЙ КЛАСС ИГРЫ ====================
class Game {
    constructor() {
        // Адаптация для мобильных устройств
        if (window.innerWidth < 768) {
            const aspectRatio = 800 / 600;
            GAME_CONFIG.canvasWidth = Math.min(window.innerWidth * 0.9, 800);
            GAME_CONFIG.canvasHeight = GAME_CONFIG.canvasWidth / aspectRatio;
            GAME_CONFIG.scale = GAME_CONFIG.canvasWidth / 800;
            GAME_CONFIG.pipeSpacing = Math.floor(200 * GAME_CONFIG.scale);
            GAME_CONFIG.pipeGapSize = Math.floor(180 * GAME_CONFIG.scale);
            GAME_CONFIG.maxGapHeightDifference = 75;
            GAME_CONFIG.pipeSpeed = 5 * 2.0;
            GAME_CONFIG.jumpPower = 5 * 0.75;
            GAME_CONFIG.gravity = 0.2 * 1.85; 
        } else {
            GAME_CONFIG.scale = 1;
        }

        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        this.characterSystem = new CharacterSystem();
        this.themeSystem = new ThemeSystem(this.characterSystem);
        this.themeImages = {};
        this.ashParticles = []; // Частицы пепла для темы Ash
        this.loadThemeImages();
        this.state = 'menu'; // 'menu', 'playing', 'gameover'
        this.score = 0;
        this.runCoins = 0;
        this.runGems = 0;
        this.skin = null;
        this.bird = null;
        this.pipeManager = null;
        this.coinManager = null;
        this.pipeCount = 0;
        this.debuffModifiers = {};
        
        // Для замедления времени (Эхо)
        this.slowMotionActive = false;
        this.slowMotionTimeLeft = 0;
        this.normalDeltaTime = 0.016; // ~60 FPS
        this.slowMotionFactor = 0.1; // 10x замедление

        this.setupEventListeners();
        this.renderUI();
        this.gameLoop();
    }

    resizeCanvas() {
        const container = document.getElementById('gameContainer');
        this.canvas.width = GAME_CONFIG.canvasWidth;
        this.canvas.height = GAME_CONFIG.canvasHeight;
        
        if (window.innerWidth < 768) {
            const aspectRatio = GAME_CONFIG.canvasWidth / GAME_CONFIG.canvasHeight;
            const containerWidth = Math.min(window.innerWidth - 20, GAME_CONFIG.canvasWidth);
            const containerHeight = containerWidth / aspectRatio;
            container.style.width = containerWidth + 'px';
            container.style.height = containerHeight + 'px';
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
        } else {
            container.style.width = this.canvas.width + 'px';
            container.style.height = this.canvas.height + 'px';
            this.canvas.style.width = '';
            this.canvas.style.height = '';
        }
    }

    loadThemeImages() {
        const neonCityImg = new Image();
        neonCityImg.onload = () => {
            console.log('Neon city image loaded');
        };
        neonCityImg.onerror = () => {
            console.log('Failed to load neon city image');
            this.themeImages.neonCity = null; // Mark as failed
        };
        neonCityImg.src = 'themes-png/neon-city.png';
        this.themeImages.neonCity = neonCityImg;

        const moonImg = new Image();
        moonImg.onload = () => {
            console.log('Moon image loaded');
        };
        moonImg.onerror = () => {
            console.log('Failed to load moon image');
            this.themeImages.moon = null; // Mark as failed
        };
        moonImg.src = 'themes-png/moon.png';
        this.themeImages.moon = moonImg;

        const ashImg = new Image();
        ashImg.onload = () => {
            console.log('Ash image loaded');
        };
        ashImg.onerror = () => {
            console.log('Failed to load ash image');
            this.themeImages.ash = null;
        };
        ashImg.src = 'themes-png/ash.png';
        this.themeImages.ash = ashImg;
    }

    setupEventListeners() {
        // Старт игры
        const startBtn = document.getElementById('startBtn');
        startBtn.addEventListener('click', () => this.startGame());
        startBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startGame();
        });

        // Кнопки меню
        const charactersBtn = document.getElementById('charactersBtn');
        charactersBtn.addEventListener('click', () => this.showCharactersModal());
        charactersBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.showCharactersModal();
        });

        const themesBtn = document.getElementById('themesBtn');
        themesBtn.addEventListener('click', () => this.showThemesModal());
        themesBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.showThemesModal();
        });

        // Кнопка очистки (только на мобильных)
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            const resetFunction = () => {
                console.log('Reset button clicked');
                document.getElementById('resetModal').style.display = 'block';
            };
            resetBtn.addEventListener('click', resetFunction);
            resetBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                resetFunction();
            });
        }

        // Retry после game over
        const retryBtn = document.getElementById('retryBtn');
        retryBtn.addEventListener('click', () => this.startGame());
        retryBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startGame();
        });

        // Menu после game over
        const menuBtn = document.getElementById('menuBtn');
        menuBtn.addEventListener('click', () => this.showMenu());
        menuBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.showMenu();
        });

        // Управление игроком
        document.addEventListener('keydown', (e) => {
            // Если фокус в консоли, не обрабатываем игровые команды
            const consoleInput = document.getElementById('consoleInput');
            const isConsoleActive = document.activeElement === consoleInput;

            if (e.code === 'Space') {
                if (!isConsoleActive) {
                    e.preventDefault();
                    if (this.state === 'playing') {
                        this.bird.jump();
                        this.bird.addFireEffect();
                    }
                }
            }
            if (e.code === 'KeyE' && this.state === 'playing' && !isConsoleActive) {
                this.activateAbility();
            }
        });

        document.addEventListener('click', () => {
            if (this.state === 'playing') {
                this.bird.jump();
                this.bird.addFireEffect();
            }
        });

        // Сенсорное управление
        this.canvas.addEventListener('touchstart', () => {
            if (this.state === 'playing') {
                this.bird.jump();
                this.bird.addFireEffect();
            }
        });

        // Обработчики для модалки сброса
        const resetYesBtn = document.getElementById('resetYesBtn');
        if (resetYesBtn) {
            resetYesBtn.addEventListener('click', () => {
                localStorage.removeItem('flappy-coins');
                localStorage.removeItem('flappy-gems');
                localStorage.removeItem('flappy-characters');
                localStorage.removeItem('flappy-rented-characters');
                localStorage.removeItem('flappy-pipes-passed');
                localStorage.removeItem('flappy-record');
                localStorage.removeItem('flappy-themes');
                location.reload();
            });
            resetYesBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                localStorage.removeItem('flappy-coins');
                localStorage.removeItem('flappy-gems');
                localStorage.removeItem('flappy-characters');
                localStorage.removeItem('flappy-rented-characters');
                localStorage.removeItem('flappy-pipes-passed');
                localStorage.removeItem('flappy-record');
                localStorage.removeItem('flappy-themes');
                location.reload();
            });
        }

        const resetNoBtn = document.getElementById('resetNoBtn');
        if (resetNoBtn) {
            resetNoBtn.addEventListener('click', () => {
                document.getElementById('resetModal').style.display = 'none';
            });
            resetNoBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                document.getElementById('resetModal').style.display = 'none';
            });
        }

        // Закрытие модалки по крестику
        const resetModalClose = document.querySelector('#resetModal .modal-close');
        if (resetModalClose) {
            resetModalClose.onclick = () => document.getElementById('resetModal').style.display = 'none';
        }

        // Закрытие по клику вне модалки
        window.onclick = (e) => {
            const resetModal = document.getElementById('resetModal');
            if (e.target === resetModal) {
                resetModal.style.display = 'none';
            }
        };
    }

    renderUI() {
        const recordDisplay = document.getElementById('recordDisplay');
        const currencyDisplay = document.getElementById('currencyDisplay');

        recordDisplay.textContent = this.characterSystem.getRecord();
        currencyDisplay.textContent = `${this.characterSystem.totalCoins}🪙|${this.characterSystem.totalGems}💎`;

        // Скины теперь в модалке
    }

    showCharactersModal() {
        const modal = document.getElementById('skinsModal');
        const modalContent = modal.querySelector('.modal-content');
        
        // Увеличиваем размер модального окна и поднимаем выше
        modalContent.style.width = '90%';
        modalContent.style.maxWidth = '1000px';
        modalContent.style.height = 'auto';
        modalContent.style.maxHeight = '80vh';
        modalContent.style.margin = '8% auto'; // Поднимаем выше
        
        // Очищаем содержимое модалки и создаем новую структуру
        modalContent.innerHTML = `
            <span class="modal-close">&times;</span>
            <h2>Выбор персонажа</h2>
            
            <div style="display: flex; gap: 20px; margin-top: 20px;">
                <div style="flex: 1;">
                    <div class="character-section-header" style="font-weight: bold; font-size: 18px; color: #333; margin-bottom: 15px; text-align: center; border-bottom: 2px solid #ddd; padding-bottom: 5px;">
                        Обычные птицы
                    </div>
                    <div id="regularCharacters" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;"></div>
                </div>
                
                <div style="flex: 1;">
                    <div class="character-section-header" style="font-weight: bold; font-size: 18px; color: #333; margin-bottom: 15px; text-align: center; border-bottom: 2px solid #ddd; padding-bottom: 5px;">
                        Супер-птицы
                    </div>
                    <div id="superCharacters" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;"></div>
                </div>
            </div>
        `;
        
        const regularContainer = document.getElementById('regularCharacters');
        const superContainer = document.getElementById('superCharacters');

        let characterCount = 0;
        for (const [key, characterData] of Object.entries(CHARACTERS)) {
            characterCount++;
            
            const characterEl = document.createElement('div');
            characterEl.className = 'skin-item';
            characterEl.style.cssText = 'padding: 10px; border: 1px solid #ccc; border-radius: 5px; text-align: center; cursor: pointer; transition: all 0.2s; height: 120px; aspect-ratio: 1; display: flex; flex-direction: column; justify-content: center;';
            
            if (characterCount <= 9) {
                // Обычные птицы: старый стиль
                let statusText = '';
                if (this.characterSystem.ownedCharacters[key]) {
                    statusText = key === this.characterSystem.currentCharacter ? '✓ ВЫБРАН' : 'Владеете';
                } else {
                    statusText = `Купить: ${characterData.price}`;
                }

                characterEl.innerHTML = `
                    <div style="font-weight: bold; margin-bottom: 5px;">${characterData.name}</div>
                    <div style="font-size: 12px; color: #e4c200ff; margin-bottom: 5px;">${characterData.price === 0 ? 'Бесплатно' : characterData.price + ' 💰'}</div>
                    <div style="font-size: 11px; color: ${this.characterSystem.ownedCharacters[key] ? '#ffd700' : '#999'}; margin-bottom: 5px;">${statusText}</div>
                `;

                characterEl.addEventListener('click', () => {
                    if (this.characterSystem.ownedCharacters[key]) {
                        this.characterSystem.selectCharacter(key);
                        this.showCharactersModal();
                    } else if (this.characterSystem.canBuyCharacter(key)) {
                        this.characterSystem.buyCharacter(key);
                        this.characterSystem.selectCharacter(key);
                        this.showCharactersModal();
                    }
                });

                // Touch support for mobile
                characterEl.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    if (this.characterSystem.ownedCharacters[key]) {
                        this.characterSystem.selectCharacter(key);
                        this.showCharactersModal();
                    } else if (this.characterSystem.canBuyCharacter(key)) {
                        this.characterSystem.buyCharacter(key);
                        this.characterSystem.selectCharacter(key);
                        this.showCharactersModal();
                    }
                });

                // Двойной клик для открытия описания
                characterEl.addEventListener('dblclick', () => {
                    this.showCharacterAbilities(key);
                });
            } else {
                // Супер-птицы: проверка условий разблокировки
                let statusText = '';
                let buttonsHtml = '';
                let priceText = characterData.price + ' 💰';
                
                if (this.characterSystem.ownedCharacters[key]) {
                    statusText = key === this.characterSystem.currentCharacter ? '✓ ВЫБРАН' : 'Владеете';
                    buttonsHtml = `<button style="width: 100%; padding: 2px; background: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 10px;">Выбрать</button>`;
                } else if (this.characterSystem.rentedCharacters[key]) {
                    statusText = 'Арендован';
                    buttonsHtml = '';
                } else if (this.characterSystem.canBuyCharacter(key)) {
                    statusText = `Купить: ${characterData.price} | Арендовать: ${Math.floor(characterData.price * 0.25)}`;
                    const rentPrice = Math.floor(characterData.price * 0.25);
                    buttonsHtml = `
                        <div style="display: flex; flex-direction: row;">
                            <button style="flex: 1; padding: 2px; background: #F44336; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 9px; margin-right: 2px;">Купить (${characterData.price} 💰)</button>
                            <button style="flex: 1; padding: 2px; background: #FF9800; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 9px;">Аренд. (${rentPrice} 💰)</button>
                        </div>
                    `;
                } else {
                    // Не разблокировано: показать замок и аренду если возможно
                    let unlockConditions = [];
                    const requiredPipes = (characterData.price >= 1200) ? 30 : 15; // Для primordial, spark, greatPhoenix - 30 труб, для остальных супер - 15
                    for (const [regKey, regChar] of Object.entries(CHARACTERS)) {
                        if (regChar.price < 700 && regChar.price > 0) {
                            if (!this.characterSystem.ownedCharacters[regKey]) {
                                unlockConditions.push(`Купить и пройти ${requiredPipes} труб с ${regChar.name}`);
                            } else if ((this.characterSystem.pipesPassedPerCharacter[regKey] || 0) < requiredPipes) {
                                const pipesNeeded = requiredPipes - (this.characterSystem.pipesPassedPerCharacter[regKey] || 0);
                                unlockConditions.push(`Пройти ${pipesNeeded} труб с ${regChar.name}`);
                            }
                        }
                    }
                    
                    statusText = 'Заблокировано';
                    priceText = 'Разблокируйте условия';
                    
                    if (this.characterSystem.canRentCharacter(key)) {
                        const rentPrice = Math.floor(characterData.price * 0.25);
                        buttonsHtml = `<div style="display: flex; align-items: center; justify-content: space-between;">
                            <span class="unlock-lock" style="font-size: 20px; cursor: pointer;">🔒</span>
                            <button style="padding: 2px; background: #FF9800; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 10px;">Аренд. (${rentPrice} 💰)</button>
                        </div>`;
                    } else {
                        buttonsHtml = '<span class="unlock-lock" style="font-size: 20px; cursor: pointer;">🔒</span>';
                    }
                    
                    // Сохранить условия для модального окна
                    characterEl.unlockConditions = unlockConditions;
                }

                characterEl.innerHTML = `
                    <div style="font-weight: bold; margin-bottom: 3px; font-size: 14px;">${characterData.name}</div>
                    <div style="font-size: 11px; color: #e4c200ff; margin-bottom: 3px;">${priceText}</div>
                    <div style="font-size: 10px; color: ${this.characterSystem.ownedCharacters[key] || this.characterSystem.rentedCharacters[key] ? '#ffd700' : '#999'}; margin-bottom: 3px;">${statusText}</div>
                    ${buttonsHtml}
                `;

                // Клик на скин - купить или выбрать
                characterEl.addEventListener('click', () => {
                    if (this.characterSystem.ownedCharacters[key] || this.characterSystem.rentedCharacters[key]) {
                        this.characterSystem.selectCharacter(key);
                        this.showCharactersModal();
                    } else if (this.characterSystem.canBuyCharacter(key)) {
                        this.characterSystem.buyCharacter(key);
                        this.characterSystem.selectCharacter(key);
                        this.showCharactersModal();
                    }
                });

                // Touch support for mobile
                characterEl.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    if (this.characterSystem.ownedCharacters[key] || this.characterSystem.rentedCharacters[key]) {
                        this.characterSystem.selectCharacter(key);
                        this.showCharactersModal();
                    } else if (this.characterSystem.canBuyCharacter(key)) {
                        this.characterSystem.buyCharacter(key);
                        this.characterSystem.selectCharacter(key);
                        this.showCharactersModal();
                    }
                });

                // Двойной клик для открытия описания
                characterEl.addEventListener('dblclick', () => {
                    this.showCharacterAbilities(key);
                });

                // Обработчик для замка
                const lockEl = characterEl.querySelector('.unlock-lock');
                if (lockEl) {
                    lockEl.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.showUnlockConditionsModal(characterData.name, characterEl.unlockConditions);
                    });
                    lockEl.addEventListener('touchstart', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.showUnlockConditionsModal(characterData.name, characterEl.unlockConditions);
                    });
                }

                // Обработчики для кнопок - купить или арендовать
                const buttons = characterEl.querySelectorAll('button');
                buttons.forEach((btn) => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (btn.textContent.includes('Выбрать')) {
                            this.characterSystem.selectCharacter(key);
                            this.showCharactersModal();
                        } else if (btn.textContent.includes('Купить')) {
                            if (this.characterSystem.canBuyCharacter(key)) {
                                this.characterSystem.buyCharacter(key);
                                this.characterSystem.selectCharacter(key);
                                this.showCharactersModal();
                            }
                        } else if (btn.textContent.includes('Аренд.')) {
                            if (this.characterSystem.rentCharacter(key)) {
                                this.characterSystem.selectCharacter(key);
                                this.showCharactersModal();
                            } else {
                                alert('Недостаточно монет для аренды!');
                            }
                        }
                    });
                    btn.addEventListener('touchstart', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (btn.textContent.includes('Выбрать')) {
                            this.characterSystem.selectCharacter(key);
                            this.showCharactersModal();
                        } else if (btn.textContent.includes('Купить')) {
                            if (this.characterSystem.canBuyCharacter(key)) {
                                this.characterSystem.buyCharacter(key);
                                this.characterSystem.selectCharacter(key);
                                this.showCharactersModal();
                            }
                        } else if (btn.textContent.includes('Аренд.')) {
                            if (this.characterSystem.rentCharacter(key)) {
                                this.characterSystem.selectCharacter(key);
                                this.showCharactersModal();
                            } else {
                                alert('Недостаточно монет для аренды!');
                            }
                        }
                    });
                });
            }

            // ПКМ для показа способностей
            characterEl.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.showCharacterAbilities(key);
            });

            // ПКМ для показа способностей
            characterEl.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.showCharacterAbilities(key);
            });

            // Добавляем в соответствующий контейнер
            if (characterCount <= 9) {
                regularContainer.appendChild(characterEl);
            } else {
                superContainer.appendChild(characterEl);
            }
        }

        modal.style.display = 'block';

        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.onclick = () => {
            modal.style.display = 'none';
            // Сбрасываем стили при закрытии
            modalContent.style.width = '';
            modalContent.style.maxWidth = '';
            modalContent.style.height = '';
            modalContent.style.maxHeight = '';
            modalContent.style.margin = '';
        };

        window.onclick = (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                // Сбрасываем стили при закрытии
                modalContent.style.width = '';
                modalContent.style.maxWidth = '';
                modalContent.style.height = '';
                modalContent.style.maxHeight = '';
                modalContent.style.margin = '';
            }
        };
    }

    showThemesModal() {
        const modal = document.getElementById('themesModal');
        const list = document.getElementById('themesModalList');
        list.innerHTML = '';

        for (const [key, themeData] of Object.entries(THEMES)) {
            const themeEl = document.createElement('div');
            themeEl.className = 'theme-item';
            if (key === this.themeSystem.currentTheme) themeEl.classList.add('selected');
            if (!this.themeSystem.ownedThemes[key]) themeEl.classList.add('locked');

            let statusText = '';
            if (this.themeSystem.ownedThemes[key]) {
                statusText = key === this.themeSystem.currentTheme ? '✓ ВЫБРАНА' : 'Владеете';
            } else {
                statusText = `Купить: ${themeData.price}`;
            }

            themeEl.innerHTML = `
                <span class="theme-name">${themeData.name}</span>
                <span class="theme-price">${themeData.price === 0 ? 'Бесплатно' : themeData.price + ' 💰'}</span>
                <span class="theme-status">${statusText}</span>
            `;

            themeEl.addEventListener('click', () => {
                if (this.themeSystem.ownedThemes[key]) {
                    this.themeSystem.selectTheme(key);
                    this.showThemesModal();
                } else if (this.themeSystem.canBuyTheme(key)) {
                    this.themeSystem.buyTheme(key);
                    this.themeSystem.selectTheme(key);
                    this.showThemesModal();
                }
            });

            list.appendChild(themeEl);
        }

        modal.style.display = 'block';

        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.onclick = () => modal.style.display = 'none';

        window.onclick = (e) => {
            if (e.target === modal) modal.style.display = 'none';
        };
    }

    showCharacterAbilities(characterKey) {
        const characterData = CHARACTERS[characterKey];
        const modal = document.getElementById('abilitiesModal');
        const textEl = document.getElementById('abilitiesText');
        
        let html = `<div style="padding: 20px;">`;
        html += `<h2 style="margin-top: 0; text-align: center;">${characterData.name}</h2>`;
        html += `<div style="font-size: 14px; color: #e4c200ff; text-align: center; margin-bottom: 15px;">${characterData.price === 0 ? 'Бесплатно' : characterData.price + ' 💰'}</div>`;
        
        // Описание
        html += `<div style="margin-bottom: 20px; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 5px;">`;
        html += `<div style="color: #FFD700; font-weight: bold; margin-bottom: 8px;">📝 Описание</div>`;
        html += `<div style="color: #ccc; line-height: 1.5;">${characterData.description}</div>`;
        html += `</div>`;
        
        // Способности
        if (characterData.abilities) {
            html += `<div style="margin-bottom: 20px; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 5px;">`;
            html += `<div style="color: #FFD700; font-weight: bold; margin-bottom: 8px;">⚡ Способности</div>`;
            html += `<div style="color: #ccc; line-height: 1.5;">${characterData.abilities}</div>`;
            html += `</div>`;
        }
        
        // Дебаффы
        if (characterData.debuffs) {
            html += `<div style="margin-bottom: 20px; padding: 10px; background: rgba(255,0,0,0.1); border-radius: 5px; border-left: 3px solid #FF5555;">`;
            html += `<div style="color: #FF5555; font-weight: bold; margin-bottom: 8px;">⚠️ Дебаффы</div>`;
            html += `<div style="color: #ccc; line-height: 1.5;">${characterData.debuffs}</div>`;
            html += `</div>`;
            
            // Кнопка понижения дебаффов
            const cost = 15; // 15% * 1 гем (или оставить)
            html += `<button id="reduceDebuffBtn" style="width: 100%; padding: 10px; background: #FF9800; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; margin-bottom: 10px;">ПОНИЗИТЬ ДЕБАФФ (на 1 игру) - ${cost} 💎</button>`;
        }
        
        // Специальные кнопки для облака
        if (characterKey === 'cloud') {
            html += `<div style="margin-bottom: 20px;">`;
            html += `<button id="upgradeCloudBtn" style="width: 48%; padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; margin-right: 4%;">Повысить до -30% - 15 💎</button>`;
            html += `<button id="downgradeCloudBtn" style="width: 48%; padding: 10px; background: #F44336; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px;">Понизить до -20% - 15 💎</button>`;
            html += `</div>`;
        }
        
        html += `</div>`;
        
        textEl.innerHTML = html;
        modal.style.display = 'block';

        // Обработчик кнопки
        const reduceBtn = document.getElementById('reduceDebuffBtn');
        if (reduceBtn) {
            reduceBtn.addEventListener('click', () => {
                if (this.characterSystem.totalGems >= 15) {
                    this.characterSystem.addGems(-15);
                    this.debuffModifiers[characterKey] = this.debuffModifiers[characterKey] || {};
                    // Применить понижение на 5%
                    if (characterData.gravityMultiplier && characterData.gravityMultiplier > 1) {
                        this.debuffModifiers[characterKey].gravityMultiplier = (this.debuffModifiers[characterKey].gravityMultiplier || 0) - 0.05;
                    }
                    if (characterData.speedMultiplier) {
                        if (characterData.speedMultiplier > 1) {
                            this.debuffModifiers[characterKey].speedMultiplier = (this.debuffModifiers[characterKey].speedMultiplier || 0) - 0.05;
                        } else if (characterData.speedMultiplier < 1) {
                            this.debuffModifiers[characterKey].speedMultiplier = (this.debuffModifiers[characterKey].speedMultiplier || 0) + 0.05;
                        }
                    }
                    if (characterData.gapMultiplier && characterData.gapMultiplier < 1) {
                        this.debuffModifiers[characterKey].gapMultiplier = (this.debuffModifiers[characterKey].gapMultiplier || 0) + 0.05;
                    }
                    if (characterData.coinMultiplier && characterData.coinMultiplier < 1) {
                        this.debuffModifiers[characterKey].coinMultiplier = (this.debuffModifiers[characterKey].coinMultiplier || 0) + 0.05;
                    }
                    if (characterData.pipeDistanceMultiplier && characterData.pipeDistanceMultiplier < 1) {
                        this.debuffModifiers[characterKey].pipeDistanceMultiplier = (this.debuffModifiers[characterKey].pipeDistanceMultiplier || 0) + 0.05;
                    }
                    this.renderUI(); // Обновить отображение гемов
                    alert('Дебаффы понижены на 5% для этой игры!');
                    modal.style.display = 'none';
                } else {
                    alert('Недостаточно гемов!');
                }
            });
            reduceBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (this.characterSystem.totalGems >= 15) {
                    this.characterSystem.addGems(-15);
                    this.debuffModifiers[characterKey] = this.debuffModifiers[characterKey] || {};
                    // Применить понижение на 5%
                    if (characterData.gravityMultiplier && characterData.gravityMultiplier > 1) {
                        this.debuffModifiers[characterKey].gravityMultiplier = (this.debuffModifiers[characterKey].gravityMultiplier || 0) - 0.05;
                    }
                    if (characterData.speedMultiplier) {
                        if (characterData.speedMultiplier > 1) {
                            this.debuffModifiers[characterKey].speedMultiplier = (this.debuffModifiers[characterKey].speedMultiplier || 0) - 0.05;
                        } else if (characterData.speedMultiplier < 1) {
                            this.debuffModifiers[characterKey].speedMultiplier = (this.debuffModifiers[characterKey].speedMultiplier || 0) + 0.05;
                        }
                    }
                    if (characterData.gapMultiplier && characterData.gapMultiplier < 1) {
                        this.debuffModifiers[characterKey].gapMultiplier = (this.debuffModifiers[characterKey].gapMultiplier || 0) + 0.05;
                    }
                    if (characterData.coinMultiplier && characterData.coinMultiplier < 1) {
                        this.debuffModifiers[characterKey].coinMultiplier = (this.debuffModifiers[characterKey].coinMultiplier || 0) + 0.05;
                    }
                    if (characterData.pipeDistanceMultiplier && characterData.pipeDistanceMultiplier < 1) {
                        this.debuffModifiers[characterKey].pipeDistanceMultiplier = (this.debuffModifiers[characterKey].pipeDistanceMultiplier || 0) + 0.05;
                    }
                    this.renderUI(); // Обновить отображение гемов
                    alert('Дебаффы понижены на 5% для этой игры!');
                    modal.style.display = 'none';
                } else {
                    alert('Недостаточно гемов!');
                }
            });
        }

        // Специальные кнопки для облака
        if (characterKey === 'cloud') {
            const upgradeBtn = document.getElementById('upgradeCloudBtn');
            const downgradeBtn = document.getElementById('downgradeCloudBtn');
            if (upgradeBtn) {
                upgradeBtn.addEventListener('click', () => {
                    if (this.characterSystem.totalGems >= 15) { // Стоимость повышения
                        this.characterSystem.addGems(-15);
                        this.debuffModifiers[characterKey] = this.debuffModifiers[characterKey] || {};
                        this.debuffModifiers[characterKey].gravityMultiplier = -0.05; // Дополнительно -5% (итого -30%)
                        this.renderUI();
                        alert('Способность повышена до -30% гравитации!');
                        modal.style.display = 'none';
                    } else {
                        alert('Недостаточно гемов!');
                    }
                });
                upgradeBtn.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    if (this.characterSystem.totalGems >= 15) { // Стоимость повышения
                        this.characterSystem.addGems(-15);
                        this.debuffModifiers[characterKey] = this.debuffModifiers[characterKey] || {};
                        this.debuffModifiers[characterKey].gravityMultiplier = -0.05; // Дополнительно -5% (итого -30%)
                        this.renderUI();
                        alert('Способность повышена до -30% гравитации!');
                        modal.style.display = 'none';
                    } else {
                        alert('Недостаточно гемов!');
                    }
                });
            }
            if (downgradeBtn) {
                downgradeBtn.addEventListener('click', () => {
                    if (this.characterSystem.totalGems >= 15) { // Стоимость понижения
                        this.characterSystem.addGems(-15);
                        this.debuffModifiers[characterKey] = this.debuffModifiers[characterKey] || {};
                        this.debuffModifiers[characterKey].gravityMultiplier = +0.05; // +5% (итого -20%)
                        this.renderUI();
                        alert('Способность понижена до -20% гравитации!');
                        modal.style.display = 'none';
                    } else {
                        alert('Недостаточно гемов!');
                    }
                });
                downgradeBtn.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    if (this.characterSystem.totalGems >= 15) { // Стоимость понижения
                        this.characterSystem.addGems(-15);
                        this.debuffModifiers[characterKey] = this.debuffModifiers[characterKey] || {};
                        this.debuffModifiers[characterKey].gravityMultiplier = +0.05; // +5% (итого -20%)
                        this.renderUI();
                        alert('Способность понижена до -20% гравитации!');
                        modal.style.display = 'none';
                    } else {
                        alert('Недостаточно гемов!');
                    }
                });
            }
        }

        // Закрытие по клику на крестик
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.onclick = () => modal.style.display = 'none';

        // Закрытие по клику вне модалки
        window.onclick = (e) => {
            if (e.target === modal) modal.style.display = 'none';
        };
    }

    showUnlockConditionsModal(characterName, conditions) {
        const modal = document.getElementById('unlockConditionsModal');
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.marginTop = '5%'; // Поднять выше
        
        let html = `<div style="padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px; font-family: Arial, sans-serif;">`;
        html += `<h2 style="margin-top: 0; text-align: center; color: #fff;">Условия разблокировки ${characterName}</h2>`;
        html += `<div style="font-size: 16px; line-height: 1.6;">`;
        html += `<p>Чтобы купить эту супер-птицу, выполните следующие условия:</p>`;
        html += `<ul>`;
        for (const condition of conditions) {
            html += `<li>${condition}</li>`;
        }
        html += `</ul>`;
        html += `</div>`;
        html += `</div>`;
        
        const textEl = document.getElementById('unlockConditionsText');
        textEl.innerHTML = html;
        modal.style.display = 'block';

        // Закрытие по клику на крестик
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.onclick = () => {
            modal.style.display = 'none';
            modalContent.style.marginTop = ''; // Сбросить
        };

        // Закрытие по клику вне модалки
        window.onclick = (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                modalContent.style.marginTop = ''; // Сбросить
            }
        };
    }

    startGame() {
        // Сбросить на обычную птицу, если текущий персонаж не доступен
        if (!this.characterSystem.ownedCharacters[this.characterSystem.currentCharacter] && !this.characterSystem.rentedCharacters[this.characterSystem.currentCharacter]) {
            this.characterSystem.selectCharacter('normal');
        }

        this.skin = this.characterSystem.getCurrentCharacterData();
        
        // Применить модификаторы дебаффов
        const modifiers = this.debuffModifiers[this.characterSystem.currentCharacter];
        if (modifiers) {
            this.skin = { ...this.skin }; // Копия
            if (modifiers.gravityMultiplier) this.skin.gravityMultiplier = (this.skin.gravityMultiplier || 1) + modifiers.gravityMultiplier;
            if (modifiers.speedMultiplier) this.skin.speedMultiplier = (this.skin.speedMultiplier || 1) + modifiers.speedMultiplier;
            if (modifiers.gapMultiplier) this.skin.gapMultiplier = (this.skin.gapMultiplier || 1) + modifiers.gapMultiplier;
            if (modifiers.coinMultiplier) this.skin.coinMultiplier = (this.skin.coinMultiplier || 1) + modifiers.coinMultiplier;
            if (modifiers.pipeDistanceMultiplier) this.skin.pipeDistanceMultiplier = (this.skin.pipeDistanceMultiplier || 1) + modifiers.pipeDistanceMultiplier;
        }
        
        this.score = 0;
        this.runCoins = 0;
        this.runGems = 0;
        this.state = 'playing';
        this.startTime = Date.now(); // время начала игры для ускорения
        this.currentSpeedMultiplier = GAME_CONFIG.baseSpeedMultiplier;
        this.pipeCount = 0;
        this.debuffModifiers = {};

        this.bird = new Bird(GAME_CONFIG.canvasWidth / 4, GAME_CONFIG.canvasHeight / 2, this.skin, this.themeSystem.currentTheme, this);
        this.pipeManager = new PipeManager(this);
        this.coinManager = new CoinManager(this);

        // Скрыть меню и game over, показать HUD
        document.getElementById('startScreen').classList.remove('active');
        document.getElementById('gameOverScreen').classList.remove('active');
        document.getElementById('gameHUD').style.display = 'block';
        document.querySelector('.hud-item.score').classList.add('active');
        document.querySelector('.hud-item.coins').classList.add('active');
        document.querySelector('.hud-item.status').classList.add('active');

        if (this.bird.armor > 0) {
            document.querySelector('.hud-item.status').textContent = `Броня: ${this.bird.armor}`;
        } else if (this.bird.lives > 0) {
            document.querySelector('.hud-item.status').textContent = `Жизни: ${this.bird.lives + 1}`;
        } else {
            document.querySelector('.hud-item.status').classList.remove('active');
        }

        if (this.bird.hasAbility || this.bird.isEcho || this.bird.hasStraightFlight || this.bird.phoenixEffect) {
            document.querySelector('.hud-item.ability').classList.add('active');
            document.querySelector('.hud-item.ability').textContent = 'Способность: Готова (E)';
        }
    }

    addRunCoins(amount) {
        this.runCoins += amount;
    }

    addRunGems(amount) {
        this.runGems += amount;
    }

    activateAbility() {
        if (this.bird.hasStraightFlight && !this.bird.straightFlightActive && !this.bird.straightFlightUsed) {
            // Первородная птица: лететь прямо
            this.bird.straightFlightActive = true;
            this.bird.straightFlightUsed = true; // Одноразовая способность
            this.bird.straightFlightEndTime = Date.now() + (this.skin.abilityDuration || 2000);
            const abilityEl = document.querySelector('.hud-item.ability');
            if (abilityEl) {
                abilityEl.textContent = 'Способность: АКТИВНА!';
            }
            return;
        }

        if (this.bird.phoenixEffect && !this.bird.phoenixFireMode && !this.bird.phoenixAbilityUsed) {
            // Великий Феникс: активация режима ярости
            this.bird.phoenixFireMode = true;
            this.bird.phoenixAbilityUsed = true; // Одноразовая способность
            this.bird.straightFlightEndTime = Date.now() + 5000; // 5 секунд ярости
            const abilityEl = document.querySelector('.hud-item.ability');
            if (abilityEl) {
                abilityEl.textContent = 'Способность: АКТИВНА!';
            }
            return;
        }

        if (this.bird.isEcho && Date.now() > this.bird.echoCooldownEndTime) {
            // Птица-Эхо: ручная активация замедления времени
            this.slowMotionActive = true;
            this.slowMotionTimeLeft = 1000; // 1 секунда замедления
            this.bird.echoCooldownEndTime = Date.now() + 10000; // 10 секунд cooldown
            const abilityEl = document.querySelector('.hud-item.ability');
            if (abilityEl) {
                abilityEl.textContent = 'Способность: АКТИВНА!';
            }
            return;
        }

        if (!this.bird.hasAbility || this.bird.abilityUsed) return;

        this.bird.abilityUsed = true;
        this.bird.abilityActive = true;
        this.bird.abilityEndTime = Date.now() + (this.skin.abilityDuration || 5000);

        const abilityEl = document.querySelector('.hud-item.ability');
        if (abilityEl) {
            abilityEl.textContent = 'Способность: АКТИВНА!';
        }
    }

    updateAbilities() {
        // Скрываем HUD для птиц без активных способностей
        if (!this.bird.hasAbility && !this.bird.isEcho && !this.bird.hasStraightFlight && !this.bird.phoenixEffect) {
            const abilityEl = document.querySelector('.hud-item.ability');
            if (abilityEl) {
                abilityEl.classList.remove('active');
            }
            return;
        }
        
        // Великий Феникс: отображение статуса
        if (this.bird.phoenixEffect) {
            const abilityEl = document.querySelector('.hud-item.ability');
            if (abilityEl) {
                if (this.bird.phoenixFireMode) {
                    abilityEl.textContent = 'Способность: АКТИВНА!';
                } else if (this.bird.phoenixAbilityUsed) {
                    abilityEl.textContent = 'Способность: Использовано';
                } else {
                    abilityEl.textContent = 'Способность: Готова (E)';
                }
            }
            // Продолжаем для обработки окончания способности
        }
        
        // Птица-Эхо: отображение статуса
        if (this.bird.isEcho) {
            const abilityEl = document.querySelector('.hud-item.ability');
            if (abilityEl) {
                if (this.slowMotionActive) {
                    abilityEl.textContent = 'Способность: АКТИВНА!';
                } else if (Date.now() < this.bird.echoCooldownEndTime) {
                    const remainingTime = Math.ceil((this.bird.echoCooldownEndTime - Date.now()) / 1000);
                    abilityEl.textContent = `Способность: Cooldown ${remainingTime}с`;
                } else {
                    abilityEl.textContent = 'Способность: Готова (E)';
                }
            }
            return;
        }
        
        // Первородная птица: отображение статуса
        if (this.bird.hasStraightFlight) {
            const abilityEl = document.querySelector('.hud-item.ability');
            if (abilityEl) {
                if (this.bird.straightFlightActive) {
                    abilityEl.textContent = 'Способность: АКТИВНА!';
                } else if (this.bird.straightFlightUsed) {
                    abilityEl.textContent = 'Способность: Использовано';
                } else {
                    abilityEl.textContent = 'Способность: Готова (E)';
                }
            }
            // Продолжаем выполнение для обработки окончания способности
        }
        
        // Первородная птица: лететь прямо
        if (this.bird.straightFlightActive) {
            if (Date.now() > this.bird.straightFlightEndTime) {
                this.bird.straightFlightActive = false;
                this.bird.setInvulnerable(1000); // 1 секунда неуязвимости после
                // Не возвращаемся, чтобы статус обновился на "Использовано"
            } else {
                // Летит горизонтально
                this.bird.rotation = 0;
                return;
            }
        }

        if (!this.bird.abilityActive) return;

        if (Date.now() > this.bird.abilityEndTime) {
            this.bird.abilityActive = false;
            // Робот получает 1 секунду неуязвимости после способности
            if (this.bird.skin.isRobot) {
                this.bird.setInvulnerable(1000);
            }
            const abilityEl = document.querySelector('.hud-item.ability');
            if (abilityEl) {
                abilityEl.textContent = 'Способность: Использовано';
            }
            return;
        }

        // Логика автопилота: робот летит по прямой снося трубы, другие скины уклоняются
        if (this.bird.skin.isRobot) {
            // Робот летит строго по прямой (без гравитации и поворотов) и сносит трубы с эффектами
            this.bird.velocityY = 0; // летит ровно горизонтально
            this.bird.rotation = 0; // без поворотов
            
            // Проверяем столкновения с трубами и добавляем эффекты разрушения
            for (let pipe of this.pipeManager.pipes) {
                if (this.bird.collidesWith(pipe.x, 0, pipe.width, pipe.topHeight) ||
                    this.bird.collidesWith(pipe.x, pipe.topHeight + pipe.gapSize, pipe.width, GAME_CONFIG.canvasHeight - (pipe.topHeight + pipe.gapSize))) {
                    // Добавляем частицы разрушения
                    this.addDestructionParticles(pipe.x + pipe.width / 2, pipe.topHeight + pipe.gapSize / 2);
                }
            }
            return;
        }

        if (this.pipeManager.pipes.length > 0) {
            // Найти ближайшую трубу, которую нужно избежать
            let nextPipe = null;
            for (let pipe of this.pipeManager.pipes) {
                if (pipe.x + pipe.width > this.bird.x - 10) {
                    nextPipe = pipe;
                    break;
                }
            }
            
            if (nextPipe) {
                const gapTop = nextPipe.topHeight;
                const gapBottom = nextPipe.topHeight + nextPipe.gapSize;
                const gapCenter = (gapTop + gapBottom) / 2;
                const gapWidth = nextPipe.gapSize;
                
                // Целевая позиция: центр зазора
                const targetY = gapCenter;
                const error = targetY - this.bird.y;
                
                // Агрессивное управление для точного попадания в проём
                if (error > 2) {
                    // Нужно подняться - частые прыжки
                    this.bird.velocityY = -GAME_CONFIG.jumpPower * 0.8;
                } else if (error < -2) {
                    // Слегка падаем под гравитацией (не прыгаем)
                    // Гравитация сама её опустит
                }
            }
        }
    }

    // Добавление частиц разрушения при сносе труб роботом
    addDestructionParticles(x, y) {
        // Создаем частицы обломков
        for (let i = 0; i < 8; i++) {
            const particle = {
                x: x + (Math.random() - 0.5) * 40,
                y: y + (Math.random() - 0.5) * 40,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 30,
                size: 3 + Math.random() * 4,
                color: '#8B4513' // коричневый для обломков
            };
            // Добавляем в массив частиц
            if (!this.destructionParticles) this.destructionParticles = [];
            this.destructionParticles.push(particle);
        }
        
        // Добавляем искры
        for (let i = 0; i < 5; i++) {
            const spark = {
                x: x + (Math.random() - 0.5) * 30,
                y: y + (Math.random() - 0.5) * 30,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6 - 2,
                life: 20,
                size: 2,
                color: '#FFA500' // оранжевый для искр
            };
            this.destructionParticles.push(spark);
        }
    }

    // Обновление частиц разрушения
    updateDestructionParticles() {
        if (!this.destructionParticles) return;
        
        this.destructionParticles = this.destructionParticles.filter(p => {
            p.life--;
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2; // гравитация
            return p.life > 0;
        });
    }

    // Рисование частиц разрушения
    drawDestructionParticles(ctx) {
        if (!this.destructionParticles) return;
        
        for (let p of this.destructionParticles) {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life / 30; // fade out
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    // Обновление частиц пепла
    updateAshParticles() {
        if (this.themeSystem.currentTheme !== 'ash') return;
        
        // Удаляем старые частицы
        this.ashParticles = this.ashParticles.filter(p => p.life > 0);
        
        // Обновляем существующие
        for (let p of this.ashParticles) {
            p.life--;
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05; // медленное падение
        }
        
        // Спавним новые частицы
        if (Math.random() < 0.3) { // 30% шанс спавна каждую итерацию
            this.ashParticles.push({
                x: Math.random() * this.canvas.width,
                y: -10,
                vx: (Math.random() - 0.5) * 0.5, // небольшое горизонтальное движение
                vy: Math.random() * 1 + 0.5, // вертикальная скорость
                life: 200 + Math.random() * 100, // длительность жизни
                size: 1 + Math.random() * 2
            });
        }
    }

    // Рисование частиц пепла
    drawAshParticles(ctx) {
        if (this.themeSystem.currentTheme !== 'ash') return;
        
        ctx.fillStyle = 'rgba(112, 108, 108, 0.6)'; // светло-серый цвет пепла
        for (let p of this.ashParticles) {
            ctx.globalAlpha = Math.min(p.life / 100, 0.6); // fade based on life
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    gameOver() {
        this.state = 'gameover';
        this.characterSystem.saveRecord(this.score);

        // Убрать аренду после игры
        if (this.characterSystem.rentedCharacters[this.characterSystem.currentCharacter]) {
            this.characterSystem.removeRental(this.characterSystem.currentCharacter);
        }

        const multiplier = this.skin.coinMultiplier || 1;
        const finalCoins = Math.floor(this.runCoins * multiplier);
        this.characterSystem.addCoins(finalCoins);
        this.characterSystem.addGems(this.runGems);

        // Увеличить счетчик пройденных труб для текущего персонажа
        const currentChar = this.characterSystem.currentCharacter;
        this.characterSystem.pipesPassedPerCharacter[currentChar] = (this.characterSystem.pipesPassedPerCharacter[currentChar] || 0) + this.bird.pipesPassed;
        this.characterSystem.savePipesPassedPerCharacter();

        // Показать экран game over
        document.getElementById('gameHUD').style.display = 'none';
        document.getElementById('gameOverScreen').classList.add('active');

        document.getElementById('scoreGameOver').textContent = this.score;
        document.getElementById('coinsGameOver').textContent = finalCoins;
        document.getElementById('totalCurrencyDisplay').textContent = `${this.characterSystem.totalCoins}🪙|${this.characterSystem.totalGems}💎`;

        // Сообщение о скине
        const messageEl = document.getElementById('skinMessage');
        if (this.skin.name === 'Феникс' && this.bird.lives === -1) {
            messageEl.textContent = '🔥 Феникс испарился! Одна из жизней использована.';
        } else if (this.skin.name === 'Рыцарь' && this.bird.armor === 0) {
            messageEl.textContent = '⚔️ Броня полностью разбита!';
        } else {
            messageEl.textContent = '';
        }
    }

    showMenu() {
        this.state = 'menu';
        document.getElementById('startScreen').classList.add('active');
        document.getElementById('gameOverScreen').classList.remove('active');
        document.getElementById('gameHUD').style.display = 'none';
        this.renderUI();
    }

    update() {
        if (this.state !== 'playing') return;

        // Обновление замедления времени (Эхо)
        if (this.slowMotionActive) {
            this.slowMotionTimeLeft -= 16; // Примерно 16ms за фрейм
            if (this.slowMotionTimeLeft <= 0) {
                this.slowMotionActive = false;
                this.slowMotionTimeLeft = 0;
            }
        }

        // Обновление скорости с ускорением (кроме ниндзи, который остаётся на 0.75)
        const elapsedTime = Date.now() - this.startTime;
        if (this.skin.name !== 'Ниндзя') {
            // Постепенное ускорение от 0.75 до 1.0
            this.currentSpeedMultiplier = GAME_CONFIG.baseSpeedMultiplier + 
                (elapsedTime * GAME_CONFIG.speedAcceleration / 1000);
            // Максимум 1.0 (нормальная скорость)
            this.currentSpeedMultiplier = Math.min(this.currentSpeedMultiplier, 1.0);
        } else {
            // Ниндзя всегда остаётся на 0.75
            this.currentSpeedMultiplier = GAME_CONFIG.baseSpeedMultiplier;
        }
        
        // Применить замедление времени
        if (this.slowMotionActive) {
            this.currentSpeedMultiplier *= this.slowMotionFactor;
        }

        // Обновление птицы
        this.bird.update();
        this.bird.addFireEffect();
        
        // Дополнительный огонь для Феникса в режиме ярости
        if (this.bird.phoenixEffect && this.bird.phoenixFireMode) {
            this.bird.addFireEffect();
        }
        
        this.bird.addSparkleEffect();

        // Обновление труб и монет
        this.pipeManager.update();
        this.coinManager.update();

        // Автопилот робота и способности
        this.updateAbilities();

        // Обновление частиц разрушения
        this.updateDestructionParticles();

        // Обновление частиц пепла для темы Ash
        this.updateAshParticles();

        // Проверка столкновения с трубами
        for (let pipe of this.pipeManager.pipes) {
            let collision = false;
            let isTopPipe = false;
            
            // Столкновение с верхней трубой
            if (this.bird.collidesWith(pipe.x, 0, pipe.width, pipe.topHeight)) {
                collision = true;
                isTopPipe = true;
            }

            // Столкновение с нижней трубой
            const bottomY = pipe.topHeight + pipe.gapSize;
            if (this.bird.collidesWith(pipe.x, bottomY, pipe.width, GAME_CONFIG.canvasHeight - bottomY)) {
                collision = true;
                isTopPipe = false;
            }
            
            if (collision) {
                let shouldDamage = true;
                
                // Режим ярости Великого Феникса: игнорировать трубы только в режиме ярости
                if (this.bird.phoenixFireMode) {
                    shouldDamage = false;
                }
                
                // Команда /ignore: игнорировать все трубы
                if (this.bird.ignorePipes) {
                    shouldDamage = false;
                }
                
                // Желейная птица: не убивает при касании только ободка (деревянных выступов)
                if (this.bird.isJelly) {
                    let collidesWood = false;
                    
                    if (isTopPipe) {
                        // Деревянный выступ верхней: y pipe.topHeight - 8 to pipe.topHeight, x pipe.x - 5 to pipe.x + pipe.width + 5
                        if (this.bird.collidesWith(pipe.x - 5, pipe.topHeight - 8, pipe.width + 10, 8)) {
                            collidesWood = true;
                        }
                    } else {
                        // Деревянный выступ нижней: y bottomY to bottomY + 8, x pipe.x - 5 to pipe.x + pipe.width + 5
                        if (this.bird.collidesWith(pipe.x - 5, bottomY, pipe.width + 10, 8)) {
                            collidesWood = true;
                        }
                    }
                    
                    // Если касается дерева, не damage
                    if (collidesWood) {
                        shouldDamage = false;
                    }
                }
                
                // Астральная птица: астральные трубы не убивают
                if (pipe.isAstral) {
                    shouldDamage = false;
                }
                
                // Огненная стена: дает жизнь Великому Фениксу вместо урона
                if (pipe.isFireWall && this.bird.phoenixEffect) {
                    // Даем жизнь Фениксу
                    if (this.bird.lives < 1) {
                        this.bird.lives++;
                        // Обновляем HUD
                        if (this.bird.lives > 0) {
                            document.querySelector('.hud-item.status').textContent = `Жизни: ${this.bird.lives + 1}`;
                        }
                    }
                    shouldDamage = false;
                }
                
                if (shouldDamage) {
                    if (this.bird.takeDamage()) {
                        this.gameOver();
                    }
                }
            }

            // Спавн монет в проёме (вероятность зависит от скина)
            const skin = (this.game && this.game.skin) || CHARACTERS.normal;
            const spawnChance = 0.4 * (skin.coinMultiplier || 1);
            if (!pipe.hasSpawnedCoin && Math.random() < spawnChance) {
                pipe.hasSpawnedCoin = true;
                this.coinManager.spawnCoin(pipe.x, pipe.topHeight, pipe.gapSize);
            }
        }

        // Проверка столкновения с землёй/потолком
        if (this.bird.y - this.bird.height / 2 < 0 || this.bird.y + this.bird.height / 2 > GAME_CONFIG.canvasHeight) {
            if (this.bird.takeDamage()) {
                this.gameOver();
            } else {
                // Выровнять позицию
                if (this.bird.y - this.bird.height / 2 < 0) {
                    this.bird.y = this.bird.height / 2;
                } else {
                    this.bird.y = GAME_CONFIG.canvasHeight - this.bird.height / 2;
                }
                this.bird.velocityY = 0;
            }
        }

        // Обновить HUD
        document.getElementById('hudScore').textContent = this.score;
        const multiplier = this.skin.coinMultiplier || 1;
        document.getElementById('hudCurrency').textContent = `${Math.floor(this.runCoins * multiplier)}🪙|${this.runGems}💎`;

        if (this.bird.armor > 0) {
            document.querySelector('.hud-item.status').textContent = `Броня: ${this.bird.armor}`;
        } else if (this.bird.lives >= 0) {
            document.querySelector('.hud-item.status').textContent = `Жизни: ${this.bird.lives + 1}`;
        } else if (this.bird.sparkAvailable) {
            document.querySelector('.hud-item.status').textContent = `Искра: готова`;
        } else {
            document.querySelector('.hud-item.status').textContent = '';
        }
    }

    draw() {
        // Фон в зависимости от темы
        const themeData = this.themeSystem.getCurrentThemeData();

        if (this.themeSystem.currentTheme === 'neonCity' && this.themeImages.neonCity && this.themeImages.neonCity.complete && this.themeImages.neonCity.naturalWidth > 0) {
            // Использовать изображение для Неон-Сити
            this.ctx.drawImage(this.themeImages.neonCity, 0, 0, this.canvas.width, this.canvas.height);
        } else if (this.themeSystem.currentTheme === 'moon' && this.themeImages.moon && this.themeImages.moon.complete && this.themeImages.moon.naturalWidth > 0) {
            // Использовать изображение для Луны
            this.ctx.drawImage(this.themeImages.moon, 0, 0, this.canvas.width, this.canvas.height);
        } else if (this.themeSystem.currentTheme === 'ash' && this.themeImages.ash && this.themeImages.ash.complete && this.themeImages.ash.naturalWidth > 0) {
            // Использовать изображение для Пепла
            this.ctx.drawImage(this.themeImages.ash, 0, 0, this.canvas.width, this.canvas.height);
        } else {
            // Использовать градиент или fallback
            let bgGradient;

            if (themeData.background.includes('linear-gradient')) {
                // Парсим градиент
                const colors = themeData.background.match(/#[0-9a-fA-F]{6}/g);
                if (colors && colors.length >= 2) {
                    bgGradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
                    colors.forEach((color, index) => {
                        bgGradient.addColorStop(index / (colors.length - 1), color);
                    });
                }
            }

            if (bgGradient) {
                this.ctx.fillStyle = bgGradient;
            } else {
                // Fallback
                this.ctx.fillStyle = '#87CEEB';
            }
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // Дополнительные эффекты для тем
        if (this.themeSystem.currentTheme === 'night') {
            // Полумесяц
            const moonX = this.canvas.width * 0.8;
            const moonY = this.canvas.height * 0.2;
            const moonRadius = 30;
            
            this.ctx.save();
            this.ctx.translate(moonX, moonY);
            this.ctx.rotate(Math.PI / 6); // поворот на 30 градусов
            
            this.ctx.fillStyle = '#FFFFE0';
            // Большой круг
            this.ctx.beginPath();
            this.ctx.arc(0, 0, moonRadius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Меньший круг для выреза (смещенный влево для другой стороны)
            this.ctx.fillStyle = '#191970'; // цвет фона ночи
            this.ctx.beginPath();
            this.ctx.arc(-15, 0, moonRadius - 5, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
            
            // Звезды
            this.ctx.fillStyle = 'white';
            const stars = [
                {x: this.canvas.width * 0.1, y: this.canvas.height * 0.15, size: 1.5},
                {x: this.canvas.width * 0.2, y: this.canvas.height * 0.25, size: 2},
                {x: this.canvas.width * 0.3, y: this.canvas.height * 0.1, size: 1},
                {x: this.canvas.width * 0.4, y: this.canvas.height * 0.35, size: 2.5},
                {x: this.canvas.width * 0.5, y: this.canvas.height * 0.2, size: 1.5},
                {x: this.canvas.width * 0.6, y: this.canvas.height * 0.4, size: 2},
                {x: this.canvas.width * 0.7, y: this.canvas.height * 0.15, size: 1},
                {x: this.canvas.width * 0.8, y: this.canvas.height * 0.3, size: 2.5},
                {x: this.canvas.width * 0.9, y: this.canvas.height * 0.45, size: 1.5},
                {x: this.canvas.width * 0.15, y: this.canvas.height * 0.5, size: 2},
                {x: this.canvas.width * 0.25, y: this.canvas.height * 0.6, size: 1},
                {x: this.canvas.width * 0.35, y: this.canvas.height * 0.55, size: 2.5},
                {x: this.canvas.width * 0.45, y: this.canvas.height * 0.65, size: 1.5},
                {x: this.canvas.width * 0.55, y: this.canvas.height * 0.7, size: 2},
                {x: this.canvas.width * 0.65, y: this.canvas.height * 0.75, size: 1},
                {x: this.canvas.width * 0.75, y: this.canvas.height * 0.8, size: 2.5},
                {x: this.canvas.width * 0.85, y: this.canvas.height * 0.85, size: 1.5},
                {x: this.canvas.width * 0.05, y: this.canvas.height * 0.3, size: 2},
                {x: this.canvas.width * 0.95, y: this.canvas.height * 0.6, size: 1},
                {x: this.canvas.width * 0.12, y: this.canvas.height * 0.8, size: 2.5}
            ];
            
            for (let star of stars) {
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                this.ctx.fill();
            }
        } else if (this.themeSystem.currentTheme === 'neonCity') {
            // Неоновые эффекты
            this.ctx.fillStyle = 'rgba(255, 0, 255, 0.1)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        if (this.state === 'playing') {
            // Рисование игровых объектов
            this.pipeManager.draw(this.ctx, this.themeSystem.currentTheme);
            this.coinManager.draw(this.ctx, this.themeSystem.currentTheme);
            this.bird.draw(this.ctx);

            // Рисование частиц разрушения
            this.drawDestructionParticles(this.ctx);

            // Рисование частиц пепла для темы Ash
            this.drawAshParticles(this.ctx);

            // Земля
            this.ctx.fillStyle = '#8B7355';
            this.ctx.fillRect(0, this.canvas.height - 20, this.canvas.width, 20);
            this.ctx.strokeStyle = '#654321';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(0, this.canvas.height - 20, this.canvas.width, 20);
        }
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// ==================== КЛАСС КОНСОЛЬ ====================
class GameConsole {
    constructor(game) {
        this.game = game;
        this.visible = false;
        this.output = [];
        this.maxLines = 5;
        this.input = document.getElementById('consoleInput');
        this.outputEl = document.getElementById('consoleOutput');
        this.console = document.getElementById('console');
        
        this.setupEventListeners();
        this.log('Консоль активирована. Введите / для справки.');
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === '/') {
                e.preventDefault();
                this.toggle();
            }
        });

        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.executeCommand(this.input.value);
                this.input.value = '';
            } else if (e.key === 'Escape') {
                this.toggle();
            }
        });
    }

    toggle() {
        this.visible = !this.visible;
        if (this.visible) {
            this.console.style.display = 'flex';
            this.input.value = '/';
            this.input.focus();
        } else {
            this.console.style.display = 'none';
        }
    }

    log(message, type = 'default') {
        this.output.push({ message, type });
        if (this.output.length > this.maxLines) {
            this.output.shift();
        }
        this.updateDisplay();
    }

    updateDisplay() {
        this.outputEl.innerHTML = '';
        for (const line of this.output) {
            const el = document.createElement('div');
            el.className = `console-line console-${line.type}`;
            el.textContent = line.message;
            this.outputEl.appendChild(el);
        }
        this.outputEl.scrollTop = this.outputEl.scrollHeight;
    }

    executeCommand(cmd) {
        cmd = cmd.trim();
        this.log(`> ${cmd}`);

        if (cmd === '~' || cmd === '') {
            this.showHelp();
            return;
        }

        const parts = cmd.split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        switch (command) {
            case '/coins':
                this.addCoins(parseInt(args[0]) || 0);
                break;
            case '/score':
                this.addScore(parseInt(args[0]) || 0);
                break;
            case '/god':
                this.toggleGodMode();
                break;
            case '/ignore':
                if (this.game.bird) {
                    this.game.bird.ignorePipes = !this.game.bird.ignorePipes;
                    this.log(`Ignore pipes: ${this.game.bird.ignorePipes ? 'ON' : 'OFF'}`);
                } else {
                    this.log('Команда доступна только во время игры', 'error');
                }
                break;
            case '/clear':
                this.output = [];
                this.updateDisplay();
                break;
            case '/help':
                this.showHelp();
                break;
            default:
                this.log('Неизвестная команда. Введите /help для справки', 'error');
        }
    }

    addCoins(amount) {
        if (isNaN(amount) || amount < 0) {
            this.log('Ошибка: введите положительное число', 'error');
            return;
        }
        this.game.characterSystem.addCoins(amount);
        this.game.renderUI();
        this.log(`+${amount} монет! Всего: ${this.game.characterSystem.totalCoins}`, 'success');
    }

    addScore(amount) {
        if (isNaN(amount) || amount < 0) {
            this.log('Ошибка: введите положительное число', 'error');
            return;
        }
        if (this.game.state === 'playing') {
            this.game.score += amount;
            this.log(`Счёт +${amount}! Текущий: ${this.game.score}`, 'success');
        } else {
            this.log('Команда работает только во время игры', 'error');
        }
    }

    toggleGodMode() {
        this.log('God Mode недоступен в этой версии', 'error');
    }

    showHelp() {
        this.output = [];
        this.log('=== ПОМОЩЬ ===', 'default');
        this.log('/coins <число> - добавить монеты', 'default');
        this.log('/score <число> - добавить очки (во время игры)', 'default');
        this.log('/ignore - включить/выключить игнорирование труб', 'default');
        this.log('/clear - очистить консоль', 'default');
        this.log('/help - эта справка', 'default');
        this.updateDisplay();
    }
}

// ==================== ЗАПУСК ИГРЫ ====================
window.addEventListener('load', () => {
    const game = new Game();
    new GameConsole(game);
});

