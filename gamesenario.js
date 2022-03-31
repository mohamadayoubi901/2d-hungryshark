var keysDown = {};

addEventListener("keydown", function (e) {
  keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
  delete keysDown[e.keyCode];
}, false);


const mouse = {
  x: 400,
  y: 400,
  click: false
}
var mousePressed = false;
addEventListener('mousemove', function (e) {
  mouse.click = true;
  mouse.x = e.x - canvasPosition.left;
  mouse.y = e.y - canvasPosition.top;
});
addEventListener('mouseup', function (e) {
  mouse.click = false;
});
addEventListener('mousedown', function (event) {
  mousePressed = true;
});
addEventListener('mouseup', function (event) {
  mousePressed = false;
});

class fish extends Sprite {
  constructor(x, y, w, h, speed) {
    super(x, y, w, h, speed);

    this.moving = false;
    this.frame = 0;
    this.spriteWidth = 256;
    this.spriteHeight = 256;
    this.playerLeft = new Image();
    //add images to fish player
    this.playerLeft.src = 'playerfishleft.png';
    this.playerRight = new Image();
    this.playerRight.src = 'playerfishright.png';

  }
  //draw the the ish
  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(this.x, this.y, this.h, 0, 2 * Math.PI, false);
    ctx.stroke();
    this.frame++;
    this.frameX++;
    if (this.frame >= 5) {
      this.frame = 0;
      this.frameX = 0;
    }
    ctx.fillStyle = 'black';
    ctx.save();
    ctx.translate(this.x, this.y);
    //check if the mouse if before or after the fish
    if (this.x >= mouse.x) {
      ctx.drawImage(this.playerLeft, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, 0 - 65, 0 - 65, this.spriteWidth - 110, this.spriteHeight - 110);
    } else {
      ctx.drawImage(this.playerRight, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, 0 - 65, 0 - 65, this.spriteWidth - 110, this.spriteHeight - 110);
    }
    ctx.restore();


  }

  update() {
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    if (mouse.x != this.x) {
      this.x -= dx / 20;
      this.moving = true;
    }
    if (mouse.y != this.y) {
      this.y -= dy / 20;
      this.moving = true;
    }
    //check for border and move the fish inside the game's canvas 
    if (this.x < 0) this.x = 0;
    if (this.x > hungrysharkgame.cw) this.x = hungrysharkgame.cw;
    if (this.y < 50) this.y = 50;
    if (this.y > hungrysharkgame.ch) this.y = hungrysharkgame.ch;
    //shoote water bullets by pressing and play sound effects
    if (32 in keysDown) {
      if (this.index > 10 || this.index < 1) {
        var bullet1 = new bullet(this.x, this.y, 6, 6, 9);
        if (dx < 0) {
          bullet1.velocityX = -bullet1.velocityX
        }
        hungrysharkgame.addSprite(bullet1);
        //play sounds
        shoot1play();
        this.index = 0;
      }
      this.index++;
    }
    //if destroy the player if he looses 
    if (score1.health < 0) {
      this.status = "dead";
      hungrysharkgame.removedsprites.push(this);
      var ex2 = new explod(this.x, this.y, this.w, this.h, 0);
      //sound effects
      destroctionplay();
      hungrysharkgame.addSprite(ex2);
    }
  }
}
//draw bullet and intalize bullet images
class bullet extends Sprite {
  constructor(x, y, w, h, speed) {
    super(x, y, w, h, speed);
    this.image = new Image();
    this.image.src = 'pngegg.png';
  }
  draw(ctx) {
    //draw bullet
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.h, 0, 2 * Math.PI, false);
    ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, 10, 10);
    ctx.stroke();
  }
  update() {
    if (this.x < 0 || this.x > hungrysharkgame.cw) {
      hungrysharkgame.removedsprites.push(this);
    }
    else {
      //check if bullet collid with an enemies and remove the bullet and the enemy collided with and create explotion with sounds
      for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].status != "dead") {
          var distance = Math.sqrt((this.x - enemies[i].x) * (this.x - enemies[i].x) + (this.y - enemies[i].y) * (this.y - enemies[i].y));
          if (enemies[i].radius >= distance) {
            enemies[i].status = "dead"
            // score1.angle += 100;
            hungrysharkgame.removedsprites.push(this);
            hungrysharkgame.removedsprites.push(enemies[i]);
            var ex2 = new explod(enemies[i].x, enemies[i].y, enemies[i].w, enemies[i].h, 0);
            hungrysharkgame.addSprite(ex2);
            explotionplay();
            score1.scoree += 100;
          }
        }
      }
      //check if the bullet hit the boss and remove it and increase the boss hits number
      for (var i = 0; i < bosses.length; i++) {
        if (bosses[i].status != "dead") {
          var distance2 = Math.sqrt((this.x - bosses[i].x) * (this.x - bosses[i].x) + (this.y - bosses[i].y) * (this.y - bosses[i].y));
          if (bosses[i].radius >= distance2) {
            hungrysharkgame.removedsprites.push(this);
            bosses[i].hits++;
            score1.scoree += 100;
          }
        }
      }
      this.x = this.x - (this.velocityX * this.speed);

    }
  }
}
class fishenemy1right extends Sprite {


  constructor(x, y, w, h, speed) {
    super(x, y, w, h, speed);
    if (this.y < hungrysharkgame.ch / 2) {
      this.index = 3;
    }
    //fish image
    this.image = new Image();
    this.image.src = 'leftfiish1.png';
  }
  draw(ctx) {
    //draw the fish
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(this.x, this.y, this.h, 0, 2 * Math.PI, false);
    ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, 80, 70);

    ctx.stroke();
  }
  update() {

    //move the enemies on the screen

    if (this.x > 300) {
      if (this.index == 3) {
        this.y += this.velocityY * this.speed;
        this.x += this.velocityX * this.speed;
      }
      else {
        this.y -= this.velocityY * this.speed;
        this.x += this.velocityX * this.speed;
      }
    }
    else {
      this.x += this.velocityX * this.speed
    }
    //delete the enemie if it is out of the screen  
    if (this.x > hungrysharkgame.cw) {
      this.status = "dead";
      hungrysharkgame.removedsprites.push(this);
    }
    //check if the fish collide with the player sound effect and play eating sounds while remove the fish
    var distance = Math.sqrt((this.x - fish1.x) * (this.x - fish1.x) + (this.y - fish1.y) * (this.y - fish1.y));
    if (fish1.radius + this.radius >= distance) {
      hungrysharkgame.removedsprites.push(this);
      eatplay();
      score1.health += 40;
      score1.scoree += 100;
    }
  }
}
class fishenemy1left extends Sprite {
  constructor(x, y, w, h, speed) {
    super(x, y, w, h, speed);
    if (this.y < hungrysharkgame.ch / 2) {
      this.index = 3;
    }
    //fish image
    this.image = new Image();
    this.image.src = 'rightfish1.png';
  }
  draw(ctx) {
    //draw the fish
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(this.x, this.y, this.h, 0, 2 * Math.PI, false);
    ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, 80, 70);

    ctx.stroke();
  }
  update() {

    //move the enemies on the screen 
    if (this.x < 800) {
      if (this.index == 3) {
        this.y += this.velocityY * this.speed;
        this.x -= this.velocityX * this.speed;
      }
      else {
        this.y -= this.velocityY * this.speed;
        this.x -= this.velocityX * this.speed;
      }
    }
    else {
      this.x -= this.velocityX * this.speed
    }
    //delete the enemie if it is out of the screen  
    if (this.x < 0) {
      this.status = "dead";
      hungrysharkgame.removedsprites.push(this);
    }
    // //check if the fish collide with the player sound effect and play eating sounds while remove the fish
    var distance = Math.sqrt((this.x - fish1.x) * (this.x - fish1.x) + (this.y - fish1.y) * (this.y - fish1.y));
    if (fish1.radius + this.radius >= distance) {
      hungrysharkgame.removedsprites.push(this);
      eatplay()
      score1.health += 40;
      score1.scoree += 100;
    }
  }
}

class fishenemy2right extends Sprite {
  constructor(x, y, w, h, speed) {
    super(x, y, w, h, speed);
    //fish image
    this.image = new Image();
    this.image.src = 'leftfish2.png';
  }
  draw(ctx) {
    //draw the fish
    ctx.beginPath();
    ctx.fillStyle = 'green';
    ctx.arc(this.x, this.y, this.h, 0, 2 * Math.PI, false);
    ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, 85, 75);
    ctx.stroke();
  }
  update() {
    //move the enemies on the screen 
    this.x += this.velocityX * this.speed

    //delete the enemie if it is out of the screen  
    if (this.x > hungrysharkgame.cw) {
      this.status = "dead";
      hungrysharkgame.removedsprites.push(this);
    }
    // //check if the fish collide with the player sound effect and play eating sounds while remove the fish
    var distance = Math.sqrt((this.x - fish1.x) * (this.x - fish1.x) + (this.y - fish1.y) * (this.y - fish1.y));
    if (fish1.radius + this.radius >= distance) {
      hungrysharkgame.removedsprites.push(this);
      eatplay();
      score1.health += 40;
      score1.scoree += 100;
    }
  }
}
class fishenemy2left extends Sprite {
  constructor(x, y, w, h, speed) {
    super(x, y, w, h, speed);
    this.image = new Image();
    this.image.src = 'rightfish2.png';
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = 'green';
    ctx.arc(this.x, this.y, this.h, 0, 2 * Math.PI, false);
    ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, 85, 75);
    ctx.stroke();
  }
  update() {

    //move the enemies on the screen 
    this.x -= this.velocityX * this.speed;

    //delete the enemie if it is out of the screen  
    if (this.x < 0) {
      this.status = "dead";
      hungrysharkgame.removedsprites.push(this);
    }
    // //check if the fish collide with the player sound effect and play eating sounds while remove the fish
    var distance = Math.sqrt((this.x - fish1.x) * (this.x - fish1.x) + (this.y - fish1.y) * (this.y - fish1.y));
    if (fish1.radius + this.radius >= distance) {
      hungrysharkgame.removedsprites.push(this);
      eatplay();
      score1.health += 50;
      score1.scoree += 100;

    }
  }
}
class seabomb extends Sprite {
  constructor(x, y, w, h, speed) {
    super(x, y, w, h, speed);
    if (this.x < 0) {
      this.index = 3;
    }
    //bomb image
    this.image = new Image();
    this.image.src = 'bombimage.png';

  }
  draw(ctx) {
    //draw bomb
    ctx.beginPath();
    ctx.fillStyle = 'blue';
    ctx.arc(this.x, this.y, this.h, 0, 2 * Math.PI, false);
    ctx.drawImage(this.image, this.x - this.radius - 6, this.y - this.radius, this.h * 2 + 20, this.h * 2);
    ctx.stroke();
  }
  update() {

    //move the enemies on the screen 
    if (this.index == 3) {
      this.x += this.velocityX * this.speed;
      if (this.x > hungrysharkgame.cw) {
        this.status = "dead";
        hungrysharkgame.removedsprites.push(this);
      }
    }
    //delete the enemie if it is out of the screen 
    else {
      this.x -= this.velocityX * this.speed;
      if (this.x < 0) {
        this.status = "dead";
        hungrysharkgame.removedsprites.push(this);
      }
    }

    //check if the fish collide with the player sound effect and play explotion sounds while remove the bomb
    var distance = Math.sqrt((this.x - fish1.x) * (this.x - fish1.x) + (this.y - fish1.y) * (this.y - fish1.y));
    if (fish1.radius + this.radius >= distance) {
      this.status = "dead";
      hungrysharkgame.removedsprites.push(this);
      var ex2 = new explod(this.x, this.y, this.w, this.h, 0);
      hungrysharkgame.addSprite(ex2);
      explotionplay();
      score1.health -= 400;
    }
  }
}

class enemybird extends Sprite {
  constructor(x, y, w, h, speed) {
    super(x, y, w, h, speed);
    if (this.x < hungrysharkgame.cw / 2) {
      this.index = 3;
    }
    //birds image
    this.image = new Image();
    this.image.src = 'birds.png';
  }
  draw(ctx) {
    //draw bird
    ctx.beginPath();
    ctx.fillStyle = 'purple';
    ctx.arc(this.x, this.y, this.h, 0, 2 * Math.PI, false);
    ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, 100, 90);
    ctx.stroke();
  }
  update() {
    if (this.y < 250 && !this.case) {
      this.y += this.speed;
    }

    else {
      this.case = true;
      //move enemy on the screnn
      if (this.index == 3) {
        this.angle += this.moveAngle * Math.PI / 180;
        this.x += this.speed * Math.sin(this.angle);
        this.y += this.speed * Math.cos(this.angle);
        this.speed += 0.01;
      }
      //move enemy on the screen
      else {
        this.angle += this.moveAngle * Math.PI / 180;
        this.x -= this.speed * Math.sin(this.angle);
        this.y += this.speed * Math.cos(this.angle);
        this.speed += 0.01;
      }
    }
    //check if the fish collide with the player sound effect and play sinking sounds while remove the bomb
    var distance = Math.sqrt((this.x - fish1.x) * (this.x - fish1.x) + (this.y - fish1.y) * (this.y - fish1.y));
    if (fish1.radius + this.radius >= distance) {
      hungrysharkgame.removedsprites.push(this);
      sinkingplay();
      score1.health -= 400;
    }
    //remove the bird when its out of the canvas by far
    if (this.y > hungrysharkgame.ch + 300) {
      hungrysharkgame.removedsprites.push(this);
    }

  }
}

class enemyboss1 extends Sprite {
  constructor(x, y, w, h, speed) {
    super(x, y, w, h, speed);
    //boss image
    this.image = new Image();
    this.image.src = 'boss1.png';
  }
  //draw boss
  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = 'orange';
    ctx.arc(this.x, this.y, this.h, 0, 2 * Math.PI, false);
    ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, 170, 110);
    ctx.stroke();

  }
  update() {
    if (this.x > 850) {
      this.x -= this.velocityX * this.speed;
    }
    //move boss
    else {
      this.angle += this.moveAngle * Math.PI / 180;
      this.y += this.speed * Math.sin(this.angle) / 1.5;
      //make boss shoot bullets
      if (this.index > 30 || this.index < 1) {
        var bullet22 = new bullet2(this.x, this.y, 6, 6, 4);
        hungrysharkgame.addSprite(bullet22);
        shoot2play();
        this.index = 0;
      }
      this.index++;

    }
    //check if the boss has take enough damge and destroyed it with massive sounds 
    if (this.hits > 30) {
      this.status = "dead";
      hungrysharkgame.removedsprites.push(this);
      var ex2 = new explod(this.x, this.y, this.w, this.h, 0);
      hungrysharkgame.addSprite(ex2);
      destroctionplay();
      score1.scoree += 100;
    }
  }
}

class enemyboss2 extends Sprite {
  constructor(x, y, w, h, speed) {
    super(x, y, w, h, speed);
    //boss image
    this.image = new Image();
    this.image.src = 'boss2.png';
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = 'orange';
    ctx.arc(this.x, this.y, this.h, 0, 2 * Math.PI, false);
    ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, 170, 110);
    ctx.stroke();

  }
  update() {
    if (this.x > 900) {
      this.x -= this.velocityX * this.speed;
    }
    //move boss
    else {
      this.angle += this.moveAngle * Math.PI / 180;
      this.y += this.speed * Math.sin(this.angle) / 1.5;
      //make boss shoot bullets
      if (this.index > 30 || this.index < 1) {
        var bullet22 = new bullet2(this.x + this.radius, this.y + this.radius, 6, 6, 4);
        hungrysharkgame.addSprite(bullet22);
        var bullet22 = new bullet2(this.x - this.radius, this.y - this.radius, 6, 6, 4);
        hungrysharkgame.addSprite(bullet22);
        shoot2play();
        this.index = 0;
      }
      //make boss through bomb
      if (this.index1 == 90) {
        var bullet22 = new seabomb(this.x, this.y, 30, 30, 4);
        hungrysharkgame.addSprite(bullet22);
        enemies.push(bullet22);
        this.index1 = 0;
      }
      this.index1++;
      this.index++;
    }
    //check if the boss take enough damage and destroy it
    if (this.hits > 30) {
      this.status = "dead";
      hungrysharkgame.removedsprites.push(this);
      var ex2 = new explod(this.x, this.y, this.w, this.h, 0);
      hungrysharkgame.addSprite(ex2);
      destroctionplay();
      score1.scoree += 500;
    }
  }
}

class bullet2 extends Sprite {
  constructor(x, y, w, h, speed) {
    super(x, y, w, h, speed);
    //bullet images
    this.image = new Image();
    this.image.src = 'bullet2.png';
  }
  draw(ctx) {
    //darw bullet
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.h, 0, 2 * Math.PI, false);
    ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, 20, 20);
    ctx.stroke();
  }
  update() {
    //remove bullet if its out 
    if (this.x < 0) {
      hungrysharkgame.removedsprites.push(this);
    }
    else {
      //check if it hits player fish is hitted by the bullets and reduce his health
      var distance = Math.sqrt((this.x - fish1.x) * (this.x - fish1.x) + (this.y - fish1.y) * (this.y - fish1.y));
      if (fish1.radius >= distance) {
        hungrysharkgame.removedsprites.push(this);
        score1.health -= 150;

      }
    }

    this.x = this.x - (this.velocityX * this.speed);



  }
};
//draw backgournd
class background extends Sprite {
  constructor(x, y, w, h, speed) {
    super(x, y, w, h, speed);
    this.image = new Image();
    this.image.src = 'backgournd.png';
  }
  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.w, this.h)
  }
}
//explotion 
class explod extends Sprite {
  constructor(x, y, w, h, speed) {
    super(x, y, w, h, speed);
    this.frame = 0;
    this.frameX = 0;
    this.spriteWidth = 128;
    this.spriteHeight = 128;
    this.images = new Image();
    this.images.src = 'explotion.png';
  }

  //draw bullet
  draw(ctx) {
    //draw animation expltion
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.h, 0, 2 * Math.PI, false);
    ctx.stroke();
    this.frame++;
    if (this.frame >= 5) {
      this.frame = 0;
    }
    ctx.fillStyle = 'black';
    //ctx.save();
    ctx.drawImage(this.images, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x - this.radius, this.y - this.radius, this.spriteWidth, this.spriteHeight);

  }
  update() {
    //remove the explotion after few minute depending on the explotion size
    if (this.h <= 0) {
      hungrysharkgame.removedsprites.push(this);
    }
    //make it smaller
    this.h--;

  }
}

class mainmenu extends Sprite {
  draw(ctx) {
    if (!this.case) {
      //draw guodince to player
      if (this.index1 == 2) {
        ctx.fillStyle = 'black'
        ctx.font = "30px Verdana"
        ctx.fillText("move by *mouse* shoout by *space* dodge bombs and birds", 100, 600);
        ctx.fillText("or destroy them .eat fish to gain health and try to aim ", 100, 650);
        ctx.fillText("to defeat the bosses ,and if you found hard try to  ", 100, 700);
        ctx.fillText("hide on the right side on the screen ;) and have fun <3 <3 ", 100, 750);
      }
      //draw credits
      else if (this.index1 == 3) {
        ctx.fillStyle = 'black'
        ctx.font = "30px Verdana"
        ctx.fillText("developed and directed by mohamad ayoubi", 100, 650);
        ctx.fillText("thank you for playing the game", 100, 700);
      }
      //creates buttons
      ctx.beginPath();
      ctx.strokeStyle = "green";
      ctx.fillStyle = 'black'
      ctx.font = "50px Verdana"
      ctx.fillText("main menu", 450, 150);
      ctx.font = "20px Verdana"
      ctx.fillText("select one", 500, 200);
      ctx.font = "30px Verdana"
      ctx.fillText("Start Game", 500, 320);
      ctx.fillText("guide", 500, 420);
      ctx.fillText("credit", 500, 520);
      // ctx.strokeStyle = "green";
      ctx.rect(490, 275, 200, 75);
      ctx.rect(490, 375, 200, 75);
      ctx.rect(490, 475, 200, 75);
      ctx.stroke();

    }
    //draw messages to player
    if (this.index1 == 5) {
      ctx.fillStyle = 'black'
      ctx.font = "30px Verdana"
      ctx.fillText("level cleared next level starts soon", 500, 400);
    }
    if (this.index1 == 6) {
      ctx.fillStyle = 'black'
      ctx.font = "30px Verdana"
      ctx.fillText("hardluck!! you lose try again", 500, 400);
    }
    if (this.index1 == 7) {
      ctx.fillStyle = 'black'
      ctx.font = "30px Verdana"
      ctx.fillText("congrats!! great job you won ", 500, 400);
    }
  }
  update() {
    //check the user selection
    if (!this.case) {
      if (mouse.x < 690 && mouse.x > 490 && mouse.y < 350 && mouse.y > 275 && mousePressed) {
        this.angle = 0;
        this.index = 0;
        //start level 1
        createenemies(enemies, bosses);
        this.case = true;
      }

      if (mouse.x < 690 && mouse.x > 490 && mouse.y < 450 && mouse.y > 375 && mousePressed) {
        this.index1 = 2;
      }
      if (mouse.x < 690 && mouse.x > 490 && mouse.y < 550 && mouse.y > 475 && mousePressed) {
        this.index1 = 3;
      }

    }
    //check if the first boss is died to start the next level and send message to player
    if (this.index < 300) {
      if (bosses.length > 0) {
        if (bosses[bosses.length - 1].status == "dead") {
          this.index1 = 5;
          this.index++;
        }
      }
    }
    //start level 2 if level is passed
    if (this.index == 300) {
      this.index1 = 1;
      createenemies2(enemies, bosses);
      this.index++;
    }
    //check if player clearer bouth levels and congratulate him
    if (this.moveAngle < 200) {
      if (bosses.length > 1) {
        if (bosses[bosses.length - 1].status == "dead" && bosses[bosses.length - 2].status == "dead") {
          this.index1 = 7;
          this.moveAngle++;
        }
      }
    }
    //reset the game
    if (this.moveAngle == 200) {
      this.index1 = 1;
      this.case = false;
      fish1.status = "alive";
      score1.health = 2000;
      score1.scoree = 0;
      hungrysharkgame.reset();
      this.moveAngle++;
    }
    //check if the palyer is died and send message to user
    if (this.angle < 200) {

      if (fish1.status == "dead") {
        this.index1 = 6;
        this.angle++;
      }
    }
    //reset the game
    if (this.angle == 200) {
      this.index1 = 1;
      this.case = false;
      fish1.status = "alive";
      score1.health = 2000;
      score1.scoree = 0;
      hungrysharkgame.reset();
      this.angle++;
    }
  }

}



//create sounds effects
function explotionplay() {
  var explotionaudio = new Audio('explotion.wav');
  explotionaudio.play();
}
function eatplay() {
  var eataudio = new Audio('eating.wav');
  eataudio.play();
}
function sinkingplay() {
  var sinkaudio = new Audio('sink.wav');
  sinkaudio.play();
}
function shoot1play() {
  var shoot1audio = new Audio('shoot1.mp3');
  shoot1audio.play();
}
function shoot2play() {
  var shoot2audio = new Audio('shoot2.mp3');
  shoot2audio.play();
}
function destroctionplay() {
  var destroctionaudio = new Audio('destruction.mp3');
  destroctionaudio.play();
}


//track score and health
class score extends Sprite {
  constructor(x, y, w, h, speed) {
    super(x, y, w, h, speed);
    this.health = 2000;
    this.scoree = 0;
  }

  draw(ctx) {

    if (menu2.case) {
      ctx.fillStyle = 'green'
      ctx.font = "30px Verdana"
      ctx.fillText("health: " + this.health, 50, 50);
      ctx.fillStyle = 'red'
      ctx.font = "30px Verdana"
      ctx.fillText("score: " + this.scoree, 1000, 50);
    }
  }

}



var hungrysharkgame = new game(1200, 800);
let canvasPosition = hungrysharkgame.canvas.getBoundingClientRect();
var fish1 = new fish(300, 300, 40, 40, 5);

var enemies = [];
var bosses = [];
var menu2 = new mainmenu();
var score1 = new score();
var background1 = new background(0, 0, hungrysharkgame.cw, hungrysharkgame.ch);


hungrysharkgame.addSprite(background1);
hungrysharkgame.addSprite(menu2);
hungrysharkgame.addSprite(fish1);
hungrysharkgame.addSprite(score1);
animate(hungrysharkgame);

//creates the first level
function createenemies(enemies, bosses) {
  for (var i = 1; i < 11; i++) {
    var fishleft1 = new fishenemy1left(1200 + i * 500, (Math.random() * (375 - 40) + 40), 40, 40, 2);
    hungrysharkgame.addSprite(fishleft1);
    var fishright2 = new fishenemy1right(-i * 500, (Math.random() * (750 - 420) + 420), 40, 40, 2);
    hungrysharkgame.addSprite(fishright2);
    var fishleft21 = new fishenemy2left(1200 + i * 500, (Math.random() * (375 - 40) + 40), 40, 40, 1.8);
    hungrysharkgame.addSprite(fishleft21);
    var fishright22 = new fishenemy2right(-i * 500, (Math.random() * (750 - 420) + 420), 40, 40, 1.8);
    hungrysharkgame.addSprite(fishright22);
    var bomb1 = new seabomb(-i * 700, (Math.random() * (750 - 40) + 40), 50, 50, 3);
    hungrysharkgame.addSprite(bomb1);
    var bomb2 = new seabomb(1200 + i * 700, (Math.random() * (750 - 40) + 40), 50, 50, 3);
    hungrysharkgame.addSprite(bomb2);
    if (i == 3 || i == 5 || i == 7 || i == 9) {
      var bird = new enemybird((Math.random() * (750 - 320) + 320), -i * 500, 35, 35, 5);
      enemies.push(bird);
      hungrysharkgame.addSprite(bird);
    }
    enemies.push(bomb1, bomb2);
  }
  var boss2 = new enemyboss1(8500, 200, 60, 60, 5);
  hungrysharkgame.addSprite(boss2);
  bosses.push(boss2);
};
//create the second level
function createenemies2(enemies, bosses) {
  for (var i = 1; i < 11; i++) {
    var fishleft1 = new fishenemy1left(1200 + i * 500, (Math.random() * (375 - 40) + 40), 40, 40, 2);
    hungrysharkgame.addSprite(fishleft1);
    var fishright2 = new fishenemy1right(-i * 500, (Math.random() * (750 - 420) + 420), 40, 40, 2);
    hungrysharkgame.addSprite(fishright2);
    var fishleft21 = new fishenemy2left(1200 + i * 500, (Math.random() * (375 - 40) + 40), 40, 40, 1.8);
    hungrysharkgame.addSprite(fishleft21);
    var fishright21 = new fishenemy2right(-i * 500, (Math.random() * (375 - 40) + 40), 40, 40, 2);
    hungrysharkgame.addSprite(fishright21);
    var fishright22 = new fishenemy2right(-i * 500, (Math.random() * (750 - 420) + 420), 40, 40, 1.8);
    hungrysharkgame.addSprite(fishright22);
    var bomb1 = new seabomb(-i * 7500, (Math.random() * (750 - 40) + 40), 50, 50, 3);
    hungrysharkgame.addSprite(bomb1);
    var bomb2 = new seabomb(1200 + i * 750, (Math.random() * (750 - 40) + 40), 50, 50, 3);
    hungrysharkgame.addSprite(bomb2);
    var bomb3 = new seabomb(1200 + i * 750, (Math.random() * (1000 - 40) + 40), 50, 50, 3);
    hungrysharkgame.addSprite(bomb3);
    if (i == 2 || i == 4 || i == 6 || i == 8 || i == 10) {
      var bird = new enemybird((Math.random() * (600 - 320) + 320), -i * 750, 35, 35, 5);
      enemies.push(bird);
      hungrysharkgame.addSprite(bird);

    }
    enemies.push(bomb1, bomb2, bomb3);
  }
  var boss2 = new enemyboss2(9000, 200, 60, 60, 5);
  hungrysharkgame.addSprite(boss2);
  bosses.push(boss2);
};
