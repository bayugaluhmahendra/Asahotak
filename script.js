const questions = [
{
question:"Planet manakah yang memiliki jumlah satelit alami terbanyak?",
answers:["Saturnus","Jupiter","Uranus","Neptunus"],
correct:0
},
{
question:"Siapakah penemu World Wide Web (WWW)?",
answers:["Bill Gates","Tim Berners-Lee","Steve Jobs","Linus Torvalds"],
correct:1
},
{
question:"Benua manakah yang tidak memiliki gurun pasir?",
answers:["Asia","Eropa","Australia","Afrika"],
correct:1
},
{
question:"Negara dengan jumlah pulau terbanyak di dunia?",
answers:["Indonesia","Filipina","Swedia","Jepang"],
correct:2
},
{
question:"Bilangan prima setelah 97 adalah...",
answers:["99","101","103","107"],
correct:1
},
{
question:"Java pertama kali dibuat oleh?",
answers:["Microsoft","Sun Microsystems","Google","IBM"],
correct:1
},
{
question:"Gunung tertinggi di Tata Surya adalah...",
answers:["Everest","Olympus Mons","K2","Mauna Kea"],
correct:1
},
{
question:"Hewan tercepat di dunia saat menyelam?",
answers:["Hiu Putih","Paus Biru","Elang Peregrine","Ikan Layar"],
correct:2
},
{
question:"Jumlah tulang manusia dewasa?",
answers:["198","206","210","212"],
correct:1
},
{
question:"Jika 7x+5=40 maka x=?",
answers:["3","4","5","6"],
correct:2
}
];

let current=0;
let score=0;
let timer=15;
let interval;
let player="";

const login=document.getElementById("login");
const quiz=document.getElementById("quiz");
const result=document.getElementById("result");

const startBtn=document.getElementById("startBtn");

const playerName=document.getElementById("playerName");

const nameText=document.getElementById("name");

const question=document.getElementById("question");

const answers=document.querySelectorAll(".answer");

const scoreText=document.getElementById("score");

const progress=document.getElementById("progressBar");

const timerText=document.getElementById("timer");

const number=document.getElementById("questionNumber");

startBtn.onclick=()=>{

player=playerName.value.trim();

if(player===""){

alert("Masukkan nama!");

return;

}

login.classList.add("hidden");

quiz.classList.remove("hidden");

nameText.innerText=player;

loadQuestion();

}

function loadQuestion(){

clearInterval(interval);

timer=15;

timerText.innerText=timer;

interval=setInterval(()=>{

timer--;

timerText.innerText=timer;

if(timer<=0){

nextQuestion();

}

},1000);

let q=questions[current];

question.innerText=q.question;

number.innerText=(current+1)+" / "+questions.length;

progress.style.width=((current)/questions.length)*100+"%";

answers.forEach((btn,index)=>{

btn.className="answer";

btn.innerText=q.answers[index];

btn.onclick=()=>check(index);

});

}

function check(index){

clearInterval(interval);

if(index===questions[current].correct){

score+=10;

scoreText.innerText=score;

answers[index].classList.add("correct");

}else{

answers[index].classList.add("wrong");

answers[questions[current].correct].classList.add("correct");

}

setTimeout(nextQuestion,1200);

}

function nextQuestion(){

current++;

if(current>=questions.length){

finish();

return;

}

loadQuestion();

}

function finish(){

quiz.classList.add("hidden");

result.classList.remove("hidden");

document.getElementById("finalName").innerText=player;

document.getElementById("finalScore").innerText=score;

progress.style.width="100%";

let rank="🤣 Noob";

if(score>=100){

rank="👑 Legend";

}else if(score>=90){

rank="🏆 Master";

}else if(score>=80){

rank="🥇 Elite";

}else if(score>=70){

rank="🥈 Pro";

}else if(score>=60){

rank="🥉 Pintar";

}else if(score>=50){

rank="👍 Lumayan";

}else if(score>=40){

rank="😅 Belajar Lagi";

}

document.getElementById("rank").innerText=rank;

saveLeaderboard();

}

function saveLeaderboard(){

let board=JSON.parse(localStorage.getItem("leaderboard"))||[];

board.push({

name:player,

score:score

});

board.sort((a,b)=>b.score-a.score);

board=board.slice(0,10);

localStorage.setItem("leaderboard",JSON.stringify(board));

}
