```javascript
/* ===========================
   Brain Challenge V4
   script.js - Part 1
=========================== */

// ---------- ELEMENT ----------
const startBtn = document.getElementById("startGame");
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");

const lifeEl = document.getElementById("life");
const comboEl = document.getElementById("combo");
const scoreEl = document.getElementById("score");

const timerFill = document.getElementById("timerFill");
const timerText = document.getElementById("timerText");

const currentQuestion = document.getElementById("questionNow");
const playerInfo = document.getElementById("playerInfo");

// ---------- AUDIO ----------
const bgm = document.getElementById("bgm");
const correctSound = document.getElementById("correct");
const wrongSound = document.getElementById("wrong");
const gameOverSound = document.getElementById("gameover");

// ---------- PLAYER ----------
let player = JSON.parse(localStorage.getItem("brainPlayer"));

function createPlayerID(){

const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

let id="BC-";

for(let i=0;i<6;i++){

id+=chars[Math.floor(Math.random()*chars.length)];

}

return id;

}

if(!player){

const nama=prompt("Masukkan nama pemain");

player={

name:nama||"Player",

id:createPlayerID()

};

localStorage.setItem("brainPlayer",JSON.stringify(player));

}

playerInfo.innerHTML=
`👤 ${player.name}<br>🆔 ${player.id}`;

// ---------- GAME ----------
let life=4;
let combo=0;
let score=0;

let timer=25;

let timerInterval;

let current=0;

// ---------- SOAL ----------
const questions=[

{
q:"2 + 2 = ?",
a:["3","4","5","6"],
c:1
},

{
q:"Ibukota Indonesia?",
a:["Bandung","Jakarta","Surabaya","Medan"],
c:1
},

{
q:"Planet Merah?",
a:["Mars","Venus","Saturnus","Jupiter"],
c:0
},

{
q:"10 x 5 = ?",
a:["20","30","40","50"],
c:3
},

{
q:"Huruf pertama alfabet?",
a:["A","B","C","D"],
c:0
},

{
q:"100 : 10 = ?",
a:["20","10","5","15"],
c:1
},

{
q:"5² = ?",
a:["10","20","25","30"],
c:2
},

{
q:"Laut terbesar?",
a:["Atlantik","Pasifik","Hindia","Arktik"],
c:1
},

{
q:"7 x 8 = ?",
a:["54","56","58","60"],
c:1
},

{
q:"HTML singkatan dari?",
a:[
"HyperText Markup Language",
"Home Tool Markup",
"Hyper Link",
"None"
],
c:0
},

{
q:"CSS digunakan untuk?",
a:[
"Database",
"Style Website",
"Server",
"Game"
],
c:1
},

{
q:"JavaScript berjalan di?",
a:[
"Browser",
"Kulkas",
"TV",
"Kamera"
],
c:0
}

];

// ---------- RANDOM ----------
function shuffle(arr){

return arr.sort(()=>Math.random()-0.5);

}

let gameQuestions=[];

// ---------- START ----------
startBtn.onclick=()=>{

bgm.play();

life=4;
combo=0;
score=0;

current=0;

gameQuestions=
shuffle([...questions]).slice(0,10);

updateUI();

showQuestion();

};

// ---------- UI ----------
function updateUI(){

lifeEl.textContent=life;

comboEl.textContent=combo;

scoreEl.textContent=score;

currentQuestion.textContent=current+1;

}

// ---------- SOAL ----------
function showQuestion(){

clearInterval(timerInterval);

timer=25;

timerText.textContent=timer;

timerFill.style.width="100%";

const q=gameQuestions[current];

questionEl.textContent=q.q;

answersEl.innerHTML="";

q.a.forEach((jawaban,index)=>{

const btn=document.createElement("button");

btn.textContent=jawaban;

btn.onclick=()=>answer(index);

answersEl.appendChild(btn);

});

startTimer();

}

// ---------- TIMER ----------
function startTimer(){

timerInterval=setInterval(()=>{

timer--;

timerText.textContent=timer;

timerFill.style.width=(timer/25*100)+"%";

if(timer<=0){

clearInterval(timerInterval);

life--;

combo=0;

nextQuestion();

}

},1000);

}
```

/* ===========================
   SCRIPT.JS PART 2
=========================== */

// ---------- JAWABAN ----------
function answer(index){

    clearInterval(timerInterval);

    const benar = gameQuestions[current].c;
    const buttons = answersEl.querySelectorAll("button");

    buttons.forEach((btn,i)=>{

        btn.disabled = true;

        if(i===benar){
            btn.classList.add("correct");
        }

        if(i===index && i!==benar){
            btn.classList.add("wrong");
        }

    });

    if(index===benar){

        correctSound.currentTime=0;
        correctSound.play();

        combo++;

        // Bonus score
        score += 10 + (combo*2);

        // Bonus waktu tiap combo 5
        if(combo>0 && combo%5===0){
            timer += 5;
            if(timer>25) timer=25;
        }

        comboEl.classList.add("comboGlow");

    }else{

        wrongSound.currentTime=0;
        wrongSound.play();

        combo=0;

        life--;

        document.body.classList.add("shake");

        setTimeout(()=>{
            document.body.classList.remove("shake");
        },400);

    }

    updateUI();

    setTimeout(nextQuestion,1000);

}

// ---------- NEXT ----------
function nextQuestion(){

    if(life<=0){

        finishGame();

        return;

    }

    current++;

    if(current>=gameQuestions.length){

        finishGame();

        return;

    }

    updateUI();

    showQuestion();

}

// ---------- GAME OVER ----------
function finishGame(){

    clearInterval(timerInterval);

    bgm.pause();

    gameOverSound.currentTime=0;
    gameOverSound.play();

    document.getElementById("game").style.display="none";
    document.getElementById("gameOver").style.display="block";

    document.getElementById("finalScore").textContent =
    "Score : "+score;

    let rank="🥉 Beginner";

    if(score>=60) rank="🏅 Advanced";
    if(score>=120) rank="🥈 Pro";
    if(score>=180) rank="🥇 Master";
    if(score>=250) rank="👑 Legend";

    document.getElementById("rank").textContent=rank;

    saveResult(rank);

}

// ---------- SAVE RESULT ----------
function saveResult(rank){

    const board =
    JSON.parse(localStorage.getItem("brainLeaderboard")) || [];

    board.push({

        name:player.name,

        id:player.id,

        score:score,

        rank:rank

    });

    board.sort((a,b)=>b.score-a.score);

    if(board.length>10){
        board.length=10;
    }

    localStorage.setItem(
        "brainLeaderboard",
        JSON.stringify(board)
    );

    loadLeaderboard();

}

// ---------- LOAD BOARD ----------
function loadLeaderboard(){

    const board =
    JSON.parse(localStorage.getItem("brainLeaderboard")) || [];

    const list =
    document.getElementById("leaderboardList");

    list.innerHTML="";

    board.forEach((p,i)=>{

        const li=document.createElement("li");

        let medal="";

        if(i===0) medal="🥇";
        else if(i===1) medal="🥈";
        else if(i===2) medal="🥉";
        else medal="🏅";

        li.innerHTML=`
        <span>
        ${medal}
        ${p.name}<br>
        <small>${p.id}</small>
        </span>

        <span>
        ${p.score}
        </span>
        `;

        list.appendChild(li);

    });

}

loadLeaderboard();

/* ===========================
   SCRIPT.JS PART 3
=========================== */

// ---------- MAIN LAGI ----------
document.getElementById("playAgain").onclick=()=>{

document.getElementById("gameOver").style.display="none";
document.getElementById("game").style.display="block";

life=4;
combo=0;
score=0;
current=0;

gameQuestions=shuffle([...questions]).slice(0,10);

updateUI();

showQuestion();

bgm.currentTime=0;
bgm.play();

};

// ---------- SHARE WA ----------
document.getElementById("shareWA").onclick=()=>{

const text=
`🧠 Brain Challenge V4

👤 ${player.name}
🆔 ${player.id}

🏆 Score : ${score}
⭐ Combo : ${combo}

Berani mengalahkanku?`;

window.open(
"https://wa.me/?text="+encodeURIComponent(text),
"_blank"
);

};

// ---------- SHARE INSTAGRAM ----------
document.getElementById("shareIG").onclick=()=>{

const caption=
`🧠 Brain Challenge

👤 ${player.name}
🆔 ${player.id}

🏆 Score : ${score}

#BrainChallenge
#HTMLGame
#JavaScript`;

navigator.clipboard.writeText(caption);

alert("Caption berhasil disalin.");

};

// ---------- SETTINGS ----------
const settings=document.getElementById("settings");

document.getElementById("openSetting").onclick=()=>{

settings.style.display="flex";

};

document.getElementById("closeSetting").onclick=()=>{

settings.style.display="none";

};

// ---------- TEMA ----------
document.getElementById("themeDark").onclick=()=>{

document.body.className="dark";

localStorage.setItem("theme","dark");

};

document.getElementById("themeLight").onclick=()=>{

document.body.className="light";

localStorage.setItem("theme","light");

};

document.getElementById("themePurple").onclick=()=>{

document.body.className="purple";

localStorage.setItem("theme","purple");

};

document.getElementById("themeOcean").onclick=()=>{

document.body.className="ocean";

localStorage.setItem("theme","ocean");

};

const savedTheme=
localStorage.getItem("theme");

if(savedTheme){

document.body.className=savedTheme;

}

// ---------- MUSIC ----------
let music=true;

document.getElementById("musicBtn").onclick=()=>{

music=!music;

bgm.muted=!music;

correctSound.muted=!music;
wrongSound.muted=!music;
gameOverSound.muted=!music;

};

// ---------- RESET LEADERBOARD ----------
document.getElementById("resetBoard").onclick=()=>{

if(confirm("Reset leaderboard?")){

localStorage.removeItem("brainLeaderboard");

loadLeaderboard();

}

};

// ---------- RESET PROFILE ----------
document.getElementById("resetStats").onclick=()=>{

if(confirm("Reset profil pemain?")){

localStorage.removeItem("brainPlayer");

location.reload();

}

};

// ---------- SPLASH ----------
window.onload=()=>{

setTimeout(()=>{

document.getElementById("splash").style.display="none";

},1800);

};

// ---------- CONFETTI ----------
function showConfetti(){

const canvas=document.getElementById("confetti");

const ctx=canvas.getContext("2d");

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

let pieces=[];

for(let i=0;i<120;i++){

pieces.push({

x:Math.random()*canvas.width,

y:-20,

r:Math.random()*8+4,

dx:(Math.random()-0.5)*4,

dy:Math.random()*5+2

});

}

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

pieces.forEach(p=>{

ctx.beginPath();

ctx.arc(p.x,p.y,p.r,0,Math.PI*2);

ctx.fillStyle=`hsl(${Math.random()*360},100%,50%)`;

ctx.fill();

p.x+=p.dx;

p.y+=p.dy;

});

requestAnimationFrame(draw);

}

draw();

setTimeout(()=>{

ctx.clearRect(0,0,canvas.width,canvas.height);

},4000);

    }/* ===========================
   SCRIPT.JS PART 4
   Achievement + Statistik
=========================== */

let stats = JSON.parse(localStorage.getItem("brainStats")) || {
    totalPlay: 0,
    totalCorrect: 0,
    totalWrong: 0,
    bestCombo: 0,
    highScore: 0
};

// ---------- UPDATE STATS ----------
function updateStats(isCorrect){

    if(isCorrect){
        stats.totalCorrect++;
    }else{
        stats.totalWrong++;
    }

    if(combo > stats.bestCombo){
        stats.bestCombo = combo;
    }

    if(score > stats.highScore){
        stats.highScore = score;
    }

    localStorage.setItem(
        "brainStats",
        JSON.stringify(stats)
    );

    renderStats();

}

function renderStats(){

    document.getElementById("totalPlay").textContent =
    stats.totalPlay;

    document.getElementById("correctCount").textContent =
    stats.totalCorrect;

    document.getElementById("wrongCount").textContent =
    stats.totalWrong;

    document.getElementById("bestCombo").textContent =
    stats.bestCombo;

    document.getElementById("highScore").textContent =
    stats.highScore;

    const total =
    stats.totalCorrect + stats.totalWrong;

    let acc = 0;

    if(total > 0){
        acc = Math.round(
            stats.totalCorrect / total * 100
        );
    }

    document.getElementById("accuracy").textContent =
    acc + "%";

}

renderStats();

// ---------- ACHIEVEMENT ----------
function checkAchievement(){

    const list = [];

    if(score >= 100){
        list.push("🏅 Score Hunter");
    }

    if(score >= 200){
        list.push("🥇 Master Mind");
    }

    if(combo >= 5){
        list.push("🔥 Combo King");
    }

    if(combo >= 10){
        list.push("⚡ Speed Genius");
    }

    if(life === 4){
        list.push("❤️ Perfect Run");
    }

    if(list.length){

        alert(
            "Achievement Baru!\n\n" +
            list.join("\n")
        );

    }

}

// ---------- RESET STATS ----------
function resetStatistics(){

    if(confirm("Reset semua statistik?")){

        stats = {

            totalPlay:0,
            totalCorrect:0,
            totalWrong:0,
            bestCombo:0,
            highScore:0

        };

        localStorage.removeItem("brainStats");

        renderStats();

    }

}

// ---------- BONUS SCORE ----------
function addBonus(){

    if(combo === 3){

        score += 15;

    }

    if(combo === 5){

        score += 30;

    }

    if(combo === 10){

        score += 60;

    }

}

// ---------- LEVEL ----------
function getDifficulty(){

    if(score >= 200){
        return "🔥 HARD";
    }

    if(score >= 100){
        return "⭐ MEDIUM";
    }

    return "😊 EASY";

}

// ---------- SAVE PLAY ----------
function savePlay(){

    stats.totalPlay++;

    localStorage.setItem(
        "brainStats",
        JSON.stringify(stats)
    );

}

// ---------- PANGGIL DI FINISHGAME ----------
// Tambahkan baris berikut di dalam finishGame()
// sebelum saveResult(rank)

savePlay();
checkAchievement();
renderStats();
