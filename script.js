const canvas = document.getElementById("gameCanvas");

let scene, camera, renderer;
let player;
let obstacles = [];

let hp = 3;
let score = 0;
let coins = 0;
let speed = 10;

let gameRunning = false;

const hpText = document.getElementById("hp");
const scoreText = document.getElementById("score");
const coinsText = document.getElementById("coins");
const speedText = document.getElementById("speed");

const menu = document.getElementById("menu");
const startBtn = document.getElementById("startBtn");

const questionBox = document.getElementById("questionBox");
const question = document.getElementById("question");

const leftBtn = document.getElementById("leftBtn");
const middleBtn = document.getElementById("middleBtn");
const rightBtn = document.getElementById("rightBtn");


startBtn.onclick = () => {
    menu.style.display = "none";
    startGame();
};


function startGame(){

    hp = 3;
    score = 0;
    coins = 0;

    updateHUD();

    gameRunning = true;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x001122);


    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth/window.innerHeight,
        0.1,
        1000
    );

    camera.position.z = 10;
    camera.position.y = 5;


    renderer = new THREE.WebGLRenderer({
        canvas:canvas
    });

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );


    // พื้น
    let ground = new THREE.Mesh(
        new THREE.BoxGeometry(30,0.2,100),
        new THREE.MeshBasicMaterial({
            color:0x222222
        })
    );

    ground.position.z=-40;

    scene.add(ground);



    // ตัวละคร
    player = new THREE.Mesh(
        new THREE.BoxGeometry(1,2,1),
        new THREE.MeshBasicMaterial({
            color:0x00ffff
        })
    );

    player.position.y=1;

    scene.add(player);



    spawnObstacle();

    animate();
}



function spawnObstacle(){

    if(!gameRunning)return;


    let obs = new THREE.Mesh(
        new THREE.BoxGeometry(1,2,1),
        new THREE.MeshBasicMaterial({
            color:0xff0000
        })
    );


    obs.position.z=-50;
    obs.position.x =
        [-3,0,3][Math.floor(Math.random()*3)];

    obs.position.y=1;


    scene.add(obs);

    obstacles.push(obs);


    setTimeout(spawnObstacle,2000);
}



function animate(){

    if(!gameRunning)return;


    requestAnimationFrame(animate);


    obstacles.forEach((obs,index)=>{

        obs.position.z += 0.5;


        if(obs.position.z > 5){

            scene.remove(obs);
            obstacles.splice(index,1);

            score+=10;
            coins++;

            updateHUD();
        }


        if(
            Math.abs(obs.position.z-player.position.z)<1 &&
            Math.abs(obs.position.x-player.position.x)<1
        ){

            scene.remove(obs);
            obstacles.splice(index,1);

            hp--;

            updateHUD();

            showQuestion();

        }

    });


    renderer.render(scene,camera);

}



function showQuestion(){

    gameRunning=false;

    questionBox.style.display="block";


    let a=Math.floor(Math.random()*10)+1;
    let b=Math.floor(Math.random()*10)+1;

    let answer=a+b;


    question.innerHTML =
    `⚡ ${a} + ${b} = ?`;


    let choices=[
        answer,
        answer+2,
        answer-1
    ];


    choices.sort(()=>Math.random()-0.5);


    leftBtn.innerHTML=choices[0];
    middleBtn.innerHTML=choices[1];
    rightBtn.innerHTML=choices[2];


    leftBtn.onclick=()=>checkAnswer(choices[0],answer);
    middleBtn.onclick=()=>checkAnswer(choices[1],answer);
    rightBtn.onclick=()=>checkAnswer(choices[2],answer);

}



function checkAnswer(choice,answer){

    questionBox.style.display="none";


    if(choice==answer){

        score+=50;
        coins+=5;

    }
    else{

        hp--;

    }


    updateHUD();


    if(hp<=0){

        alert("GAME OVER คะแนน "+score);

        location.reload();

        return;
    }


    gameRunning=true;
    animate();

}



function updateHUD(){

    hpText.innerHTML=hp;
    scoreText.innerHTML=score;
    coinsText.innerHTML=coins;
    speedText.innerHTML=speed;

}
