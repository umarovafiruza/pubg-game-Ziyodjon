/* ==========================================================
   3D XAZINA TOPISH O'YINI - JAVASCRIPT (SHIT, QILICH VA CHO'PAKLAR)
   Mavzu: Qalqon (Shit) va Qilich bilan dushmanlarni urish (3 marta = o'lim),
          Daraxtga chiqqanda inventarga cho'pak qo'shilishi,
          E tugmasi bosilganda qayerga qarasa o'sha tomonga cho'pak otish.
   Dvigatel: Three.js 3D WebGL Engine
   ========================================================== */

// ----------------------------------------------------------
// 1. DOM ELEMENTLARI VA ASOSIY HOLAT (STATE)
// ----------------------------------------------------------
const canvas = document.getElementById('gameCanvas');
const canvasContainer = document.getElementById('canvasContainer');
const radarCanvas = document.getElementById('radarCanvas');
const radarCtx = radarCanvas ? radarCanvas.getContext('2d') : null;

// HUD
const heartsContainer = document.getElementById('heartsContainer');
const coinCountElem = document.getElementById('coinCount');
const keyCountElem = document.getElementById('keyCount');
const stickCountElem = document.getElementById('stickCount');
const fuelBarElem = document.getElementById('fuelBar');
const fuelTextElem = document.getElementById('fuelText');
const fuelBoxElem = document.getElementById('fuelBox');
const vehicleLabelElem = document.getElementById('vehicleLabel');
const levelBadge = document.getElementById('levelBadge');
const levelTitle = document.getElementById('levelTitle');
const soundToggleBtn = document.getElementById('soundToggleBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');

// PUBG Qurollar va Airdrop HUD
const weaponHudBox = document.getElementById('weaponHudBox');
const weaponIconElem = document.getElementById('weaponIcon');
const weaponNameElem = document.getElementById('weaponName');
const ammoDisplayElem = document.getElementById('ammoDisplay');
const airdropAlertElem = document.getElementById('airdropAlert');
const slotSwordElem = document.getElementById('slotSword');
const slotRifleElem = document.getElementById('slotRifle');
const slotAK47Elem = document.getElementById('slotAK47');
const slotSniperElem = document.getElementById('slotSniper');
const slotShotgunElem = document.getElementById('slotShotgun');
const slotStickElem = document.getElementById('slotStick');
const nameSlotAK47 = document.getElementById('nameSlotAK47');
const nameSlotSniper = document.getElementById('nameSlotSniper');
const nameSlotShotgun = document.getElementById('nameSlotShotgun');

// Flight HUD
const flightHudBox = document.getElementById('flightHudBox');
const flightAltElem = document.getElementById('flightAlt');
const flightSpeedElem = document.getElementById('flightSpeed');

// Crosshair va maslahatlar
const crosshair = document.getElementById('crosshair');
const hitMarker = document.getElementById('hitMarker');
const actionPrompt = document.getElementById('actionPrompt');
const actionText = document.getElementById('actionText');
const actionKeyBadge = document.getElementById('actionKeyBadge');
const gameNotification = document.getElementById('gameNotification');
const lockPrompt = document.getElementById('lockPrompt');
const damageOverlay = document.getElementById('damageOverlay');
const lavaOverlay = document.getElementById('lavaOverlay');
const treeStatus = document.getElementById('treeStatus');

// Modallar
const startScreen = document.getElementById('startScreen');
const levelCompleteScreen = document.getElementById('levelCompleteScreen');
const winScreen = document.getElementById('winScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const quizRevivalScreen = document.getElementById('quizRevivalScreen');
const quizSubjectBadge = document.getElementById('quizSubjectBadge');
const quizTimerText = document.getElementById('quizTimerText');
const quizTimerBar = document.getElementById('quizTimerBar');
const quizFlagVisual = document.getElementById('quizFlagVisual');
const quizQuestionText = document.getElementById('quizQuestionText');
const quizOptionsGrid = document.getElementById('quizOptionsGrid');
const quizFeedbackBox = document.getElementById('quizFeedbackBox');
const quizFeedbackIcon = document.getElementById('quizFeedbackIcon');
const quizFeedbackMsg = document.getElementById('quizFeedbackMsg');
const quizGiveUpBtn = document.getElementById('quizGiveUpBtn');

const startBtn = document.getElementById('startBtn');
const nextLevelBtn = document.getElementById('nextLevelBtn');
const winRestartBtn = document.getElementById('winRestartBtn');
const gameOverRestartBtn = document.getElementById('gameOverRestartBtn');

const levelCoinsElem = document.getElementById('levelCoins');
const levelCompleteTitle = document.getElementById('levelCompleteTitle');
const nextLevelDescription = document.getElementById('nextLevelDescription');
const winCoinsElem = document.getElementById('winCoins');
const winHeartsElem = document.getElementById('winHearts');
const gameOverMsg = document.getElementById('gameOverMsg');

// O'yin ma'lumotlari
let currentLevel = 1;
const maxLevels = 5;
let playerHealth = 3;
const maxHealth = 3;
let totalCoins = 0;
let collectedKeys = 0;
const totalKeysNeeded = 3;
let buggyFuel = 100;
let isDriving = false;
let drivingVehicleType = null; // 'tracker' | 'moto' | null
let gameRunning = false;
let isPointerLocked = false;
let soundEnabled = true;
let notificationTimeout = null;

// PUBG Qurollar tizimi (Kengaytirilgan Arsenal)
let activeWeapon = 'rifle'; // 'sword' | 'rifle' | 'ak47' | 'sniper' | 'shotgun' | 'stick'
const unlockedWeapons = {
    sword: true,
    rifle: true,
    ak47: false,
    sniper: false,
    shotgun: false,
    stick: true
};

const weaponStats = {
    sword: { name: 'Qilich', icon: '🗡️', damage: 1, auto: false },
    rifle: { name: 'M416 Avtomat', icon: '🔫', damage: 1, auto: true },
    ak47: { name: 'AK-47 Kalashnikov', icon: '💥', damage: 2, auto: true },
    sniper: { name: 'AWM Snayper', icon: '🔭', damage: 5, auto: false },
    shotgun: { name: 'Shotgun Drobovik', icon: '⚡', damage: 1.5, auto: false },
    stick: { name: "Cho'pak", icon: '🎯', damage: 3, auto: false }
};

let rifleAmmo = 30;
const rifleMaxAmmo = 30;
let rifleReserve = 90;

let ak47Ammo = 30;
const ak47MaxAmmo = 30;
let ak47Reserve = 90;

let sniperAmmo = 5;
const sniperMaxAmmo = 5;
let sniperReserve = 25;

let shotgunAmmo = 8;
const shotgunMaxAmmo = 8;
let shotgunReserve = 32;

let isReloading = false;
let isFiringRifle = false;
let lastRifleFireTime = 0;
let bulletTracers = [];
let swordMesh = null;
let rifleGroup = null;
let ak47Group = null;
let sniperGroup = null;
let shotgunGroup = null;
let playerParachute = null;
let isGliding = false;
let muzzleFlashMesh = null;

// Cho'paklar va Daraxt holati
let stickCount = 3;
let treeGatherTimer = 0;
let inTree = false;
let currentClimbingTree = null;
let thrownSticks = [];

// PUBG Transportlar (Tracker SUV, Mototsikl va Uchuvchi Samalyot)
let trackerVehicle = null;
let motoVehicle = null;
let pilotPlaneVehicle = null;

// Uylar va ichidagi Qurollar (Loot)
let militaryHouses = [];
let houseLootPickups = [];

// PUBG Harbiy Samalyot va Airdrop
let cargoAirplane = null;
let airplaneTimer = 18.0;
let airdropCrates = [];
let explosiveBarrels = [];
let watchtowers = [];
let militaryBunkers = [];
let terrainMesh = null;

// ----------------------------------------------------------
// 2. PROCEDURAL WEB AUDIO API (TOVUSHLAR)
// ----------------------------------------------------------
let audioCtx = null;
function getAudioContext() {
    if (!audioCtx) {
        const AudioClass = window.AudioContext || window.webkitAudioContext;
        if (AudioClass) audioCtx = new AudioClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
    }
    return audioCtx;
}

function playToneSound(freq, type, duration, startVol = 0.15, endVol = 0.001) {
    if (!soundEnabled) return;
    try {
        const actx = getAudioContext();
        if (!actx) return;
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, actx.currentTime);
        gain.gain.setValueAtTime(startVol, actx.currentTime);
        gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, endVol), actx.currentTime + duration);
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.start();
        osc.stop(actx.currentTime + duration);
    } catch (e) {}
}

function playSwordSwingSound() {
    if (!soundEnabled) return;
    try {
        const actx = getAudioContext();
        if (!actx) return;
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, actx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(160, actx.currentTime + 0.16);
        gain.gain.setValueAtTime(0.24, actx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.16);
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.start();
        osc.stop(actx.currentTime + 0.16);
    } catch (e) {}
}

function playSwordHitSound() {
    playToneSound(360, 'sawtooth', 0.15, 0.35, 0.001);
}

function playStickThrowSound() {
    if (!soundEnabled) return;
    try {
        const actx = getAudioContext();
        if (!actx) return;
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(620, actx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, actx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.28, actx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.start();
        osc.stop(actx.currentTime + 0.12);
    } catch (e) {}
}

function playStickImpaleSound() {
    playToneSound(240, 'square', 0.12, 0.3, 0.01);
    setTimeout(() => playToneSound(120, 'sawtooth', 0.16, 0.25, 0.01), 40);
}

function playEnemyFallSound() {
    playToneSound(160, 'sawtooth', 0.22, 0.3, 0.01);
}

let lastStepTime = 0;
function playFootstepSound(surface = 'sand') {
    if (!soundEnabled) return;
    const now = performance.now();
    if (now - lastStepTime < 320) return;
    lastStepTime = now;
    const baseFreq = surface === 'stone' ? 220 : surface === 'wood' ? 150 : 90;
    playToneSound(baseFreq, 'triangle', 0.08, 0.06, 0.001);
}

function playJumpSound() {
    playToneSound(160, 'sine', 0.14, 0.16, 0.01);
}

function playCoinSound() {
    playToneSound(987.77, 'sine', 0.09, 0.18);
    setTimeout(() => playToneSound(1318.51, 'sine', 0.16, 0.18), 65);
}

function playKeySound() {
    playToneSound(523.25, 'triangle', 0.12, 0.2);
    setTimeout(() => playToneSound(659.25, 'triangle', 0.14, 0.2), 75);
    setTimeout(() => playToneSound(1046.50, 'triangle', 0.28, 0.2), 150);
}

function playHurtSound() {
    playToneSound(140, 'sawtooth', 0.25, 0.35, 0.01);
}

function playChestOpenSound() {
    [440, 554.37, 659.25, 880, 1108.73].forEach((f, i) => {
        setTimeout(() => playToneSound(f, 'triangle', 0.32, 0.22), i * 90);
    });
}

function playCarHornSound() {
    if (!soundEnabled) return;
    [392, 493.88].forEach(f => playToneSound(f, 'sawtooth', 0.28, 0.16));
}

function playCarRamSound() {
    playToneSound(110, 'square', 0.25, 0.35, 0.01);
}

function playGunshotSound() {
    if (!soundEnabled) return;
    try {
        const actx = getAudioContext();
        if (!actx) return;
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(420, actx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(45, actx.currentTime + 0.11);
        gain.gain.setValueAtTime(0.36, actx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.11);
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.start();
        osc.stop(actx.currentTime + 0.11);

        const bufferSize = Math.floor(actx.sampleRate * 0.07);
        const buffer = actx.createBuffer(1, bufferSize, actx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
        }
        const noise = actx.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = actx.createGain();
        noiseGain.gain.setValueAtTime(0.35, actx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.07);
        noise.connect(noiseGain);
        noiseGain.connect(actx.destination);
        noise.start();
    } catch (e) {}
}

function playReloadSound() {
    if (!soundEnabled) return;
    try {
        const actx = getAudioContext();
        if (!actx) return;
        playToneSound(680, 'square', 0.06, 0.2, 0.01);
        setTimeout(() => playToneSound(520, 'square', 0.08, 0.2, 0.01), 220);
        setTimeout(() => playToneSound(880, 'triangle', 0.09, 0.25, 0.01), 600);
    } catch (e) {}
}

function playAirplaneDroneSound() {
    if (!soundEnabled) return;
    try {
        const actx = getAudioContext();
        if (!actx) return;
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(75, actx.currentTime);
        gain.gain.setValueAtTime(0.12, actx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 3.5);
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.start();
        osc.stop(actx.currentTime + 3.5);
    } catch (e) {}
}

function playExplosionSound() {
    if (!soundEnabled) return;
    try {
        const actx = getAudioContext();
        if (!actx) return;
        playToneSound(60, 'sawtooth', 0.45, 0.45, 0.001);
        const bufferSize = Math.floor(actx.sampleRate * 0.35);
        const buffer = actx.createBuffer(1, bufferSize, actx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
        }
        const noise = actx.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = actx.createGain();
        noiseGain.gain.setValueAtTime(0.4, actx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.35);
        noise.connect(noiseGain);
        noiseGain.connect(actx.destination);
        noise.start();
    } catch (e) {}
}

function playMotorcycleSound() {
    if (!soundEnabled) return;
    playToneSound(160 + Math.random() * 40, 'sawtooth', 0.12, 0.18, 0.01);
}

function playAK47Sound() {
    if (!soundEnabled) return;
    try {
        const actx = getAudioContext();
        if (!actx) return;
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, actx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, actx.currentTime + 0.14);
        gain.gain.setValueAtTime(0.42, actx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.14);
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.start();
        osc.stop(actx.currentTime + 0.14);

        const bufferSize = Math.floor(actx.sampleRate * 0.09);
        const buffer = actx.createBuffer(1, bufferSize, actx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
        }
        const noise = actx.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = actx.createGain();
        noiseGain.gain.setValueAtTime(0.45, actx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.09);
        noise.connect(noiseGain);
        noiseGain.connect(actx.destination);
        noise.start();
    } catch (e) {}
}

function playSniperSound() {
    if (!soundEnabled) return;
    try {
        const actx = getAudioContext();
        if (!actx) return;
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(540, actx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(25, actx.currentTime + 0.28);
        gain.gain.setValueAtTime(0.55, actx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.28);
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.start();
        osc.stop(actx.currentTime + 0.28);

        const bufferSize = Math.floor(actx.sampleRate * 0.22);
        const buffer = actx.createBuffer(1, bufferSize, actx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
        }
        const noise = actx.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = actx.createGain();
        noiseGain.gain.setValueAtTime(0.5, actx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.22);
        noise.connect(noiseGain);
        noiseGain.connect(actx.destination);
        noise.start();
    } catch (e) {}
}

function playShotgunSound() {
    if (!soundEnabled) return;
    try {
        const actx = getAudioContext();
        if (!actx) return;
        playToneSound(95, 'sawtooth', 0.22, 0.45, 0.005);
        const bufferSize = Math.floor(actx.sampleRate * 0.16);
        const buffer = actx.createBuffer(1, bufferSize, actx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.18));
        }
        const noise = actx.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = actx.createGain();
        noiseGain.gain.setValueAtTime(0.5, actx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.16);
        noise.connect(noiseGain);
        noiseGain.connect(actx.destination);
        noise.start();
    } catch (e) {}
}

function playAirplaneFlySound() {
    if (!soundEnabled) return;
    playToneSound(88 + Math.random() * 25, 'sawtooth', 0.16, 0.12, 0.01);
}

function playRevivalSuccessSound() {
    if (!soundEnabled) return;
    try {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
            setTimeout(() => playToneSound(freq, 'triangle', 0.22, 0.25, 0.005), idx * 80);
        });
    } catch (e) {}
}

function playRevivalFailSound() {
    if (!soundEnabled) return;
    try {
        [220, 180, 140, 95].forEach((freq, idx) => {
            setTimeout(() => playToneSound(freq, 'sawtooth', 0.28, 0.35, 0.01), idx * 110);
        });
    } catch (e) {}
}

// ----------------------------------------------------------
// 3. TEKSTURALAR KESHI
// ----------------------------------------------------------
const TextureCache = {};
function getTexture(type) {
    if (TextureCache[type]) return TextureCache[type];

    const c = document.createElement('canvas');
    c.width = 128; c.height = 128;
    const ctx = c.getContext('2d');

    if (type === 'sand') {
        ctx.fillStyle = '#dfb15b';
        ctx.fillRect(0, 0, 128, 128);
        for (let i = 0; i < 1500; i++) {
            ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.15)' : 'rgba(140,90,30,0.15)';
            ctx.fillRect(Math.random() * 128, Math.random() * 128, 2, 2);
        }
    } else if (type === 'grass') {
        ctx.fillStyle = '#2e7d32';
        ctx.fillRect(0, 0, 128, 128);
        for (let i = 0; i < 2000; i++) {
            ctx.fillStyle = Math.random() > 0.5 ? '#388e3c' : '#1b5e20';
            ctx.fillRect(Math.random() * 128, Math.random() * 128, 2, 3);
        }
    } else if (type === 'rock') {
        ctx.fillStyle = '#546e7a';
        ctx.fillRect(0, 0, 128, 128);
        for (let i = 0; i < 1200; i++) {
            ctx.fillStyle = Math.random() > 0.4 ? 'rgba(20,25,30,0.18)' : 'rgba(220,230,240,0.18)';
            ctx.fillRect(Math.random() * 128, Math.random() * 128, 3, 3);
        }
    } else if (type === 'lava') {
        const grad = ctx.createLinearGradient(0, 0, 128, 128);
        grad.addColorStop(0, '#b71c1c'); grad.addColorStop(0.5, '#e65100'); grad.addColorStop(1, '#ff8f00');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 128, 128);
    } else if (type === 'cobblestone') {
        ctx.fillStyle = '#37474f';
        ctx.fillRect(0, 0, 128, 128);
        for (let y = 0; y < 128; y += 16) {
            for (let x = 0; x < 128; x += 32) {
                ctx.fillStyle = Math.random() > 0.5 ? '#455a64' : '#263238';
                ctx.fillRect(x + 1, y + 1, 30, 14);
            }
        }
    } else if (type === 'wood_planks') {
        ctx.fillStyle = '#6d4c41';
        ctx.fillRect(0, 0, 128, 128);
        for (let y = 0; y < 128; y += 16) {
            ctx.fillStyle = (Math.floor(y / 16) % 2 === 0) ? '#5d4037' : '#4e342e';
            ctx.fillRect(0, y + 1, 128, 14);
            for (let g = 0; g < 4; g++) {
                ctx.fillStyle = 'rgba(0,0,0,0.12)';
                ctx.fillRect(Math.random() * 128, y + 2 + Math.random() * 10, 25 + Math.random() * 30, 1);
            }
            ctx.fillStyle = '#1b1b1b';
            ctx.fillRect(6, y + 7, 2, 2);
            ctx.fillRect(120, y + 7, 2, 2);
            ctx.fillStyle = '#271810';
            ctx.fillRect(0, y, 128, 2);
        }
    } else {
        ctx.fillStyle = '#5d4037';
        ctx.fillRect(0, 0, 128, 128);
        for (let y = 0; y < 128; y += 32) {
            ctx.fillStyle = '#3e2723';
            ctx.fillRect(0, y, 128, 2);
        }
    }

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    TextureCache[type] = tex;
    return tex;
}

// ----------------------------------------------------------
// 4. THREE.JS SAHNA, KAMERA VA YORUG'LIK
// ----------------------------------------------------------
let scene, camera, renderer;
let dirLight, hemiLight;
let clock = new THREE.Clock();

function initThree() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);

    camera = new THREE.PerspectiveCamera(70, 1, 0.1, 1000);

    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    dirLight = new THREE.DirectionalLight(0xfff5e6, 1.4);
    dirLight.position.set(100, 150, 80);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 400;
    const sDist = 180;
    dirLight.shadow.camera.left = -sDist;
    dirLight.shadow.camera.right = sDist;
    dirLight.shadow.camera.top = sDist;
    dirLight.shadow.camera.bottom = -sDist;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    hemiLight = new THREE.HemisphereLight(0xb1e1ff, 0x3b2d18, 0.65);
    scene.add(hemiLight);

    resizeRenderer();
    window.addEventListener('resize', resizeRenderer);
}

function resizeRenderer() {
    if (!renderer || !camera || !canvasContainer) return;
    const w = canvasContainer.clientWidth;
    const h = canvasContainer.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
}

// ----------------------------------------------------------
// 5. QAHRAMON: QALQON (SHIT) VA QILICH BILAN JIHODLANGAN
// ----------------------------------------------------------
let playerGroup = null;
let playerBody = null;
let playerHead = null;
let playerArmR = null;
let playerArmL = null;
let playerLegR = null;
let playerLegL = null;
let slashTrail = null;
let isAttacking = false;
let attackProgress = 0;

function createPlayerCharacter() {
    playerGroup = new THREE.Group();
    scene.add(playerGroup);

    const coatMat = new THREE.MeshStandardMaterial({ color: 0xb71c1c, roughness: 0.7 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffcc80, roughness: 0.6 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x263238, roughness: 0.8 });
    const bootMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.9 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.2 });

    // 1. ETIKLAR (y = 0.0 tekislik ustida)
    const bootGeo = new THREE.BoxGeometry(0.18, 0.22, 0.28);
    const bootL = new THREE.Mesh(bootGeo, bootMat);
    bootL.position.set(-0.16, 0.11, 0.04);
    bootL.castShadow = true;
    playerGroup.add(bootL);

    const bootR = new THREE.Mesh(bootGeo, bootMat);
    bootR.position.set(0.16, 0.11, 0.04);
    bootR.castShadow = true;
    playerGroup.add(bootR);

    // 2. OYOQLAR
    const legGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.55, 8);
    playerLegL = new THREE.Mesh(legGeo, pantsMat);
    playerLegL.position.set(-0.16, 0.48, 0);
    playerLegL.castShadow = true;
    playerGroup.add(playerLegL);

    playerLegR = new THREE.Mesh(legGeo, pantsMat);
    playerLegR.position.set(0.16, 0.48, 0);
    playerLegR.castShadow = true;
    playerGroup.add(playerLegR);

    // 3. KAMAR
    const belt = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.12, 0.36), new THREE.MeshStandardMaterial({ color: 0x212121 }));
    belt.position.y = 0.82;
    playerGroup.add(belt);

    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.38), goldMat);
    buckle.position.y = 0.82;
    playerGroup.add(buckle);

    // 4. GAVDA
    playerBody = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.65, 0.34), coatMat);
    playerBody.position.y = 1.15;
    playerBody.castShadow = true;
    playerGroup.add(playerBody);

    // 5. BOSH VA SHLYAPA
    playerHead = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), skinMat);
    playerHead.position.y = 1.62;
    playerHead.castShadow = true;
    playerGroup.add(playerHead);

    const hatGroup = new THREE.Group();
    hatGroup.position.set(0, 1.76, 0);
    const hatMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.85 });
    hatGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.2, 12), hatMat));
    const hatBrim = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.05, 3), hatMat);
    hatBrim.position.y = -0.05;
    hatGroup.add(hatBrim);
    playerGroup.add(hatGroup);

    const armGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.55, 8);

    // 6. CHAP QO'L: 3D QALQON (SHIT / SHIELD)
    playerArmL = new THREE.Group();
    playerArmL.position.set(-0.36, 1.25, 0);

    const armMeshL = new THREE.Mesh(armGeo, coatMat);
    armMeshL.position.y = -0.22;
    armMeshL.castShadow = true;
    playerArmL.add(armMeshL);

    // QALQON (SHIT) MODELI
    const shieldGroup = new THREE.Group();
    shieldGroup.position.set(-0.12, -0.2, 0.12);

    const shieldBase = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.04, 16), new THREE.MeshStandardMaterial({ color: 0x4e342e, roughness: 0.8 }));
    shieldBase.rotation.x = Math.PI / 2;
    shieldGroup.add(shieldBase);

    const shieldRim = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.025, 8, 20), new THREE.MeshStandardMaterial({ color: 0x90a4ae, metalness: 0.9, roughness: 0.2 }));
    shieldGroup.add(shieldRim);

    const shieldBoss = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), goldMat);
    shieldBoss.position.z = 0.04;
    shieldGroup.add(shieldBoss);

    playerArmL.add(shieldGroup);
    playerGroup.add(playerArmL);

    // 7. O'NG QO'L: 3D QILICH (SWORD)
    playerArmR = new THREE.Group();
    playerArmR.position.set(0.36, 1.35, 0);

    const armMeshR = new THREE.Mesh(armGeo, coatMat);
    armMeshR.position.y = -0.22;
    armMeshR.castShadow = true;
    playerArmR.add(armMeshR);

    swordMesh = new THREE.Group();
    swordMesh.position.set(0, -0.45, 0.15);
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.022, 0.18, 6), bootMat);
    handle.rotation.x = Math.PI / 2;
    swordMesh.add(handle);
    const guard = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, 0.02), goldMat);
    guard.position.z = 0.08;
    swordMesh.add(guard);
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.065, 0.75), new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.95 }));
    blade.position.z = 0.44;
    swordMesh.add(blade);
    playerArmR.add(swordMesh);
    playerGroup.add(playerArmR);

    // Qilich nuri
    slashTrail = new THREE.Mesh(
        new THREE.RingGeometry(0.4, 0.75, 12, 1, 0, Math.PI * 0.75),
        new THREE.MeshBasicMaterial({ color: 0x80d8ff, transparent: true, opacity: 0, side: THREE.DoubleSide })
    );
    slashTrail.position.set(0.2, 1.15, 0.6);
    slashTrail.rotation.set(0.2, 0.4, -0.8);
    playerGroup.add(slashTrail);

    // 8. 3D AVTOMAT (PUBG M416 / AK-47 ASSAULT RIFLE)
    rifleGroup = new THREE.Group();
    rifleGroup.position.set(0.18, 1.18, 0.35);

    const gunMetalMat = new THREE.MeshStandardMaterial({ color: 0x1f2428, metalness: 0.9, roughness: 0.25 });
    const gunDarkMat = new THREE.MeshStandardMaterial({ color: 0x121417, roughness: 0.8 });

    // Qabul qilgich (Receiver)
    const receiver = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.38), gunMetalMat);
    rifleGroup.add(receiver);

    // Stvol (Barrel & Muzzle Brake)
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.022, 0.45, 8), gunMetalMat);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.02, 0.38);
    rifleGroup.add(barrel);

    const muzzleBrake = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.038, 0.08), gunDarkMat);
    muzzleBrake.position.set(0, 0.02, 0.62);
    rifleGroup.add(muzzleBrake);

    // Dasta (Buttstock)
    const stock = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.14, 0.28), gunDarkMat);
    stock.position.set(0, -0.04, -0.3);
    rifleGroup.add(stock);

    // Egri magazin (Curved Magazine)
    const mag = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.22, 0.1), gunDarkMat);
    mag.position.set(0, -0.15, 0.1);
    mag.rotation.x = -0.15;
    rifleGroup.add(mag);

    // Tutqich (Pistol Grip)
    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.14, 0.06), gunDarkMat);
    grip.position.set(0, -0.12, -0.08);
    grip.rotation.x = 0.25;
    rifleGroup.add(grip);

    // Optik / Holo nishonga olgich
    const sight = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 0.14), new THREE.MeshStandardMaterial({ color: 0x333333 }));
    sight.position.set(0, 0.09, 0.0);
    rifleGroup.add(sight);

    // Otish olovi (Muzzle Flash)
    muzzleFlashMesh = new THREE.Mesh(
        new THREE.ConeGeometry(0.09, 0.26, 6),
        new THREE.MeshBasicMaterial({ color: 0xffea00 })
    );
    muzzleFlashMesh.rotation.x = -Math.PI / 2;
    muzzleFlashMesh.position.set(0, 0.02, 0.76);
    muzzleFlashMesh.visible = false;
    rifleGroup.add(muzzleFlashMesh);

    playerGroup.add(rifleGroup);

    // 9. 3D AK-47 (KALASHNIKOV - YOG'OCH VA QORA PO'LAT)
    ak47Group = new THREE.Group();
    ak47Group.position.set(0.18, 1.18, 0.35);

    const akWoodMat = new THREE.MeshStandardMaterial({ color: 0x8d4925, roughness: 0.65 });
    const akSteelMat = new THREE.MeshStandardMaterial({ color: 0x212121, metalness: 0.85, roughness: 0.3 });

    // Qabul qilgich (Steel Receiver)
    const akRec = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.13, 0.42), akSteelMat);
    ak47Group.add(akRec);

    // Yog'och dasta (Wood Stock)
    const akStock = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.16, 0.32), akWoodMat);
    akStock.position.set(0, -0.05, -0.32);
    ak47Group.add(akStock);

    // Yog'och stvol qoplamasi (Fore-end)
    const akFore = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.1, 0.25), akWoodMat);
    akFore.position.set(0, 0.01, 0.26);
    ak47Group.add(akFore);

    // Po'lat stvol (Long Barrel)
    const akBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.022, 0.52, 8), akSteelMat);
    akBarrel.rotation.x = Math.PI / 2;
    akBarrel.position.set(0, 0.02, 0.48);
    ak47Group.add(akBarrel);

    // O'roqsimon magazin (Banana Magazine)
    const akMag = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.28, 0.11), akSteelMat);
    akMag.position.set(0, -0.17, 0.12);
    akMag.rotation.x = -0.25;
    ak47Group.add(akMag);

    ak47Group.visible = false;
    playerGroup.add(ak47Group);

    // 10. 3D AWM SNAYPER VINTOVKASI (MILITARY SNIPER)
    sniperGroup = new THREE.Group();
    sniperGroup.position.set(0.18, 1.18, 0.35);

    const sniperMat = new THREE.MeshStandardMaterial({ color: 0x2e4a2e, roughness: 0.6 });
    const sniperMetal = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.9, roughness: 0.2 });

    const snBody = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.14, 0.72), sniperMat);
    sniperGroup.add(snBody);

    const snBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.026, 0.85, 8), sniperMetal);
    snBarrel.rotation.x = Math.PI / 2;
    snBarrel.position.set(0, 0.03, 0.62);
    sniperGroup.add(snBarrel);

    // Optik nishon (Optical Scope)
    const snScope = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.38, 10), sniperMetal);
    snScope.rotation.x = Math.PI / 2;
    snScope.position.set(0, 0.13, 0.05);
    sniperGroup.add(snScope);

    sniperGroup.visible = false;
    playerGroup.add(sniperGroup);

    // 11. 3D SHOTGUN (DROBOVIK / POMPALI)
    shotgunGroup = new THREE.Group();
    shotgunGroup.position.set(0.18, 1.18, 0.35);

    const sgMetal = new THREE.MeshStandardMaterial({ color: 0x263238, metalness: 0.85, roughness: 0.35 });
    const sgStock = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.15, 0.32), akWoodMat);
    sgStock.position.set(0, -0.06, -0.28);
    shotgunGroup.add(sgStock);

    const sgReceiver = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.32), sgMetal);
    shotgunGroup.add(sgReceiver);

    const sgBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.65, 8), sgMetal);
    sgBarrel.rotation.x = Math.PI / 2;
    sgBarrel.position.set(0, 0.02, 0.42);
    shotgunGroup.add(sgBarrel);

    shotgunGroup.visible = false;
    playerGroup.add(shotgunGroup);

    // 12. 3D O'YINCHI PARASHYUTI (PARACHUTE GLIDER)
    playerParachute = new THREE.Group();
    playerParachute.position.set(0, 3.4, 0);

    const chuteCanopy = new THREE.Mesh(
        new THREE.SphereGeometry(3.2, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6, side: THREE.DoubleSide })
    );
    chuteCanopy.rotation.x = Math.PI;
    playerParachute.add(chuteCanopy);

    const chuteStripe = new THREE.Mesh(
        new THREE.SphereGeometry(3.25, 12, 8, 0, Math.PI * 0.7, 0, Math.PI / 2),
        new THREE.MeshStandardMaterial({ color: 0xff5722, roughness: 0.6, side: THREE.DoubleSide })
    );
    chuteStripe.rotation.x = Math.PI;
    playerParachute.add(chuteStripe);

    playerParachute.visible = false;
    playerGroup.add(playerParachute);

    // Boshlang'ich qurolni o'rnatish
    selectWeapon('rifle');
}

function selectWeapon(type) {
    if (!unlockedWeapons[type]) {
        showNotification("Bu qurol hali topilmadi! Uylar ichidan qidiring! 🏠🔍");
        return;
    }
    activeWeapon = type;
    if (swordMesh) swordMesh.visible = (type === 'sword');
    if (playerArmL && playerArmL.children[1]) playerArmL.children[1].visible = (type === 'sword');
    if (rifleGroup) rifleGroup.visible = (type === 'rifle');
    if (ak47Group) ak47Group.visible = (type === 'ak47');
    if (sniperGroup) sniperGroup.visible = (type === 'sniper');
    if (shotgunGroup) shotgunGroup.visible = (type === 'shotgun');

    if (slotSwordElem) slotSwordElem.classList.toggle('active', type === 'sword');
    if (slotRifleElem) slotRifleElem.classList.toggle('active', type === 'rifle');
    if (slotAK47Elem) slotAK47Elem.classList.toggle('active', type === 'ak47');
    if (slotSniperElem) slotSniperElem.classList.toggle('active', type === 'sniper');
    if (slotShotgunElem) slotShotgunElem.classList.toggle('active', type === 'shotgun');
    if (slotStickElem) slotStickElem.classList.toggle('active', type === 'stick');

    const stat = weaponStats[type] || weaponStats['rifle'];
    if (weaponIconElem) weaponIconElem.innerText = stat.icon;
    if (weaponNameElem) weaponNameElem.innerText = stat.name;
    updateHUD();
    playToneSound(580, 'triangle', 0.06, 0.1);
}

// AVTOMATLAR VA QUROLLARDAN O'T OCHISH
function triggerRifleShot() {
    if (isDriving) {
        if (drivingVehicleType === 'plane') {
            triggerAirplaneCannons();
        }
        return;
    }
    if (isReloading || !gameRunning) return;

    if (activeWeapon === 'rifle') {
        if (rifleAmmo <= 0) { reloadRifle(); return; }
        const now = performance.now();
        if (now - lastRifleFireTime < 115) return;
        lastRifleFireTime = now;
        rifleAmmo--;
        updateHUD();
        playGunshotSound();
        fireGunBullet({ damage: 1, color: 0xffea00, speed: 135, recoilPitch: 0.012, count: 1 });
    } else if (activeWeapon === 'ak47') {
        if (ak47Ammo <= 0) { reloadRifle(); return; }
        const now = performance.now();
        if (now - lastRifleFireTime < 140) return;
        lastRifleFireTime = now;
        ak47Ammo--;
        updateHUD();
        playAK47Sound();
        fireGunBullet({ damage: 2, color: 0xff9100, speed: 140, recoilPitch: 0.018, count: 1 });
    } else if (activeWeapon === 'sniper') {
        if (sniperAmmo <= 0) { reloadRifle(); return; }
        const now = performance.now();
        if (now - lastRifleFireTime < 820) return;
        lastRifleFireTime = now;
        sniperAmmo--;
        updateHUD();
        playSniperSound();
        fireGunBullet({ damage: 5, color: 0x00e5ff, speed: 220, recoilPitch: 0.038, count: 1 });
    } else if (activeWeapon === 'shotgun') {
        if (shotgunAmmo <= 0) { reloadRifle(); return; }
        const now = performance.now();
        if (now - lastRifleFireTime < 460) return;
        lastRifleFireTime = now;
        shotgunAmmo--;
        updateHUD();
        playShotgunSound();
        fireGunBullet({ damage: 1.5, color: 0xff5722, speed: 110, recoilPitch: 0.026, count: 6, spread: 0.075 });
    }
}

function fireGunBullet(cfg) {
    if (muzzleFlashMesh) {
        muzzleFlashMesh.visible = true;
        setTimeout(() => { if (muzzleFlashMesh) muzzleFlashMesh.visible = false; }, 35);
    }

    cameraPitch += cfg.recoilPitch || 0.012;
    cameraYaw += (Math.random() - 0.5) * 0.006;

    const baseDir = new THREE.Vector3();
    camera.getWorldDirection(baseDir);
    const startPos = new THREE.Vector3().copy(playerPos).add(new THREE.Vector3(0, 1.45, 0)).addScaledVector(baseDir, 0.8);

    const count = cfg.count || 1;
    for (let c = 0; c < count; c++) {
        const dir = baseDir.clone();
        if (cfg.spread) {
            dir.x += (Math.random() - 0.5) * cfg.spread;
            dir.y += (Math.random() - 0.5) * cfg.spread;
            dir.z += (Math.random() - 0.5) * cfg.spread;
            dir.normalize();
        }

        const tracerGeo = new THREE.CylinderGeometry(0.018, 0.018, 1.6, 4);
        const tracerMat = new THREE.MeshBasicMaterial({ color: cfg.color || 0xffea00 });
        const tracer = new THREE.Mesh(tracerGeo, tracerMat);
        tracer.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        tracer.position.copy(startPos);
        scene.add(tracer);

        bulletTracers.push({
            mesh: tracer,
            dir: dir.clone(),
            dist: 0,
            maxDist: 180,
            speed: cfg.speed || 135
        });

        // Dushmanlarga tekkanini tekshirish
        let hit = false;
        enemies.forEach(enemy => {
            if (!enemy.alive || hit) return;
            const toEnemy = enemy.group.position.clone();
            toEnemy.y += enemy.isBoss ? 2.0 : 1.0;
            const v = toEnemy.sub(startPos);
            const proj = v.dot(dir);
            if (proj > 0 && proj < 180) {
                const perp = v.clone().subScaledVector(dir, proj).length();
                if (perp < (enemy.isBoss ? 2.4 : 1.35)) {
                    hit = true;
                    damageEnemy(enemy, cfg.damage || 1, dir);
                    showHitMarker();
                    playSwordHitSound();
                }
            }
        });

        // Portlovchi bochkalarni tekshirish
        explosiveBarrels.forEach(barrel => {
            if (barrel.exploded || hit) return;
            const toBarrel = barrel.mesh.position.clone().sub(startPos);
            const proj = toBarrel.dot(dir);
            if (proj > 0 && proj < 150) {
                const perp = toBarrel.clone().subScaledVector(dir, proj).length();
                if (perp < 1.4) {
                    hit = true;
                    explodeBarrel(barrel);
                }
            }
        });
    }
}

// SAMALYOTDAN HAVODAN O'T OCHISH (AIR-TO-GROUND DUAL CANNONS)
function triggerAirplaneCannons() {
    if (!pilotPlaneVehicle) return;
    const now = performance.now();
    if (now - lastRifleFireTime < 110) return;
    lastRifleFireTime = now;

    playGunshotSound();
    const p = pilotPlaneVehicle;
    const forward = new THREE.Vector3(
        Math.sin(p.angle) * Math.cos(p.pitch),
        Math.sin(p.pitch) - 0.08,
        Math.cos(p.angle) * Math.cos(p.pitch)
    ).normalize();

    [-4.5, 4.5].forEach(wingOffset => {
        const wingPos = p.position.clone().add(new THREE.Vector3(
            Math.cos(p.angle) * wingOffset,
            -0.2,
            -Math.sin(p.angle) * wingOffset
        ));

        const tracerGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.8, 4);
        const tracer = new THREE.Mesh(tracerGeo, new THREE.MeshBasicMaterial({ color: 0xff1744 }));
        tracer.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), forward);
        tracer.position.copy(wingPos);
        scene.add(tracer);

        bulletTracers.push({
            mesh: tracer,
            dir: forward.clone(),
            dist: 0,
            maxDist: 220,
            speed: 170
        });

        // Havodan dushmanlarni yo'q qilish
        enemies.forEach(enemy => {
            if (!enemy.alive) return;
            const dist = enemy.group.position.distanceTo(wingPos);
            if (dist < 180) {
                const toE = enemy.group.position.clone().sub(wingPos);
                const proj = toE.dot(forward);
                if (proj > 0 && proj < 180) {
                    const perp = toE.clone().subScaledVector(forward, proj).length();
                    if (perp < 2.8) {
                        damageEnemy(enemy, 3, forward);
                        showHitMarker();
                    }
                }
            }
        });

        explosiveBarrels.forEach(b => {
            if (b.exploded) return;
            const toB = b.mesh.position.clone().sub(wingPos);
            const proj = toB.dot(forward);
            if (proj > 0 && proj < 160) {
                const perp = toB.clone().subScaledVector(forward, proj).length();
                if (perp < 2.5) explodeBarrel(b);
            }
        });
    });
}

function reloadRifle() {
    if (isReloading) return;
    let curAmmo = 0, maxAmmo = 30, res = 0;
    if (activeWeapon === 'rifle') { curAmmo = rifleAmmo; maxAmmo = rifleMaxAmmo; res = rifleReserve; }
    else if (activeWeapon === 'ak47') { curAmmo = ak47Ammo; maxAmmo = ak47MaxAmmo; res = ak47Reserve; }
    else if (activeWeapon === 'sniper') { curAmmo = sniperAmmo; maxAmmo = sniperMaxAmmo; res = sniperReserve; }
    else if (activeWeapon === 'shotgun') { curAmmo = shotgunAmmo; maxAmmo = shotgunMaxAmmo; res = shotgunReserve; }
    else return;

    if (curAmmo >= maxAmmo || res <= 0) return;

    isReloading = true;
    playReloadSound();
    showNotification(`${weaponStats[activeWeapon]?.name || 'Qurol'} o'qlanmoqda... ⏳`);

    const reloadDelay = (activeWeapon === 'sniper') ? 1400 : (activeWeapon === 'ak47') ? 1200 : 1000;
    setTimeout(() => {
        const needed = maxAmmo - curAmmo;
        const take = Math.min(needed, res);
        if (activeWeapon === 'rifle') { rifleAmmo += take; rifleReserve -= take; }
        else if (activeWeapon === 'ak47') { ak47Ammo += take; ak47Reserve -= take; }
        else if (activeWeapon === 'sniper') { sniperAmmo += take; sniperReserve -= take; }
        else if (activeWeapon === 'shotgun') { shotgunAmmo += take; shotgunReserve -= take; }

        isReloading = false;
        updateHUD();
        showNotification("Qurol to'liq o'qlandi! 🔫✅");
    }, reloadDelay);
}

function explodeBarrel(barrel) {
    if (barrel.exploded) return;
    barrel.exploded = true;
    playExplosionSound();

    const fireMesh = new THREE.Mesh(
        new THREE.SphereGeometry(3.6, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xff3d00 })
    );
    fireMesh.position.copy(barrel.mesh.position);
    scene.add(fireMesh);
    setTimeout(() => scene.remove(fireMesh), 420);

    worldGroup.remove(barrel.mesh);
    showNotification("Portlovchi bochka portladi! 💥🔥");

    enemies.forEach(enemy => {
        if (!enemy.alive) return;
        const d = enemy.group.position.distanceTo(barrel.mesh.position);
        if (d < 12.0) {
            damageEnemy(enemy, 3, enemy.group.position.clone().sub(barrel.mesh.position).normalize());
        }
    });
}

// QILICH BILAN URISH (3 MARTA URGANDA DUSHMAN O'LADI)
function triggerSwordAttack() {
    if (isAttacking || isDriving) return;
    isAttacking = true;
    attackProgress = 0;
    playSwordSwingSound();

    const attackRange = 4.8; // Keng yetib borish
    const forward = new THREE.Vector3(-Math.sin(cameraYaw), 0, -Math.cos(cameraYaw));

    let hitAny = false;
    enemies.forEach(enemy => {
        if (!enemy.alive) return;
        const toEnemy = new THREE.Vector3().subVectors(enemy.group.position, playerPos);
        if (toEnemy.length() <= attackRange) {
            toEnemy.normalize();
            if (forward.dot(toEnemy) > 0.15) {
                // Aniq 1 ta zarba beriladi (Jami 3 ta zarbadan keyin dushman o'ladi!)
                damageEnemy(enemy, 1, forward);
                hitAny = true;
            }
        }
    });

    if (hitAny) {
        showHitMarker();
        playSwordHitSound();
    }
}

function showHitMarker() {
    if (!hitMarker) return;
    hitMarker.classList.add('active');
    setTimeout(() => hitMarker.classList.remove('active'), 120);
}

// ----------------------------------------------------------
// 6. CHO'PAKLAR OTISH FIZIKASI (QAYERGA QARASA O'SHA TOMONGA)
// ----------------------------------------------------------
function throwStick() {
    if (isDriving) return;

    if (stickCount <= 0) {
        showNotification("Cho'paklar tugadi! Daraxtga chiqib cho'pak oling 🌳");
        return;
    }

    stickCount--;
    updateHUD();
    playStickThrowSound();

    const stickGroup = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x6d4c41, roughness: 0.85 });

    const stickBody = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.045, 1.4, 6), woodMat);
    stickBody.rotation.x = Math.PI / 2;
    stickGroup.add(stickBody);

    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.25, 6), new THREE.MeshStandardMaterial({ color: 0x8d6e63 }));
    tip.position.z = 0.8;
    tip.rotation.x = Math.PI / 2;
    stickGroup.add(tip);

    // Qayerga qaragan bo'lsa to'g'ri o'sha yo'nalishga otadi
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);

    const spawnPos = new THREE.Vector3(
        playerPos.x + dir.x * 0.8,
        playerPos.y + 1.4,
        playerPos.z + dir.z * 0.8
    );
    stickGroup.position.copy(spawnPos);

    const speed = 44.0;
    const velocity = dir.clone().multiplyScalar(speed);
    velocity.y += 1.2;

    stickGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
    scene.add(stickGroup);

    thrownSticks.push({
        mesh: stickGroup,
        velocity: velocity,
        alive: true,
        lifeTime: 0
    });

    if (playerArmR) {
        playerArmR.rotation.x = -Math.PI / 2;
        setTimeout(() => { if (playerArmR) playerArmR.rotation.x = 0; }, 180);
    }
}

function updateThrownSticks(delta) {
    for (let i = thrownSticks.length - 1; i >= 0; i--) {
        const s = thrownSticks[i];
        if (!s.alive) continue;

        s.lifeTime += delta;
        s.velocity.y -= 14.0 * delta;
        s.mesh.position.addScaledVector(s.velocity, delta);

        const moveDir = s.velocity.clone().normalize();
        s.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), moveDir);

        let hitEnemy = false;
        enemies.forEach(enemy => {
            if (!enemy.alive || hitEnemy) return;

            const enemyCenter = enemy.group.position.clone();
            enemyCenter.y += enemy.isBoss ? 2.0 : 1.0;
            const dist = s.mesh.position.distanceTo(enemyCenter);

            if (dist < (enemy.isBoss ? 2.5 : 1.4)) {
                hitEnemy = true;
                s.alive = false;
                playStickImpaleSound();
                showHitMarker();

                if (enemy.isClimbing) {
                    enemy.isClimbing = false;
                    enemy.group.position.y = 0.0;
                    damageEnemy(enemy, 3, moveDir); // Daraxtdagi dushmanni to'liq halok qiladi
                    playEnemyFallSound();
                    showNotification("Dushman taxta maydonchadan pastga qulatildi! 🪵💥");
                } else {
                    damageEnemy(enemy, 3, moveDir); // Cho'pak tekkanda dushman darhol o'ladi
                }

                s.mesh.position.copy(enemyCenter);
                setTimeout(() => scene.remove(s.mesh), 2000);
            }
        });

        if (!hitEnemy && s.mesh.position.y <= 0.05) {
            s.alive = false;
            s.mesh.position.y = 0.05;
            setTimeout(() => scene.remove(s.mesh), 2500);
        }

        if (s.lifeTime > 4.5 && s.alive) {
            s.alive = false;
            scene.remove(s.mesh);
            thrownSticks.splice(i, 1);
        }
    }
}

function updateBulletTracers(delta) {
    for (let i = bulletTracers.length - 1; i >= 0; i--) {
        const t = bulletTracers[i];
        const step = t.speed * delta;
        t.dist += step;
        t.mesh.position.addScaledVector(t.dir, step);
        if (t.dist >= t.maxDist) {
            scene.remove(t.mesh);
            bulletTracers.splice(i, 1);
        }
    }
}

// ----------------------------------------------------------
// 7. BOSQICHLARNING 3D SOZLAMALARI (PUBG BATTLE ROYALE)
// ----------------------------------------------------------
const islandRadius = 260; // ULKAN OROL RADIUSI (260 METR!)

const islandConfigs = {
    1: {
        title: "Erangel Sohili va Baland Tog'lar",
        desc: "Katta ochiq dunyo, M416 avtomati, Tracker SUV, tezkor mototsikl va samalyot airdroplari!",
        skyColor: 0x64b5f6, fogColor: 0x90caf9, fogNear: 140, fogFar: 480,
        sunColor: 0xfff9e6, waterColor: 0x0277bd,
        groundTex: 'sand', innerTex: 'grass',
        chestPos: { x: 30, z: -150 }, // Shimoliy Cho'qqidagi qulagan samalyot yonida!
        trackerPos: { x: -20, z: 25 },
        motoPos: { x: 20, z: 28 },
        keys: [
            { x: -140, z: -85 },
            { x: 155, z: 65 },
            { x: 0, z: -35 }
        ],
        coins: 24,
        enemiesCount: 36
    },
    2: {
        title: "Miramar Cho'li va Qoyali Cho'qqilar",
        desc: "Tog'li cho'l relyefi. Mototsikl bilan qum tepaliklarida sakrab dushmanlarni oting!",
        skyColor: 0x263238, fogColor: 0x37474f, fogNear: 110, fogFar: 440,
        sunColor: 0xffcc80, waterColor: 0x004d40,
        groundTex: 'rock', innerTex: 'sand',
        chestPos: { x: 145, z: 25 },
        trackerPos: { x: -18, z: 20 },
        motoPos: { x: 24, z: 22 },
        keys: [
            { x: -130, z: 120 },
            { x: 140, z: -120 },
            { x: -50, z: -60 }
        ],
        coins: 28,
        enemiesCount: 40
    },
    3: {
        title: "Sanhok O'rmoni va Harbiy Baza",
        desc: "Qalin o'rmonlar va harbiy bunkerlar. Dushman armiyalari ta'qib qilmoqda!",
        skyColor: 0x1b3022, fogColor: 0x2d4a36, fogNear: 110, fogFar: 420,
        sunColor: 0xc5e1a5, waterColor: 0x0a2612,
        groundTex: 'cobblestone', innerTex: 'rock',
        chestPos: { x: -140, z: -130 },
        trackerPos: { x: 22, z: 30 },
        motoPos: { x: -25, z: 32 },
        keys: [
            { x: 135, z: -130 },
            { x: -135, z: 130 },
            { x: 45, z: -50 }
        ],
        coins: 30,
        enemiesCount: 44
    },
    4: {
        title: "Vikendi Qorli / Vulqon Cho'qqisi",
        desc: "Olovli lava va muzli tosh tog'lar. Airdrop qurollari bilan bosslarni mag'lub eting!",
        skyColor: 0x3e1b1b, fogColor: 0x5d2424, fogNear: 100, fogFar: 400,
        sunColor: 0xff7043, waterColor: 0x4e0d0d,
        groundTex: 'lava', innerTex: 'rock',
        chestPos: { x: 130, z: 130 },
        trackerPos: { x: -25, z: 28 },
        motoPos: { x: 22, z: 25 },
        keys: [
            { x: -140, z: -140 },
            { x: 140, z: -140 },
            { x: -90, z: 60 }
        ],
        coins: 34,
        enemiesCount: 48
    },
    5: {
        title: "PUBG Imperator Qal'asi va Final Zonasi",
        desc: "Ulkan qasr, snayper minoralari va eng qudratli Boss armiyasi!",
        skyColor: 0x0a1128, fogColor: 0x121b38, fogNear: 120, fogFar: 460,
        sunColor: 0x82b1ff, waterColor: 0x03081a,
        groundTex: 'cobblestone', innerTex: 'rock',
        chestPos: { x: 0, z: -160 },
        trackerPos: { x: -15, z: 35 },
        motoPos: { x: 25, z: 35 },
        keys: [
            { x: -140, z: 100 },
            { x: 140, z: 100 },
            { x: 0, z: 0 }
        ],
        coins: 40,
        enemiesCount: 52
    }
};

// ----------------------------------------------------------
// 8. KATTA TOG'LAR VA OROL TERRAINI FIZIKASI (HEIGHTMAP)
// ----------------------------------------------------------
function getTerrainHeight(x, z) {
    const dist = Math.hypot(x, z);
    if (dist > islandRadius) return -1.5;

    let h = 0.0;

    // 1. Shimoliy Qoyali Katta Tog' (North Mountain - Baland cho'qqi!)
    const dNorth = Math.hypot(x - 30, z - (-150));
    if (dNorth < 100) {
        h += Math.cos((dNorth / 100) * Math.PI * 0.5) * 34.0;
    }

    // 2. Sharqiy Tog' Tizmasi (East Mountain Ridge)
    const dEast = Math.hypot(x - 145, z - 25);
    if (dEast < 85) {
        h += Math.cos((dEast / 85) * Math.PI * 0.5) * 26.0;
    }

    // 3. Janubi-G'arbiy Qoyalar (South-West Crags)
    const dSW = Math.hypot(x - (-125), z - 115);
    if (dSW < 80) {
        h += Math.cos((dSW / 80) * Math.PI * 0.5) * 22.0;
    }

    // 4. Kichik to'lqinsimon tepaliklar va plato
    h += Math.sin(x * 0.032) * Math.cos(z * 0.032) * 2.8;
    h += Math.sin(x * 0.07 + z * 0.05) * 1.2;

    // Qirg'oqqa yaqinlashganda tekis pasayish (Beach falloff)
    if (dist > islandRadius - 45) {
        const factor = (islandRadius - dist) / 45;
        h *= Math.max(0, Math.min(1, factor));
    }

    return Math.max(0.0, h);
}

let worldGroup = null;
let oceanMesh = null;
let chestObject = null;
let chestLidMesh = null;
let chestUnlocked = false;
let collectibleKeys = [];
let collectibleCoins = [];
let hazardZones = [];
let enemies = [];
let climbableTrees = [];

function clearCurrentLevel() {
    if (worldGroup) {
        scene.remove(worldGroup);
        worldGroup = null;
    }
    if (cargoAirplane) {
        scene.remove(cargoAirplane);
        cargoAirplane = null;
    }
    airdropCrates.forEach(c => {
        if (c.group) scene.remove(c.group);
        if (c.smoke) scene.remove(c.smoke);
    });
    airdropCrates = [];
    bulletTracers.forEach(t => scene.remove(t.mesh));
    bulletTracers = [];
    explosiveBarrels = [];
    watchtowers = [];
    militaryBunkers = [];
    collectibleKeys = [];
    collectibleCoins = [];
    hazardZones = [];
    enemies = [];
    climbableTrees = [];
    thrownSticks.forEach(s => scene.remove(s.mesh));
    thrownSticks = [];
    trackerVehicle = null;
    motoVehicle = null;
    chestObject = null;
    chestLidMesh = null;
    chestUnlocked = false;
    isDriving = false;
    drivingVehicleType = null;
    inTree = false;
    currentClimbingTree = null;
    treeGatherTimer = 0;
    airplaneTimer = 18.0;
    militaryHouses = [];
    houseLootPickups = [];
    pilotPlaneVehicle = null;
    isGliding = false;
    if (playerParachute) playerParachute.visible = false;
    if (flightHudBox) flightHudBox.classList.add('hidden');
    clearInterval(quizTimerInterval);
    isQuizActive = false;
    if (quizRevivalScreen) quizRevivalScreen.classList.add('hidden');
    if (treeStatus) treeStatus.classList.add('hidden');
    if (airdropAlertElem) airdropAlertElem.classList.add('hidden');
}

function buildMountainTerrain(config) {
    const segments = 110;
    const islandSize = islandRadius * 2 + 40;
    const terrainGeo = new THREE.PlaneGeometry(islandSize, islandSize, segments, segments);
    terrainGeo.rotateX(-Math.PI / 2);

    const pos = terrainGeo.attributes.position;
    const colors = [];
    const color = new THREE.Color();

    for (let i = 0; i < pos.count; i++) {
        const vx = pos.getX(i);
        const vz = pos.getZ(i);
        const dist = Math.hypot(vx, vz);

        if (dist > islandRadius) {
            pos.setY(i, -12.0);
            color.setHex(0x1a2332);
        } else {
            const vy = getTerrainHeight(vx, vz);
            pos.setY(i, vy);

            if (vy > 18.0) {
                color.setHex(0x546e7a); // Toshli qoya
            } else if (vy > 8.0) {
                color.setHex(config.innerTex === 'rock' ? 0x455a64 : 0x33691e);
            } else if (vy > 2.0) {
                color.setHex(config.groundTex === 'sand' ? 0x558b2f : 0x37474f);
            } else {
                color.setHex(config.groundTex === 'sand' ? 0xd7ccc8 : 0x424242);
            }
        }
        colors.push(color.r, color.g, color.b);
    }

    terrainGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    terrainGeo.computeVertexNormals();

    const topTex = getTexture(config.groundTex);
    topTex.repeat.set(36, 36);

    const terrainMat = new THREE.MeshStandardMaterial({
        map: topTex,
        vertexColors: true,
        roughness: 0.82
    });

    terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.receiveShadow = true;
    worldGroup.add(terrainMesh);
}

function buildLevel(lvlNum) {
    clearCurrentLevel();
    const config = islandConfigs[lvlNum];

    worldGroup = new THREE.Group();
    scene.add(worldGroup);

    scene.background = new THREE.Color(config.skyColor);
    scene.fog = new THREE.Fog(config.fogColor, config.fogNear, config.fogFar);
    dirLight.color.setHex(config.sunColor);

    // 1. ULKAN TOG'LI OROL TERRAINI
    buildMountainTerrain(config);

    // 2. KENG OKEAN (y = -1.2)
    const oceanGeo = new THREE.PlaneGeometry(2400, 2400, 16, 16);
    const oceanMat = new THREE.MeshStandardMaterial({
        color: config.waterColor, roughness: 0.15, metalness: 0.8,
        transparent: true, opacity: 0.88
    });
    oceanMesh = new THREE.Mesh(oceanGeo, oceanMat);
    oceanMesh.rotation.x = -Math.PI / 2;
    oceanMesh.position.y = -1.2;
    worldGroup.add(oceanMesh);

    // 3. 48 ta Baland Daraxtlar va Taxta Maydonchalar
    buildClimbableForest(lvlNum);

    // 4. Harbiy Kuzatuv Minoralari, Bunkerlar, Samalyot Qoldiqlari va Bochkalari
    buildMapProps();

    // 5. Xazina Sandig'i
    buildTreasureChest(config.chestPos.x, config.chestPos.z);

    // 6. 3 Ta Oltin Kalit
    config.keys.forEach((pos, idx) => buildKey(pos.x, pos.z, idx + 1));

    // 7. Tangalar
    for (let i = 0; i < config.coins; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 25 + Math.random() * 200;
        buildCoin(Math.cos(angle) * dist, Math.sin(angle) * dist);
    }

    // 8. Xavfli hududlar
    for (let i = 0; i < 7; i++) {
        const a = Math.random() * Math.PI * 2;
        const d = 40 + Math.random() * 160;
        buildHazard(Math.cos(a) * d, Math.sin(a) * d, 7 + Math.random() * 5, lvlNum === 4);
    }

    // 9. Chevrolet Tracker SUV
    buildTrackerVehicle(config.trackerPos.x, config.trackerPos.z);

    // 10. Tezkor Mototsikl
    buildMotorcycleVehicle(config.motoPos.x, config.motoPos.z);

    // 11. Dushmanlar armiyasi
    buildEnemyHordes(lvlNum, config.enemiesCount);

    // 12. Kirish mumkin bo'lgan Uylar va ichidagi Har xil Avtomatlar
    buildMilitaryHouses();

    // 13. Uchish mumkin bo'lgan Harbiy Samalyot (Flyable Airplane) va Uchish-qo'nish yo'lagi
    buildFlyableAirplane(25, 60);

    // Qahramon boshlang'ich pozitsiyasi
    const startY = getTerrainHeight(0, 50);
    playerPos.set(0, startY, 50);
    cameraYaw = Math.PI;
    cameraPitch = 0.15;
    playerVelocity.set(0, 0, 0);

    if (playerGroup) {
        playerGroup.position.set(0, startY, 50);
    }

    collectedKeys = 0;
    buggyFuel = 100;
    stickCount = 3;
    selectWeapon('rifle');
    updateHUD();
}

// ----------------------------------------------------------
// 9. DARAXTLARNI YARATISH
// ----------------------------------------------------------
function buildClimbableForest(lvlNum) {
    const treeCount = 48;
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.9 });
    const rungMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.8 });
    const beamMat = new THREE.MeshStandardMaterial({ color: 0x4e342e, roughness: 0.85 });
    const fenceMat = new THREE.MeshStandardMaterial({ color: 0x543d2b, roughness: 0.8 });
    const lanternMat = new THREE.MeshBasicMaterial({ color: 0xffb74d });
    const stickMat = new THREE.MeshStandardMaterial({ color: 0x795548, roughness: 0.8 });

    // Taxta pol materiali (wood_planks teksturasi bilan)
    const plankTex = getTexture('wood_planks');
    plankTex.repeat.set(2, 2);
    const platformFloorMat = new THREE.MeshStandardMaterial({ map: plankTex, roughness: 0.78 });

    const canopyMat = new THREE.MeshStandardMaterial({
        color: lvlNum === 4 ? 0xd84315 : lvlNum === 2 ? 0x1b5e20 : 0x2e7d32,
        roughness: 0.65
    });

    const trunkGeo = new THREE.CylinderGeometry(0.7, 0.95, 12, 8);
    const rungGeo = new THREE.BoxGeometry(0.75, 0.12, 0.22);

    // TAXTA MAYDONCHA GEOMETRIYALARI (SHARED GEOMETRIES - 60 FPS OPTIMALLIK)
    const platformDeckGeo = new THREE.CylinderGeometry(2.65, 2.65, 0.22, 8);
    const crossBeamGeo = new THREE.BoxGeometry(5.3, 0.28, 0.35);
    const strutGeo = new THREE.BoxGeometry(0.18, 3.2, 0.18);
    const postGeo = new THREE.BoxGeometry(0.14, 0.95, 0.14);
    const railGeo = new THREE.BoxGeometry(1.88, 0.08, 0.06);
    const crateGeo = new THREE.BoxGeometry(0.65, 0.65, 0.65);
    const stickPropGeo = new THREE.CylinderGeometry(0.03, 0.035, 1.3, 5);
    const lanternGeo = new THREE.BoxGeometry(0.22, 0.3, 0.22);
    const branchGeo = new THREE.BoxGeometry(0.45, 0.35, 4.4);
    const canopyGeo = new THREE.SphereGeometry(4.2, 10, 10);

    for (let i = 0; i < treeCount; i++) {
        const angle = (i / treeCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.25;
        const dist = 30 + Math.random() * 200;
        const tx = Math.cos(angle) * dist;
        const tz = Math.sin(angle) * dist;
        const ty = getTerrainHeight(tx, tz);

        const treeGroup = new THREE.Group();
        treeGroup.position.set(tx, ty, tz);

        const treeHeight = 12.0;
        const localPlatformY = 9.0; // Daraxt guruhi ichidagi lokal balandlik
        const branchHeight = ty + localPlatformY; // Butun dunyo koordinatasidagi balandlik

        // Tana (Trunk)
        const trunk = new THREE.Mesh(trunkGeo, woodMat);
        trunk.position.y = treeHeight / 2;
        trunk.castShadow = true;
        treeGroup.add(trunk);

        // Zina pog'onalari (+Z tomonda, to'g'ridan-to'g'ri maydoncha eshigiga olib chiqadi)
        for (let y = 1.0; y <= localPlatformY + 0.1; y += 1.1) {
            const rung = new THREE.Mesh(rungGeo, rungMat);
            rung.position.set(0, y, 0.85);
            treeGroup.add(rung);
        }

        // ========================================================
        // TAXTADAN QURILGAN MAYDONCHA (WOODEN TREE PLATFORM)
        // ========================================================
        // 1. Asosiy taxta pol (8 burchakli mustahkam maydoncha)
        const deck = new THREE.Mesh(platformDeckGeo, platformFloorMat);
        deck.position.set(0, localPlatformY, 0);
        deck.receiveShadow = true;
        deck.castShadow = true;
        treeGroup.add(deck);

        // 2. Maydoncha ostidagi yuk ko'taruvchi yog'och to'sinlar (Crossbeams)
        const beamX = new THREE.Mesh(crossBeamGeo, beamMat);
        beamX.position.set(0, localPlatformY - 0.18, 0);
        treeGroup.add(beamX);
        const beamZ = new THREE.Mesh(crossBeamGeo, beamMat);
        beamZ.position.set(0, localPlatformY - 0.18, 0);
        beamZ.rotation.y = Math.PI / 2;
        treeGroup.add(beamZ);

        // 3. Maydonchani daraxt tanasiga mustahkamlab turuvchi 4 ta diagonal tirgovich
        [
            { x: 0.9, z: 0, rx: 0, rz: 0.62 },
            { x: -0.9, z: 0, rx: 0, rz: -0.62 },
            { x: 0, z: 0.9, rx: -0.62, rz: 0 },
            { x: 0, z: -0.9, rx: 0.62, rz: 0 }
        ].forEach(s => {
            const strut = new THREE.Mesh(strutGeo, beamMat);
            strut.position.set(s.x, localPlatformY - 1.5, s.z);
            strut.rotation.set(s.rx, 0, s.rz);
            treeGroup.add(strut);
        });

        // 4. Maydoncha atrofidagi taxta panjara va to'siqlar (Railings)
        const R = 2.5;
        const posts = [];
        for (let k = 0; k < 8; k++) {
            const pAngle = (k / 8) * Math.PI * 2 + Math.PI / 8;
            const px = Math.cos(pAngle) * R;
            const pz = Math.sin(pAngle) * R;
            posts.push({ x: px, z: pz, angle: pAngle });

            const post = new THREE.Mesh(postGeo, fenceMat);
            post.position.set(px, localPlatformY + 0.48, pz);
            post.castShadow = true;
            treeGroup.add(post);
        }

        // Ustunlar orasiga taxta to'siqlar tortiladi (Zinapoya tomondagi kirish ochiq qoldiriladi)
        for (let k = 0; k < 8; k++) {
            const p1 = posts[k];
            const p2 = posts[(k + 1) % 8];
            const midX = (p1.x + p2.x) / 2;
            const midZ = (p1.z + p2.z) / 2;
            const segAngle = Math.atan2(p2.x - p1.x, p2.z - p1.z);

            // Zinapoya keladigan tomon (+Z yaqinidagi tomon) ochiq kirish eshigi hisoblanadi
            if (p1.z > 1.3 && p2.z > 1.3) {
                continue; // Kirish eshigi
            }

            // Yuqori to'siq taxta
            const railTop = new THREE.Mesh(railGeo, fenceMat);
            railTop.position.set(midX, localPlatformY + 0.82, midZ);
            railTop.rotation.y = segAngle + Math.PI / 2;
            treeGroup.add(railTop);

            // Quyi to'siq taxta
            const railBot = new THREE.Mesh(railGeo, fenceMat);
            railBot.position.set(midX, localPlatformY + 0.42, midZ);
            railBot.rotation.y = segAngle + Math.PI / 2;
            treeGroup.add(railBot);
        }

        // 5. Maydonchadagi cho'paklar zaxira qutisi (Wooden crate with sticks)
        const crate = new THREE.Mesh(crateGeo, woodMat);
        crate.position.set(1.4, localPlatformY + 0.33, -1.3);
        crate.rotation.y = 0.4;
        treeGroup.add(crate);

        [-0.12, 0, 0.12].forEach((sx, idx) => {
            const stickProp = new THREE.Mesh(stickPropGeo, stickMat);
            stickProp.position.set(1.4 + sx, localPlatformY + 0.85, -1.3 + (idx - 1) * 0.08);
            stickProp.rotation.set((idx - 1) * 0.15, 0, (idx - 1) * -0.2);
            treeGroup.add(stickProp);
        });

        // 6. Qaroqchilar fonusi (Hanging Pirate Lantern)
        const lantern = new THREE.Mesh(lanternGeo, lanternMat);
        lantern.position.set(-1.8, localPlatformY + 0.75, -0.6);
        treeGroup.add(lantern);

        // 7. Tabiiy soyabon shoxlar va barglar
        for (let b = 0; b < 4; b++) {
            const bAngle = (b / 4) * Math.PI * 2;
            const branch = new THREE.Mesh(branchGeo, beamMat);
            branch.position.set(Math.cos(bAngle) * 1.8, localPlatformY + 1.8, Math.sin(bAngle) * 1.8);
            branch.rotation.y = bAngle;
            treeGroup.add(branch);
        }

        const canopy = new THREE.Mesh(canopyGeo, canopyMat);
        canopy.position.y = treeHeight + 2.5;
        canopy.castShadow = true;
        treeGroup.add(canopy);

        worldGroup.add(treeGroup);

        climbableTrees.push({
            x: tx,
            z: tz,
            branchHeight: branchHeight,
            radius: 2.65, // Taxta maydoncha radiusi
            group: treeGroup
        });
    }
}

// ----------------------------------------------------------
// 10. DUSHMANLARNI YARATISH (3 MARTA URGANDA O'LADI)
// ----------------------------------------------------------
function buildEnemyHordes(lvlNum, totalEnemies) {
    const types = lvlNum === 1 ? ['goblin'] :
                  lvlNum === 2 ? ['goblin', 'bat'] :
                  lvlNum === 3 ? ['skeleton', 'bat'] :
                  lvlNum === 4 ? ['fire_demon', 'bat'] :
                  ['skeleton', 'fire_demon', 'boss_chaser'];

    for (let i = 0; i < totalEnemies; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const angle = Math.random() * Math.PI * 2;
        const dist = 30 + Math.random() * 125;
        const ex = Math.cos(angle) * dist;
        const ez = Math.sin(angle) * dist;

        const isBoss = (type === 'boss_chaser') || (i === totalEnemies - 1 && lvlNum >= 3);
        buildSingleEnemy({
            type: isBoss ? 'boss_chaser' : type,
            x: ex,
            z: ez,
            speed: isBoss ? 3.4 : 3.0 + Math.random() * 0.8,
            hp: isBoss ? 8 : 3, // ODDIY DUSHMANLAR 3 TA ZARBADAN O'LADI!
            isBoss: isBoss
        });
    }
}

function buildSingleEnemy(cfg) {
    const enemyGroup = new THREE.Group();
    enemyGroup.position.set(cfg.x, 0.0, cfg.z);

    const type = cfg.type;
    const isBoss = !!cfg.isBoss;
    const scale = isBoss ? 2.5 : type === 'bat' ? 0.9 : 1.2;
    enemyGroup.scale.set(scale, scale, scale);

    let mainColor = 0x4caf50;
    if (type === 'bat') mainColor = 0x311b92;
    if (type === 'skeleton') mainColor = 0xeeeeee;
    if (type === 'fire_demon') mainColor = 0xd50000;
    if (type === 'boss_chaser') mainColor = 0x1b5e20;

    const bodyMat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.7 });

    if (type === 'bat') {
        const batBody = new THREE.Mesh(new THREE.SphereGeometry(0.35, 10, 10), bodyMat);
        enemyGroup.add(batBody);
        const wingL = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.6), bodyMat);
        wingL.position.set(-0.7, 0.1, 0);
        enemyGroup.add(wingL);
        const wingR = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.6), bodyMat);
        wingR.position.set(0.7, 0.1, 0);
        enemyGroup.add(wingR);
        enemyGroup.wingL = wingL;
        enemyGroup.wingR = wingR;
        enemyGroup.position.y = 3.5;
    } else {
        const legGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.7, 8);
        const legL = new THREE.Mesh(legGeo, bodyMat);
        legL.position.set(-0.18, 0.35, 0);
        enemyGroup.add(legL);
        const legR = new THREE.Mesh(legGeo, bodyMat);
        legR.position.set(0.18, 0.35, 0);
        enemyGroup.add(legR);
        enemyGroup.legL = legL;
        enemyGroup.legR = legR;

        const torso = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.35), bodyMat);
        torso.position.y = 1.05;
        torso.castShadow = true;
        enemyGroup.add(torso);

        const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 10, 10), bodyMat);
        head.position.y = 1.65;
        head.castShadow = true;
        enemyGroup.add(head);

        const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff1744 });
        [-0.1, 0.1].forEach(ex => {
            const eye = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), eyeMat);
            eye.position.set(ex, 1.7, 0.28);
            enemyGroup.add(eye);
        });
    }

    // 3D JON INDIKATORI (3 TA BO'LIM: 3 MARTA URILGANDA O'LISH)
    const hpCanvas = document.createElement('canvas');
    hpCanvas.width = 128; hpCanvas.height = 24;
    const hpTex = new THREE.CanvasTexture(hpCanvas);
    const hpSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: hpTex }));
    hpSprite.position.y = isBoss ? 2.9 : 2.2;
    hpSprite.scale.set(1.4, 0.26, 1);
    enemyGroup.add(hpSprite);

    const enemyData = {
        group: enemyGroup,
        type: type,
        speed: cfg.speed,
        hp: cfg.hp || (isBoss ? 8 : 3),
        maxHp: cfg.hp || (isBoss ? 8 : 3),
        alive: true,
        hpCanvas: hpCanvas,
        hpTex: hpTex,
        isBoss: isBoss,
        isClimbing: false,
        climbTree: null,
        attackCooldown: 0
    };

    updateEnemyHealthSprite(enemyData);
    enemies.push(enemyData);
    worldGroup.add(enemyGroup);
}

function updateEnemyHealthSprite(enemy) {
    const ctx = enemy.hpCanvas.getContext('2d');
    ctx.clearRect(0, 0, 128, 24);
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(0, 0, 128, 24);

    const totalBars = enemy.maxHp;
    const barW = (124 - (totalBars - 1) * 3) / totalBars;
    for (let i = 0; i < totalBars; i++) {
        const x = 2 + i * (barW + 3);
        if (i < enemy.hp) {
            ctx.fillStyle = enemy.hp === 1 ? '#ff1744' : enemy.hp === 2 ? '#ffd600' : '#00e676';
            ctx.fillRect(x, 2, barW, 20);
        } else {
            ctx.fillStyle = 'rgba(255,255,255,0.15)';
            ctx.fillRect(x, 2, barW, 20);
        }
    }
    enemy.hpTex.needsUpdate = true;
}

function damageEnemy(enemy, amount, pushDir) {
    if (!enemy.alive) return;
    enemy.hp -= amount;
    updateEnemyHealthSprite(enemy);

    if (pushDir) {
        enemy.group.position.x += pushDir.x * 2.2;
        enemy.group.position.z += pushDir.z * 2.2;
    }

    if (enemy.hp <= 0) {
        defeatEnemy(enemy);
    }
}

function defeatEnemy(enemy) {
    enemy.alive = false;
    worldGroup.remove(enemy.group);

    for (let i = 0; i < (enemy.isBoss ? 5 : 2); i++) {
        buildCoin(
            enemy.group.position.x + (Math.random() - 0.5) * 2,
            enemy.group.position.z + (Math.random() - 0.5) * 2
        );
    }
    showNotification(enemy.isBoss ? "BUYUK BOSS YENGILDI! 👑🪙" : "Dushman tor-mor qilindi! 🪙");
}

// ----------------------------------------------------------
// 11. XAZINA, KALITLAR, TANGALAR, BUGGY
// ----------------------------------------------------------
function buildTreasureChest(x, z) {
    chestObject = new THREE.Group();
    chestObject.position.set(x, 0.0, z);

    const woodMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.7 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.2 });

    const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.2, 1.6), woodMat);
    baseMesh.position.y = 0.6;
    baseMesh.castShadow = true;
    chestObject.add(baseMesh);

    chestLidMesh = new THREE.Group();
    chestLidMesh.position.set(0, 1.2, -0.8);
    const lidTop = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2.4, 12, 1, false, 0, Math.PI), woodMat);
    lidTop.rotation.z = Math.PI / 2;
    lidTop.position.set(0, 0, 0.8);
    chestLidMesh.add(lidTop);

    const lock = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.15), goldMat);
    lock.position.set(0, 0, 1.62);
    chestLidMesh.add(lock);
    chestObject.add(chestLidMesh);

    worldGroup.add(chestObject);
}

function buildKey(x, z, id) {
    const keyGroup = new THREE.Group();
    keyGroup.position.set(x, 1.8, z);

    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.15, emissive: 0x553300 });
    keyGroup.add(new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.08, 8, 16), goldMat));
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.9, 8), goldMat);
    rod.position.y = -0.55;
    keyGroup.add(rod);

    const light = new THREE.PointLight(0xffd700, 1.5, 12);
    keyGroup.add(light);

    keyGroup.userData = { id, baseY: 1.8 };
    collectibleKeys.push(keyGroup);
    worldGroup.add(keyGroup);
}

function buildCoin(x, z) {
    const coinGroup = new THREE.Group();
    coinGroup.position.set(x, 0.8, z);
    const coinMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.08, 12), new THREE.MeshStandardMaterial({ color: 0xffca28, metalness: 0.85, roughness: 0.2 }));
    coinMesh.rotation.x = Math.PI / 2;
    coinGroup.add(coinMesh);
    coinGroup.userData = { baseY: 0.8 };
    collectibleCoins.push(coinGroup);
    worldGroup.add(coinGroup);
}

function buildHazard(x, z, radius, isLava) {
    const hMesh = new THREE.Mesh(new THREE.CircleGeometry(radius, 16), new THREE.MeshStandardMaterial({
        color: isLava ? 0xff3d00 : 0x111111,
        emissive: isLava ? 0xff1744 : 0x000000,
        roughness: 0.5
    }));
    hMesh.rotation.x = -Math.PI / 2;
    hMesh.position.set(x, 0.03, z);
    worldGroup.add(hMesh);
    hazardZones.push({ x, z, radius, isLava });
}

// ----------------------------------------------------------
// 11. TRANSPORTLAR: CHEVROLET TRACKER SUV VA MOTOTSIKL
// ----------------------------------------------------------
function buildTrackerVehicle(x, z) {
    trackerVehicle = new THREE.Group();
    const yPos = getTerrainHeight(x, z) + 0.65;
    trackerVehicle.position.set(x, yPos, z);

    const paintMat = new THREE.MeshStandardMaterial({ color: 0x1a2e40, metalness: 0.85, roughness: 0.25 });
    const trimMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x050c18, roughness: 0.1, metalness: 0.9 });
    const silverMat = new THREE.MeshStandardMaterial({ color: 0xb0bec5, metalness: 0.8, roughness: 0.3 });
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x1b1b1b, roughness: 0.95 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xd6d6d6, metalness: 0.9, roughness: 0.2 });

    // 1. Asosiy kuzov (Lower Body)
    const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.75, 4.4), paintMat);
    lowerBody.position.y = 0.55;
    lowerBody.castShadow = true;
    trackerVehicle.add(lowerBody);

    // 2. Kabina (Cabin)
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.72, 2.7), glassMat);
    cabin.position.set(0, 1.25, -0.2);
    trackerVehicle.add(cabin);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.08, 2.5), paintMat);
    roof.position.set(0, 1.63, -0.2);
    trackerVehicle.add(roof);

    // 3. Tom relslari / Bagajnik (Roof Rails)
    [-0.85, 0.85].forEach(rx => {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 2.3), trimMat);
        rail.position.set(rx, 1.7, -0.2);
        trackerVehicle.add(rail);
    });
    [-0.8, 0.4].forEach(rz => {
        const crossBar = new THREE.Mesh(new THREE.BoxGeometry(1.78, 0.06, 0.06), trimMat);
        crossBar.position.set(0, 1.74, rz);
        trackerVehicle.add(crossBar);
    });

    // 4. Kapot va Tracker panjarasi (Hood & Grille)
    const hood = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.28, 1.3), paintMat);
    hood.position.set(0, 0.85, 1.5);
    trackerVehicle.add(hood);

    const grille = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.4, 0.1), trimMat);
    grille.position.set(0, 0.55, 2.22);
    trackerVehicle.add(grille);

    const bowTie = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 0.12), new THREE.MeshStandardMaterial({ color: 0xffb300, metalness: 0.9 }));
    bowTie.position.set(0, 0.58, 2.24);
    trackerVehicle.add(bowTie);

    // 5. LED Farlar va Proyektorlar
    const ledMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    [-0.8, 0.8].forEach(lx => {
        const headlight = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.14, 0.1), ledMat);
        headlight.position.set(lx, 0.72, 2.21);
        trackerVehicle.add(headlight);

        const spot = new THREE.SpotLight(0xfff8e7, 3.0, 75, Math.PI / 4.5, 0.4);
        spot.position.set(lx, 0.75, 2.3);
        spot.target.position.set(lx, -0.2, 40);
        trackerVehicle.add(spot);
        trackerVehicle.add(spot.target);
    });

    // 6. Bamperlar va Orqa chiroqlar
    const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(2.25, 0.35, 0.3), silverMat);
    frontBumper.position.set(0, 0.25, 2.2);
    trackerVehicle.add(frontBumper);

    const rearBumper = new THREE.Mesh(new THREE.BoxGeometry(2.25, 0.35, 0.3), silverMat);
    rearBumper.position.set(0, 0.28, -2.2);
    trackerVehicle.add(rearBumper);

    const rearLightBar = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.1, 0.08), new THREE.MeshBasicMaterial({ color: 0xff1744 }));
    rearLightBar.position.set(0, 0.95, -2.22);
    trackerVehicle.add(rearLightBar);

    // 7. 4 ta Katta G'ildiraklar (Alloy Wheels)
    const tireGeo = new THREE.CylinderGeometry(0.62, 0.62, 0.42, 16);
    const rimGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.43, 10);

    trackerVehicle.wheels = [];
    [[-1.25, 1.35], [1.25, 1.35], [-1.25, -1.35], [1.25, -1.35]].forEach(p => {
        const wheelGroup = new THREE.Group();
        wheelGroup.position.set(p[0], 0.0, p[1]);

        const tire = new THREE.Mesh(tireGeo, tireMat);
        tire.rotation.z = Math.PI / 2;
        tire.castShadow = true;
        wheelGroup.add(tire);

        const rim = new THREE.Mesh(rimGeo, rimMat);
        rim.rotation.z = Math.PI / 2;
        wheelGroup.add(rim);

        trackerVehicle.add(wheelGroup);
        trackerVehicle.wheels.push(wheelGroup);
    });

    trackerVehicle.velocity = 0;
    trackerVehicle.angle = 0;
    trackerVehicle.vehicleType = 'tracker';
    worldGroup.add(trackerVehicle);
}

function buildMotorcycleVehicle(x, z) {
    motoVehicle = new THREE.Group();
    const yPos = getTerrainHeight(x, z) + 0.55;
    motoVehicle.position.set(x, yPos, z);

    const frameMat = new THREE.MeshStandardMaterial({ color: 0xd32f2f, metalness: 0.8, roughness: 0.3 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, metalness: 0.95, roughness: 0.15 });
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x1b1b1b, roughness: 0.95 });
    const leatherMat = new THREE.MeshStandardMaterial({ color: 0x212121, roughness: 0.7 });

    // Bak va o'rindiq
    const tank = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.42, 0.95), frameMat);
    tank.position.set(0, 0.85, 0.15);
    tank.castShadow = true;
    motoVehicle.add(tank);

    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.22, 0.9), leatherMat);
    seat.position.set(0, 0.78, -0.6);
    motoVehicle.add(seat);

    // Dvigatel va Egzoz
    const engine = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.55, 0.7), chromeMat);
    engine.position.set(0, 0.4, 0.0);
    motoVehicle.add(engine);

    const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.4, 8), chromeMat);
    exhaust.rotation.x = Math.PI / 2;
    exhaust.position.set(0.28, 0.35, -0.65);
    motoVehicle.add(exhaust);

    // Rul va Fara
    const forkL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.95, 6), chromeMat);
    forkL.position.set(-0.2, 0.75, 0.85);
    forkL.rotation.x = -0.28;
    motoVehicle.add(forkL);

    const forkR = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.95, 6), chromeMat);
    forkR.position.set(0.2, 0.75, 0.85);
    forkR.rotation.x = -0.28;
    motoVehicle.add(forkR);

    const handleBar = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.9, 8), chromeMat);
    handleBar.rotation.z = Math.PI / 2;
    handleBar.position.set(0, 1.15, 0.72);
    motoVehicle.add(handleBar);

    const headlight = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.12, 12), new THREE.MeshBasicMaterial({ color: 0xfffaed }));
    headlight.rotation.x = Math.PI / 2;
    headlight.position.set(0, 1.05, 0.92);
    motoVehicle.add(headlight);

    const motoSpot = new THREE.SpotLight(0xfffaed, 2.5, 60, Math.PI / 4, 0.35);
    motoSpot.position.set(0, 1.05, 1.0);
    motoSpot.target.position.set(0, 0.0, 35);
    motoVehicle.add(motoSpot);
    motoVehicle.add(motoSpot.target);

    // 2 ta g'ildirak
    const wheelGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.18, 16);
    const rimGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.19, 8);

    motoVehicle.wheels = [];
    [1.05, -1.05].forEach(zPos => {
        const wheelGroup = new THREE.Group();
        wheelGroup.position.set(0, 0.0, zPos);

        const tire = new THREE.Mesh(wheelGeo, tireMat);
        tire.rotation.z = Math.PI / 2;
        tire.castShadow = true;
        wheelGroup.add(tire);

        const rim = new THREE.Mesh(rimGeo, chromeMat);
        rim.rotation.z = Math.PI / 2;
        wheelGroup.add(rim);

        motoVehicle.add(wheelGroup);
        motoVehicle.wheels.push(wheelGroup);
    });

    motoVehicle.velocity = 0;
    motoVehicle.angle = 0;
    motoVehicle.lean = 0;
    motoVehicle.vehicleType = 'moto';
    worldGroup.add(motoVehicle);
}

// ----------------------------------------------------------
// HARBIY SAMALYOT (C-130 CARGO AIRPLANE) VA AIRDROP
// ----------------------------------------------------------
function buildCargoAirplane() {
    cargoAirplane = new THREE.Group();
    cargoAirplane.position.set(-390, 85, (Math.random() - 0.5) * 140);

    const planeMat = new THREE.MeshStandardMaterial({ color: 0x37474f, roughness: 0.6, metalness: 0.5 });
    const wingMat = new THREE.MeshStandardMaterial({ color: 0x455a64, roughness: 0.6, metalness: 0.4 });
    const glassMat = new THREE.MeshBasicMaterial({ color: 0x80d8ff });
    const propMat = new THREE.MeshBasicMaterial({ color: 0x212121 });

    const fuselage = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.4, 28, 12), planeMat);
    fuselage.rotation.x = Math.PI / 2;
    fuselage.castShadow = true;
    cargoAirplane.add(fuselage);

    const nose = new THREE.Mesh(new THREE.ConeGeometry(2.2, 5, 12), planeMat);
    nose.rotation.x = -Math.PI / 2;
    nose.position.z = 16.5;
    cargoAirplane.add(nose);

    const cockpit = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.2, 2.5), glassMat);
    cockpit.position.set(0, 1.4, 13.5);
    cargoAirplane.add(cockpit);

    const wing = new THREE.Mesh(new THREE.BoxGeometry(28, 0.4, 4.5), wingMat);
    wing.position.set(0, 1.2, 2);
    cargoAirplane.add(wing);

    cargoAirplane.props = [];
    [-6.5, 6.5].forEach(wx => {
        const engine = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 4.2, 8), planeMat);
        engine.rotation.x = Math.PI / 2;
        engine.position.set(wx, 0.6, 2.5);
        cargoAirplane.add(engine);

        const prop = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.25, 0.08), propMat);
        prop.position.set(wx, 0.6, 4.8);
        cargoAirplane.add(prop);
        cargoAirplane.props.push(prop);
    });

    const tailFin = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5.5, 3.5), wingMat);
    tailFin.position.set(0, 3.8, -12);
    cargoAirplane.add(tailFin);

    const tailWing = new THREE.Mesh(new THREE.BoxGeometry(9.5, 0.3, 2.2), wingMat);
    tailWing.position.set(0, 5.8, -12.5);
    cargoAirplane.add(tailWing);

    cargoAirplane.rotation.y = Math.PI / 2;
    cargoAirplane.hasDroppedAirdrop = false;
    scene.add(cargoAirplane);

    playAirplaneDroneSound();
}

function dropAirdrop(x, z) {
    const crateGroup = new THREE.Group();
    crateGroup.position.set(x, 82, z);

    const crateBox = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 1.4, 1.6),
        new THREE.MeshStandardMaterial({ color: 0xb71c1c, roughness: 0.5, metalness: 0.4 })
    );
    crateBox.position.y = 0.7;
    crateGroup.add(crateBox);

    const blueTarp = new THREE.Mesh(
        new THREE.BoxGeometry(1.65, 0.35, 1.65),
        new THREE.MeshStandardMaterial({ color: 0x0277bd, roughness: 0.7 })
    );
    blueTarp.position.y = 1.42;
    crateGroup.add(blueTarp);

    const parachuteGroup = new THREE.Group();
    parachuteGroup.position.set(0, 4.2, 0);

    const canopy = new THREE.Mesh(
        new THREE.SphereGeometry(3.6, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6, side: THREE.DoubleSide })
    );
    canopy.rotation.x = Math.PI;
    parachuteGroup.add(canopy);

    const stripe = new THREE.Mesh(
        new THREE.SphereGeometry(3.65, 12, 8, 0, Math.PI * 0.6, 0, Math.PI / 2),
        new THREE.MeshStandardMaterial({ color: 0xd50000, roughness: 0.6, side: THREE.DoubleSide })
    );
    stripe.rotation.x = Math.PI;
    parachuteGroup.add(stripe);

    crateGroup.add(parachuteGroup);
    scene.add(crateGroup);

    const smokeGroup = new THREE.Group();
    smokeGroup.position.set(x, getTerrainHeight(x, z), z);
    const smokeMat = new THREE.MeshBasicMaterial({ color: 0xff1744, transparent: true, opacity: 0.85 });
    for (let i = 0; i < 6; i++) {
        const sm = new THREE.Mesh(new THREE.SphereGeometry(0.8 + i * 0.35, 8, 8), smokeMat);
        sm.position.set((Math.random() - 0.5) * 0.6, 1.2 + i * 2.2, (Math.random() - 0.5) * 0.6);
        smokeGroup.add(sm);
    }
    smokeGroup.visible = false;
    scene.add(smokeGroup);

    airdropCrates.push({
        group: crateGroup,
        parachute: parachuteGroup,
        smoke: smokeGroup,
        x: x,
        z: z,
        landed: false,
        looted: false,
        vy: -8.0
    });

    if (airdropAlertElem) {
        airdropAlertElem.classList.remove('hidden');
        setTimeout(() => airdropAlertElem.classList.add('hidden'), 5500);
    }
    showNotification("Osmondan Airdrop tushmoqda! Qizil tutunga qarab boring! 🛩️📦");
}

function lootAirdrop(crate) {
    if (crate.looted) return;
    crate.looted = true;

    rifleReserve += 60;
    buggyFuel = 100;
    totalCoins += 10;
    playerHealth = Math.min(maxHealth, playerHealth + 1);

    playChestOpenSound();
    playCoinSound();
    updateHUD();

    showNotification("PUBG Airdrop ochildi! 📦🔥 (+60 O'q, +100% Yoqilg'i, +10 Tanga, +1 ❤️)");

    if (crate.smoke) {
        crate.smoke.children.forEach(s => s.material.color.setHex(0x37474f));
        setTimeout(() => scene.remove(crate.smoke), 4000);
    }
}

// ----------------------------------------------------------
// KUZATUV MINORALARI, BUNKERLAR VA TOG' QOYALARI
// ----------------------------------------------------------
function buildMapProps() {
    const towerPositions = [
        { x: 30, z: -150 },
        { x: 145, z: 25 },
        { x: -70, z: -40 }
    ];

    const steelMat = new THREE.MeshStandardMaterial({ color: 0x37474f, metalness: 0.85, roughness: 0.3 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.85 });

    towerPositions.forEach(pos => {
        const baseY = getTerrainHeight(pos.x, pos.z);
        const towerGroup = new THREE.Group();
        towerGroup.position.set(pos.x, baseY, pos.z);
        const towerHeight = 13.0;

        [-1.8, 1.8].forEach(lx => {
            [-1.8, 1.8].forEach(lz => {
                const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, towerHeight, 6), steelMat);
                leg.position.set(lx, towerHeight / 2, lz);
                towerGroup.add(leg);
            });
        });

        for (let y = 0.8; y < towerHeight; y += 1.0) {
            const rung = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.08, 0.08), woodMat);
            rung.position.set(0, y, 1.82);
            towerGroup.add(rung);
        }

        const deck = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.22, 4.2), woodMat);
        deck.position.set(0, towerHeight, 0);
        towerGroup.add(deck);

        [-2.0, 2.0].forEach(rx => {
            const rail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.9, 4.2), steelMat);
            rail.position.set(rx, towerHeight + 0.45, 0);
            towerGroup.add(rail);
        });
        const railBack = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.9, 0.1), steelMat);
        railBack.position.set(0, towerHeight + 0.45, -2.0);
        towerGroup.add(railBack);

        const roof = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.15, 4.6), steelMat);
        roof.position.set(0, towerHeight + 2.5, 0);
        towerGroup.add(roof);

        const ammoBox = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.4), new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.6 }));
        ammoBox.position.set(1.2, towerHeight + 0.22, -1.2);
        towerGroup.add(ammoBox);

        worldGroup.add(towerGroup);
        watchtowers.push({ x: pos.x, z: pos.z, baseY: baseY, height: towerHeight });
    });

    const bunkerPositions = [
        { x: -50, z: 60, rot: 0.3 },
        { x: 90, z: -60, rot: -0.6 }
    ];

    const concreteMat = new THREE.MeshStandardMaterial({ color: 0x616161, roughness: 0.9 });
    bunkerPositions.forEach(b => {
        const baseY = getTerrainHeight(b.x, b.z);
        const bunkerGroup = new THREE.Group();
        bunkerGroup.position.set(b.x, baseY, b.z);
        bunkerGroup.rotation.y = b.rot;

        const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.8, 6.0), concreteMat);
        leftWall.position.set(-2.8, 1.4, 0);
        bunkerGroup.add(leftWall);

        const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.8, 6.0), concreteMat);
        rightWall.position.set(2.8, 1.4, 0);
        bunkerGroup.add(rightWall);

        const backWall = new THREE.Mesh(new THREE.BoxGeometry(5.6, 2.8, 0.4), concreteMat);
        backWall.position.set(0, 1.4, -2.8);
        bunkerGroup.add(backWall);

        const roof = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.4, 6.4), concreteMat);
        roof.position.set(0, 2.8, 0);
        bunkerGroup.add(roof);

        worldGroup.add(bunkerGroup);
        militaryBunkers.push(bunkerGroup);
    });

    // Qulagan Samalyot (Crashed Airplane)
    const crashX = 45;
    const crashZ = -130;
    const crashY = getTerrainHeight(crashX, crashZ);
    const crashGroup = new THREE.Group();
    crashGroup.position.set(crashX, crashY + 1.2, crashZ);
    crashGroup.rotation.set(0.3, 1.2, -0.4);

    const metalScrapMat = new THREE.MeshStandardMaterial({ color: 0x455a64, roughness: 0.7, metalness: 0.6 });
    const brokenFuselage = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.2, 16, 10, 1, true), metalScrapMat);
    brokenFuselage.rotation.z = Math.PI / 2;
    crashGroup.add(brokenFuselage);

    const brokenWing = new THREE.Mesh(new THREE.BoxGeometry(14, 0.35, 3.2), metalScrapMat);
    brokenWing.position.set(-4, 0.8, -2);
    brokenWing.rotation.y = 0.3;
    crashGroup.add(brokenWing);

    worldGroup.add(crashGroup);

    // Portlovchi bochkalar
    const barrelMat = new THREE.MeshStandardMaterial({ color: 0xd50000, roughness: 0.5 });
    const barrelCapMat = new THREE.MeshStandardMaterial({ color: 0x212121, roughness: 0.9 });
    const barrelGeo = new THREE.CylinderGeometry(0.38, 0.38, 1.1, 12);

    const barrelCoords = [
        { x: -18, z: 12 }, { x: 35, z: 20 }, { x: -80, z: -35 },
        { x: 65, z: -85 }, { x: 120, z: 35 }, { x: -100, z: 80 },
        { x: 20, z: -110 }, { x: -40, z: 110 }
    ];

    barrelCoords.forEach(pos => {
        const by = getTerrainHeight(pos.x, pos.z);
        const bMesh = new THREE.Mesh(barrelGeo, barrelMat);
        bMesh.position.set(pos.x, by + 0.55, pos.z);

        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.39, 0.39, 0.08, 12), barrelCapMat);
        cap.position.y = 0.52;
        bMesh.add(cap);

        worldGroup.add(bMesh);
        explosiveBarrels.push({ mesh: bMesh, exploded: false });
    });

    // Tog' qoyalari
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x455a64, roughness: 0.95 });
    const rockGeo = new THREE.DodecahedronGeometry(2.8, 1);

    for (let i = 0; i < 22; i++) {
        const angle = (i / 22) * Math.PI * 2;
        const dist = 70 + Math.random() * 150;
        const rx = Math.cos(angle) * dist;
        const rz = Math.sin(angle) * dist;
        const ry = getTerrainHeight(rx, rz);

        const rock = new THREE.Mesh(rockGeo, rockMat);
        const s = 0.8 + Math.random() * 1.6;
        rock.scale.set(s, s * (0.8 + Math.random() * 0.6), s);
        rock.position.set(rx, ry + s * 1.1, rz);
        rock.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
        worldGroup.add(rock);
    }
}

// ----------------------------------------------------------
// 12. KIRISH MUMKIN BO'LGAN UYLAR VA ICHIDAGI AVTOMATLAR (LOOT)
// ----------------------------------------------------------
function buildMilitaryHouses() {
    const houseConfigs = [
        { x: -45, z: 20, rot: 0.1, weaponType: 'ak47', title: "AK-47 Kalashnikovni olish 💥 (+60 O'q)" },
        { x: 80, z: -35, rot: -0.4, weaponType: 'sniper', title: "AWM Snayper Vintovkasini olish 🔭 (+25 O'q)" },
        { x: -95, z: -70, rot: 0.8, weaponType: 'shotgun', title: "Shotgun Drobovikni olish ⚡ (+32 Patron)" },
        { x: 55, z: 90, rot: -0.2, weaponType: 'medkit', title: "Katta Harbiy Aptechka (+2 ❤️ Jon, +120 O'q) 💊" }
    ];

    const wallMat = new THREE.MeshStandardMaterial({ color: 0xd7ccc8, roughness: 0.85 });
    const woodPlankTex = getTexture('wood_planks');
    woodPlankTex.repeat.set(3, 3);
    const floorMat = new THREE.MeshStandardMaterial({ map: woodPlankTex, roughness: 0.75 });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0xb71c1c, roughness: 0.65 });
    const trimMat = new THREE.MeshStandardMaterial({ color: 0x4e342e, roughness: 0.8 });
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.7 });

    houseConfigs.forEach((cfg) => {
        const baseY = getTerrainHeight(cfg.x, cfg.z);
        const houseGroup = new THREE.Group();
        houseGroup.position.set(cfg.x, baseY, cfg.z);
        houseGroup.rotation.y = cfg.rot;

        const w = 9.0;
        const d = 11.0;
        const h = 3.8;

        // 1. Pol (Floor)
        const floor = new THREE.Mesh(new THREE.BoxGeometry(w, 0.25, d), floorMat);
        floor.position.y = 0.12;
        floor.receiveShadow = true;
        houseGroup.add(floor);

        // 2. Chap va O'ng devorlar (Left & Right Walls)
        const wallL = new THREE.Mesh(new THREE.BoxGeometry(0.35, h, d), wallMat);
        wallL.position.set(-w / 2 + 0.175, h / 2, 0);
        wallL.castShadow = true;
        houseGroup.add(wallL);

        const wallR = new THREE.Mesh(new THREE.BoxGeometry(0.35, h, d), wallMat);
        wallR.position.set(w / 2 - 0.175, h / 2, 0);
        wallR.castShadow = true;
        houseGroup.add(wallR);

        // 3. Orqa devor (Back Wall)
        const wallBack = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.35), wallMat);
        wallBack.position.set(0, h / 2, -d / 2 + 0.175);
        wallBack.castShadow = true;
        houseGroup.add(wallBack);

        // 4. Old devor (Keng eshik ochig'i bilan - 2.4 metrli ochiq kirish eshigi)
        const frontWallW = (w - 2.4) / 2;
        const wallFrontL = new THREE.Mesh(new THREE.BoxGeometry(frontWallW, h, 0.35), wallMat);
        wallFrontL.position.set(-w / 2 + frontWallW / 2, h / 2, d / 2 - 0.175);
        houseGroup.add(wallFrontL);

        const wallFrontR = new THREE.Mesh(new THREE.BoxGeometry(frontWallW, h, 0.35), wallMat);
        wallFrontR.position.set(w / 2 - frontWallW / 2, h / 2, d / 2 - 0.175);
        houseGroup.add(wallFrontR);

        // Eshik usti peshtoqi (Door Lintel)
        const lintel = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.9, 0.35), wallMat);
        lintel.position.set(0, h - 0.45, d / 2 - 0.175);
        houseGroup.add(lintel);

        // Eshik ramkasi bezaklari
        const doorFrameL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.0, 0.4), trimMat);
        doorFrameL.position.set(-1.2, 1.5, d / 2 - 0.175);
        houseGroup.add(doorFrameL);

        const doorFrameR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.0, 0.4), trimMat);
        doorFrameR.position.set(1.2, 1.5, d / 2 - 0.175);
        houseGroup.add(doorFrameR);

        // 5. Uy tomi (Gabled Roof)
        const roofGeo = new THREE.ConeGeometry(w * 0.75, 2.2, 4);
        const roof = new THREE.Mesh(roofGeo, roofMat);
        roof.position.set(0, h + 1.1, 0);
        roof.rotation.y = Math.PI / 4;
        roof.scale.set(1.0, 1.0, d / w);
        roof.castShadow = true;
        houseGroup.add(roof);

        // 6. Ichki yorug'lik fonusi (Interior Lantern)
        const interiorLight = new THREE.PointLight(0xffb74d, 2.2, 15);
        interiorLight.position.set(0, h - 0.6, 0);
        houseGroup.add(interiorLight);

        const lampMesh = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.3), new THREE.MeshBasicMaterial({ color: 0xffd54f }));
        lampMesh.position.set(0, h - 0.6, 0);
        houseGroup.add(lampMesh);

        // 7. Ichki Stol / Qurol stendi (Weapon Workbench)
        const table = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.85, 1.1), tableMat);
        table.position.set(0, 0.42, -1.8);
        table.castShadow = true;
        houseGroup.add(table);

        // 8. Stolda turgan Qurol / Aptechka (Loot Pickup)
        const lootGroup = new THREE.Group();
        const lootY = 1.15;
        lootGroup.position.set(0, lootY, -1.8);

        let lootGlowColor = 0xffea00;
        if (cfg.weaponType === 'ak47') {
            lootGlowColor = 0xff9100;
            // 3D AK-47 maketi
            const gunRec = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.14, 0.5), new THREE.MeshStandardMaterial({ color: 0x212121, metalness: 0.8 }));
            lootGroup.add(gunRec);
            const gunStock = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.35), new THREE.MeshStandardMaterial({ color: 0x8d4925 }));
            gunStock.position.set(0, -0.04, -0.38);
            lootGroup.add(gunStock);
            const gunBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.65, 8), new THREE.MeshStandardMaterial({ color: 0x111111 }));
            gunBarrel.rotation.x = Math.PI / 2;
            gunBarrel.position.set(0, 0.02, 0.52);
            lootGroup.add(gunBarrel);
            const gunMag = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.3, 0.12), new THREE.MeshStandardMaterial({ color: 0x212121 }));
            gunMag.position.set(0, -0.18, 0.12);
            gunMag.rotation.x = -0.25;
            lootGroup.add(gunMag);
        } else if (cfg.weaponType === 'sniper') {
            lootGlowColor = 0x00e5ff;
            // 3D AWM Snayper maketi
            const snBody = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.16, 0.85), new THREE.MeshStandardMaterial({ color: 0x2e4a2e, roughness: 0.6 }));
            lootGroup.add(snBody);
            const snBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.03, 0.95, 8), new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9 }));
            snBarrel.rotation.x = Math.PI / 2;
            snBarrel.position.set(0, 0.03, 0.85);
            lootGroup.add(snBarrel);
            const snScope = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.42, 8), new THREE.MeshStandardMaterial({ color: 0x1a1a1a }));
            snScope.rotation.x = Math.PI / 2;
            snScope.position.set(0, 0.14, 0.05);
            lootGroup.add(snScope);
        } else if (cfg.weaponType === 'shotgun') {
            lootGlowColor = 0xff3d00;
            // 3D Shotgun maketi
            const sgBody = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.16, 0.45), new THREE.MeshStandardMaterial({ color: 0x263238, metalness: 0.8 }));
            lootGroup.add(sgBody);
            const sgStock = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.38), new THREE.MeshStandardMaterial({ color: 0x5d4037 }));
            sgStock.position.set(0, -0.06, -0.38);
            lootGroup.add(sgStock);
            const sgBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.72, 8), new THREE.MeshStandardMaterial({ color: 0x1b1b1b }));
            sgBarrel.rotation.x = Math.PI / 2;
            sgBarrel.position.set(0, 0.02, 0.52);
            lootGroup.add(sgBarrel);
        } else {
            lootGlowColor = 0x00e676;
            // Katta Aptechka qutisi
            const medBox = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.45, 0.45), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 }));
            lootGroup.add(medBox);
            const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.12, 0.46), new THREE.MeshBasicMaterial({ color: 0xd50000 }));
            lootGroup.add(crossH);
            const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.35, 0.46), new THREE.MeshBasicMaterial({ color: 0xd50000 }));
            lootGroup.add(crossV);
        }

        const lootLight = new THREE.PointLight(lootGlowColor, 2.5, 6);
        lootLight.position.set(0, 0.3, 0);
        lootGroup.add(lootLight);

        houseGroup.add(lootGroup);
        worldGroup.add(houseGroup);

        const worldLootPos = new THREE.Vector3(0, lootY, -1.8)
            .applyAxisAngle(new THREE.Vector3(0, 1, 0), cfg.rot)
            .add(new THREE.Vector3(cfg.x, baseY, cfg.z));

        houseLootPickups.push({
            weaponType: cfg.weaponType,
            title: cfg.title,
            mesh: lootGroup,
            light: lootLight,
            houseGroup: houseGroup,
            position: worldLootPos,
            baseY: lootY,
            looted: false
        });

        militaryHouses.push({
            x: cfg.x,
            z: cfg.z,
            baseY: baseY,
            floorY: baseY + 0.15,
            halfW: w / 2,
            halfD: d / 2
        });
    });
}

function lootHouseItem(item) {
    if (item.looted) return;
    item.looted = true;

    item.mesh.visible = false;
    if (item.light) item.light.visible = false;
    playChestOpenSound();
    playCoinSound();

    if (item.weaponType === 'ak47') {
        unlockedWeapons.ak47 = true;
        ak47Reserve += 60;
        if (slotAK47Elem) {
            slotAK47Elem.classList.remove('locked');
            if (nameSlotAK47) nameSlotAK47.innerText = "💥 AK-47";
        }
        selectWeapon('ak47');
        showNotification("Yangi qurol olindi! AK-47 Kalashnikov faollashdi! [3] bilan tanlang 💥");
    } else if (item.weaponType === 'sniper') {
        unlockedWeapons.sniper = true;
        sniperReserve += 25;
        if (slotSniperElem) {
            slotSniperElem.classList.remove('locked');
            if (nameSlotSniper) nameSlotSniper.innerText = "🔭 AWM Snayper";
        }
        selectWeapon('sniper');
        showNotification("Yangi qurol olindi! AWM Snayper Vintovkasi faollashdi! [4] bilan tanlang 🔭");
    } else if (item.weaponType === 'shotgun') {
        unlockedWeapons.shotgun = true;
        shotgunReserve += 32;
        if (slotShotgunElem) {
            slotShotgunElem.classList.remove('locked');
            if (nameSlotShotgun) nameSlotShotgun.innerText = "⚡ Shotgun";
        }
        selectWeapon('shotgun');
        showNotification("Yangi qurol olindi! Shotgun Drobovik faollashdi! [5] bilan tanlang ⚡");
    } else if (item.weaponType === 'medkit') {
        playerHealth = Math.min(maxHealth, playerHealth + 2);
        rifleReserve += 60;
        ak47Reserve += 60;
        updateHUD();
        showNotification("Katta Harbiy Aptechka olindi! (+2 ❤️ Jon, +120 Zaxira O'q) 💊✅");
    }
}

// ----------------------------------------------------------
// 13. UCHISH MUMKIN BO'LGAN HARBIY SAMALYOT (PILOTABLE AIRPLANE)
// ----------------------------------------------------------
function buildFlyableAirplane(rx, rz) {
    const ry = getTerrainHeight(rx, rz);

    // 1. Uchish-qo'nish yo'lagi (Runway Airstrip)
    const runwayGeo = new THREE.PlaneGeometry(16, 95);
    const runwayMat = new THREE.MeshStandardMaterial({ color: 0x21272e, roughness: 0.9 });
    const runway = new THREE.Mesh(runwayGeo, runwayMat);
    runway.rotation.x = -Math.PI / 2;
    runway.position.set(rx, ry + 0.06, rz);
    runway.receiveShadow = true;
    worldGroup.add(runway);

    // Yo'lak oq chiziqlari (Centerline stripes)
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (let sz = -40; sz <= 40; sz += 10) {
        const stripe = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 5.0), stripeMat);
        stripe.rotation.x = -Math.PI / 2;
        stripe.position.set(rx, ry + 0.08, rz + sz);
        worldGroup.add(stripe);
    }

    // 2. Uchuvchi Samalyot 3D Modeli
    pilotPlaneVehicle = new THREE.Group();
    pilotPlaneVehicle.position.set(rx, ry + 1.25, rz - 25);

    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x0277bd, roughness: 0.4, metalness: 0.6 });
    const wingMat = new THREE.MeshStandardMaterial({ color: 0xe0e0e0, roughness: 0.5, metalness: 0.3 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x0d47a1, roughness: 0.1, metalness: 0.9 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x212121, roughness: 0.8 });
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x1b1b1b, roughness: 0.95 });

    // Fuselyaj (Main Aircraft Fuselage)
    const fuselage = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.15, 10.5, 12), bodyMat);
    fuselage.rotation.x = Math.PI / 2;
    fuselage.castShadow = true;
    pilotPlaneVehicle.add(fuselage);

    // Burun konusi (Nose Cone)
    const nose = new THREE.Mesh(new THREE.ConeGeometry(1.05, 2.6, 12), bodyMat);
    nose.rotation.x = -Math.PI / 2;
    nose.position.z = 6.4;
    pilotPlaneVehicle.add(nose);

    // Kabina oynasi (Cockpit Canopy)
    const cockpit = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.85, 2.8), glassMat);
    cockpit.position.set(0, 0.95, 3.2);
    pilotPlaneVehicle.add(cockpit);

    // Katta Qanotlar (Main Wings)
    const wing = new THREE.Mesh(new THREE.BoxGeometry(15.2, 0.22, 2.4), wingMat);
    wing.position.set(0, 0.35, 1.2);
    wing.castShadow = true;
    pilotPlaneVehicle.add(wing);

    // Qanot chiroqlari (Wingtip Navigation Lights)
    const lightL = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), new THREE.MeshBasicMaterial({ color: 0xff1744 }));
    lightL.position.set(-7.6, 0.35, 1.2);
    pilotPlaneVehicle.add(lightL);

    const lightR = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), new THREE.MeshBasicMaterial({ color: 0x00e676 }));
    lightR.position.set(7.6, 0.35, 1.2);
    pilotPlaneVehicle.add(lightR);

    // Qanotdagi pulemyotlar (Wing-mounted Cannons)
    [-4.5, 4.5].forEach(wx => {
        const cannon = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 1.5, 8), darkMat);
        cannon.rotation.x = Math.PI / 2;
        cannon.position.set(wx, 0.15, 2.0);
        pilotPlaneVehicle.add(cannon);
    });

    // Dum qismi (Tail Fin & Elevators)
    const tailFin = new THREE.Mesh(new THREE.BoxGeometry(0.22, 2.6, 2.2), bodyMat);
    tailFin.position.set(0, 1.9, -4.8);
    pilotPlaneVehicle.add(tailFin);

    const tailWings = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.16, 1.5), wingMat);
    tailWings.position.set(0, 1.2, -4.9);
    pilotPlaneVehicle.add(tailWings);

    // Dvigatellar va Aylanuvchi Propellerlar
    pilotPlaneVehicle.props = [];
    [-4.2, 4.2].forEach(wx => {
        const nacelle = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 2.6, 8), bodyMat);
        nacelle.rotation.x = Math.PI / 2;
        nacelle.position.set(wx, 0.1, 1.8);
        pilotPlaneVehicle.add(nacelle);

        const prop = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.18, 0.06), darkMat);
        prop.position.set(wx, 0.1, 3.2);
        pilotPlaneVehicle.add(prop);
        pilotPlaneVehicle.props.push(prop);
    });

    // G'ildiraklar (3-Point Landing Gear)
    pilotPlaneVehicle.wheels = [];
    const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.22, 12);
    [
        { x: 0, y: -0.9, z: 4.5 },
        { x: -2.8, y: -0.9, z: 0.2 },
        { x: 2.8, y: -0.9, z: 0.2 }
    ].forEach(wPos => {
        const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.9, 6), darkMat);
        strut.position.set(wPos.x, wPos.y + 0.45, wPos.z);
        pilotPlaneVehicle.add(strut);

        const wheel = new THREE.Mesh(wheelGeo, tireMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(wPos.x, wPos.y, wPos.z);
        wheel.castShadow = true;
        pilotPlaneVehicle.add(wheel);
        pilotPlaneVehicle.wheels.push(wheel);
    });

    pilotPlaneVehicle.airspeed = 0;
    pilotPlaneVehicle.angle = 0; // Uchish yo'lagi bo'ylab
    pilotPlaneVehicle.pitch = 0;
    pilotPlaneVehicle.roll = 0;
    pilotPlaneVehicle.vehicleType = 'plane';

    worldGroup.add(pilotPlaneVehicle);
}

function updatePilotAirplane(delta) {
    const p = pilotPlaneVehicle;
    if (!p) return;

    const maxSpeed = 74.0;
    const accel = 28.0;

    let throttle = 0;
    if (keysDown['KeyW'] || keysDown['ArrowUp']) throttle += 1;
    if (keysDown['KeyS'] || keysDown['ArrowDown']) throttle -= 0.8;

    let steer = 0;
    if (keysDown['KeyA'] || keysDown['ArrowLeft']) steer += 1;
    if (keysDown['KeyD'] || keysDown['ArrowRight']) steer -= 1;

    let pitchInput = 0;
    if (keysDown['Space']) pitchInput += 1; // Ko'tarilish (Pitch Up)
    if (keysDown['ShiftLeft'] || keysDown['ShiftRight']) pitchInput -= 1; // Pastga sho'ng'ish (Pitch Down)

    // Dvigatel gazini boshqarish
    if (throttle > 0 && buggyFuel > 0) {
        p.airspeed = Math.min(maxSpeed, (p.airspeed || 0) + accel * delta);
        buggyFuel = Math.max(0, buggyFuel - delta * 1.5);
        if (Math.random() < 0.22) playAirplaneFlySound();
    } else if (throttle < 0) {
        p.airspeed = Math.max(0, (p.airspeed || 0) - accel * 1.6 * delta);
    } else {
        p.airspeed = Math.max(0, (p.airspeed || 0) * 0.985);
    }

    // Propellerlar aylanishi
    if (p.props) {
        p.props.forEach(prop => {
            prop.rotation.z += (p.airspeed + 15) * delta * 2.8;
        });
    }

    const groundY = getTerrainHeight(p.position.x, p.position.z) + 1.25;
    const isAirborne = (p.position.y > groundY + 0.35);

    if (isAirborne) {
        // Havoda burilish va banking roll (qiyalanish)
        p.angle = (p.angle || 0) + steer * 1.8 * delta;
        const targetRoll = steer * -0.52;
        p.roll = (p.roll || 0) + (targetRoll - (p.roll || 0)) * 6.5 * delta;

        // Pitch balandlik burchagi
        p.pitch = (p.pitch || 0) + pitchInput * 1.3 * delta;
        p.pitch = Math.max(-0.65, Math.min(0.75, p.pitch));

        // Stall effekti (Tezlik yetarli bo'lmasa balandlik yo'qotiladi)
        if (p.airspeed < 16) {
            p.pitch -= 0.35 * delta;
        }
    } else {
        // Yerda yurish
        p.pitch = 0;
        p.roll = 0;
        if (Math.abs(p.airspeed) > 1.0) {
            p.angle = (p.angle || 0) + steer * 1.6 * delta;
        }

        // Uchishga havoga ko'tarilish (Takeoff)
        if (p.airspeed > 18 && pitchInput > 0) {
            p.pitch = 0.35;
            p.position.y += 2.2 * delta;
        }
    }

    // Harakat vektori
    const cosPitch = Math.cos(p.pitch);
    const moveX = Math.sin(p.angle) * cosPitch * p.airspeed * delta;
    const moveZ = Math.cos(p.angle) * cosPitch * p.airspeed * delta;
    const moveY = Math.sin(p.pitch) * p.airspeed * delta;

    p.position.x += moveX;
    p.position.z += moveZ;
    p.position.y += moveY;

    // Yerga qo'nish
    if (p.position.y <= groundY) {
        p.position.y = groundY;
        p.pitch = 0;
        p.roll = 0;
    }

    p.rotation.set(p.pitch, p.angle + Math.PI, p.roll, 'YXZ');

    // G'ildiraklar aylanishi
    if (p.wheels) {
        p.wheels.forEach(w => w.rotation.x += p.airspeed * delta * 2.2);
    }

    // Orol chegarasi
    const distFromCenter = Math.hypot(p.position.x, p.position.z);
    if (distFromCenter > islandRadius + 35) {
        p.angle += Math.PI;
    }

    // Kamera samalyot ortidan ergashishi
    const camDist = 9.8;
    const camHeight = 3.8;
    camera.position.set(
        p.position.x - Math.sin(p.angle) * (-camDist),
        p.position.y + camHeight,
        p.position.z - Math.cos(p.angle) * (-camDist)
    );
    cameraYaw = p.angle + Math.PI;
    const euler = new THREE.Euler(cameraPitch * 0.4 + p.pitch * 0.4, cameraYaw, p.roll * 0.4, 'YXZ');
    camera.quaternion.setFromEuler(euler);

    // Havodan o't ochish (Sichqoncha bosib turilganda pulemyotlardan zarba)
    if (isFiringRifle) {
        triggerAirplaneCannons();
    }

    // Parvoz HUD
    if (flightHudBox) flightHudBox.classList.remove('hidden');
    if (flightAltElem) flightAltElem.innerText = `${Math.round(p.position.y)}m`;
    if (flightSpeedElem) flightSpeedElem.innerText = `${Math.round(p.airspeed * 3.6)} km/h`;

    // Pastdagi dushmanlarni bosib ketish
    if (p.airspeed > 12) {
        enemies.forEach(enemy => {
            if (!enemy.alive) return;
            if (p.position.distanceTo(enemy.group.position) < 4.8) {
                damageEnemy(enemy, 3, new THREE.Vector3(moveX, 0, moveZ).normalize());
                playCarRamSound();
            }
        });
    }

    updateHUD();
}

function ejectFromAirplane() {
    if (!pilotPlaneVehicle) return;
    const p = pilotPlaneVehicle;
    isDriving = false;
    drivingVehicleType = null;
    if (playerGroup) playerGroup.visible = true;

    const groundY = getTerrainHeight(p.position.x, p.position.z);
    if (p.position.y > groundY + 7.0) {
        // Balandlikda samalyotdan parashyut bilan sakrash!
        isGliding = true;
        playerPos.copy(p.position);
        playerVelocity.set(Math.sin(p.angle) * 8, -2.5, Math.cos(p.angle) * 8);
        if (playerParachute) playerParachute.visible = true;
        showNotification("Parashyut ochildi! [W,A,S,D] Boshqarish 🪂🏝️");
    } else {
        playerPos.set(p.position.x - 3.5, groundY, p.position.z);
    }

    if (flightHudBox) flightHudBox.classList.add('hidden');
    updateHUD();
}

function updateGliding(delta) {
    const forward = new THREE.Vector3(-Math.sin(cameraYaw), 0, -Math.cos(cameraYaw));
    const right = new THREE.Vector3(Math.cos(cameraYaw), 0, -Math.sin(cameraYaw));

    let inputForward = 0;
    let inputRight = 0;
    if (keysDown['KeyW'] || keysDown['ArrowUp']) inputForward += 1;
    if (keysDown['KeyS'] || keysDown['ArrowDown']) inputForward -= 1;
    if (keysDown['KeyD'] || keysDown['ArrowRight']) inputRight += 1;
    if (keysDown['KeyA'] || keysDown['ArrowLeft']) inputRight -= 1;

    const glideSpeed = 16.0;
    const moveDir = new THREE.Vector3()
        .addScaledVector(forward, inputForward)
        .addScaledVector(right, inputRight)
        .normalize();

    playerPos.x += moveDir.x * glideSpeed * delta;
    playerPos.z += moveDir.z * glideSpeed * delta;
    playerPos.y -= 4.2 * delta; // Yumshoq tushish

    const groundY = getTerrainHeight(playerPos.x, playerPos.z);
    if (playerPos.y <= groundY + 0.1) {
        playerPos.y = groundY;
        isGliding = false;
        if (playerParachute) playerParachute.visible = false;
        playFootstepSound('sand');
        showNotification("Parashyut bilan orolga xavfsiz qo'ndingiz! 🪂✅");
    }

    if (playerGroup) {
        playerGroup.position.set(playerPos.x, playerPos.y, playerPos.z);
        playerGroup.rotation.y = cameraYaw + Math.PI;
    }

    const camX = playerPos.x - Math.sin(cameraYaw) * (-3.2);
    const camZ = playerPos.z - Math.cos(cameraYaw) * (-3.2);
    const camY = playerPos.y + 2.5;
    camera.position.set(camX, camY, camZ);
    const euler = new THREE.Euler(cameraPitch * 0.5, cameraYaw, 0, 'YXZ');
    camera.quaternion.setFromEuler(euler);
}

// ----------------------------------------------------------
// 12. BOSHQARUV TIZIMI VA POINTER LOCK
// ----------------------------------------------------------
const keysDown = {};
let cameraYaw = Math.PI;
let cameraPitch = 0.15;
const playerPos = new THREE.Vector3(0, 0.0, 50);
const playerVelocity = new THREE.Vector3();
let isGrounded = true;
let runCycle = 0;

function setupControls() {
    canvasContainer.addEventListener('click', () => {
        if (!isPointerLocked && gameRunning) {
            canvasContainer.requestPointerLock();
        }
    });

    document.addEventListener('pointerlockchange', () => {
        isPointerLocked = (document.pointerLockElement === canvasContainer);
        if (lockPrompt) {
            if (isPointerLocked || !gameRunning) lockPrompt.classList.add('hidden');
            else lockPrompt.classList.remove('hidden');
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!isPointerLocked || !gameRunning) return;
        const sensitivity = 0.0022;
        cameraYaw -= e.movementX * sensitivity;
        cameraPitch -= e.movementY * sensitivity;
        cameraPitch = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, cameraPitch));
    });

    document.addEventListener('mousedown', (e) => {
        if (!isPointerLocked || !gameRunning) return;
        if (e.button === 0) {
            if (isDriving && drivingVehicleType === 'plane') {
                isFiringRifle = true;
                triggerAirplaneCannons();
            } else if (activeWeapon === 'sword') {
                triggerSwordAttack();
            } else if (activeWeapon === 'stick') {
                throwStick();
            } else {
                isFiringRifle = true;
                triggerRifleShot();
            }
        } else if (e.button === 2) {
            e.preventDefault();
            throwStick();
        }
    });

    document.addEventListener('mouseup', (e) => {
        if (e.button === 0) {
            isFiringRifle = false;
        }
    });

    canvasContainer.addEventListener('contextmenu', e => e.preventDefault());

    // Klaviatura tugmalari
    window.addEventListener('keydown', (e) => {
        // Savollar modali ochiq bo'lganda 1, 2, 3, 4 orqali javob berish
        if (isQuizActive) {
            if (e.code === 'Digit1' || e.code === 'Numpad1') { handleQuizAnswer(0); return; }
            if (e.code === 'Digit2' || e.code === 'Numpad2') { handleQuizAnswer(1); return; }
            if (e.code === 'Digit3' || e.code === 'Numpad3') { handleQuizAnswer(2); return; }
            if (e.code === 'Digit4' || e.code === 'Numpad4') { handleQuizAnswer(3); return; }
            return;
        }

        keysDown[e.code] = true;

        // Qurollar tanlash: 1, 2, 3, 4, 5, 6
        if (e.code === 'Digit1') selectWeapon('sword');
        if (e.code === 'Digit2') selectWeapon('rifle');
        if (e.code === 'Digit3') selectWeapon('ak47');
        if (e.code === 'Digit4') selectWeapon('sniper');
        if (e.code === 'Digit5') selectWeapon('shotgun');
        if (e.code === 'Digit6') selectWeapon('stick');

        // R: Avtomatni o'qlash
        if (e.code === 'KeyR') reloadRifle();

        // E TUGMASI: Minish, Tushish, Airdrop ochish, Uylardan qurol olish, Sandiq ochish
        if (e.code === 'KeyE') {
            if (isDriving) {
                exitVehicle();
            } else {
                let handled = false;

                // 1. Uylardagi qurollar va aptechkalarni olish (House Loot)
                for (const loot of houseLootPickups) {
                    if (!loot.looted && playerPos.distanceTo(loot.position) < 2.8) {
                        lootHouseItem(loot);
                        handled = true;
                        break;
                    }
                }

                // 2. Uchuvchi Samalyotga o'tirish (Flyable Airplane)
                if (!handled && pilotPlaneVehicle && playerPos.distanceTo(pilotPlaneVehicle.position) < 4.8) {
                    enterVehicle('plane');
                    handled = true;
                }

                // 3. Tracker SUV minish
                if (!handled && trackerVehicle && playerPos.distanceTo(trackerVehicle.position) < 3.8) {
                    enterVehicle('tracker');
                    handled = true;
                }
                // 4. Mototsikl minish
                else if (!handled && motoVehicle && playerPos.distanceTo(motoVehicle.position) < 3.4) {
                    enterVehicle('moto');
                    handled = true;
                }
                // 5. Airdrop qutisini ochish
                else if (!handled) {
                    for (const crate of airdropCrates) {
                        if (!crate.looted && playerPos.distanceTo(crate.group.position) < 4.2) {
                            lootAirdrop(crate);
                            handled = true;
                            break;
                        }
                    }
                }

                // 6. Xazina sandig'ini ochish
                if (!handled && chestObject && !chestUnlocked && playerPos.distanceTo(chestObject.position) < 3.8) {
                    tryOpenChest();
                    handled = true;
                }

                // Agar hech narsa bo'lmasa va cho'pak quroli bo'lsa otish
                if (!handled && activeWeapon === 'stick') {
                    throwStick();
                }
            }
        }

        if (e.code === 'KeyQ') throwStick();
        if (e.code === 'KeyF') {
            if (!isDriving && ((trackerVehicle && playerPos.distanceTo(trackerVehicle.position) < 4.5) ||
                              (motoVehicle && playerPos.distanceTo(motoVehicle.position) < 4.5))) {
                refuelVehicle();
            }
        }
        if (e.code === 'KeyH' && isDriving) playCarHornSound();
        if (e.code === 'KeyM') toggleSound();
    });

    window.addEventListener('keyup', (e) => {
        keysDown[e.code] = false;
    });

    if (soundToggleBtn) soundToggleBtn.addEventListener('click', toggleSound);
    if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);

    if (startBtn) startBtn.addEventListener('click', startGame);
    if (nextLevelBtn) nextLevelBtn.addEventListener('click', goToNextLevel);
    if (winRestartBtn) winRestartBtn.addEventListener('click', restartFromBeginning);
    if (gameOverRestartBtn) gameOverRestartBtn.addEventListener('click', restartFromBeginning);
    if (quizGiveUpBtn) quizGiveUpBtn.addEventListener('click', () => handleQuizAnswer(-2));
}

function enterVehicle(type) {
    if (buggyFuel <= 0) {
        showNotification("Yoqilg'i tugagan! [F] to'ldiring (5 tanga)");
        return;
    }
    isDriving = true;
    drivingVehicleType = type;
    if (playerGroup) playerGroup.visible = false;

    if (vehicleLabelElem) {
        vehicleLabelElem.innerText = type === 'tracker' ? 'Tracker SUV:' : type === 'moto' ? 'Mototsikl:' : 'Samalyot:';
    }
    updateHUD();

    if (type === 'plane') {
        showNotification("Harbiy Samalyotga o'tirdingiz! [W] Tezlanish, [Space] Ko'tarilish, [A/D] Burilish, [LKM] O't ochish, [E] Parashyutda sakrash ✈️🔥");
    } else if (type === 'tracker') {
        showNotification("Chevrolet Tracker SUV minildi! [W,A,S,D] Haydash, [E] Tushish, [H] Signal 🚙");
    } else {
        showNotification("Tezkor Mototsikl minildi! [W,A,S,D] Tezlik, [E] Tushish, [H] Signal 🏍️");
    }
}

function exitVehicle() {
    if (drivingVehicleType === 'plane') {
        ejectFromAirplane();
        return;
    }
    isDriving = false;
    const v = (drivingVehicleType === 'moto') ? motoVehicle : trackerVehicle;
    if (playerGroup) playerGroup.visible = true;
    if (v) {
        playerPos.set(v.position.x - 2.5, getTerrainHeight(v.position.x - 2.5, v.position.z), v.position.z);
    }
    drivingVehicleType = null;
    if (flightHudBox) flightHudBox.classList.add('hidden');
    updateHUD();
}

function refuelVehicle() {
    if (totalCoins < 5) {
        showNotification("Yoqilg'i uchun 5 ta tanga kerak! 🪙");
        return;
    }
    if (buggyFuel >= 100) {
        showNotification("Baki to'la! ⛽");
        return;
    }
    totalCoins -= 5;
    buggyFuel = 100;
    playCoinSound();
    updateHUD();
    showNotification("Yoqilg'i baki to'liq to'ldirildi! ⛽ +100%");
}

function collectKey(keyGroup, index) {
    worldGroup.remove(keyGroup);
    collectibleKeys.splice(index, 1);
    collectedKeys++;
    playKeySound();
    updateHUD();
    showNotification(`Oltin kalit topildi! (${collectedKeys} / ${totalKeysNeeded}) 🔑`);
}

function tryOpenChest() {
    if (collectedKeys < totalKeysNeeded) {
        showNotification(`Xazinani ochish uchun barcha 3 ta kalit kerak! (${collectedKeys}/3) 🔑`);
        return;
    }
    chestUnlocked = true;
    playChestOpenSound();
    const startRot = chestLidMesh.rotation.x;
    const targetRot = -Math.PI / 1.8;
    const startTime = performance.now();
    function animateLid() {
        const elapsed = (performance.now() - startTime) / 600;
        if (elapsed < 1) {
            chestLidMesh.rotation.x = startRot + (targetRot - startRot) * elapsed;
            requestAnimationFrame(animateLid);
        } else {
            chestLidMesh.rotation.x = targetRot;
            setTimeout(completeLevel, 700);
        }
    }
    animateLid();
}

// ----------------------------------------------------------
// 13. QAHRAMON HARAKATI, DARAXTGA CHIQISH VA CHO'PAK YIG'ISH
// ----------------------------------------------------------
function updatePlayer(delta) {
    if (isGliding) {
        updateGliding(delta);
        return;
    }

    if (isDriving) {
        updateVehicleDriving(delta);
        return;
    }

    // Avtomatdan uzluksiz o'q uzish (Mouse tugmasi bosib turilganda M416 yoki AK-47)
    if (isFiringRifle && (activeWeapon === 'rifle' || activeWeapon === 'ak47')) {
        triggerRifleShot();
    }

    const forward = new THREE.Vector3(-Math.sin(cameraYaw), 0, -Math.cos(cameraYaw));
    const right = new THREE.Vector3(Math.cos(cameraYaw), 0, -Math.sin(cameraYaw));

    let inputForward = 0;
    let inputRight = 0;

    if (keysDown['KeyW'] || keysDown['ArrowUp']) inputForward += 1;
    if (keysDown['KeyS'] || keysDown['ArrowDown']) inputForward -= 1;
    if (keysDown['KeyD'] || keysDown['ArrowRight']) inputRight += 1;
    if (keysDown['KeyA'] || keysDown['ArrowLeft']) inputRight -= 1;

    const isSprinting = keysDown['ShiftLeft'] || keysDown['ShiftRight'];
    const baseSpeed = isSprinting ? 11.0 : 6.5;

    // YAQUIN DARAXTNI VA DARAXTGA CHIQISHNI TEKSHIRISH
    let nearTree = null;
    climbableTrees.forEach(t => {
        const dist = Math.hypot(playerPos.x - t.x, playerPos.z - t.z);
        if (dist < 2.5) nearTree = t;
    });

    // YAQUIN KUZATUV MINORASI VA ZINAPOYADAN CHIQISH
    let nearTower = null;
    watchtowers.forEach(tw => {
        const dist = Math.hypot(playerPos.x - tw.x, playerPos.z - tw.z);
        if (dist < 2.6) nearTower = tw;
    });

    if (nearTree) {
        if ((keysDown['Space'] || keysDown['KeyW']) && playerPos.y < nearTree.branchHeight) {
            playerVelocity.y = 7.0;
            isGrounded = false;
            currentClimbingTree = nearTree;
            playFootstepSound('wood');
        }
    } else if (nearTower) {
        const topY = nearTower.baseY + nearTower.height;
        if ((keysDown['Space'] || keysDown['KeyW']) && playerPos.y < topY) {
            playerVelocity.y = 7.5;
            isGrounded = false;
            playFootstepSound('stone');
        }
    }

    // TAXTADAN QURILGAN MAYDONCHADA TURGANLIKNI VA CHO'PAKLARNI TEKSHIRISH
    let onPlatformTree = null;
    for (let i = 0; i < climbableTrees.length; i++) {
        const t = climbableTrees[i];
        const distFromTrunk = Math.hypot(playerPos.x - t.x, playerPos.z - t.z);
        if (distFromTrunk <= 2.65 && playerPos.y >= t.branchHeight - 0.5) {
            onPlatformTree = t;
            break;
        }
    }

    // KUZATUV MINORASI MAYDONCHASIDA TURGANLIKNI TEKSHIRISH
    let onTowerDeck = null;
    for (let i = 0; i < watchtowers.length; i++) {
        const tw = watchtowers[i];
        const deckY = tw.baseY + tw.height;
        if (Math.hypot(playerPos.x - tw.x, playerPos.z - tw.z) <= 2.4 && playerPos.y >= deckY - 0.6) {
            onTowerDeck = tw;
            break;
        }
    }

    if (onTowerDeck && !onTowerDeck.looted) {
        onTowerDeck.looted = true;
        rifleReserve += 30;
        updateHUD();
        showNotification("Kuzatuv minorasidagi snayper o'qlari olindi! (+30 O'q) 🎯");
        playCoinSound();
    }

    let curTerrainY = getTerrainHeight(playerPos.x, playerPos.z);

    // Uylar ichida yurganda pol ustida mustahkam turish
    for (let i = 0; i < militaryHouses.length; i++) {
        const h = militaryHouses[i];
        if (Math.abs(playerPos.x - h.x) <= h.halfW && Math.abs(playerPos.z - h.z) <= h.halfD) {
            curTerrainY = Math.max(curTerrainY, h.floorY);
            break;
        }
    }

    if (onPlatformTree) {
        currentClimbingTree = onPlatformTree;
        if (!inTree) {
            inTree = true;
            stickCount++; // INVENTARGA CHO'PAK QO'SHILADI
            updateHUD();
            showNotification("Taxta maydonchaga chiqdingiz! +1 Cho'pak olindi (Inventarda: " + stickCount + " ta) 🪵🎯");
            playCoinSound();
        }

        // Maydonchada turganda har 3 soniyada yangi cho'pak yig'iladi
        treeGatherTimer += delta;
        if (treeGatherTimer >= 3.0) {
            treeGatherTimer = 0;
            stickCount++;
            updateHUD();
            showNotification("Maydonchadagi qutidan yangi cho'pak olindi! (+1 🎯, Jami: " + stickCount + " ta)");
            playToneSound(520, 'triangle', 0.1, 0.15);
        }

        if (playerPos.y <= onPlatformTree.branchHeight) {
            playerPos.y = onPlatformTree.branchHeight;
            playerVelocity.y = 0;
            isGrounded = true;
        }
    } else {
        if (playerPos.y <= curTerrainY + 0.3 || (inTree && playerPos.y < (currentClimbingTree ? currentClimbingTree.branchHeight - 0.5 : 8.0))) {
            inTree = false;
            currentClimbingTree = null;
            treeGatherTimer = 0;
        }
    }

    if (treeStatus) {
        if (inTree) treeStatus.classList.remove('hidden');
        else treeStatus.classList.add('hidden');
    }

    if (inputForward !== 0 || inputRight !== 0) {
        const moveDir = new THREE.Vector3()
            .addScaledVector(forward, inputForward)
            .addScaledVector(right, inputRight)
            .normalize();

        playerVelocity.x = moveDir.x * baseSpeed;
        playerVelocity.z = moveDir.z * baseSpeed;

        runCycle += delta * (isSprinting ? 14 : 9);
        if (isGrounded) {
            playFootstepSound(inTree || onTowerDeck ? 'wood' : currentLevel === 1 ? 'sand' : 'grass');
        }
    } else {
        playerVelocity.x *= 0.82;
        playerVelocity.z *= 0.82;
        runCycle = 0;
    }

    // Sakrash
    const canJump = isGrounded && (!nearTree && !nearTower || ((onPlatformTree || onTowerDeck) && playerPos.y >= (onPlatformTree ? onPlatformTree.branchHeight : onTowerDeck.baseY + onTowerDeck.height) - 0.1));
    if (keysDown['Space'] && canJump) {
        playerVelocity.y = 8.5;
        isGrounded = false;
        playJumpSound();
    }

    playerVelocity.y -= 22 * delta;

    playerPos.x += playerVelocity.x * delta;
    playerPos.y += playerVelocity.y * delta;
    playerPos.z += playerVelocity.z * delta;

    let groundLevel = curTerrainY;
    if (onPlatformTree) {
        groundLevel = onPlatformTree.branchHeight;
    } else if (onTowerDeck) {
        groundLevel = onTowerDeck.baseY + onTowerDeck.height;
    }

    if (playerPos.y <= groundLevel) {
        playerPos.y = groundLevel;
        playerVelocity.y = 0;
        isGrounded = true;
    }

    // 260m lik orol chegarasi
    const maxDist = islandRadius - 5;
    const curDist = Math.hypot(playerPos.x, playerPos.z);
    if (curDist > maxDist) {
        const a = Math.atan2(playerPos.z, playerPos.x);
        playerPos.x = Math.cos(a) * maxDist;
        playerPos.z = Math.sin(a) * maxDist;
    }

    if (playerGroup) {
        playerGroup.position.set(playerPos.x, playerPos.y, playerPos.z);
        playerGroup.rotation.y = cameraYaw + Math.PI;

        const legSwing = Math.sin(runCycle) * 0.55;
        if (playerLegL) playerLegL.rotation.x = legSwing;
        if (playerLegR) playerLegR.rotation.x = -legSwing;
        if (playerArmL) playerArmL.rotation.x = -legSwing * 0.8;

        if (isAttacking && playerArmR) {
            attackProgress += delta * 7.5;
            if (attackProgress <= 0.5) {
                playerArmR.rotation.x = -Math.PI / 2 - attackProgress * 1.5;
                if (slashTrail) slashTrail.material.opacity = attackProgress * 1.6;
            } else if (attackProgress <= 1.0) {
                playerArmR.rotation.x = -Math.PI / 2 - (1 - attackProgress) * 1.5;
                if (slashTrail) slashTrail.material.opacity = (1 - attackProgress) * 1.6;
            } else {
                isAttacking = false;
                playerArmR.rotation.x = 0;
                if (slashTrail) slashTrail.material.opacity = 0;
            }
        }
    }

    // YELKADAN KAMERA (QAHRAMONNING SHITI VA QILICHI ANIQLIK BILAN KO'RINADI)
    const camDistBack = 2.4;
    const camOffsetRight = 0.55;
    const camHeight = 1.95;

    const camX = playerPos.x - Math.sin(cameraYaw) * (-camDistBack) + Math.cos(cameraYaw) * camOffsetRight;
    const camZ = playerPos.z - Math.cos(cameraYaw) * (-camDistBack) - Math.sin(cameraYaw) * camOffsetRight;
    const camY = playerPos.y + camHeight;

    camera.position.set(camX, camY, camZ);

    const euler = new THREE.Euler(0, 0, 0, 'YXZ');
    euler.x = cameraPitch;
    euler.y = cameraYaw;
    camera.quaternion.setFromEuler(euler);

    checkHazardCollisions(playerPos.x, playerPos.z);
    checkCoinCollisions(playerPos.x, playerPos.z);
}

function updateVehicleDriving(delta) {
    if (drivingVehicleType === 'plane') {
        updatePilotAirplane(delta);
        return;
    }

    const v = (drivingVehicleType === 'moto') ? motoVehicle : trackerVehicle;
    if (!v) return;

    const isMoto = (drivingVehicleType === 'moto');
    const accel = isMoto ? 36.0 : 26.0;
    const maxSpeed = isMoto ? 42.0 : 30.0;
    const turnSpeed = isMoto ? 2.6 : 2.0;

    let throttle = 0;
    if (keysDown['KeyW'] || keysDown['ArrowUp']) throttle += 1;
    if (keysDown['KeyS'] || keysDown['ArrowDown']) throttle -= 0.6;

    let steer = 0;
    if (keysDown['KeyA'] || keysDown['ArrowLeft']) steer += 1;
    if (keysDown['KeyD'] || keysDown['ArrowRight']) steer -= 1;

    if (throttle !== 0 && buggyFuel > 0) {
        v.velocity = (v.velocity || 0) + throttle * accel * delta;
        buggyFuel = Math.max(0, buggyFuel - delta * (isMoto ? 1.6 : 2.2));
        if (isMoto && Math.random() < 0.22) playMotorcycleSound();
    } else {
        v.velocity = (v.velocity || 0) * 0.94;
    }

    v.velocity = Math.max(-10, Math.min(maxSpeed, v.velocity));

    if (Math.abs(v.velocity) > 0.4) {
        v.angle = (v.angle || 0) + steer * turnSpeed * delta * (v.velocity > 0 ? 1 : -1);
    }

    // Mototsikl burilganda yon tomonga qiyalanishi (Lean / Roll physics)
    if (isMoto) {
        const targetLean = steer * -0.38 * (Math.min(1, Math.abs(v.velocity) / 15));
        v.lean = (v.lean || 0) + (targetLean - (v.lean || 0)) * 9 * delta;
    }

    const moveX = Math.sin(v.angle) * v.velocity * delta;
    const moveZ = Math.cos(v.angle) * v.velocity * delta;
    v.position.x += moveX;
    v.position.z += moveZ;

    // Relyef balandligi va nishablikni moslashtirish (Terrain Height & Slope Pitch)
    const curY = getTerrainHeight(v.position.x, v.position.z);
    v.position.y = curY + (isMoto ? 0.48 : 0.62);

    const frontX = v.position.x + Math.sin(v.angle) * 1.5;
    const frontZ = v.position.z + Math.cos(v.angle) * 1.5;
    const backX = v.position.x - Math.sin(v.angle) * 1.5;
    const backZ = v.position.z - Math.cos(v.angle) * 1.5;
    const frontY = getTerrainHeight(frontX, frontZ);
    const backY = getTerrainHeight(backX, backZ);
    const pitch = Math.atan2(frontY - backY, 3.0);

    v.rotation.set(pitch, v.angle + Math.PI, isMoto ? v.lean : 0, 'YXZ');

    if (v.wheels) {
        v.wheels.forEach(w => w.rotation.x += v.velocity * delta * 2.2);
    }

    const dist = Math.hypot(v.position.x, v.position.z);
    if (dist > islandRadius - 8) {
        v.velocity = -v.velocity * 0.5;
    }

    // Kamera transport orqasidan ergashishi
    const camDist = isMoto ? 4.2 : 5.4;
    const camHeight = isMoto ? 2.2 : 2.8;
    camera.position.set(
        v.position.x - Math.sin(v.angle) * (-camDist),
        v.position.y + camHeight,
        v.position.z - Math.cos(v.angle) * (-camDist)
    );
    cameraYaw = v.angle + Math.PI;
    const euler = new THREE.Euler(cameraPitch * 0.5, cameraYaw, 0, 'YXZ');
    camera.quaternion.setFromEuler(euler);

    // Dushmanlarni bosib ketish (Car ramming)
    if (Math.abs(v.velocity) > 5.5) {
        enemies.forEach(enemy => {
            if (!enemy.alive) return;
            if (v.position.distanceTo(enemy.group.position) < (isMoto ? 2.4 : 3.4)) {
                damageEnemy(enemy, 3, new THREE.Vector3(moveX, 0, moveZ).normalize());
                playCarRamSound();
            }
        });
    }

    // Portlovchi bochkalarni urib yuborish
    explosiveBarrels.forEach(b => {
        if (!b.exploded && v.position.distanceTo(b.mesh.position) < 2.5) {
            explodeBarrel(b);
        }
    });

    checkHazardCollisions(v.position.x, v.position.z);
    checkCoinCollisions(v.position.x, v.position.z);
    updateHUD();
}

function updateCargoAirplane(delta) {
    if (!cargoAirplane) {
        airplaneTimer -= delta;
        if (airplaneTimer <= 0) {
            buildCargoAirplane();
            airplaneTimer = 45.0 + Math.random() * 20.0;
        }
        return;
    }

    // Samalyot tezligi va parvozi (G'arbdan Sharqqa)
    const flightSpeed = 62.0;
    cargoAirplane.position.x += flightSpeed * delta;

    // Propeller aylanishi
    if (cargoAirplane.props) {
        cargoAirplane.props.forEach(p => p.rotation.z += 25 * delta);
    }

    // Markazdan yoki o'yinchi yaqinidan o'tayotganda airdrop tashlash
    if (!cargoAirplane.hasDroppedAirdrop && cargoAirplane.position.x >= -30) {
        cargoAirplane.hasDroppedAirdrop = true;
        const dropX = cargoAirplane.position.x + (Math.random() - 0.5) * 40;
        const dropZ = cargoAirplane.position.z + (Math.random() - 0.5) * 40;
        dropAirdrop(dropX, dropZ);
    }

    // Orolni tark etganda o'chirish
    if (cargoAirplane.position.x > islandRadius + 180) {
        scene.remove(cargoAirplane);
        cargoAirplane = null;
        airplaneTimer = 50.0 + Math.random() * 20.0;
    }
}

function updateAirdrops(delta) {
    const time = clock.getElapsedTime();

    for (let i = airdropCrates.length - 1; i >= 0; i--) {
        const crate = airdropCrates[i];

        if (!crate.landed) {
            crate.group.position.y += crate.vy * delta;
            // Parashyut tebranishi
            if (crate.parachute) {
                crate.parachute.rotation.z = Math.sin(time * 2.5) * 0.08;
                crate.parachute.rotation.x = Math.cos(time * 2.0) * 0.06;
            }

            const groundY = getTerrainHeight(crate.x, crate.z);
            if (crate.group.position.y <= groundY + 0.1) {
                crate.landed = true;
                crate.group.position.y = groundY;
                if (crate.parachute) crate.parachute.visible = false;
                if (crate.smoke) {
                    crate.smoke.visible = true;
                    crate.smoke.position.set(crate.x, groundY, crate.z);
                }
                showNotification("Airdrop erga qo'ndi! Qizil tutun chiqarilmoqda 📦🚩");
            }
        } else {
            // Qizil tutun to'lqinlanishi (Billowing smoke)
            if (crate.smoke && crate.smoke.visible) {
                crate.smoke.children.forEach((sm, idx) => {
                    sm.position.y = 1.0 + idx * 1.8 + Math.sin(time * 3 + idx) * 0.25;
                    const s = 1.0 + Math.sin(time * 2 + idx * 0.8) * 0.18;
                    sm.scale.set(s, s, s);
                });
            }
        }
    }
}

function checkHazardCollisions(x, z) {
    let onLava = false;
    hazardZones.forEach(h => {
        if (Math.hypot(x - h.x, z - h.z) < h.radius) {
            if (h.isLava) {
                onLava = true;
                takeDamage(1, "Lava qizdirmoqda! 🔥");
            } else {
                takeDamage(1, "Tuzoqqa tushdingiz! ⚠️");
            }
        }
    });
    if (lavaOverlay) lavaOverlay.style.opacity = onLava ? '0.65' : '0';
}

function checkCoinCollisions(x, z) {
    for (let i = collectibleCoins.length - 1; i >= 0; i--) {
        const c = collectibleCoins[i];
        if (Math.hypot(x - c.position.x, z - c.position.z) < 2.0) {
            worldGroup.remove(c);
            collectibleCoins.splice(i, 1);
            totalCoins++;
            playCoinSound();
            updateHUD();
        }
    }
}

let lastDamageTime = 0;
function takeDamage(amount = 1, msg = "Jarohatlandingiz!") {
    if (isDriving && drivingVehicleType === 'plane') return;
    const now = performance.now();
    if (now - lastDamageTime < 1400) return;
    lastDamageTime = now;

    playerHealth -= amount;
    playHurtSound();
    updateHUD();
    showNotification(msg);

    if (damageOverlay) {
        damageOverlay.style.opacity = '0.85';
        setTimeout(() => damageOverlay.style.opacity = '0', 350);
    }

    if (playerHealth <= 0) handleGameOver();
}

// ----------------------------------------------------------
// 14. DUSHMANLAR AI VA DARAXTGA CHIQISH
// ----------------------------------------------------------
function updateEnemies(delta) {
    const targetPos = isDriving
        ? ((drivingVehicleType === 'moto' && motoVehicle) ? motoVehicle.position : (trackerVehicle ? trackerVehicle.position : playerPos))
        : playerPos;

    enemies.forEach(enemy => {
        if (!enemy.alive) return;

        if (inTree && currentClimbingTree && !isDriving) {
            const treePos = new THREE.Vector2(currentClimbingTree.x, currentClimbingTree.z);
            const enemyPos2D = new THREE.Vector2(enemy.group.position.x, enemy.group.position.z);
            const distToTree = treePos.distanceTo(enemyPos2D);

            if (distToTree > 1.8) {
                const dirToTree = treePos.clone().sub(enemyPos2D).normalize();
                enemy.group.position.x += dirToTree.x * enemy.speed * delta;
                enemy.group.position.z += dirToTree.y * enemy.speed * delta;
                const groundY = getTerrainHeight(enemy.group.position.x, enemy.group.position.z);
                enemy.group.position.y = (enemy.type === 'bat') ? groundY + 3.5 : groundY;
                enemy.group.rotation.y = Math.atan2(dirToTree.x, dirToTree.y);
                enemy.isClimbing = false;
            } else {
                enemy.isClimbing = true;
                enemy.climbTree = currentClimbingTree;
                enemy.group.rotation.y = Math.atan2(playerPos.x - enemy.group.position.x, playerPos.z - enemy.group.position.z);

                if (enemy.group.position.y < currentClimbingTree.branchHeight - 0.4) {
                    enemy.group.position.y += (enemy.speed * 0.7) * delta;
                } else {
                    enemy.attackCooldown -= delta;
                    if (enemy.attackCooldown <= 0) {
                        enemy.attackCooldown = 1.2;
                        takeDamage(1, "Dushman taxta maydonchaga yetib kelib zarba berdi! ⚔️");
                    }
                }
            }
        } else {
            enemy.isClimbing = false;
            const groundY = getTerrainHeight(enemy.group.position.x, enemy.group.position.z);
            enemy.group.position.y = (enemy.type === 'bat') ? groundY + 3.5 : groundY;

            const toPlayer = new THREE.Vector3().subVectors(targetPos, enemy.group.position);
            const dist = toPlayer.length();

            if (dist < (enemy.isBoss ? 55 : 28)) {
                toPlayer.normalize();
                enemy.group.position.x += toPlayer.x * enemy.speed * delta;
                enemy.group.position.z += toPlayer.z * enemy.speed * delta;
                enemy.group.rotation.y = Math.atan2(toPlayer.x, toPlayer.z);

                if (dist < 2.2 && !isDriving) {
                    enemy.attackCooldown -= delta;
                    if (enemy.attackCooldown <= 0) {
                        enemy.attackCooldown = 1.2;
                        takeDamage(1, `${enemy.isBoss ? "Boss" : "Dushman"} sizga zarba berdi! ⚔️`);
                    }
                }
            }
        }

        const animTime = clock.getElapsedTime() * 12;
        if (enemy.type === 'bat') {
            const wa = Math.sin(animTime) * 0.45;
            if (enemy.group.wingL) enemy.group.wingL.rotation.z = wa;
            if (enemy.group.wingR) enemy.group.wingR.rotation.z = -wa;
        } else {
            const la = Math.sin(animTime) * 0.6;
            if (enemy.group.legL) enemy.group.legL.rotation.x = la;
            if (enemy.group.legR) enemy.group.legR.rotation.x = -la;
        }
    });
}

// ----------------------------------------------------------
// 15. INTERAKTIV AMALLAR VA RADAR
// ----------------------------------------------------------
function updateCollectiblesAndPrompts() {
    const time = clock.getElapsedTime();

    collectibleKeys.forEach(k => {
        k.rotation.y = time * 2.2;
        k.position.y = (k.userData.baseY || 1.8) + Math.sin(time * 3) * 0.15;
    });

    collectibleCoins.forEach(c => {
        c.rotation.z = time * 2.8;
        c.position.y = (c.userData.baseY || 0.8) + Math.sin(time * 4) * 0.1;
    });

    // Uylardagi qurollarni aylantirish (Spinning Loot)
    houseLootPickups.forEach(lp => {
        if (!lp.looted && lp.mesh) {
            lp.mesh.rotation.y = time * 2.2;
            lp.mesh.position.y = lp.baseY + Math.sin(time * 3.5) * 0.08;
        }
    });

    if (oceanMesh) {
        oceanMesh.position.y = -1.2 + Math.sin(time * 1.5) * 0.08;
    }

    let promptMsg = null;
    let promptKey = "E";
    let isCrossInteractive = false;

    if (isDriving) {
        promptMsg = (drivingVehicleType === 'plane')
            ? "Parashyutda sakrash / Tushish [E] 🪂"
            : (drivingVehicleType === 'moto') ? "Mototsikldan tushish [E]" : "Tracker SUV dan tushish [E]";
    } else {
        let nearTree = null;
        climbableTrees.forEach(t => {
            if (Math.hypot(playerPos.x - t.x, playerPos.z - t.z) < 2.5) nearTree = t;
        });

        let nearTower = null;
        watchtowers.forEach(tw => {
            if (Math.hypot(playerPos.x - tw.x, playerPos.z - tw.z) < 2.6) nearTower = tw;
        });

        // 1. Uylardagi qurollar va aptechkalar
        let nearLoot = null;
        for (let i = 0; i < houseLootPickups.length; i++) {
            const lp = houseLootPickups[i];
            if (!lp.looted && playerPos.distanceTo(lp.position) < 2.8) {
                nearLoot = lp;
                break;
            }
        }

        if (nearLoot) {
            promptMsg = `[E] ${nearLoot.title}`;
            isCrossInteractive = true;
        } else if (nearTree && !inTree) {
            promptMsg = "Taxta maydonchaga chiqish (+Cho'pak olish)";
            promptKey = "Space / W";
            isCrossInteractive = true;
        } else if (nearTower && playerPos.y < nearTower.baseY + 2.0) {
            promptMsg = "Kuzatuv minorasiga chiqish (Snayper zaxirasi)";
            promptKey = "Space / W";
            isCrossInteractive = true;
        } else if (pilotPlaneVehicle && playerPos.distanceTo(pilotPlaneVehicle.position) < 4.8) {
            promptMsg = "Harbiy Samalyotga o'tirish va Uchish [E] ✈️";
            isCrossInteractive = true;
        } else if (trackerVehicle && playerPos.distanceTo(trackerVehicle.position) < 4.2) {
            promptMsg = "Chevrolet Tracker SUV ga o'tirish [E]";
            isCrossInteractive = true;
        } else if (motoVehicle && playerPos.distanceTo(motoVehicle.position) < 3.8) {
            promptMsg = "Tezkor Mototsiklga o'tirish [E]";
            isCrossInteractive = true;
        } else {
            let nearCrate = null;
            for (const crate of airdropCrates) {
                if (!crate.looted && playerPos.distanceTo(crate.group.position) < 4.2) {
                    nearCrate = crate;
                    break;
                }
            }
            if (nearCrate) {
                promptMsg = "PUBG Airdrop ochish [E] 📦🔥";
                isCrossInteractive = true;
            } else if (chestObject && !chestUnlocked && playerPos.distanceTo(chestObject.position) < 4.5) {
                promptMsg = collectedKeys >= totalKeysNeeded ? "Xazinani ochish! [E] 🎁" : `3 ta kalit kerak (${collectedKeys}/3) 🔑`;
                isCrossInteractive = true;
            } else {
                for (const k of collectibleKeys) {
                    if (playerPos.distanceTo(k.position) < 4.0) {
                        promptMsg = "Oltin kalitni olish 🔑";
                        isCrossInteractive = true;
                        break;
                    }
                }
            }
        }
    }

    if (actionPrompt && actionText) {
        if (promptMsg) {
            if (actionKeyBadge) actionKeyBadge.innerText = promptKey;
            actionText.innerText = promptMsg;
            actionPrompt.classList.remove('hidden');
        } else {
            actionPrompt.classList.add('hidden');
        }
    }

    if (crosshair) {
        if (isCrossInteractive) crosshair.classList.add('interactive');
        else crosshair.classList.remove('interactive');
    }
}

function updateRadar() {
    if (!radarCtx) return;
    const size = 140;
    const center = size / 2;
    const scale = (size / 2) / 280;

    radarCtx.clearRect(0, 0, size, size);

    // Orol konturi va okean
    radarCtx.beginPath();
    radarCtx.arc(center, center, islandRadius * scale, 0, Math.PI * 2);
    radarCtx.fillStyle = 'rgba(20, 50, 85, 0.7)';
    radarCtx.fill();
    radarCtx.lineWidth = 1.5;
    radarCtx.strokeStyle = '#4099ff';
    radarCtx.stroke();

    const currentPos = isDriving
        ? ((drivingVehicleType === 'plane' && pilotPlaneVehicle) ? pilotPlaneVehicle.position :
           (drivingVehicleType === 'moto' && motoVehicle) ? motoVehicle.position :
           (trackerVehicle ? trackerVehicle.position : playerPos))
        : playerPos;

    // Harbiy uylar
    militaryHouses.forEach(h => {
        const hx = center + h.x * scale;
        const hz = center + h.z * scale;
        radarCtx.fillStyle = '#8d6e63';
        radarCtx.fillRect(hx - 3.5, hz - 4, 7, 8);
    });

    // Kuzatuv minoralari
    watchtowers.forEach(tw => {
        const wx = center + tw.x * scale;
        const wz = center + tw.z * scale;
        radarCtx.fillStyle = '#90a4ae';
        radarCtx.fillRect(wx - 2.5, wz - 2.5, 5, 5);
    });

    // Daraxtlar
    climbableTrees.forEach(t => {
        const tx = center + t.x * scale;
        const tz = center + t.z * scale;
        radarCtx.fillStyle = '#2e7d32';
        radarCtx.fillRect(tx - 1.2, tz - 1.2, 2.4, 2.4);
    });

    // Kalitlar
    collectibleKeys.forEach(k => {
        const rx = center + k.position.x * scale;
        const rz = center + k.position.z * scale;
        radarCtx.fillStyle = '#ffd700';
        radarCtx.beginPath();
        radarCtx.arc(rx, rz, 3.2, 0, Math.PI * 2);
        radarCtx.fill();
    });

    // Xazina
    if (chestObject) {
        const cx = center + chestObject.position.x * scale;
        const cz = center + chestObject.position.z * scale;
        radarCtx.fillStyle = '#ffea00';
        radarCtx.fillRect(cx - 3.5, cz - 3.5, 7, 7);
    }

    // Tracker SUV (Moviy)
    if (trackerVehicle && (!isDriving || drivingVehicleType !== 'tracker')) {
        const bx = center + trackerVehicle.position.x * scale;
        const bz = center + trackerVehicle.position.z * scale;
        radarCtx.fillStyle = '#00e5ff';
        radarCtx.beginPath();
        radarCtx.arc(bx, bz, 3.5, 0, Math.PI * 2);
        radarCtx.fill();
    }

    // Mototsikl (Zarg'aldoq)
    if (motoVehicle && (!isDriving || drivingVehicleType !== 'moto')) {
        const mx = center + motoVehicle.position.x * scale;
        const mz = center + motoVehicle.position.z * scale;
        radarCtx.fillStyle = '#ff9100';
        radarCtx.beginPath();
        radarCtx.arc(mx, mz, 3.2, 0, Math.PI * 2);
        radarCtx.fill();
    }

    // Uchuvchi Samalyot (Yorqin moviy)
    if (pilotPlaneVehicle && (!isDriving || drivingVehicleType !== 'plane')) {
        const ax = center + pilotPlaneVehicle.position.x * scale;
        const az = center + pilotPlaneVehicle.position.z * scale;
        radarCtx.fillStyle = '#00e5ff';
        radarCtx.beginPath();
        radarCtx.arc(ax, az, 4.2, 0, Math.PI * 2);
        radarCtx.fill();
    }

    // Airdroplar (Pulsing Qizil)
    airdropCrates.forEach(c => {
        if (c.looted) return;
        const ax = center + c.x * scale;
        const az = center + c.z * scale;
        radarCtx.fillStyle = '#ff1744';
        radarCtx.fillRect(ax - 3, az - 3, 6, 6);
    });

    // Samalyot (Oq samalyot belgisi)
    if (cargoAirplane) {
        const px = center + cargoAirplane.position.x * scale;
        const pz = center + cargoAirplane.position.z * scale;
        radarCtx.fillStyle = '#ffffff';
        radarCtx.beginPath();
        radarCtx.arc(px, pz, 4, 0, Math.PI * 2);
        radarCtx.fill();
    }

    // Dushmanlar
    enemies.forEach(e => {
        if (!e.alive) return;
        const ex = center + e.group.position.x * scale;
        const ez = center + e.group.position.z * scale;
        radarCtx.fillStyle = e.isBoss ? '#d500f9' : '#ff1744';
        radarCtx.beginPath();
        radarCtx.arc(ex, ez, e.isBoss ? 4 : 2.5, 0, Math.PI * 2);
        radarCtx.fill();
    });

    // Qahramon
    const px = center + currentPos.x * scale;
    const pz = center + currentPos.z * scale;
    const angle = cameraYaw;

    radarCtx.save();
    radarCtx.translate(px, pz);
    radarCtx.rotate(-angle + Math.PI);
    radarCtx.fillStyle = '#00e676';
    radarCtx.beginPath();
    radarCtx.moveTo(0, -6);
    radarCtx.lineTo(4, 5);
    radarCtx.lineTo(-4, 5);
    radarCtx.closePath();
    radarCtx.fill();
    radarCtx.restore();
}

function updateHUD() {
    if (levelBadge) levelBadge.innerText = `${currentLevel} / ${maxLevels}`;
    if (levelTitle) levelTitle.innerText = islandConfigs[currentLevel].title;

    if (heartsContainer) {
        let heartsStr = '';
        for (let i = 0; i < maxHealth; i++) {
            heartsStr += (i < playerHealth) ? '❤️' : '🖤';
        }
        heartsContainer.innerText = heartsStr;
    }

    if (coinCountElem) coinCountElem.innerText = totalCoins;
    if (keyCountElem) keyCountElem.innerText = `${collectedKeys} / ${totalKeysNeeded}`;

    if (stickCountElem) {
        stickCountElem.innerText = `${stickCount} ta`;
    }

    if (fuelBarElem) fuelBarElem.style.width = `${Math.round(buggyFuel)}%`;
    if (fuelTextElem) fuelTextElem.innerText = `${Math.round(buggyFuel)}%`;

    if (ammoDisplayElem) {
        if (activeWeapon === 'sword') {
            ammoDisplayElem.innerText = 'Cheksiz ⚔️';
        } else if (activeWeapon === 'stick') {
            ammoDisplayElem.innerText = `${stickCount} ta`;
        } else if (activeWeapon === 'rifle') {
            ammoDisplayElem.innerText = `${rifleAmmo} / ${rifleReserve}`;
        } else if (activeWeapon === 'ak47') {
            ammoDisplayElem.innerText = `${ak47Ammo} / ${ak47Reserve}`;
        } else if (activeWeapon === 'sniper') {
            ammoDisplayElem.innerText = `${sniperAmmo} / ${sniperReserve}`;
        } else if (activeWeapon === 'shotgun') {
            ammoDisplayElem.innerText = `${shotgunAmmo} / ${shotgunReserve}`;
        }
    }
}

function showNotification(text) {
    if (!gameNotification) return;
    gameNotification.innerText = text;
    gameNotification.classList.remove('hidden');
    clearTimeout(notificationTimeout);
    notificationTimeout = setTimeout(() => {
        gameNotification.classList.add('hidden');
    }, 2800);
}

// ----------------------------------------------------------
// 16. O'YINNI BOSHLASH VA BOSQICHLARNI BOSHQARISH
// ----------------------------------------------------------
function startGame() {
    getAudioContext();
    if (startScreen) startScreen.classList.add('hidden');
    currentLevel = 1;
    playerHealth = 3;
    totalCoins = 0;
    stickCount = 3;
    gameRunning = true;
    buildLevel(currentLevel);
    if (canvasContainer) canvasContainer.requestPointerLock();
}

function completeLevel() {
    gameRunning = false;
    document.exitPointerLock();
    if (currentLevel >= maxLevels) showWinScreen();
    else showLevelCompleteScreen();
}

function showLevelCompleteScreen() {
    if (levelCompleteScreen) {
        if (levelCompleteTitle) levelCompleteTitle.innerText = `${currentLevel}-OROL FATH ETILDI!`;
        if (levelCoinsElem) levelCoinsElem.innerText = `${totalCoins} 🪙`;
        const nextCfg = islandConfigs[currentLevel + 1];
        if (nextLevelDescription) nextLevelDescription.innerText = `Keyingi orol: "${nextCfg.title}". ${nextCfg.desc}`;
        levelCompleteScreen.classList.remove('hidden');
    }
}

function goToNextLevel() {
    if (levelCompleteScreen) levelCompleteScreen.classList.add('hidden');
    currentLevel++;
    playerHealth = Math.min(maxHealth, playerHealth + 1);
    gameRunning = true;
    buildLevel(currentLevel);
    if (canvasContainer) canvasContainer.requestPointerLock();
}

function showWinScreen() {
    if (winScreen) {
        if (winCoinsElem) winCoinsElem.innerText = `${totalCoins} 🪙`;
        if (winHeartsElem) winHeartsElem.innerText = '❤️'.repeat(playerHealth);
        winScreen.classList.remove('hidden');
    }
}

// ----------------------------------------------------------
// 16. FANLAR SAVOLLARI VA QAYTA TIRILISH TIZIMI
// (MATEMATIKA, INGLIZ TILI, GEOGRAFIYA POYTAXTLAR VA BAYROQLAR)
// ----------------------------------------------------------
const ENGLISH_QUIZ_BANK = [
    { q: '"Book" so\'zining o\'zbekcha tarjimasi nima?', a: 'Kitob', wrong: ['Daftar', 'Qalam', 'Stol'] },
    { q: '"Apple" so\'zi qaysi mevani anglatadi?', a: 'Olma', wrong: ['Nok', 'Shaftoli', 'Uzum'] },
    { q: '"Suv" so\'zi ingliz tilida qanday ataladi?', a: 'Water', wrong: ['Fire', 'Stone', 'Bread'] },
    { q: '"School" so\'zining ma\'nosi nima?', a: 'Maktab', wrong: ['Bog\'cha', 'Shifoxona', 'Do\'kon'] },
    { q: '"Quyosh" so\'zi ingliz tilida qanday bo\'ladi?', a: 'Sun', wrong: ['Moon', 'Sky', 'Star'] },
    { q: '"Cat" so\'zi qaysi hayvonni bildiradi?', a: 'Mushuk', wrong: ['It', 'Sichqon', 'Ayiq'] },
    { q: '"Dog" so\'zining o\'zbekcha tarjimasi nima?', a: 'It', wrong: ['Mushuk', 'Bo\'ri', 'Tulki'] },
    { q: '"Green" so\'zi qaysi rangni bildiradi?', a: 'Yashil', wrong: ['Qizil', 'Moviy', 'Sariq'] },
    { q: '"Red" so\'zi qaysi rangni bildiradi?', a: 'Qizil', wrong: ['Oq', 'Qora', 'Yashil'] },
    { q: '"Blue" so\'zi qaysi rang?', a: 'Ko\'k / Moviy', wrong: ['Yashil', 'Qizil', 'Jigarrang'] },
    { q: '"Yellow" so\'zi qaysi rangni bildiradi?', a: 'Sariq', wrong: ['Yashil', 'Qora', 'Qizil'] },
    { q: '"Car" so\'zining ma\'nosi nima?', a: 'Mashina', wrong: ['Samolyot', 'Poyezd', 'Kema'] },
    { q: '"Mother" so\'zining ma\'nosi nima?', a: 'Ona', wrong: ['Opa', 'Ota', 'Xola'] },
    { q: '"Father" so\'zining ma\'nosi nima?', a: 'Ota', wrong: ['Aka', 'Bobo', 'Tog\'a'] },
    { q: '"Friend" so\'zi nimani anglatadi?', a: 'Do\'st', wrong: ['Dushman', 'Qo\'shni', 'Mehmon'] },
    { q: '"Tree" so\'zi nimani bildiradi?', a: 'Daraxt', wrong: ['Gul', 'Barg', 'O\'rmon'] },
    { q: '"Milk" so\'zining ma\'nosi nima?', a: 'Sut', wrong: ['Choy', 'Qahva', 'Sharbat'] },
    { q: '"Bread" so\'zining tarjimasi nima?', a: 'Non', wrong: ['Go\'sht', 'Yog\'', 'Qand'] },
    { q: '"Good morning" iborasi nima degani?', a: 'Xayrli tong', wrong: ['Xayrli tun', 'Xayrli kech', 'Salom'] },
    { q: '"Thank you" iborasi qanday tarjima qilinadi?', a: 'Rahmat', wrong: ['Salom', 'Xayr', 'Kechirasiz'] },
    { q: '"House" so\'zining ma\'nosi nima?', a: 'Uy', wrong: ['Ko\'cha', 'Xona', 'Qasr'] },
    { q: '"Pen" so\'zi nima degani?', a: 'Ruchka', wrong: ['Qalam', 'Qog\'oz', 'Daftar'] },
    { q: '"Boy" so\'zining ma\'nosi nima?', a: 'O\'g\'il bola', wrong: ['Qiz bola', 'Erkak', 'Ayol'] },
    { q: '"Girl" so\'zining ma\'nosi nima?', a: 'Qiz bola', wrong: ['Ona', 'Singil', 'Opa'] },
    { q: '"Fish" so\'zi qaysi jonivorni bildiradi?', a: 'Baliq', wrong: ['Qush', 'Qurbaqa', 'Ilon'] }
];

const GEOGRAPHY_CAPITALS_BANK = [
    { q: 'O\'zbekistonning poytaxti qaysi shahar?', a: 'Toshkent', wrong: ['Samarqand', 'Buxoro', 'Xiva'] },
    { q: 'Fransiyaning poytaxti qaysi shahar?', a: 'Parij', wrong: ['Marsel', 'Lion', 'Nissa'] },
    { q: 'Yaponiyaning poytaxti qaysi shahar?', a: 'Tokio', wrong: ['Kioto', 'Osaka', 'Nagoya'] },
    { q: 'Turkiyaning poytaxti qaysi shahar?', a: 'Anqara', wrong: ['Istanbul', 'Izmir', 'Bursa'] },
    { q: 'Buyuk Britaniya (Angliya) poytaxti qaysi shahar?', a: 'London', wrong: ['Manchester', 'Liverpul', 'Edinburg'] },
    { q: 'Rossiyaning poytaxti qaysi shahar?', a: 'Moskva', wrong: ['Sankt-Peterburg', 'Qozon', 'Sochi'] },
    { q: 'AQSHning poytaxti qaysi shahar?', a: 'Vashington', wrong: ['Nyu-York', 'Los-Anjeles', 'Chikago'] },
    { q: 'Germaniyaning poytaxti qaysi shahar?', a: 'Berlin', wrong: ['Myunxen', 'Gamburg', 'Frankfurt'] },
    { q: 'Janubiy Koreyaning poytaxti qaysi shahar?', a: 'Seul', wrong: ['Pusan', 'Incheon', 'Daegu'] },
    { q: 'Italiyaning poytaxti qaysi shahar?', a: 'Rim', wrong: ['Milan', 'Venetsiya', 'Neapol'] },
    { q: 'Ispaniyaning poytaxti qaysi shahar?', a: 'Madrid', wrong: ['Barselona', 'Valensiya', 'Sevilya'] },
    { q: 'Qozog\'istonning poytaxti qaysi shahar?', a: 'Ostona', wrong: ['Olmaota', 'Chimkent', 'Aqtau'] },
    { q: 'Tojikistonning poytaxti qaysi shahar?', a: 'Dushanbe', wrong: ['Xo\'jand', 'Boxtar', 'Ko\'lob'] },
    { q: 'Qirg\'izistonning poytaxti qaysi shahar?', a: 'Bishkek', wrong: ['O\'sh', 'Jalolobod', 'Qorako\'l'] },
    { q: 'Xitoyning poytaxti qaysi shahar?', a: 'Pekin', wrong: ['Shanxay', 'Guanchjou', 'Gonkong'] },
    { q: 'Misrning poytaxti qaysi shahar?', a: 'Qohira', wrong: ['Iskandariya', 'Giza', 'Asvon'] },
    { q: 'Ozarbayjonning poytaxti qaysi shahar?', a: 'Boku', wrong: ['Ganja', 'Sumqayit', 'Shaki'] },
    { q: 'BAA (Birlashgan Arab Amirliklari) poytaxti qaysi shahar?', a: 'Abu-Dabi', wrong: ['Dubay', 'Sharja', 'Ajman'] },
    { q: 'Kanadaning poytaxti qaysi shahar?', a: 'Ottava', wrong: ['Toronto', 'Vankuver', 'Monreal'] },
    { q: 'Braziliyaning poytaxti qaysi shahar?', a: 'Braziliya (shahar)', wrong: ['Rio-de-Janeyro', 'San-Paulu', 'Salvador'] }
];

const GEOGRAPHY_FLAGS_BANK = [
    { flag: '🇺🇿', q: 'Ushbu bayroq qaysi davlatga tegishli?', a: 'O\'zbekiston', wrong: ['Qozog\'iston', 'Tojikiston', 'Ozarbayjon'] },
    { flag: '🇹🇷', q: 'Ushbu bayroq qaysi davlatga tegishli?', a: 'Turkiya', wrong: ['Ozarbayjon', 'Tunis', 'Pokiston'] },
    { flag: '🇯🇵', q: 'Ushbu bayroq qaysi davlatga tegishli?', a: 'Yaponiya', wrong: ['Janubiy Koreya', 'Xitoy', 'Vyetnam'] },
    { flag: '🇫🇷', q: 'Ushbu bayroq qaysi davlatga tegishli?', a: 'Fransiya', wrong: ['Italiya', 'Germaniya', 'Niderlandiya'] },
    { flag: '🇩🇪', q: 'Ushbu bayroq qaysi davlatga tegishli?', a: 'Germaniya', wrong: ['Belgiya', 'Avstriya', 'Polsha'] },
    { flag: '🇬🇧', q: 'Ushbu bayroq qaysi davlatga tegishli?', a: 'Buyuk Britaniya', wrong: ['AQSH', 'Avstraliya', 'Kanada'] },
    { flag: '🇺🇸', q: 'Ushbu bayroq qaysi davlatga tegishli?', a: 'AQSH', wrong: ['Kanada', 'Buyuk Britaniya', 'Meksika'] },
    { flag: '🇰🇿', q: 'Ushbu bayroq qaysi davlatga tegishli?', a: 'Qozog\'iston', wrong: ['O\'zbekiston', 'Qirg\'iziston', 'Mo\'g\'uliston'] },
    { flag: '🇮🇹', q: 'Ushbu bayroq qaysi davlatga tegishli?', a: 'Italiya', wrong: ['Fransiya', 'Irlandiya', 'Vengriya'] },
    { flag: '🇧🇷', q: 'Ushbu bayroq qaysi davlatga tegishli?', a: 'Braziliya', wrong: ['Argentina', 'Kolumbiya', 'Portugaliya'] },
    { flag: '🇨🇦', q: 'Ushbu bayroq qaysi davlatga tegishli?', a: 'Kanada', wrong: ['AQSH', 'Shveysariya', 'Avstriya'] },
    { flag: '🇰🇷', q: 'Ushbu bayroq qaysi davlatga tegishli?', a: 'Janubiy Koreya', wrong: ['Yaponiya', 'Xitoy', 'Singapur'] },
    { flag: '🇪🇸', q: 'Ushbu bayroq qaysi davlatga tegishli?', a: 'Ispaniya', wrong: ['Portugaliya', 'Italiya', 'Meksika'] },
    { flag: '🇦🇿', q: 'Ushbu bayroq qaysi davlatga tegishli?', a: 'Ozarbayjon', wrong: ['Turkiya', 'Eron', 'Qozog\'iston'] },
    { flag: '🇦🇷', q: 'Ushbu bayroq qaysi davlatga tegishli?', a: 'Argentina', wrong: ['Urugvay', 'Braziliya', 'Chili'] },
    { flag: '🇸🇦', q: 'Ushbu bayroq qaysi davlatga tegishli?', a: 'Saudiya Arabistoni', wrong: ['BAA', 'Misr', 'Qatar'] }
];

function generateMathQuestion() {
    const opTypes = ['add', 'sub', 'mul', 'div'];
    const op = opTypes[Math.floor(Math.random() * opTypes.length)];
    let questionText = '';
    let correctAnswer = 0;

    if (op === 'add') {
        const a = 10 + Math.floor(Math.random() * 35);
        const b = 5 + Math.floor(Math.random() * 30);
        correctAnswer = a + b;
        questionText = `${a} + ${b} = ?`;
    } else if (op === 'sub') {
        const a = 25 + Math.floor(Math.random() * 45);
        const b = 5 + Math.floor(Math.random() * (a - 10));
        correctAnswer = a - b;
        questionText = `${a} - ${b} = ?`;
    } else if (op === 'mul') {
        const a = 2 + Math.floor(Math.random() * 8);
        const b = 2 + Math.floor(Math.random() * 8);
        correctAnswer = a * b;
        questionText = `${a} × ${b} = ?`;
    } else { // div
        const b = 2 + Math.floor(Math.random() * 7);
        const ans = 2 + Math.floor(Math.random() * 7);
        const a = b * ans;
        correctAnswer = ans;
        questionText = `${a} ÷ ${b} = ?`;
    }

    const wrongAnswers = new Set();
    const offsets = [-4, -3, -2, -1, 1, 2, 3, 4, 10, -10];
    offsets.sort(() => Math.random() - 0.5);

    for (const off of offsets) {
        const candidate = correctAnswer + off;
        if (candidate > 0 && candidate !== correctAnswer) {
            wrongAnswers.add(candidate.toString());
            if (wrongAnswers.size === 3) break;
        }
    }

    let fallback = 1;
    while (wrongAnswers.size < 3) {
        if (!wrongAnswers.has((correctAnswer + fallback).toString())) {
            wrongAnswers.add((correctAnswer + fallback).toString());
        }
        fallback++;
    }

    return {
        subject: 'math',
        badge: '📐 Matematika',
        badgeClass: 'badge-math',
        question: questionText,
        flag: null,
        correctAnswer: correctAnswer.toString(),
        wrongAnswers: Array.from(wrongAnswers)
    };
}

function getRandomQuizQuestion() {
    const categories = ['math', 'english', 'capitals', 'flags'];
    const chosenCat = categories[Math.floor(Math.random() * categories.length)];

    if (chosenCat === 'math') {
        return generateMathQuestion();
    } else if (chosenCat === 'english') {
        const item = ENGLISH_QUIZ_BANK[Math.floor(Math.random() * ENGLISH_QUIZ_BANK.length)];
        return {
            subject: 'english',
            badge: '🇬🇧 Ingliz Tili',
            badgeClass: 'badge-english',
            question: item.q,
            flag: null,
            correctAnswer: item.a,
            wrongAnswers: [...item.wrong]
        };
    } else if (chosenCat === 'capitals') {
        const item = GEOGRAPHY_CAPITALS_BANK[Math.floor(Math.random() * GEOGRAPHY_CAPITALS_BANK.length)];
        return {
            subject: 'geography',
            badge: '🌍 Geografiya (Poytaxtlar)',
            badgeClass: 'badge-geo',
            question: item.q,
            flag: null,
            correctAnswer: item.a,
            wrongAnswers: [...item.wrong]
        };
    } else { // flags
        const item = GEOGRAPHY_FLAGS_BANK[Math.floor(Math.random() * GEOGRAPHY_FLAGS_BANK.length)];
        return {
            subject: 'flag',
            badge: '🚩 Geografiya (Bayroqlar)',
            badgeClass: 'badge-flag',
            question: item.q,
            flag: item.flag,
            correctAnswer: item.a,
            wrongAnswers: [...item.wrong]
        };
    }
}

let currentQuiz = null;
let quizTimerInterval = null;
let quizTimeLeft = 20;
let isQuizActive = false;

function showRevivalQuiz() {
    isQuizActive = true;
    gameRunning = false;
    document.exitPointerLock();

    currentQuiz = getRandomQuizQuestion();
    quizTimeLeft = 20;

    if (quizSubjectBadge) {
        quizSubjectBadge.innerText = currentQuiz.badge;
        quizSubjectBadge.className = `badge quiz-badge ${currentQuiz.badgeClass}`;
    }

    if (quizFlagVisual) {
        if (currentQuiz.flag) {
            quizFlagVisual.innerText = currentQuiz.flag;
            quizFlagVisual.classList.remove('hidden');
        } else {
            quizFlagVisual.classList.add('hidden');
        }
    }

    if (quizQuestionText) {
        quizQuestionText.innerText = currentQuiz.question;
    }

    if (quizFeedbackBox) {
        quizFeedbackBox.classList.add('hidden');
        quizFeedbackBox.className = 'quiz-feedback-box hidden';
    }

    const allOptions = [currentQuiz.correctAnswer, ...currentQuiz.wrongAnswers];
    allOptions.sort(() => Math.random() - 0.5);
    currentQuiz.correctIndex = allOptions.indexOf(currentQuiz.correctAnswer);
    currentQuiz.options = allOptions;

    if (quizOptionsGrid) {
        quizOptionsGrid.innerHTML = '';
        allOptions.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-opt-btn';
            btn.dataset.index = idx;
            btn.innerHTML = `<span class="opt-key">${idx + 1}</span> <span class="opt-text">${opt}</span>`;
            btn.addEventListener('click', () => handleQuizAnswer(idx));
            quizOptionsGrid.appendChild(btn);
        });
    }

    updateQuizTimerDisplay();

    if (quizRevivalScreen) {
        quizRevivalScreen.classList.remove('hidden');
    }

    clearInterval(quizTimerInterval);
    quizTimerInterval = setInterval(() => {
        quizTimeLeft--;
        updateQuizTimerDisplay();
        if (quizTimeLeft <= 0) {
            clearInterval(quizTimerInterval);
            handleQuizAnswer(-1);
        }
    }, 1000);
}

function updateQuizTimerDisplay() {
    if (quizTimerText) quizTimerText.innerText = `${quizTimeLeft}s`;
    if (quizTimerBar) {
        const pct = Math.max(0, (quizTimeLeft / 20) * 100);
        quizTimerBar.style.width = `${pct}%`;
    }
}

function handleQuizAnswer(selectedIndex) {
    if (!isQuizActive) return;
    isQuizActive = false;
    clearInterval(quizTimerInterval);

    const isCorrect = (selectedIndex === currentQuiz.correctIndex);
    const buttons = quizOptionsGrid ? quizOptionsGrid.querySelectorAll('.quiz-opt-btn') : [];

    buttons.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === currentQuiz.correctIndex) {
            btn.classList.add('correct');
        } else if (idx === selectedIndex) {
            btn.classList.add('wrong');
        }
    });

    if (quizFeedbackBox && quizFeedbackMsg && quizFeedbackIcon) {
        quizFeedbackBox.classList.remove('hidden');
        if (isCorrect) {
            quizFeedbackBox.className = 'quiz-feedback-box correct';
            quizFeedbackIcon.innerText = '🎉';
            quizFeedbackMsg.innerText = "To'g'ri javob! Qahramon qayta tirildi!";
            playRevivalSuccessSound();
        } else {
            quizFeedbackBox.className = 'quiz-feedback-box wrong';
            quizFeedbackIcon.innerText = '❌';
            quizFeedbackMsg.innerText = (selectedIndex === -1)
                ? "Vaqt tugadi! O'yin 0 ga tushadi..."
                : "Noto'g'ri javob! O'yin 0 ga tushadi...";
            playRevivalFailSound();
        }
    }

    if (isCorrect) {
        // TO'G'RI JAVOB: O'yin o'sha joydan to'liq jon bilan davom etadi!
        setTimeout(() => {
            if (quizRevivalScreen) quizRevivalScreen.classList.add('hidden');
            playerHealth = maxHealth;
            lastDamageTime = performance.now() + 2500; // 2.5 soniya zarbalardan himoya

            // Yaqin dushmanlarni chetga surish
            enemies.forEach(e => {
                if (e.alive && playerPos.distanceTo(e.group.position) < 5.0) {
                    const pushDir = e.group.position.clone().sub(playerPos).normalize();
                    e.group.position.addScaledVector(pushDir, 6.0);
                }
            });

            gameRunning = true;
            updateHUD();
            showNotification("To'g'ri javob berdingiz! Qayta tirildingiz va jang davom etmoqda! ❤️‍🔥");
            if (canvasContainer) canvasContainer.requestPointerLock();
        }, 1100);
    } else {
        // NOTO'G'RI JAVOB: O'yin boshida 0 ga tushadi!
        setTimeout(() => {
            if (quizRevivalScreen) quizRevivalScreen.classList.add('hidden');
            currentLevel = 1;
            totalCoins = 0;
            playerHealth = 3;
            stickCount = 3;
            collectedKeys = 0;
            buggyFuel = 100;
            isDriving = false;
            drivingVehicleType = null;
            if (playerGroup) playerGroup.visible = true;

            if (gameOverMsg) {
                gameOverMsg.innerText = "Savolga noto'g'ri javob berildi! Barcha yutuqlar 0 ga tushdi. O'yin 1-bosqichdan qaytadan boshlanadi.";
            }
            if (gameOverScreen) gameOverScreen.classList.remove('hidden');
        }, 1600);
    }
}

function handleGameOver() {
    gameRunning = false;
    document.exitPointerLock();
    showRevivalQuiz();
}

function restartCurrentLevel() {
    if (gameOverScreen) gameOverScreen.classList.add('hidden');
    playerHealth = 3;
    stickCount = 3;
    gameRunning = true;
    buildLevel(currentLevel);
    if (canvasContainer) canvasContainer.requestPointerLock();
}

function restartFromBeginning() {
    if (winScreen) winScreen.classList.add('hidden');
    if (gameOverScreen) gameOverScreen.classList.add('hidden');
    currentLevel = 1;
    playerHealth = 3;
    totalCoins = 0;
    stickCount = 3;
    gameRunning = true;
    buildLevel(currentLevel);
    if (canvasContainer) canvasContainer.requestPointerLock();
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    if (soundToggleBtn) soundToggleBtn.innerText = soundEnabled ? '🔊' : '🔇';
    showNotification(soundEnabled ? "Ovoz yoqildi 🔊" : "Ovoz o'chirildi 🔇");
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
    } else {
        document.exitFullscreen().catch(() => {});
    }
}

// ----------------------------------------------------------
// 17. ASOSIY 3D RENDER LOOP
// ----------------------------------------------------------
function animate() {
    requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 0.05);

    if (gameRunning) {
        try {
            updatePlayer(delta);
            updateThrownSticks(delta);
            updateBulletTracers(delta);
            updateCargoAirplane(delta);
            updateAirdrops(delta);
            updateEnemies(delta);
            updateCollectiblesAndPrompts();
            updateRadar();
        } catch (e) {
            console.error("Update loop error:", e);
        }
    }

    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    initThree();
    createPlayerCharacter();
    buildLevel(1);
    setupControls();
    updateHUD();
    animate();
});
