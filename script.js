// --- DATABASE SOAL ACAK ---
const questionBank = [
    { q: "Berapakah hasil dari 8 + 4 x 2?", options: ["24", "16", "20", "12"], answer: 1 },
    { q: "Ibu kota Australia adalah...", options: ["Sydney", "Melbourne", "Canberra", "Perth"], answer: 2 },
    { q: "Hewan apa yang bisa tidur sambil berdiri?", options: ["Kuda", "Kucing", "Anjing", "Kelinci"], answer: 0 },
    { q: "Planet manakah yang paling dekat dengan matahari?", options: ["Venus", "Merkurius", "Mars", "Bumi"], answer: 1 },
    { q: "Unsur kimia dengan simbol 'O' adalah...", options: ["Oksigen", "Gold", "Osmium", "Ozone"], answer: 0 },
    { q: "Berapa jumlah warna dalam pelangi?", options: ["5", "6", "7", "8"], answer: 2 },
    { q: "Bahasa pemrograman dasar untuk web adalah...", options: ["Python", "HTML", "C++", "Java"], answer: 1 },
    { q: "Negara manakah yang memiliki bentuk seperti sepatu bot?", options: ["Yunani", "Italia", "Spanyol", "Prancis"], answer: 1 },
    { q: "Siapakah penemu lampu pijar?", options: ["Albert Einstein", "Nikola Tesla", "Thomas Edison", "Galileo"], answer: 2 },
    { q: "Berapa jumlah total pemain dalam satu tim sepak bola di lapangan?", options: ["10", "11", "12", "9"], answer: 1 },
    { q: "Gunung tertinggi di dunia adalah...", options: ["Merapi", "Everest", "Kilimanjaro", "Fuji"], answer: 1 },
    { q: "Air mendidih pada suhu berapa derajat Celsius?", options: ["90", "100", "110", "120"], answer: 1 }
];

// --- STATE GAME ---
let player = {
    name: "",
    id: "",
    score: 0,
    lives: 7,
    currentQuestionIndex: 0,
    activeQuestions: [],
    timer: 25,
    timerInterval: null
};

let gameStats = JSON.parse(localStorage.getItem('brainstorm_stats')) || {
    totalPlayed: 0,
    highestScore: 0,
    correctAnswers: 0
};

let achievements = JSON.parse(localStorage.getItem('brainstorm_achv')) || [
    { id: 1, title: "Pemula Pintar", desc: "Selesaikan 1 game pertama", unlocked: false },
    { id: 2, title: "Master Otak", desc: "Raih skor di atas 500", unlocked: false },
    { id: 3, title: "Anti Salah", desc: "Jawab benar 5 kali beruntun", unlocked: false }
];

let themes = ['theme-ocean', 'theme-planet', 'theme-dark'];
let currentThemeIndex = 0;
let soundEnabled = true;

// Inisialisasi awal
window.onload = () => {
    generatePlayerId();
    loadStats();
    loadAchievements();
};

function generatePlayerId() {
    const randomId = 'ID-' + Math.floor(1000 + Math.random() * 9000);
    document.getElementById('playerIdDisplay').innerText = randomId;
    player.id = randomId;
}

function openScreen(screenId) {
    playSound('click');
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    if(screenId === 'screen-leaderboard') renderLeaderboard();
}

// --- SOUND & MUSIC CONTROL ---
function playSound(type) {
    if(!soundEnabled) return;
    if(type === 'click') document.getElementById('soundClick').play();
    if(type === 'correct') document.getElementById('soundCorrect').play();
    if(type === 'wrong') document.getElementById('soundWrong').play();
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const bgMusic = document.getElementById('bgMusic');
    const btnIcon = document.querySelector('#soundToggleBtn i');
    if(soundEnabled) {
        btnIcon.className = "fa-solid fa-volume-high";
        bgMusic.play();
    } else {
        btnIcon.className = "fa-solid fa-volume-xmark";
        bgMusic.pause();
    }
}

// --- TEMA CONTROL ---
function toggleTheme() {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    document.body.className = themes[currentThemeIndex];
    playSound('click');
}

// --- GAME LOGIC ---
function startGame() {
    const nameInput = document.getElementById('playerName').value.trim();
    player.name = nameInput !== "" ? nameInput : "Anonymous";
    
    // Reset State
    player.score = 0;
    player.lives = 7;
    player.currentQuestionIndex = 0;
    
    // Acak 10 soal dari bank soal
    player.activeQuestions = [...questionBank].sort(() => 0.5 - Math.random()).slice(0, 10);

    openScreen('screen-game');
    if(soundEnabled) document.getElementById('bgMusic').play();
    loadQuestion();
}

function loadQuestion() {
    if(player.currentQuestionIndex >= 10 || player.lives <= 0) {
        endGame();
        return;
    }

    clearInterval(player.timerInterval);
    player.timer = 25;
    document.getElementById('timerVal').innerText = player.timer;
    startTimer();

    const qData = player.activeQuestions[player.currentQuestionIndex];
    document.getElementById('qCurrent').innerText = player.currentQuestionIndex + 1;
    document.getElementById('questionText').innerText = qData.q;
    document.getElementById('livesVal').innerText = player.lives;
    document.getElementById('scoreVal').innerText = player.score;

    // Update Progress Bar
    const progressPercent = ((player.currentQuestionIndex) / 10) * 100;
    document.getElementById('progressBar').style.width = progressPercent + '%';

    const grid = document.getElementById('answersGrid');
    grid.innerHTML = '';

    qData.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(idx, btn);
        grid.appendChild(btn);
    });
}

function startTimer() {
    const bar = document.getElementById('progressBar');
    player.timerInterval = setInterval(() => {
        player.timer--;
        document.getElementById('timerVal').innerText = player.timer;
        if(player.timer <= 0) {
            clearInterval(player.timerInterval);
            handleWrongAnswer();
        }
    }, 1000);
}

function checkAnswer(selectedIdx, btnElement) {
    clearInterval(player.timerInterval);
    const qData = player.activeQuestions[player.currentQuestionIndex];
    const allButtons = document.querySelectorAll('.answer-btn');
    
    // Disable semua tombol setelah dipilih
    allButtons.forEach(b => b.disabled = true);

    if(selectedIdx === qData.answer) {
        btnElement.classList.add('correct');
        playSound('correct');
        // Bonus Skor berdasarkan sisa waktu
        let bonus = player.timer * 2;
        player.score += 100 + bonus;
        gameStats.correctAnswers++;
    } else {
        btnElement.classList.add('wrong');
        allButtons[qData.answer].classList.add('correct');
        playSound('wrong');
        player.lives--;
    }

    setTimeout(() => {
        player.currentQuestionIndex++;
        loadQuestion();
    }, 1000);
}

function handleWrongAnswer() {
    playSound('wrong');
    player.lives--;
    setTimeout(() => {
        player.currentQuestionIndex++;
        loadQuestion();
    }, 1000);
}

function endGame() {
    clearInterval(player.timerInterval);
    document.getElementById('bgMusic').pause();
    openScreen('screen-gameover');

    document.getElementById('finalScore').innerText = player.score;
    
    // Update Stats & LocalStorage Leaderboard
    gameStats.totalPlayed++;
    if(player.score > gameStats.highestScore) gameStats.highestScore = player.score;
    localStorage.setItem('brainstorm_stats', JSON.stringify(gameStats));

    saveLeaderboardData();
    checkAchievementsUnlock();

    // Trigger Confetti jika skor tinggi
    if(player.score > 300) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
}

// --- LEADERBOARD & STORAGE ---
function saveLeaderboardData() {
    let lb = JSON.parse(localStorage.getItem('brainstorm_lb')) || [];
    lb.push({ name: player.name, id: player.id, score: player.score });
    lb.sort((a, b) => b.score - a.score);
    lb = lb.slice(0, 10); // Ambil top 10
    localStorage.setItem('brainstorm_lb', JSON.stringify(lb));
}

function renderLeaderboard() {
    const list = document.getElementById('leaderboardList');
    let lb = JSON.parse(localStorage.getItem('brainstorm_lb')) || [];
    list.innerHTML = '';

    if(lb.length === 0) {
        list.innerHTML = '<p style="text-align:center; opacity:0.6;">Belum ada skor tersimpan.</p>';
        return;
    }

    lb.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `<span>#${index + 1} <b>${item.name}</b> (${item.id})</span> <span>${item.score} pts</span>`;
        list.appendChild(div);
    });
}

function loadStats() {
    document.getElementById('statTotalPlayed').innerText = gameStats.totalPlayed;
    document.getElementById('statHighestScore').innerText = gameStats.highestScore;
    document.getElementById('statCorrectAnswers').innerText = gameStats.correctAnswers;
}

// --- ACHIEVEMENTS ---
function checkAchievementsUnlock() {
    if(gameStats.totalPlayed >= 1) achievements[0].unlocked = true;
    if(player.score >= 500) achievements[1].unlocked = true;
    localStorage.setItem('brainstorm_achv', JSON.stringify(achievements));
    loadAchievements();
}

function loadAchievements() {
    const list = document.getElementById('achievementList');
    list.innerHTML = '';
    achievements.forEach(ach => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `<span><i class="fa-solid fa-medal" style="color: ${ach.unlocked ? '#f1c40f' : '#7f8c8d'}"></i> <b>${ach.title}</b><br><small>${ach.desc}</small></span> <span>${ach.unlocked ? '✅' : '🔒'}</span>`;
        list.appendChild(div);
    });
}

// --- SHARE FEATURE ---
function shareTo(platform) {
    const text = `Halo! Aku baru saja main game BrainStorm dan mendapat skor ${player.score}! Yuk coba asah otakmu juga! ID-ku: ${player.id}`;
    if(platform === 'whatsapp') {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    } else if(platform === 'instagram') {
        // Karena IG direct web share terbatas, arahkan salin teks/bagikan umum
        navigator.clipboard.writeText(text);
        alert("Skor disalin ke clipboard! Bagikan ke Story/DM Instagram kamu.");
    }
}
