// ================= DATA SOAL (50 Soal Bank Data, Diacak 25 per Sesi) =================
const questionBank = [
    { q: "Manakah yang tidak termasuk kelompok warna primer?", o: ["Merah", "Kuning", "Hijau", "Biru"], a: 2, cat: "Umum" },
    { q: "Jika 5 kucing menangkap 5 tikus dalam 5 menit, berapa menit yang dibutuhkan 100 kucing untuk menangkap 100 tikus?", o: ["100 menit", "5 menit", "25 menit", "1 menit"], a: 1, cat: "Logika" },
    { q: "Berapa jumlah titik pada sebuah buah Dadu?", o: ["15", "21", "18", "24"], a: 1, cat: "Matematika" },
    { q: "Hewan apa yang paling berat di bumi?", o: ["Gajah Afrika", "Paus Biru", "Paus Sperma", "Hiu Paus"], a: 1, cat: "Sains" },
    { q: "Kota manakah yang dijuluki sebagai 'Kota Pahlawan' di Indonesia?", o: ["Jakarta", "Bandung", "Surabaya", "Semarang"], a: 2, cat: "Sejarah" },
    { q: "Lanjutkan deret angka berikut: 2, 3, 5, 7, 11, ...", o: ["12", "13", "15", "17"], a: 1, cat: "Matematika" },
    { q: "Berapa banyak sisi yang dimiliki oleh bangun ruang Kubus?", o: ["6", "8", "12", "4"], a: 0, cat: "Matematika" },
    { q: "Bulan apa yang memiliki 28 hari dalam kalender masehi?", o: ["Februari", "Semua bulan", "Desember", "Januari"], a: 1, cat: "Logika" },
    { q: "Unsur kimia dengan lambang 'Au' adalah?", o: ["Perak", "Emas", "Tembaga", "Aluminium"], a: 1, cat: "Sains" },
    { q: "Benua terkecil di dunia berdasarkan luas daratan adalah?", o: ["Eropa", "Antarktika", "Australia", "Amerika Utara"], a: 2, cat: "Geografi" },
    { q: "Siapakah penemu mesin lampu pijar komersial?", o: ["Nikola Tesla", "Thomas Alva Edison", "Albert Einstein", "Alexander Graham Bell"], a: 1, cat: "Sains" },
    { q: "Alat musik tradisional Angklung berasal dari provinsi mana?", o: ["Bali", "Jawa Tengah", "Jawa Barat", "Sumatera Barat"], a: 2, cat: "Budaya" },
    { q: "Jika kemarin adalah lusa dari hari Kamis, hari apakah hari ini?", o: ["Senin", "Selasa", "Rabu", "Jumat"], a: 1, cat: "Logika" },
    { q: "Berapa hasil dari 50 + 50 x 0 - 25?", o: ["25", "0", "50", "75"], a: 0, cat: "Matematika" },
    { q: "Planet manakah yang letaknya paling dekat dengan Matahari?", o: ["Venus", "Merkurius", "Bumi", "Mars"], a: 1, cat: "Sains" },
    { q: "Ibu kota negara Australia adalah?", o: ["Sydney", "Melbourne", "Canberra", "Brisbane"], a: 2, cat: "Geografi" },
    { q: "Apa nama alat untuk mengukur gempa bumi?", o: ["Barometer", "Termometer", "Seismograf", "Anemometer"], a: 2, cat: "Sains" },
    { q: "Ada berapa huruf vokal dalam abjad bahasa Indonesia?", o: ["4", "5", "6", "7"], a: 1, cat: "Umum" },
    { q: "Gunung tertinggi di dunia adalah Gunung Everest, di perbatasan negara mana?", o: ["Nepal & Tiongkok", "India & Pakistan", "Chile & Argentina", "Kenya & Tanzania"], a: 0, cat: "Geografi" },
    { q: "Apa mata uang resmi dari negara Jepang?", o: ["Yuan", "Won", "Yen", "Ringgit"], a: 2, cat: "Umum" }
];

// ================= STATE GAME =================
let gameState = {
    playerName: "",
    playerId: "",
    score: 0,
    lives: 4,
    currentQuestionIndex: 0,
    activeQuestions: [],
    timer: null,
    timeLeft: 25,
    consecutiveCorrect: 0,
    totalCorrect: 0,
    stats: {
        gamesPlayed: 0,
        highScore: 0,
        totalCorrectAnswers: 0
    },
    achievements: {
        firstWin: false,
        streakMaster: false,
        genius: false
    },
    settings: {
        theme: "dark",
        music: true
    }
};

// ================= DOM ELEMENTS =================
const menuScreen = document.getElementById("menuScreen");
const gameScreen = document.getElementById("gameScreen");
const resultScreen = document.getElementById("resultScreen");

const startBtn = document.getElementById("startBtn");
const playerNameInput = document.getElementById("playerName");
const playerIdDisplay = document.getElementById("playerIdDisplay");

const livesDisplay = document.getElementById("livesDisplay");
const timerDisplay = document.getElementById("timerDisplay");
const scoreDisplay = document.getElementById("scoreDisplay");
const progressBar = document.getElementById("progressBar");

const questionCounter = document.getElementById("questionCounter");
const questionCategory = document.getElementById("questionCategory");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");

const resultTitle = document.getElementById("resultTitle");
const resultIcon = document.getElementById("resultIcon");
const finalScore = document.getElementById("finalScore");
const finalRank = document.getElementById("finalRank");
const finalBonus = document.getElementById("finalBonus");
const finalCorrect = document.getElementById("finalCorrect");
const restartBtn = document.getElementById("restartBtn");
const homeBtn = document.getElementById("homeBtn");

const shareWaBtn = document.getElementById("shareWaBtn");
const shareIgBtn = document.getElementById("shareIgBtn");

const themeToggleBtn = document.getElementById("themeToggleBtn");
const musicToggleBtn = document.getElementById("musicToggleBtn");
const bgMusic = document.getElementById("bgMusic");

const statsModal = document.getElementById("statsModal");
const openStatsBtn = document.getElementById("openStatsBtn");
const closeStatsModal = document.getElementById("closeStatsModal");
const statsContent = document.getElementById("statsContent");

const achModal = document.getElementById("achModal");
const openAchBtn = document.getElementById("openAchBtn");
const closeAchModal = document.getElementById("closeAchModal");
const achContent = document.getElementById("achContent");

// ================= INIT & LOCALSTORAGE =================
function init() {
    loadLocalStorage();
    generatePlayerId();
    applyTheme();

    // Event Listeners
    startBtn.addEventListener("click", startGame);
    restartBtn.addEventListener("click", startGame);
    homeBtn.addEventListener("click", goToMenu);

    themeToggleBtn.addEventListener("click", toggleTheme);
    musicToggleBtn.addEventListener("click", toggleMusic);

    openStatsBtn.addEventListener("click", showStats);
    closeStatsBtn.addEventListener("click", () => statsModal.classList.remove("active"));
    
    openAchBtn.addEventListener("click", showAchievements);
    closeAchModal.addEventListener("click", () => achModal.classList.remove("active"));

    shareWaBtn.addEventListener("click", shareToWhatsApp);
    shareIgBtn.addEventListener("click", shareToInstagram);

    playerNameInput.addEventListener("input", (e) => {
        gameState.playerName = e.target.value.trim();
        saveLocalStorage();
    });
}

function generatePlayerId() {
    if (!gameState.playerId) {
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        gameState.playerId = `AO-${randomNum}`;
        saveLocalStorage();
    }
    playerIdDisplay.textContent = `ID: ${gameState.playerId}`;
    if (gameState.playerName) {
        playerNameInput.value = gameState.playerName;
    }
}

function loadLocalStorage() {
    const saved = localStorage.getItem("brainGameData");
    if (saved) {
        const data = JSON.parse(saved);
        gameState.playerName = data.playerName || "";
        gameState.playerId = data.playerId || "";
        gameState.stats = data.stats || gameState.stats;
        gameState.achievements = data.achievements || gameState.achievements;
        gameState.settings = data.settings || gameState.settings;
    }
}

function saveLocalStorage() {
    localStorage.setItem("brainGameData", JSON.stringify({
        playerName: gameState.playerName,
        playerId: gameState.playerId,
        stats: gameState.stats,
        achievements: gameState.achievements,
        settings: gameState.settings
    }));
}

// ================= AUDIO & THEME =================
function toggleTheme() {
    gameState.settings.theme = gameState.settings.theme === "dark" ? "light" : "dark";
    applyTheme();
    saveLocalStorage();
}

function applyTheme() {
    document.body.setAttribute("data-theme", gameState.settings.theme);
}

function toggleMusic() {
    gameState.settings.music = !gameState.settings.music;
    if (gameState.settings.music) {
        bgMusic.play().catch(() => {});
        musicToggleBtn.innerHTML = '<i class="fa-solid fa-music"></i>';
    } else {
        bgMusic.pause();
        musicToggleBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    }
    saveLocalStorage();
}

// ================= GAME LOGIC =================
function startGame() {
    if (!gameState.playerName) {
        gameState.playerName = "Pemain Misterius";
    }

    // Reset Game Stats
    gameState.score = 0;
    gameState.lives = 4;
    gameState.currentQuestionIndex = 0;
    gameState.consecutiveCorrect = 0;
    gameState.totalCorrect = 0;

    // Ambil 20 soal acak dari bank soal
    gameState.activeQuestions = [...questionBank].sort(() => 0.5 - Math.random()).slice(0, 20);

    switchScreen(gameScreen);
    playMusicIfNeeded();
    loadQuestion();
}

function playMusicIfNeeded() {
    if (gameState.settings.music) {
        bgMusic.play().catch(() => {});
    }
}

function switchScreen(screen) {
    [menuScreen, gameScreen, resultScreen].forEach(s => s.classList.remove("active"));
    screen.classList.add("active");
}

function loadQuestion() {
    if (gameState.currentQuestionIndex >= gameState.activeQuestions.length || gameState.lives <= 0) {
        endGame();
        return;
    }

    const q = gameState.activeQuestions[gameState.currentQuestionIndex];
    questionCounter.textContent = `Soal ${gameState.currentQuestionIndex + 1} dari ${gameState.activeQuestions.length}`;
    questionCategory.textContent = q.cat;
    questionText.textContent = q.q;

    livesDisplay.textContent = gameState.lives;
    scoreDisplay.textContent = gameState.score;

    // Render Options
    optionsContainer.innerHTML = "";
    q.o.forEach((opt, index) => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerHTML = `<span>${opt}</span> <i class="fa-regular fa-circle"></i>`;
        btn.addEventListener("click", () => handleAnswer(index, btn));
        optionsContainer.appendChild(btn);
    });

    startTimer();
}

function startTimer() {
    clearInterval(gameState.timer);
    gameState.timeLeft = 25;
    timerDisplay.textContent = gameState.timeLeft;
    progressBar.style.width = "100%";

    const totalTime = 25;
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        timerDisplay.textContent = gameState.timeLeft;
        progressBar.style.width = `${(gameState.timeLeft / totalTime) * 100}%`;

        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timer);
            handleTimeOut();
        }
    }, 1000);
}

function handleTimeOut() {
    gameState.lives--;
    gameState.consecutiveCorrect = 0;
    livesDisplay.textContent = gameState.lives;
    
    // Highlight jawaban benar
    const q = gameState.activeQuestions[gameState.currentQuestionIndex];
    const buttons = optionsContainer.querySelectorAll(".option-btn");
    buttons[q.a].classList.add("correct");

    disableOptions();

    setTimeout(() => {
        gameState.currentQuestionIndex++;
        loadQuestion();
    }, 1200);
}

function handleAnswer(selectedIndex, selectedBtn) {
    clearInterval(gameState.timer);
    const q = gameState.activeQuestions[gameState.currentQuestionIndex];
    const buttons = optionsContainer.querySelectorAll(".option-btn");

    disableOptions();

    if (selectedIndex === q.a) {
        selectedBtn.classList.add("correct");
        selectedBtn.querySelector("i").className = "fa-solid fa-circle-check";
        
        // Perhitungan Skor & Bonus Waktu
        let baseScore = 100;
        let timeBonus = gameState.timeLeft * 3;
        gameState.score += baseScore + timeBonus;
        
        gameState.consecutiveCorrect++;
        gameState.totalCorrect++;

        // Cek Bonus Streak
        if (gameState.consecutiveCorrect >= 3) {
            gameState.score += 50; // Bonus Streak
        }
    } else {
        selectedBtn.classList.add("wrong");
        selectedBtn.querySelector("i").className = "fa-solid fa-circle-xmark";
        buttons[q.a].classList.add("correct"); // Tampilkan yang benar
        
        gameState.lives--;
        gameState.consecutiveCorrect = 0;
        livesDisplay.textContent = gameState.lives;
    }

    scoreDisplay.textContent = gameState.score;

    setTimeout(() => {
        gameState.currentQuestionIndex++;
        loadQuestion();
    }, 1200);
}

function disableOptions() {
    const buttons = optionsContainer.querySelectorAll(".option-btn");
    buttons.forEach(b => b.style.pointerEvents = "none");
}

// ================= END GAME & RANKING =================
function endGame() {
    clearInterval(gameState.timer);
    switchScreen(resultScreen);

    // Update Stats
    gameState.stats.gamesPlayed++;
    gameState.stats.totalCorrectAnswers += gameState.totalCorrect;
    if (gameState.score > gameState.stats.highScore) {
        gameState.stats.highScore = gameState.score;
    }

    // Check Achievements
    if (gameState.stats.gamesPlayed >= 1) gameState.achievements.firstWin = true;
    if (gameState.consecutiveCorrect >= 5 || gameState.totalCorrect >= 15) gameState.achievements.streakMaster = true;
    if (gameState.score >= 2500) gameState.achievements.genius = true;
    saveLocalStorage();

    // Hitung Bonus Skor Total & Rank
    let completionBonus = gameState.lives * 100;
    let totalFinalScore = gameState.score + completionBonus;
    finalScore.textContent = totalFinalScore;
    finalBonus.textContent = `+${completionBonus}`;
    finalCorrect.textContent = `${gameState.totalCorrect}/20`;

    // Tentukan Rank
    let rank = "Pemula Otak";
    let icon = "🧠";
    if (totalFinalScore > 3500) { rank = "Albert Einstein Legend 🌌"; icon = "👑"; }
    else if (totalFinalScore > 2500) { rank = "Master Logika ⚡"; icon = "🔥"; }
    else if (totalFinalScore > 1500) { rank = "Cendekiawan Pintar 📚"; icon = "⭐"; }

    finalRank.textContent = rank;
    resultIcon.textContent = icon;

    if (totalFinalScore > 1500) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
}

// ================= MODALS & SHARE =================
function showStats() {
    statsContent.innerHTML = `
        <div class="stat-row"><span>Nama Pemain</span> <strong>${gameState.playerName || '-'}</strong></div>
        <div class="stat-row"><span>ID Pemain</span> <strong>${gameState.playerId}</strong></div>
        <div class="stat-row"><span>Total Main</span> <strong>${gameState.stats.gamesPlayed}x</strong></div>
        <div class="stat-row"><span>Skor Tertinggi</span> <strong>${gameState.stats.highScore}</strong></div>
        <div class="stat-row"><span>Akumulasi Benar</span> <strong>${gameState.stats.totalCorrectAnswers} Soal</strong></div>
    `;
    statsModal.classList.add("active");
}

function showAchievements() {
    achContent.innerHTML = `
        <div class="ach-item ${gameState.achievements.firstWin ? '' : 'locked'}">
            <div class="ach-icon">🏁</div>
            <div class="ach-info">
                <h4>Langkah Pertama</h4>
                <p>Menyelesaikan sesi permainan pertamamu.</p>
            </div>
        </div>
        <div class="ach-item ${gameState.achievements.streakMaster ? '' : 'locked'}">
            <div class="ach-icon">🔥</div>
            <div class="ach-info">
                <h4>Master Beruntun</h4>
                <p>Menjawab banyak soal dengan benar berturut-turut.</p>
            </div>
        </div>
        <div class="ach-item ${gameState.achievements.genius ? '' : 'locked'}">
            <div class="ach-icon">🧠</div>
            <div class="ach-info">
                <h4>Jenius Sejati</h4>
                <p>Meraih skor total lebih dari 2500 poin.</p>
            </div>
        </div>
    `;
    achModal.classList.add("active");
}

function goToMenu() {
    switchScreen(menuScreen);
}

function shareToWhatsApp() {
    const text = `Halo! Aku baru saja main Asah Otak Master 🧠\nNama: ${gameState.playerName} (${gameState.playerId})\nSkor: ${finalScore.textContent}\nRank: ${finalRank.textContent}\nYuk uji kecerdasanmu juga!`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
}

function shareToInstagram() {
    const text = `Skor Asah Otakku: ${finalScore.textContent} (${finalRank.textContent})! ID: ${gameState.playerId}. Tantang aku kalau berani! 🧠🔥`;
    navigator.clipboard.writeText(text).then(() => {
        alert("Teks berhasil disalin! Tempelkan di Story/Caption Instagram kamu.");
    });
}

// Jalankan aplikasi saat DOM siap
document.addEventListener("DOMContentLoaded", init);
