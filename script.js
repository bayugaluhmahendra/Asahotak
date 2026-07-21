const questions=[

{q:"2+2=?",a:["3","4","5","6"],c:1},
{q:"Ibukota Jepang?",a:["Tokyo","Osaka","Kyoto","Nagoya"],c:0},
{q:"5x6=?",a:["30","20","25","35"],c:0},
{q:"Planet Merah?",a:["Mars","Venus","Saturnus","Jupiter"],c:0},
{q:"8+9=?",a:["17","18","19","20"],c:0},
{q:"10-3=?",a:["6","7","8","9"],c:1},
{q:"Huruf pertama alfabet?",a:["B","A","C","D"],c:1},
{q:"100/10=?",a:["20","15","10","5"],c:2},
{q:"Air membeku pada?",a:["0°C","50°C","10°C","5°C"],c:0},
{q:"1 Jam=?",a:["60 menit","30 menit","90 menit","100 menit"],c:0},
{q:"9x9=?",a:["72","81","99","90"],c:1},
{q:"Benua Indonesia?",a:["Asia","Afrika","Eropa","Australia"],c:0},
];

let list=[];
let index=0;
let life=4;
let combo=0;
let score=0;
let timer=25;
let interval;

const lifeTxt=document.getElementById("life");
const comboTxt=document.getElementById("combo");
const timerTxt=document.getElementById("timer");
const question=document.getElementById("question");
const answers=document.getElementById("answers");

function shuffle(array){
return array.sort(()=>Math.random()-0.5);
}

document.getElementById("startBtn").onclick=()=>{

document.getElementById("bgm").play();

list=shuffle([...questions]).slice(0,10);

index=0;
life=4;
combo=0;
score=0;

document.getElementById("startBtn").style.display="none";

showQuestion();

}

function showQuestion(){

if(index>=10||life<=0){

gameOver();

return;

}

lifeTxt.innerHTML=life;
comboTxt.innerHTML=combo;

timer=25;

timerTxt.innerHTML=timer;

clearInterval(interval);

interval=setInterval(()=>{

timer--;

timerTxt.innerHTML=timer;

if(timer<=0){

life--;

combo=0;

next();

}

},1000);

let q=list[index];

question.innerHTML=(index+1)+". "+q.q;

answers.innerHTML="";

q.a.forEach((txt,i)=>{

let b=document.createElement("button");

b.innerHTML=txt;

b.onclick=()=>check(i);

answers.appendChild(b);

});

}

function check(i){

clearInterval(interval);

if(i==list[index].c){

combo++;

score+=10+(combo*2);

}else{

life--;

combo=0;

}

next();

}

function next(){

index++;

showQuestion();

}

function gameOver(){

clearInterval(interval);

document.getElementById("game").classList.add("hide");

document.getElementById("result").classList.remove("hide");

let rank="🥉 Beginner";

if(score>=80) rank="🥇 Master";
else if(score>=60) rank="🥈 Pro";
else if(score>=40) rank="🏅 Advanced";

document.getElementById("scoreText").innerHTML=
`Score : ${score}<br>${rank}`;

}

function loadBoard(){

let board=JSON.parse(localStorage.getItem("brain"))||[];

board.sort((a,b)=>b.score-a.score);

let html="";

board.forEach(v=>{

html+=`<li>${v.name} - ${v.score}</li>`;

});

document.getElementById("leaderboard").innerHTML=html;

}

loadBoard();

document.getElementById("saveBtn").onclick=()=>{

let board=JSON.parse(localStorage.getItem("brain"))||[];

board.push({

name:document.getElementById("playerName").value||"Player",

score:score

});

localStorage.setItem("brain",JSON.stringify(board));

loadBoard();

alert("Score tersimpan!");

}

document.getElementById("waBtn").onclick=()=>{

let text=`Aku mendapatkan score ${score} di Brain Challenge! Bisa mengalahkanku?`;

window.open("https://wa.me/?text="+encodeURIComponent(text));

}

document.getElementById("igBtn").onclick=()=>{

let text=`🧠 Brain Challenge\n\nScoreku : ${score}\nAyo lawan aku!`;

navigator.clipboard.writeText(text);

alert("Caption berhasil disalin. Tempel di Instagram.");

  }
