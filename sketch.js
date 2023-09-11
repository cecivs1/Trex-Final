//Declare the variables
var trex, trex_running, edges;
var groundImage;
var cloud;
var cloudImage;
var score;
var obstaclesGroup, cloudsGroup;
var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var trex_collided;
var gameOver, restart; 
var gameOverImg, restartImg; 
var jumpSound;

var PLAY = 1;
var END = 0;
var gameState = PLAY;

//load the assets of the game
function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");

  trex_collided = loadImage("trex_collided.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  jumpSound = loadSound("checkPoint.mp3");
}

//Config for the game:
function setup(){
  createCanvas(600,200);
  
  //create Trex sprite
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);

  //create the ground sprite:
  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  gameOver = createSprite(300,100);
  gameOver.addImage("gameOver", gameOverImg);

  restart = createSprite(300,140);
  restart.addImage("restart", restartImg);

  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;

  //Create an invisible ground:
  invisibleGround = createSprite(200, 190, 400, 20);
  invisibleGround.visible = false;

  edges = createEdgeSprites();
  
  //size of Trex
  trex.scale = 0.5;

  //position of trex:
  trex.x = 50;

  //1. CREATE GROUPS:
  obstaclesGroup = new Group();
  cloudsGroup = new Group();

  score = 0;
}


function draw(){
  //color of the background
  background("white");

  text( "Score: " + score, 500, 50 );
  

  if( gameState === PLAY ){
    //movement for the ground:
    ground.velocityX = - (2 + score/100);
    score = score + Math.round(frameCount/80);

    trex.setCollider("rectangle", 0, 0, trex.width, trex.height);
    trex.debug=false;


     //make the Trex jump if we press space:
    if(keyDown("space") && trex.y >= 140 ){
      trex.velocityY = -10;
      jumpSound.play();
    }

    //Make the ground go back to canvas
    if(ground.x < 0){
      ground.x = ground.width / 2;
    }

    //Make the Trex go back to ground (gravity):
    trex.velocityY = trex.velocityY + 0.5;

    spawnClouds();

    spawnObstacles();

    if(obstaclesGroup.isTouching(trex)){
      gameState = END;
    }

  } else if( gameState === END ){
    ground.velocityX = 0;

    trex.velocityY=0;

    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    gameOver.visible = true;
    restart.visible = true;

    trex.changeAnimation("collided", trex_collided);
   
  }

  //showing the Y position of Trex on the console:
  console.log(trex.y);

  if(mousePressedOver(restart)){
    reset();
  }

  
  
  //avoid Trex to fall
  trex.collide(invisibleGround);


  

  drawSprites();

}


function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  trex.changeAnimation("running", trex_running);

  score = 0;

}


function spawnClouds(){

  //To create a cloud after 60 frames: 
  if( frameCount % 60 === 0 ){
    cloud = createSprite(600, 100, 40, 10);
    cloud.velocityX = - 3;
    cloud.addImage("cloud", cloudImage);
    cloud.scale = 0.7;
    cloud.y = Math.round(random(10,80));

    cloud.lifetime = 200;

    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1; 

    cloudsGroup.add(cloud);
  }
}

function spawnObstacles(){
  if( frameCount % 60 === 0 ){
    var obstacle = createSprite(600, 160, 10, 40);
    obstacle.velocityX = - (6 + score/100 );

    var rand = Math.round(random(1,6));

    switch(rand){
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break; 
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default:break;
    }

    obstacle.scale = 0.5;
    obstacle.lifetime = 300;

    obstaclesGroup.add(obstacle);

  }
}
