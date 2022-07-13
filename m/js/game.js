var canvasBg = document.getElementById('canvasBg');
var ctxBg = canvasBg.getContext('2d');
var canvasEnemy = document.getElementById('canvasEnemy');
var ctxEnemy = canvasEnemy.getContext('2d');
var canvasJet = document.getElementById('canvasJet');
var ctxJet = canvasJet.getContext('2d');
var canvasHUD = document.getElementById('canvasHUD');
var ctxHUD = canvasHUD.getContext('2d');
ctxHUD.fillStyle = "#FFFFFF";
ctxHUD.font = "bold 26px serif";
var noseOfJet;
var startSound = new Audio("audio/start.mp3");
var winSound = new Audio("audio/win.mp3");
var bgSound = new Audio("audio/back.mp3");
var enemyKillSound = new Audio("audio/bullet.wav");
var deathSound = new Audio("audio/death.wav");
var fireSound = new Audio("audio/fire.wav");
var speedInc = 0;
var jet1 = new Jet();
var btnStart = new Button(560, 720, 345, 405);
var btnTry = new Button(490, 680, 275, 330);
var btnMenu = new Button(250, 410, 275, 330);
var btnAbout = new Button(560, 720, 415, 470);
var btnPlay = new Button(480, 780, 390, 490);
var btnBack = new Button(10, 100, 425, 465);
var gameWidth = canvasBg.width;
var gameHeight = canvasBg.height;
var mouseX = 0;
var mouseY = 0;
var isPlaying = false;
var endDrawn = false;
var menuDrawn = false;
var winDrawn = false;
var aboutDrawn = false;
var requestAnimFrame = window.requestAnimationFrame || window.webRequestAnimationFrame ||
    window.mozRequestAnimationFrame || window.mstRequestAnimationFrame || window.oRequestAnimationFrame;
var enemies = [];
var spawnAmount = 12;
var imgSprite = new Image();
imgSprite.src = "img/sprite.png";
imgSprite.addEventListener('load', init, false);
var bgDrawX1 = 0;
var bgDrawX2 = 1600;

var btnKeyUp = document.getElementById('keyUp');


function moveBg() {
    bgDrawX1 -= 5;
    bgDrawX2 -= 5;
    if (bgDrawX1 <= -1600)
        bgDrawX1 = 1600;
    else if (bgDrawX2 <= -1600) {
        bgDrawX2 = 1600;
    }
    drawBg();
}
//init functions
function init() {
    spawnEnemy(spawnAmount);
    drawMenu();
    document.addEventListener('click', mouseClicked, false);
}

function playGame() {
    drawBg();
    startLoop();
    updateHUD();
    document.addEventListener('keydown', checkKeyDown, false);
    document.addEventListener('keyup', checkKeyUp, false);
}

function spawnEnemy(num) {
    for (var i = 0; i < num; i++) {
        enemies[enemies.length] = new Enemy();
    }
}

function drawAllEnemies() {
    clearCtxEnemy();
    for (i = 0; i < enemies.length; i++) {
        enemies[i].draw();
    }
}

function loop() {
    if (isPlaying) {
        canvasBg.style.cursor = "none";
        canvasEnemy.style.cursor = "none";
        canvasJet.style.cursor = "none";
        canvasHUD.style.cursor = "none";
        bgSound.loop = true;
        bgSound.play();
        moveBg();
        jet1.draw();
        drawAllEnemies();
        requestAnimFrame(loop);
    }
}

function startLoop() {
    isPlaying = true;
    loop();
}

function stopLoop() {
    isPlaying = false;
}

function drawMenu() {
    menuDrawn = true;
    startSound.loop = true;
    startSound.play();
    ctxHUD.clearRect(0, 0, gameWidth, gameHeight);
    var srcX = 0;
    var srcY = 580;
    var drawX = 0;
    var drawY = 0;
    ctxBg.drawImage(imgSprite, srcX, srcY, gameWidth, gameHeight, drawX, drawY, gameWidth, gameHeight);
}

function drawAbout() {
    aboutDrawn = true;
    ctxHUD.clearRect(0, 0, gameWidth, gameHeight);
    var srcX = 0;
    var srcY = 1580;
    var drawX = 0;
    var drawY = 0;
    ctxBg.drawImage(imgSprite, srcX, srcY, gameWidth, gameHeight, drawX, drawY, gameWidth, gameHeight);
}

function drawEnd() {
    endDrawn = true;
    jet1.lineCount = 0;
    deathSound.play();
    bgSound.pause();
    bgSound.loop = false;
    speedInc = 0;
    ctxHUD.clearRect(0, 0, gameWidth, gameHeight);
    ctxHUD.fillText("香蕉炳: " + jet1.score + " 個", 10, 30);
    canvasBg.style.cursor = "pointer";
    canvasEnemy.style.cursor = "pointer";
    canvasJet.style.cursor = "pointer";
    canvasHUD.style.cursor = "pointer";
    var srcX = 0;
    var srcY = 1080;
    var drawX = 0;
    var drawY = 0;
    ctxBg.drawImage(imgSprite, srcX, srcY, gameWidth, gameHeight, drawX, drawY, gameWidth, gameHeight);
    jet1.score = 0;
}

function drawWin() {
    winDrawn = true;
    bgSound.pause();
    bgSound.loop = false;
    winSound.play();
    speedInc = 0;
    ctxHUD.clearRect(0, 0, gameWidth, gameHeight);
    ctxHUD.fillText("香蕉炳: " + jet1.score + " 個", 10, 30);
    canvasBg.style.cursor = "pointer";
    canvasEnemy.style.cursor = "pointer";
    canvasJet.style.cursor = "pointer";
    canvasHUD.style.cursor = "pointer";
    var srcX = 0;
    var srcY = 2080;
    var drawX = 0;
    var drawY = 0;
    ctxBg.drawImage(imgSprite, srcX, srcY, gameWidth, gameHeight, drawX, drawY, gameWidth, gameHeight);
    jet1.score = 0;
}

function drawBg() {
    ctxBg.clearRect(0, 0, gameWidth, gameHeight);
    var srcX = 0;
    var srcY = 0;
    var drawY = 0;
    ctxBg.drawImage(imgSprite, srcX, srcY, 1600, gameHeight, bgDrawX1, drawY, 1600, gameHeight);
    ctxBg.drawImage(imgSprite, srcX, srcY, 1600, gameHeight, bgDrawX2, drawY, 1600, gameHeight);
}

function updateHUD() {
    ctxHUD.clearRect(0, 0, gameWidth, gameHeight);
    ctxHUD.fillText("香蕉炳: " + jet1.score + " 個", 10, 30);
}
//end of init functions	
//Jet functions
function Jet() {
    this.srcX = 0;
    this.srcY = 500;
    this.width = 125;
    this.height = 73;
    this.drawX = 220;
    this.drawY = 200;
    this.noseX = this.drawX + 100;
    this.noseY = this.drawY + 10;
    this.noseX2 = this.drawX;
    this.noseY2 = this.drawY + 60;
    this.leftX = this.drawX;
    this.rightX = this.drawX + this.width;
    this.topY = this.drawY;
    this.bottomY = this.drawY + this.height;
    this.speed = 3;
    this.isUpKey = false;
    this.isRightKey = false;
    this.isDownKey = false;
    this.isLeftKey = false;
    this.isSpacebar = false;
    this.isXKey = false;
    this.isShooting = false;
    this.isShootingLine = false;
    this.line = new Line(this);
    this.bullets = [];
    this.currentBullet = 0;
    for (var i = 0; i < 25; i++) {
        this.bullets[this.bullets.length] = new Bullet(this);
    }
    this.score = 0;
    this.explode = new Explosion();
    this.lineCount = 0;
}
Jet.prototype.draw = function () {
    clearCtxJet();
    this.updateCoors();
    this.checkDirection();
    this.checkShooting();
    this.checkShootingLine();
    this.drawAllBullets();
    this.drawLines();
    ctxJet.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
    this.checkWin();
    this.checkHitEnemy();
};
Jet.prototype.drawAllBullets = function () {
    for (i = 0; i < this.bullets.length; i++) {
        if (this.bullets[i].drawX >= 0) {
            this.bullets[i].draw();
        }
        if (this.bullets[i].explosion.hasHit) this.bullets[i].explosion.draw();
    }
};
Jet.prototype.drawLines = function () {
    if (this.line.drawX >= 0) {
        this.line.draw();
    }
    if (this.line.explosion.hasHit) this.line.explosion.draw();
};
Jet.prototype.checkShooting = function () {
    //bullet shooting
    if (this.isSpacebar && !this.isShooting) {
        this.isShooting = true;
        fireSound.pause();
        fireSound = 0;
        fireSound = new Audio("fire.wav");
        fireSound.play();
        this.bullets[i].sound.play();
        this.bullets[this.currentBullet].fire(this.noseX, this.noseY);
        this.currentBullet++;
        if (this.currentBullet >= this.bullets.length) {
            this.currentBullet = 0;
        }
    } else if (!this.isSpacebar) this.isShooting = false;
};
Jet.prototype.checkShootingLine = function () {
    //line shooting
    if (this.isXKey && !this.isShootingLine) {
        this.isShootingLine = true;
        //fireSound.pause();
        //fireSound=0;
        //fireSound=new Audio("fire.wav");
        //fireSound.play();
        //this.bullets[i].sound.play();
        this.line.fire(this.noseX, 0);
        //this.currentBullet++;
        //   if(this.currentBullet >= this.bullets.length){this.currentBullet =0;}
    } else if (!this.isXKey) this.isShootingLine = false;
};
Jet.prototype.updateScore = function (points) {
    this.score += points;
    updateHUD();
    this.updateLineCount(1);
};
Jet.prototype.updateLineCount = function (linePoints) {
    if (this.score % 25 === 0) this.lineCount += linePoints;
};
Jet.prototype.checkWin = function () {
    if (this.score >= 324) {
        isPlaying = false;
        clearCtxJet();
        this.drawX = 220;
        this.drawY = 200;
        for (i = 0; i < spawnAmount; ++i) {
            enemies[i].recycleEnemy();
        }
        for (var i = 0; i < 25; i++) {
            this.bullets[i].recycle();
        }
        for (var i = 0; i < 25; i++) {
            this.bullets[i].explosion.drawX = -100;
        }
        drawWin();
    }
};
Jet.prototype.updateCoors = function () {
    this.noseX = this.drawX + 100;
    this.noseY = this.drawY + 10;
    this.noseX2 = this.drawX;
    this.noseY2 = this.drawY+ 60;
    this.leftX = this.drawX;
    this.rightX = this.drawX + this.width;
    this.topY = this.drawY;
    this.bottomY = this.drawY + this.height;
};
Jet.prototype.checkDirection = function () {
    if (this.isUpKey && this.topY > 0) {
        this.drawY -= this.speed;
    }
    if (this.isRightKey && this.rightX < gameWidth) {
        this.drawX += this.speed;
    }
    if (this.isDownKey && this.bottomY < gameHeight) {
        this.drawY += this.speed;
    }
    if (this.isLeftKey && this.leftX > 0) {
        this.drawX -= this.speed;
    }
};

function clearCtxJet() {
    ctxJet.clearRect(0, 0, gameWidth, gameHeight)
}
Jet.prototype.checkHitEnemy = function () {
    for (var i = 0; i < enemies.length; i++) {
        if (this.noseX +5 >= enemies[i].drawX && 
        	this.noseX - 0 <= (enemies[i].drawX + enemies[i].width) && 
        	this.noseY +5 >= enemies[i].drawY && 
        	this.noseY - 0 <= (enemies[i].drawY + enemies[i].height)) 
        {
            this.explode.drawX = this.drawX - (this.explode.width / 2);
            this.explode.drawY = this.drawY;
            this.explode.hasHit = true;
            isPlaying = false;
            clearCtxJet();
            this.drawX = 220;
            this.drawY = 200;
            for (i = 0; i < spawnAmount; ++i) {
                enemies[i].recycleEnemy();
            }
            for (var i = 0; i < 25; i++) {
                this.bullets[i].recycle();
            }
            this.line.recycle();
            for (var i = 0; i < 25; i++) {
                this.bullets[i].explosion.drawX = -100;
            }
            drawEnd();
        }
    }
};
//end of jet functions	
//bullet functions
function Bullet(j) {
    this.jet = j;
    this.srcX = 230;
    this.srcY = 500;
    this.width = 30;
    this.height = 22;
    this.drawX = -20;
    this.drawY = 0;
    this.explosion = new Explosion();
    this.sound = fireSound;
}
Bullet.prototype.draw = function () {
    this.drawX += 3;
    ctxJet.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
    this.checkHitEnemy();
    if (this.drawX > gameWidth) this.recycle();
};
Bullet.prototype.checkHitEnemy = function () {
    for (var i = 0; i < enemies.length; i++) {
        if (this.drawX >= enemies[i].drawX && 
        	this.drawX <= (enemies[i].drawX + enemies[i].width) && 
        	this.drawY >= enemies[i].drawY && 
        	this.drawY <= (enemies[i].drawY + enemies[i].height)) 
        {
            enemyKillSound.pause();
            enemyKillSound = 0;
            enemyKillSound = new Audio("bullet.wav");
            enemyKillSound.play();
            this.explosion.drawX = enemies[i].drawX - (this.explosion.width / 2);
            this.explosion.drawY = enemies[i].drawY;
            this.explosion.hasHit = true;
            enemies[i].sound.play();
            this.recycle();
            enemies[i].recycleEnemy();
            this.jet.updateScore(enemies[i].rewardPoints);
            ++speedInc;
        }
    }
};
Bullet.prototype.fire = function (startX, startY) {
    this.drawX = startX;
    this.drawY = startY;
};
Bullet.prototype.recycle = function () {
    this.drawX = -20;
};
//end of bullet functions
//Line attack start
function Line(j) {
    this.jet = j;
    this.srcX = 798;
    this.srcY = 1080;
    this.width = 2;
    this.height = 500;
    this.drawX = -20;
    this.drawY = 0;
    this.explosion = new Explosion();
    this.sound = fireSound;
}
Line.prototype.draw = function () {
    this.drawX += 2 + speedInc / 3;
    ctxJet.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
    this.checkHitEnemy();
    if (this.drawX > gameWidth) this.recycle();
};
Line.prototype.checkHitEnemy = function () {
    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].drawX >= noseOfJet && this.drawX >= enemies[i].drawX) { //enemyKillSound.pause();
            //enemyKillSound=0;
            //enemyKillSound=new Audio("bullet.wav");
            //	enemyKillSound.play();
            this.explosion.drawX = enemies[i].drawX - (this.explosion.width / 2);
            this.explosion.drawY = enemies[i].drawY;
            this.explosion.hasHit = true;
            enemies[i].sound.play();
            // this.recycle();
            enemies[i].recycleEnemy();
            this.jet.updateScore(enemies[i].rewardPoints);
            // ++speedInc;
        }
    }
};
Line.prototype.fire = function (startX, startY) {
    this.drawX = startX;
    this.drawY = startY;
};
Line.prototype.recycle = function () {
    this.drawX = -20;
};
//end of line attack
//explosion functions
function Explosion() {
    this.srcX = 718;
    this.srcY = 500;
    this.width = 82;
    this.height = 73;
    this.drawX = 0;
    this.drawY = 0;
    this.hasHit = false;
    this.currentFrame = 0;
    this.totalFrames = 10;
}
Explosion.prototype.draw = function () {
    if (this.currentFrame <= this.totalFrames) {
        ctxJet.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
        this.currentFrame++;
    } else {
        this.hasHit = false;
        this.currentFrame = 0;
    }
};
//end of explosion functions
//enemy functions
function Enemy() {
    this.srcX = 125;
    this.srcY = 500;
    this.drawX = Math.floor(Math.random() * 1000) + gameWidth;
    this.drawY = Math.floor(Math.random() * 480);
    this.width = 105;
    this.height = 45;
    this.speed = 2;
    this.rewardPoints = 1;
    this.sound = enemyKillSound;
}
Enemy.prototype.draw = function () {
    this.drawX -= 2 + speedInc / 5;
    ctxEnemy.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
    this.checkEscaped();
};
Enemy.prototype.checkEscaped = function () {
    if ((this.drawX + this.width) <= 0) {
        this.recycleEnemy();
    }
};
Enemy.prototype.recycleEnemy = function () {
    this.drawX = Math.floor(Math.random() * 1000) + gameWidth;
    this.drawY = Math.floor(Math.random() * 360);
};

function clearCtxEnemy() {
    ctxEnemy.clearRect(0, 0, gameWidth, gameHeight)
}
//end of enemy functions
//button object
function Button(xL, xR, yT, yB) {
    this.xLeft = xL;
    this.xRight = xR;
    this.yTop = yT;
    this.yBottom = yB;
}
Button.prototype.checkClicked = function () {
    if (this.xLeft <= mouseX && this.xRight >= mouseX && this.yTop <= mouseY && this.yBottom >= mouseY) return true;
};
//end of button object
//event functions	
function mouseClicked(e) {
    mouseX = e.pageX - canvasBg.offsetLeft;
    mouseY = e.pageY - canvasBg.offsetTop;
    if (!isPlaying) {
        if (menuDrawn) {
            if (btnStart.checkClicked()) {
                menuDrawn = false;
                startSound.pause();
                startSound = 0;
                startSound.loop = true;
                startSound = new Audio("start.wav");
                playGame();
            }
            if (btnAbout.checkClicked()) {
                menuDrawn = false;
                drawAbout();
            }
        }
        if (endDrawn) {
            if (btnTry.checkClicked()) {
                endDrawn = false;
                playGame();
            }
            if (btnMenu.checkClicked()) {
                endDrawn = false;
                drawMenu();
            }
        }
        if (winDrawn) {
            if (btnPlay.checkClicked()) {
                winDrawn = false;
                winSound.pause();
                winSound = 0;
                winSound = new Audio("win.wav");
                drawMenu();
            }
        }
        if (aboutDrawn) {
            if (btnBack.checkClicked()) {
                aboutDrawn = false;
                drawMenu();
            }
        }
    }
}

function checkKeyDown(e) {
    var keyID = e.keyCode || e.which;
    if (keyID === 38 || keyID === 87) { //up or w
        jet1.isUpKey = true;
        e.preventDefault();
    }
    if (keyID === 39 || keyID === 68) { //right or d
        jet1.isRightKey = true;
        e.preventDefault();
    }
    if (keyID === 40 || keyID === 83) { //down or s
        jet1.isDownKey = true;
        e.preventDefault();
    }
    if (keyID === 37 || keyID === 65) { //left or a
        jet1.isLeftKey = true;
        e.preventDefault();
    }
    if (keyID === 32 || keyID === 90) { //spacebar and z
        jet1.isSpacebar = true;
        e.preventDefault();
    }
    if (keyID === 88 && jet1.lineCount > 0 && jet1.line.drawX == -20) { //x
        jet1.isXKey = true;
        jet1.lineCount = jet1.lineCount - 1;
        noseOfJet = jet1.noseX;
        e.preventDefault();
    }
    if (keyID === 80 && !menuDrawn && !aboutDrawn && !endDrawn) { //p
        isPlaying = false;
        bgSound.pause();
        e.preventDefault();
    }
    if (keyID === 79) { //o
        if (!isPlaying && !menuDrawn && !aboutDrawn && !endDrawn) {
            playGame();
        }
        e.preventDefault();
    }
}

function checkKeyUp(e) {
    var keyID = e.keyCode || e.which;
    if (keyID === 38 || keyID === 87) { //up or w
        jet1.isUpKey = false;
        e.preventDefault();
    }
    if (keyID === 39 || keyID === 68) { //right or d
        jet1.isRightKey = false;
        e.preventDefault();
    }
    if (keyID === 40 || keyID === 83) { //down or s
        jet1.isDownKey = false;
        e.preventDefault();
    }
    if (keyID === 37 || keyID === 65) { //left or a
        jet1.isLeftKey = false;
        e.preventDefault();
    }
    if (keyID === 32 || keyID === 90) { //spacebar and z
        jet1.isSpacebar = false;
        e.preventDefault();
    }
    if (keyID === 88 && jet1.score >= 10) { //x
        jet1.isXKey = false;
        e.preventDefault();
    }
}
//end of event functions