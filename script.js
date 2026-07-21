// ==========================
// BRAIN CHALLENGE V2
// ==========================

const login = document.getElementById("login");
const quiz = document.getElementById("quiz");
const result = document.getElementById("result");

const username = document.getElementById("username");
const playBtn = document.getElementById("playBtn");

const playerName = document.getElementById("playerName");
const question = document.getElementById("question");
const answers = document.querySelectorAll(".answer");

const scoreText = document.getElementById("score");
const comboText = document.getElementById("combo");
const timerText = document.getElementById("timer");

const progress = document.getElementById("progress");

const number = document.getElementById("number");

let current = 0;
let score = 0;
let combo = 0;
let life = 3;
let timer = 15;
let interval;

let player = "";

let quizList = [];

const questions = [

{
question:"Planet yang memiliki satelit alami terbanyak adalah...",
answers:["Saturnus","Jupiter","Neptunus","Uranus"],
correct:0
},

{
question:"Penemu World Wide Web adalah...",
answers:["Bill Gates","Steve Jobs","Tim Berners-Lee","Larry Page"],
correct:2
},

{
question:"Bilangan prima setelah 97 adalah...",
answers:["99","100","101","103"],
correct:2
},

{
question:"Negara dengan pulau terbanyak di dunia adalah...",
answers:["Indonesia","Filipina","Swedia","Jepang"],
correct:2
},

{
question:"Gunung tertinggi di Tata Surya adalah...",
answers:["Everest","Olympus Mons","K2","Fuji"],
correct:1
},

{
question:"Bahasa Java pertama dikembangkan oleh...",
answers:["Google","Microsoft","Sun Microsystems","IBM"],
correct:2
},

{
question:"Ibukota Kanada adalah...",
answers:["Toronto","Ottawa","Vancouver","Montreal"],
correct:1
},

{
question:"Unsur kimia dengan simbol Au adalah...",
answers:["Perak","Aluminium","Emas","Argon"],
correct:2
},

{
question:"Planet terbesar di Tata Surya adalah...",
answers:["Bumi","Mars","Saturnus","Jupiter"],
correct:3
},

{
question:"Organ terbesar pada tubuh manusia adalah...",
answers:["Hati","Kulit","Paru-paru","Jantung"],
correct:1
}

];

playBtn.onclick = ()=>{

player = username.value.trim();

if(player==""){

alert("Masukkan nama dulu!");

return;

}

playerName.innerHTML = player;

login.classList.add("hidden");

quiz.classList.remove("hidden");

quizList = [...questions]
.sort(()=>Math.random()-0.5);

loadQuestion();
function loadQuestion(){

clearInterval(interval);

timer=15;

timerText.innerHTML=timer;

interval=setInterval(()=>{

timer--;

timerText.innerHTML=timer;

if(timer<=0){

clearInterval(interval);

life--;

updateLife();

nextQuestion();

}

},1000);

progress.style.width=((current)/10)*100+"%";

number.innerHTML=(current+1)+" / 10";

const q=quizList[current];

question.innerHTML=q.question;

answers.forEach((btn,index)=>{

btn.className="answer";

btn.innerHTML=q.answers[index];

btn.onclick=()=>checkAnswer(index);

});

}

function checkAnswer(index){

clearInterval(interval);

const q=quizList[current];

answers.forEach(btn=>btn.disabled=true);

if(index===q.correct){

score+=10+(combo*2);

combo++;

scoreText.innerHTML=score;

comboText.innerHTML=combo;

answers[index].classList.add("correct");

}else{

life--;

combo=0;

comboText.innerHTML=0;

updateLife();

answers[index].classList.add("wrong");

answers[q.correct].classList.add("correct");

}

setTimeout(()=>{

nextQuestion();

},1200);

}

function nextQuestion(){

current++;

if(life<=0){

finishGame();

return;

}

if(current>=10){

finishGame();

return;

}

loadQuestion();

}

function updateLife(){

const lifeBox=document.querySelector(".life");

let html="";

for(let i=0;i<life;i++){

html+="❤️ ";

}

for(let i=life;i<3;i++){

html+="🤍 ";

}

lifeBox.innerHTML=html;

}
}
function finishGame(){

clearInterval(interval);

quiz.classList.add("hidden");

result.classList.remove("hidden");

document.getElementById("finalName").innerHTML=player;

document.getElementById("finalScore").innerHTML=score;

// Hitung Akurasi
const accuracy=Math.round((score/(10*10))*100);

document.getElementById("accuracy").innerHTML=
"🎯 Akurasi : "+accuracy+"%";

// Rank
let rank="🤣 Noob";

if(score>=100){

rank="👑 LEGEND";

}else if(score>=90){

rank="🏆 MASTER";

}else if(score>=80){

rank="🥇 ELITE";

}else if(score>=70){

rank="🥈 PRO";

}else if(score>=60){

rank="🥉 PINTAR";

}else if(score>=50){

rank="👍 LUMAYAN";

}else if(score>=40){

rank="😅 BELAJAR LAGI";

}

document.getElementById("rank").innerHTML=rank;

// Leaderboard
saveLeaderboard();

showLeaderboard();

}

function saveLeaderboard(){

let board=JSON.parse(localStorage.getItem("brainLeaderboard"))||[];

board.push({

name:player,

score:score

});

board.sort((a,b)=>b.score-a.score);

board=board.slice(0,10);

localStorage.setItem("brainLeaderboard",JSON.stringify(board));

}

function showLeaderboard(){

let board=JSON.parse(localStorage.getItem("brainLeaderboard"))||[];

let html="<h3>🏆 TOP 10</h3>";

board.forEach((item,index)=>{

html+=`

<div>

<span>${index+1}. ${item.name}</span>

<b>${item.score}</b>

</div>

`;

});

document.getElementById("leaderboard").innerHTML=html;

}

// Tampilkan leaderboard saat tombol diklik
document.getElementById("leaderBtn").onclick=()=>{

let board=JSON.parse(localStorage.getItem("brainLeaderboard"))||[];

let text="🏆 TOP 10\n\n";

board.forEach((item,index)=>{

text+=`${index+1}. ${item.name} - ${item.score}\n`;

});

if(board.length===0){

text="Belum ada skor tersimpan.";

}

alert(text);

}
