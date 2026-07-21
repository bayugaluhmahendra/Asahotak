/* ==========================================
   Brain Challenge Ultimate
   Script.js - Bagian 1
========================================== */

// ==========================
// ELEMENT
// ==========================

const loading = document.getElementById("loading");
const menu = document.getElementById("menu");
const game = document.getElementById("game");
const result = document.getElementById("result");

const playBtn = document.getElementById("playBtn");
const playAgain = document.getElementById("playAgain");

const playerID = document.getElementById("playerID");

const lifeText = document.getElementById("life");
const timerText = document.getElementById("timer");
const comboText = document.getElementById("combo");
const scoreText = document.getElementById("score");

const progressBar = document.getElementById("progressBar");

const question = document.getElementById("question");
const answers = document.querySelectorAll(".answer");

// ==========================
// DATA GAME
// ==========================

let lives = 4;
let timer = 25;
let score = 0;
let combo = 0;
let bestCombo = 0;

let currentQuestion = null;

let timerInterval = null;

// ==========================
// PLAYER ID
// ==========================

function generatePlayerID(){

let id =
"BC-" +
Math.floor(
100000 + Math.random()*900000
);

localStorage.setItem(
"brainPlayer",
id
);

return id;

}

let savedPlayer =
localStorage.getItem("brainPlayer");

if(savedPlayer==null){

savedPlayer=
generatePlayerID();

}

playerID.innerHTML=savedPlayer;

// ==========================
// LOADING
// ==========================

setTimeout(()=>{

loading.classList.add("hidden");

menu.classList.remove("hidden");

},1500);

// ==========================
// UPDATE HUD
// ==========================

function updateHUD(){

lifeText.innerHTML=lives;

timerText.innerHTML=timer;

comboText.innerHTML=combo;

scoreText.innerHTML=score;

progressBar.style.width=(timer/25)*100+"%";

}

// ==========================
// TIMER
// ==========================

function startTimer(){

clearInterval(timerInterval);

timer=25;

updateHUD();

timerInterval=setInterval(()=>{

timer--;

updateHUD();

if(timer<=0){

loseLife();

}

},1000);

}

// ==========================
// NYAWA
// ==========================

function loseLife(){

clearInterval(timerInterval);

lives--;

combo=0;

updateHUD();

if(lives<=0){

gameOver();

return;

}

setTimeout(()=>{

nextQuestion();

},800);

}

// ==========================
// SCORE
// ==========================

function addScore(){

let bonus=timer*5;

score+=100+bonus+(combo*20);

combo++;

if(combo>bestCombo){

bestCombo=combo;

}

updateHUD();

}

// ==========================
// RESET GAME
// ==========================

function resetGame(){

lives=4;

timer=25;

score=0;

combo=0;

bestCombo=0;

updateHUD();

}

// ==========================
// START GAME
// ==========================

playBtn.onclick=()=>{

menu.classList.add("hidden");

game.classList.remove("hidden");

resetGame();

nextQuestion();

}

playAgain.onclick=()=>{

result.classList.add("hidden");

game.classList.remove("hidden");

resetGame();

nextQuestion();

}

// ==========================
// GAME OVER
// ==========================

function gameOver(){

clearInterval(timerInterval);

game.classList.add("hidden");

result.classList.remove("hidden");

document.getElementById("finalScore").innerHTML=score;

document.getElementById("bestCombo").innerHTML=bestCombo;

document.getElementById("rank").innerHTML=getRank(score);

saveHighScore();

}

// ==========================
// RANK
// ==========================

function getRank(score){

if(score<1000)return"Bronze";

if(score<3000)return"Silver";

if(score<6000)return"Gold";

if(score<9000)return"Platinum";

if(score<12000)return"Diamond";

return"Legend";

}

// ==========================
// HIGHSCORE
// ==========================

function saveHighScore(){

let hs=
localStorage.getItem("highScore");

if(hs==null){

hs=0;

}

if(score>Number(hs)){

localStorage.setItem(
"highScore",
score
);

}

}

// ==========================
// PLACEHOLDER
// ==========================

function nextQuestion(){

// Akan dibuat pada Bagian 2
question.innerHTML="Loading soal...";

answers.forEach(btn=>{

btn.innerHTML="...";

btn.onclick=null;

});

startTimer();

}

// ==========================

updateHUD();

/* ==========================================
   SCRIPT.JS - BAGIAN 2
   Sistem Soal & Jawaban
========================================== */

// ==========================
// DATA SOAL
// ==========================

const colorQuestions = [
  { q: "Apa warna langit saat siang?", a: "Biru", o: ["Merah","Hijau","Biru","Hitam"] },
  { q: "Apa warna daun?", a: "Hijau", o: ["Biru","Hijau","Ungu","Abu"] },
  { q: "Apa warna pisang matang?", a: "Kuning", o: ["Merah","Kuning","Hitam","Putih"] },
  { q: "Apa warna darah?", a: "Merah", o: ["Biru","Merah","Hijau","Pink"] }
];

// ==========================
// MATEMATIKA
// ==========================

function mathQuestion(){

    let a=Math.floor(Math.random()*20)+1;
    let b=Math.floor(Math.random()*20)+1;

    let ops=["+","-","×"];

    let op=ops[Math.floor(Math.random()*ops.length)];

    let answer;

    if(op==="+") answer=a+b;
    if(op==="-") answer=a-b;
    if(op==="×") answer=a*b;

    let options=[answer];

    while(options.length<4){

        let fake=answer+Math.floor(Math.random()*15)-7;

        if(fake!==answer && !options.includes(fake))
            options.push(fake);

    }

    options.sort(()=>Math.random()-0.5);

    return{

        question:`${a} ${op} ${b} = ?`,

        answer,

        options

    };

}

// ==========================
// SOAL WARNA
// ==========================

function randomColorQuestion(){

    return colorQuestions[
        Math.floor(Math.random()*colorQuestions.length)
    ];

}

// ==========================
// PILIH SOAL
// ==========================

function generateQuestion(){

    let random=Math.random();

    if(random<0.7){

        return mathQuestion();

    }else{

        return randomColorQuestion();

    }

}

// ==========================
// SOAL BERIKUTNYA
// ==========================

function nextQuestion(){

    clearInterval(timerInterval);

    currentQuestion=generateQuestion();

    question.innerHTML=currentQuestion.question || currentQuestion.q;

    let options=currentQuestion.options || currentQuestion.o;

    answers.forEach((btn,index)=>{

        btn.innerHTML=options[index];

        btn.onclick=()=>{

            checkAnswer(options[index]);

        };

    });

    startTimer();

}

// ==========================
// CEK JAWABAN
// ==========================

function checkAnswer(answer){

    clearInterval(timerInterval);

    let correct=currentQuestion.answer || currentQuestion.a;

    if(String(answer)===String(correct)){

        addScore();

        buttonFlash("green");

        setTimeout(nextQuestion,500);

    }else{

        combo=0;

        loseLife();

        buttonFlash("red");

    }

}

// ==========================
// EFEK TOMBOL
// ==========================

function buttonFlash(color){

    answers.forEach(btn=>{

        btn.style.background=color;

    });

    setTimeout(()=>{

        answers.forEach(btn=>{

            btn.style.background="";

        });

    },250);

}

/* ==========================================
   SCRIPT.JS - BAGIAN 3
   Level, Statistik, Achievement
========================================== */

// ===== LEVEL =====
let level = 1;
let correctCount = 0;

const levelText = document.createElement("div");
levelText.className = "box";
levelText.innerHTML = `🎯 <span id="level">${level}</span>`;

const hud = document.getElementById("hud");
if (hud.children.length === 4) {
    hud.appendChild(levelText);
}

function updateLevel() {
    document.getElementById("level").textContent = level;
}

function levelUp() {
    if (correctCount > 0 && correctCount % 10 === 0) {
        level++;
        updateLevel();
        showToast(`🎉 Level ${level}!`);
    }
}

// ===== COMBO MULTIPLIER =====
function getComboMultiplier() {
    if (combo >= 20) return 4;
    if (combo >= 15) return 3;
    if (combo >= 10) return 2;
    if (combo >= 5) return 1.5;
    return 1;
}

// Ganti isi addScore() lama dengan versi ini
function addScore() {

    const bonusTime = timer * 10;
    const multi = getComboMultiplier();

    score += Math.floor((100 + bonusTime) * multi);

    combo++;
    correctCount++;

    if (combo > bestCombo) bestCombo = combo;

    levelUp();

    updateHUD();
}

// ===== SOAL LOGIKA =====

const logicQuestions = [

{
q:"Mana yang lebih besar?",
o:["15","9","12","7"],
a:"15"
},

{
q:"2,4,6,8,...?",
o:["10","12","9","11"],
a:"10"
},

{
q:"5+5×2 = ?",
o:["20","15","10","25"],
a:"15"
},

{
q:"Huruf setelah D?",
o:["E","F","G","H"],
a:"E"
}

];

// Tambahkan ke generateQuestion()

// if(random<0.55) return mathQuestion();
// if(random<0.80) return randomColorQuestion();
// return logicQuestions[Math.floor(Math.random()*logicQuestions.length)];


// ===== BONUS CEPAT =====

function fastBonus(){

if(timer>=20){

score+=500;

showToast("⚡ Bonus Cepat +500");

}

}

// panggil fastBonus()
// setelah jawaban benar


// ===== SHAKE =====

function screenShake(){

document.body.classList.add("shake");

setTimeout(()=>{

document.body.classList.remove("shake");

},400);

}


// panggil screenShake()
// saat jawaban salah


// ===== SOUND =====

const soundCorrect=new Audio("audio/correct.mp3");

const soundWrong=new Audio("audio/wrong.mp3");

const soundWin=new Audio("audio/win.mp3");


// saat benar

// soundCorrect.play()

// saat salah

// soundWrong.play()

// saat menang

// soundWin.play()


// ===== CONFETTI =====

function confetti(){

for(let i=0;i<80;i++){

let d=document.createElement("div");

d.className="confetti";

d.style.left=Math.random()*100+"vw";

d.style.background=
`hsl(${Math.random()*360},100%,50%)`;

d.style.animationDuration=
2+Math.random()*3+"s";

document.body.appendChild(d);

setTimeout(()=>{

d.remove();

},5000);

}

}


// ===== TOAST =====

function showToast(text){

let t=document.createElement("div");

t.className="toast";

t.innerHTML=text;

document.body.appendChild(t);

setTimeout(()=>{

t.classList.add("show");

},50);

setTimeout(()=>{

t.remove();

},2200);

}


// ===== STATISTIK =====

const stats={

played:Number(localStorage.getItem("played"))||0,

correct:Number(localStorage.getItem("correct"))||0,

wrong:Number(localStorage.getItem("wrong"))||0,

high:Number(localStorage.getItem("highScore"))||0

};

function saveStats(){

localStorage.setItem("played",stats.played);

localStorage.setItem("correct",stats.correct);

localStorage.setItem("wrong",stats.wrong);

localStorage.setItem("highScore",Math.max(stats.high,score));

}


// ===== ACHIEVEMENT =====

const achievements=[];

function unlock(name){

if(!achievements.includes(name)){

achievements.push(name);

showToast("🏆 "+name);

}

}

// Contoh

if(score>=5000){

unlock("Score Master");

}

if(bestCombo>=10){

unlock("Combo King");

}

if(level>=5){

unlock("Level Hunter");

}

/* ==========================================
   SCRIPT.JS - BAGIAN 4
   Leaderboard, Theme, Reward, Shop
========================================== */

// ==========================
// COIN
// ==========================

let coins = Number(localStorage.getItem("coins")) || 0;

function addCoins(amount){

    coins += amount;

    localStorage.setItem("coins", coins);

    showToast("🪙 +" + amount + " Coin");

}

// setiap jawaban benar
// addCoins(5);


// ==========================
// DAILY REWARD
// ==========================

function dailyReward(){

    const today = new Date().toDateString();

    const last = localStorage.getItem("dailyReward");

    if(last !== today){

        addCoins(100);

        showToast("🎁 Daily Reward +100 Coin");

        localStorage.setItem("dailyReward", today);

    }

}

dailyReward();


// ==========================
// LOGIN STREAK
// ==========================

let streak = Number(localStorage.getItem("streak")) || 0;

const lastLogin = localStorage.getItem("lastLogin");

const today = new Date().toDateString();

if(lastLogin !== today){

    streak++;

    localStorage.setItem("streak", streak);

    localStorage.setItem("lastLogin", today);

}

showToast("🔥 Streak " + streak + " Hari");


// ==========================
// LEADERBOARD
// ==========================

let leaderboard = JSON.parse(
localStorage.getItem("leaderboard")
) || [];

function saveLeaderboard(){

    leaderboard.push({

        id: savedPlayer,

        score: score,

        date: new Date().toLocaleDateString()

    });

    leaderboard.sort((a,b)=>b.score-a.score);

    leaderboard = leaderboard.slice(0,10);

    localStorage.setItem(
        "leaderboard",
        JSON.stringify(leaderboard)
    );

}


// panggil saat Game Over
// saveLeaderboard();


// ==========================
// THEME
// ==========================

const theme = document.getElementById("theme");

const savedTheme =
localStorage.getItem("theme") || "dark";

document.body.className = savedTheme;

theme.value = savedTheme;

theme.onchange = () => {

    document.body.className = theme.value;

    localStorage.setItem(
        "theme",
        theme.value
    );

};


// ==========================
// SHOP
// ==========================

const shop = [

{ name:"Neon", cost:300 },

{ name:"Ocean", cost:500 },

{ name:"Galaxy", cost:1000 },

{ name:"Gold", cost:2000 }

];

function buyTheme(index){

    const item = shop[index];

    if(coins >= item.cost){

        coins -= item.cost;

        localStorage.setItem("coins", coins);

        showToast("✅ " + item.name + " Dibeli");

    }else{

        showToast("❌ Coin Tidak Cukup");

    }

}


// ==========================
// SHARE WHATSAPP
// ==========================

function shareWhatsApp(){

const text =
`🧠 Brain Challenge

🏆 Score : ${score}

⭐ Combo : ${bestCombo}

🎯 Rank : ${getRank(score)}

Main juga yuk!`;

window.open(

"https://wa.me/?text="+

encodeURIComponent(text)

);

}


// ==========================
// SHARE INSTAGRAM
// ==========================

function shareInstagram(){

alert(

"Instagram tidak mendukung share langsung dari website.\n\nGunakan tombol Screenshot lalu upload ke Story."

);

}


// ==========================
// ACHIEVEMENT
// ==========================

const allAchievements=[

"First Win",
"Combo x5",
"Combo x10",
"Combo x20",
"1000 Score",
"3000 Score",
"5000 Score",
"10000 Score",
"No Damage",
"Speed Runner",
"Level 5",
"Level 10",
"100 Correct",
"500 Correct",
"100 Game",
"Daily Player",
"7 Day Streak",
"30 Day Streak",
"Coin Collector",
"Legend Player"

];

function checkAchievements(){

if(score>=1000)unlock("1000 Score");

if(score>=3000)unlock("3000 Score");

if(score>=5000)unlock("5000 Score");

if(combo>=5)unlock("Combo x5");

if(combo>=10)unlock("Combo x10");

if(combo>=20)unlock("Combo x20");

if(level>=5)unlock("Level 5");

if(level>=10)unlock("Level 10");

if(lives===4)unlock("No Damage");

if(streak>=7)unlock("7 Day Streak");

if(streak>=30)unlock("30 Day Streak");

}

