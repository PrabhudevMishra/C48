const PLAY = 2;
const END = 1;
const TFOUND = 0;


var player,playerRunning;
var obstacle1Img,obstacle2Img,obstacle3Img,obstacle4Img,obstacleGroup;
var invisibleGround;
var ground, groundImg;
var coinImage;
var scene;
var coinCount;
var coinsGroup;
var footSteps;
var jumpSound;
var lifeCount;
var gameState = PLAY; 
var lifeMissed;
var instruction;
var enemyImage;
var enemyGroup;
var playerCollided;
var treasure;
var treasureImg;
var treasureGroup;
var congrats;
var count = 0;

function preload(){
  playerRunning = loadAnimation("./p1.png","./p2.png","./p3.png","./p4.png");
  backImg = loadImage("./bg.png");
  groundImg = loadImage("./ground.png");
  obstacle1Img = loadImage("./o1.png");
  obstacle2Img = loadImage("./o2.png");
  obstacle3Img = loadImage("./o3.png");
  obstacle4Img = loadImage("./o4.png");
  coinImage = loadImage("./coins.png");
  enemyImage = loadImage("./enemy.png");
  jumpSound = loadSound("./jump.mp3");
  lifeMissed = loadSound("./LIFE MISSED.wav");
  playerCollided = loadImage("./p2.png");
  treasureImg = loadImage("./treasure.png");
  congrats = loadSound("./TREASUREFOUND.wav");
}


function setup() {
  createCanvas(displayWidth,displayHeight);
 
 //footSteps.play();

  ground = createSprite(width/2, height/2 + 400, width, 200);
  ground.addImage("background", groundImg);
  ground.x = ground.width / 2;
  ground.scale = 4;
  
  player = createSprite(200,height/2 + 200,20,20);
  player.addAnimation("player",playerRunning);
  player.addAnimation("collided", playerCollided);
  player.scale = 0.6;
  player.setCollider("circle", -30, 0, 100);
  
  invisibleGround = createSprite(width/2, height/2 + 260, width, 10);
  invisibleGround.visible = false;

  obstacleGroup = new Group();
  coinsGroup = new Group();
  enemyGroup = new Group();
  treasureGroup = new Group();

  coinCount = 0;
  lifeCount = 4;

  instruction = createButton('RESTART');
  instruction.position(width/2 - 200,height/2);
  instruction.mousePressed(()=>{
    reset();
  });
  instruction.hide();
}

function draw() {
  background(backImg); 

  console.log(frameCount);
  if(gameState === PLAY){
  ground.velocityX = -6;
  spawnObstacles();
  spawnCoins();
  spawnEnemy();

  if(frameCount === 2000){
  spawnTreasure();
  }

  if (ground.x < 0) {
    ground.x = ground.width / 2;
  }

  if(keyDown(UP_ARROW) && player.y >= height/2 + 190){
    player.velocityY = -12;
    jumpSound.play();
  }
  
  player.velocityY = player.velocityY + 0.4;

  //if(coinsGroup.isTouching(player)){
    for(var i = 0; i < coinsGroup.length; i++){
      if(coinsGroup.get(i).isTouching(player)){
        coinCount ++;
        coinsGroup.get(i).destroy();
      }
    }
 // }

 for(var j = 0; j < obstacleGroup.length; j++){
    if(obstacleGroup.get(j).isTouching(player) && lifeCount > 0){
      lifeCount -= 1;
      //console.log(lifeCount);
      obstacleGroup.get(j).destroy();
      lifeMissed.play();
    }
  }

  if(enemyGroup.isTouching(player)){
    lifeCount = 0;
  }

    if(lifeCount === 0){
      gameState = END;
    }


  if(treasureGroup.isTouching(player)){
    gameState = TFOUND;
    count = 1;
  }  
  }

  else if(gameState === END){
    ground.velocityX = 0;
    player.velocityY = 0;
    obstacleGroup.setVelocityXEach(0);
    coinsGroup.setVelocityXEach(0);
    obstacleGroup.setLifetimeEach(-1);
    coinsGroup.setLifetimeEach(-1);
    enemyGroup.setVelocityXEach(0);
    enemyGroup.setLifetimeEach(-1);
    treasureGroup.setVelocityXEach(0);
    treasureGroup.setLifetimeEach(-1);
    player.changeAnimation("collided");
    textSize(60);
    fill("red");
    stroke("white");
    text("GAME OVER😔😔", width/3, height/2);
  }

  else if(gameState === TFOUND){
    ground.velocityX = 0;
    player.velocityY = 0;
    obstacleGroup.destroyEach();
    coinsGroup.destroyEach();
    enemyGroup.destroyEach();
    treasureGroup.setVelocityXEach(0);
    treasureGroup.setLifetimeEach(-1);
    player.changeAnimation("collided");
    textSize(60);
    fill("violet");
    stroke("black");
    text("CONGRATS👏👏TREASURE FOUND👍👍", width/4, height/2);
    if(count === 1){
    congrats.play();
    count = 0;
    }
  }

  // if(mousePressedOver(restart) && gameState === END){
  //   reset();
  // }

  if(gameState === END){
    instruction.show();
  }

  else{
    instruction.hide();
  }

  player.collide(invisibleGround);
  //console.log(height - 300);

  drawSprites();

  textSize(25);
  stroke("black");
  fill("yellow");
  text("COINS: " + coinCount, width - 200, 50);
  text("LIFE: " + lifeCount, width - 200 , 80);
}

function spawnObstacles() {
  if(frameCount % 200 === 0) {
    var obstacle = createSprite(width,height/2 + 230,10,40);
    obstacle.velocityX = -8;
    
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1Img);
              break;
      case 2: obstacle.addImage(obstacle2Img);
              break;
      case 3: obstacle.addImage(obstacle3Img);
              break;
      case 4: obstacle.addImage(obstacle4Img);
              break;
      default: break;
    }
              
    obstacle.scale = 0.5;
    obstacle.lifetime = width/3;
    obstacleGroup.add(obstacle);
  }
}

function spawnCoins() {
  if (frameCount % 80 === 0) {
    var coin = createSprite(random(width/2 + 200, width/2 + 300),height/2 + 230,10,40);
    coin.y = Math.round(random(height/2 + 230,height/2 + 50));
    coin.addImage(coinImage);
    coin.scale = 0.05;
    coin.velocityX = -3;
    
    coin.lifetime = width/3;
    
    coinsGroup.add(coin);
  }
  
}

function spawnEnemy() {
  if (frameCount % 500 === 0) {
    var enemy = createSprite(width, 2*height/3,10,40);
    enemy.addImage(enemyImage);
    enemy.scale = 0.28;
    enemy.velocityX = -8;
    enemy.lifetime = width/3;
    //enemy.debug = true;
    enemyGroup.add(enemy);
  }
}

function spawnTreasure(){
  //if(frameCount % 500 === 0){
    treasure = createSprite(width,height/2 + 200,20,20);
    treasure.addImage("treasure", treasureImg);
    treasure.scale = 0.3;
    treasure.velocityX = -2
    treasure.lifetime = width/2;
    treasureGroup.add(treasure);
  //}
}

function reset(){
  gameState = PLAY;
  coinsGroup.destroyEach();
  enemyGroup.destroyEach();
  obstacleGroup.destroyEach();
  coinCount = 0;
  lifeCount = 4;
  player.changeAnimation("player");
  window.location.reload();
}


























