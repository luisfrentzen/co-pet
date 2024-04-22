function handlePetPosition(x, y) {
  pet.currentX = x;
  pet.currentY = y;
}

window.addEventListener('petPosition', function(event) {
  const newPosition = event.detail;
  handlePetPosition(newPosition.x, newPosition.y);
});

function handleScreenInfo(width, height) {
  pet.screenWidth = width;
  pet.screenHeight = height;
}

window.addEventListener('screenInfo', function(event) {
  const newPosition = event.detail;
  handlePetPosition(newPosition.screenWidth, newPosition.screenHeight);
});

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

class Pet {
  constructor(canvas) {
    this.canvas = canvas;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    this.petImage = new Image;

    this.action = "";

    this.walkDx = 0;
    this.walkDy = 0;

    this.mirrorHorizontal = false;

    this.currentFrameNumber = 1;
    this.lastSpriteFrameNumber = 1;

    this.currentX = 0
    this.currentY = 0

    this.getScreenInfo()

    this.idle();
  }

  async getScreenInfo(){
    const t = this;
    const {screenWidth, screenHeight} = await window.electronAPI.screenInfo()
    t.screenWidth = screenWidth
    t.screenHeight = screenHeight
  }

  async render() {
    const t = this;
    if (this.mirrorHorizontal == false) {
      this.petImage.onload = function () {
        t.ctx.setTransform(1, 0, 0, 1, 0, 0);
        t.ctx.clearRect(0, 0, t.ctx.canvas.width, t.ctx.canvas.height);
        t.ctx.drawImage(t.petImage, 0, 0, t.ctx.canvas.width, t.ctx.canvas.height);
      };
    } else {
      this.petImage.onload = function () {
        t.ctx.setTransform(1, 0, 0, 1, 0, 0);
        t.ctx.scale(-1, 1);
        t.ctx.clearRect(-t.petImage.width, 0, -t.ctx.canvas.width, t.ctx.canvas.height);
        t.ctx.drawImage(t.petImage, -t.petImage.width, 0, -t.ctx.canvas.width, t.ctx.canvas.height);
      }; 
    }

    if (this.action === "walk") {
      await window.electronAPI.petStep(this.walkDx, this.walkDy);
    }

    this.petImage.src = `assets/${this.action}/${this.action}${this.currentFrameNumber++}.png`;
    
    if (this.currentFrameNumber > this.lastSpriteFrameNumber) {
      this.currentFrameNumber = 1;
    }
  }

  async idle() {
    this.action = "idle";
    const duration = randomIntFromInterval(3000, 5000);
    
    this.currentFrame = 1;
    this.lastSpriteFrameNumber = 8;

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, duration);
    });
  }

  async stand() {
    this.action = "stand";
    const duration = randomIntFromInterval(3000, 5000);
    
    this.currentFrame = 1;
    this.lastSpriteFrameNumber = 8;

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, duration);
    });
  }

  async walk() {
    this.action = "walk";
    this.walkDx = randomIntFromInterval(5, 9);
    this.walkDy = randomIntFromInterval(3, 5);
    const directionX = Math.random() < 0.5;
    const directionY = Math.random() < 0.5;

    if (directionX > 0.5) {
      this.mirrorHorizontal = false
    } else{
      this.mirrorHorizontal = true
      this.walkDx *= -1
    }

    if (directionY > 0.5) {
      this.walkDy *= -1
    } 

    const duration = randomIntFromInterval(3000, 5000);
    
    this.currentFrame = 1;
    this.lastSpriteFrameNumber = 8;

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, duration);
    });
  }

  async walkToPosition(x, y) {
    this.action = "walk";
    const dx = x - this.currentX;
    const dy = y - this.currentY;
    const distance = Math.sqrt(dx*dx + dy*dy);
    const stepCount = distance / 20

    const stepX = dx / stepCount;
    const stepY = dy / stepCount;

    this.walkDx = Math.round(stepX);
    this.walkDy = Math.round(stepY);

    this.mirrorHorizontal = this.walkDx < 0;
    
    this.currentFrame = 1;
    this.lastSpriteFrameNumber = 8;

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, stepCount * 1000 / 8);
    });
  }

  async screenshot(){
    try {
      const data = await apiService.screenshot();
      const responseWithCoordinate = JSON.parse(data.data.response.initial_response)
      console.log('Data:', data);
      const {x, y} = this.calculateCoordinateByScreenRatio(responseWithCoordinate.x, responseWithCoordinate.y, data.data.screen_size.width, data.data.screen_size.height)
      console.log(x,y)
      await this.walkToPosition(x, y)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // async randomWalkAroundScreen(){
  //   let width = 1920
  //   let height = 1080
  //   const {x, y} = this.calculateCoordinateByScreenRatio(1920, 1080, width, height)
  //   await this.walkToPosition(x, y)
  // }

  async randomizeAction () {
    while(true) {
      const nextActionChance = Math.random();
      if (nextActionChance < 0.50) {
        await this.screenshot()
      }
       else if (nextActionChance < 0.66) {
        await this.stand()
      } else {
        await this.idle()
      }
    }
    
  }

  calculateCoordinateByScreenRatio(x, y, screenshotWidth, screenshotHeight){
    let widthScalingFactor = this.screenWidth / screenshotWidth
    let heightScalingFactor = this.screenHeight / screenshotHeight
    let convertedX = x * widthScalingFactor
    let convertedY = y * heightScalingFactor
    return {
      x: convertedX >= 0 ? convertedX - (this.canvas.width/2) : convertedX + (this.canvas.width/2),
      y: convertedY >= 0 ? convertedY - (this.canvas.height/2) : convertedY + (this.canvas.height/2)
    }
  }
}

const canvas = document.getElementById('canvas');

const pet = new Pet(canvas);

var fpsInterval = 1000 / 8;
var currentFrame;
var elapsed;
var then;

async function updateFrame(timeStamp) {
  currentFrame = window.performance.now();
  elapsed = currentFrame - then;

  if (elapsed > fpsInterval) {
    then = currentFrame - (elapsed % fpsInterval);
    await pet.render();
  }

  requestAnimationFrame(updateFrame);
};

function playAnimation() {
  then = window.performance.now();

  requestAnimationFrame(updateFrame);
};

pet.randomizeAction();
playAnimation();

const apiService = window.geminiAPI.apiService


