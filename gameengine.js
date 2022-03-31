window.requestAnimFrame = (function (callback) {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

function animate(myGame) {
  myGame.update();
  myGame.draw();
  requestAnimationFrame(function () {
    animate(myGame);
  });
};

class game {
  constructor(canvasWidth, canvasHeight) {
    this.canvas = document.getElementById("maingame");
    if (this.canvas.getContext) {
      this.ctx = this.canvas.getContext("2d");
    }
    this.sprites = []
    this.cw = canvasWidth;
    this.ch = canvasHeight;
    this.removedsprites = [];
    this.removeindex;
  };
  addSprite(sprite) {
    this.sprites.push(sprite);
  };
  clearSprites() {
    this.sprites = [];
  }
  update() {
    var numberofsprites = this.sprites.length;
    for (var i = 0; i < numberofsprites; i++) {
      this.sprites[i].update();
    }
    var numberofsprites1 = this.removedsprites.length;
    for (var j = 0; j < numberofsprites1; j++) {
      this.removeindex = this.sprites.indexOf(this.removedsprites[j]);
      this.sprites.splice(this.removeindex, 1);
    }
    this.removedsprites = [];
  };
  draw() {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.cw, this.ch); //i added this 2 line  in order to show a simple animation without creating rectangle class
    var numberofsprites = this.sprites.length;
    for (var i = 0; i < numberofsprites; i++)
      this.sprites[i].draw(this.ctx);
  };
  //resert the game
reset(){
  var numberofsprites = this.sprites.length;
  for (var i = 0; i < numberofsprites; i++) {
    this.removedsprites.push(this.sprites[i]);
  }
  hungrysharkgame.addSprite(background1);
  hungrysharkgame.addSprite(menu2);
  hungrysharkgame.addSprite(fish1);
  hungrysharkgame.addSprite(score1);
}

};


class Sprite {
  constructor(x, y, w, h, speed) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.radius = h;
    this.speed = speed
    this.velocityX = 1;
    this.velocityY = 1;
    this.case = false;
    this.index = 0;
    this.index1=0;
    this.angle = 0;
    this.moveAngle = 1;
    this.status = "alive";
    this.hits = 0;

  }
  draw(ctx) {
  }

  update() {

  }
};




