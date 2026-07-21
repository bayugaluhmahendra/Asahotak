// State Game
let score = 0;
let lives = 4;
let timeLeft = 25;
let combo = 1;
let timerInterval = null;
let isPlaying = false;
let audioEnabled = true;

// Player ID & Stats Storage
let playerId = localStorage.getItem('arcade_pid');
if (!playerId) {
    playerId = 'Player_' + Math.floor(1000 + Math.random() * 9000);
    localStorage.setItem('arcade_pid', playerId);
}
document.getElementById('player-id').innerText = `ID: ${playerId}`;

let stats = JSON.parse(localStorage.getItem('arcade_stats')) || { gamesPlayed: 0, highestScore: 0 };
let achievements = JSON.parse(localStorage.getItem('arcade_ach')) || { firstGame: false, comboMaster: false };

// DOM Elements
const startScreen = document.getElementById('start-screen');
const playScreen = document.getElementById('play-screen');
const gameoverScreen = document.getElementById('gameover-screen');
const targetBox = document.getElementById('target-box');
const livesEl = document.getElementById('lives');
const timerEl = document.getElementById('timer');
const scoreEl = document.getElementById('score');
const comboEl = document.getElementById('combo');
const finalScoreEl = document.getElementById('final-score');
const finalRankEl = document.getElementById('final-rank');
const bonusPopup = document.getElementById('bonus-popup');

// Audio Synthesizer sederhana (Web Audio API tanpa file eksternal)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
    if (!audioEnabled) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    let osc = audioCtx.createOscillator();
    let gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'click') {
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start(); osc.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'bonus') {
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        osc.start(); osc.stop(audioCtx.currentTime + 0.2);
    } else if (type === 'over') {
        osc.frequency.setValueAtTime(200, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(80, audioCtx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.start(); osc.stop(audioCtx.currentTime + 0.4);
    }
}

// Event Listeners Tombol Utama
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('restart-btn').addEventListener('click', startGame);

function startGame() {
    startScreen.classList.remove('active');
    gameoverScreen.classList.remove('active');
    playScreen.classList.add('active');

    score = 0;
    lives = 4;
    timeLeft = 25;
    combo = 1;
    isPlaying = true;
    updateUI();

    stats.gamesPlayed++;
    localStorage.setItem('arcade_stats', JSON.stringify(stats));

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.innerText = timeLeft;
        if (timeLeft <= 0) endGame();
    }, 1000);

    moveTarget();
}

function moveTarget() {
    if (!isPlaying) return;
    const board = playScreen.getBoundingClientRect();
    const maxX = board.width - 90;
    const maxY = board.height - 90;
    
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    targetBox.style.left = `${randomX}px`;
    targetBox.style.top = `${randomY}px`;
}

// Aksi Klik Target
targetBox.addEventListener('click', () => {
    if (!isPlaying) return;
    playSound('click');
    score += 10 * combo;
    combo++;
    
    // Fitur Bonus Skor acak (1 dari 5 kesempatan)
    if (Math.random() < 0.2) {
        score += 50;
        playSound('bonus');
        bonusPopup.classList.remove('hidden');
        setTimeout(() => bonusPopup.classList.add('hidden'), 800);
    }

    if (combo >= 5 && !achievements.comboMaster) {
        achievements.comboMaster = true;
        localStorage.setItem('arcade_ach', JSON.stringify(achievements));
    }

    updateUI();
    moveTarget();
});

function updateUI() {
    scoreEl.innerText = score;
    livesEl.innerText = lives;
    timerEl.innerText = timeLeft;
    comboEl.innerText = combo;
}

function getRank(s) {
    if (s > 300) return '🥇 Master Legend';
    if (s > 150) return '🥈 Challenger Pro';
    if (s > 50) return '🥉 Skilled Player';
    return '🌱 Novice Beginner';
}

function endGame() {
    isPlaying = false;
    clearInterval(timerInterval);
    playScreen.classList.remove('active');
    gameoverScreen.classList.add('active');

    finalScoreEl.innerText = score;
    const rank = getRank(score);
    finalRankEl.innerText = rank;

    if (score > stats.highestScore) {
        stats.highestScore = score;
        localStorage.setItem('arcade_stats', JSON.stringify(stats));
    }

    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    playSound('over');
}

// Fitur Share Score
document.getElementById('share-btn').addEventListener('click', () => {
    const text = `🎮 Skor saya ${score} (${getRank(score)}) di Arcade Reflex Challenge! Mainkan sekarang!`;
    if (navigator.share) {
        navigator.share({ title: 'Arcade Game', text: text }).catch(() => {});
    } else {
        navigator.clipboard.writeText(text);
        alert('Skor berhasil disalin ke clipboard!');
    }
});

// Fitur Tema (Ganti 3 Tema)
const themes = ['cyberpunk', 'neon', 'sunset'];
let currentThemeIdx = 0;
document.getElementById('theme-btn').addEventListener('click', () => {
    currentThemeIdx = (currentThemeIdx + 1) % themes.length;
    document.documentElement.setAttribute('data-theme', themes[currentThemeIdx]);
});

// Audio Toggle
document.getElementById('sound-btn').addEventListener('click', () => {
    audioEnabled = !audioEnabled;
    document.getElementById('sound-btn').innerText = audioEnabled ? '🔊 Audio' : '🔇 Mute';
});

// Modal Statistik & Achievement
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
document.getElementById('close-modal').onclick = () => modal.classList.add('hidden');

document.getElementById('stat-btn').onclick = () => {
    modalBody.innerHTML = `<h3>📊 Statistik</h3><br>Total Main: ${stats.gamesPlayed}<br>Skor Tertinggi: ${stats.highestScore}`;
    modal.classList.remove('hidden');
};

document.getElementById('ach-btn').onclick = () => {
    modalBody.innerHTML = `<h3>🥇 Prestasi</h3><br>
        - Main Pertama: ${stats.gamesPlayed > 0 ? '✅ Selesai' : '❌ Belum'}<br>
        - Combo Master (x5): ${achievements.comboMaster ? '✅ Selesai' : '❌ Belum'}`;
    modal.classList.remove('hidden');
};
