// function handlePetPosition(x, y) {
//   pet.currentX = x;
//   pet.currentY = y;
// }

// window.addEventListener("petPosition", function (event) {
//   const newPosition = event.detail;
//   handlePetPosition(newPosition.x, newPosition.y);
// });

// function handleScreenInfo(width, height) {
//   pet.screenWidth = width;
//   pet.screenHeight = height;
// }

// window.addEventListener("screenInfo", function (event) {
//   const newPosition = event.detail;
//   handlePetPosition(newPosition.screenWidth, newPosition.screenHeight);
// });

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomAction(strings) {
  const i = Math.floor(Math.random() * strings.length);

  return strings[i];
}

class Pet {
  constructor(canvas) {
    this.canvas = canvas;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.K_ACTION_IDLE = "idle";
    this.K_ACTION_STAND = "stand";
    this.K_ACTION_WALK = "walk";

    this.SPRITE_LENGTH = 8;

    this.speed = 6;

    this.action = this.K_ACTION_IDLE;
    this.actionTick = 16;

    this.orientation = 1;
    this.tick = 0;

    this.actions = {
      walk: () => {
        this.action = this.K_ACTION_WALK;
        this.actionTick = randomIntFromInterval(16, 64);

        this.orientation = Math.random() < 0.5 ? -1 : 1;

        window.electronAPI.petInfo({
          orientation: this.orientation
        });
      },
      idle: () => {
        this.action = this.K_ACTION_IDLE;
        this.actionTick = randomIntFromInterval(8, 32);
      },
      stand: () => {
        this.action = this.K_ACTION_STAND;
        this.actionTick = randomIntFromInterval(8, 32);
      },
    };

    this.sprites = {};
    this.load();

    this.isResponseActive = false;
  }

  load() {
    this.sprites[this.K_ACTION_WALK] = this.loadSprite("texture-pet-walk");
    this.sprites[this.K_ACTION_STAND] = this.loadSprite("texture-pet-stand");
    this.sprites[this.K_ACTION_IDLE] = this.loadSprite("texture-pet-idle");
  }

  loadSprite(cls) {
    let sprites = [...document.getElementsByClassName(cls)];

    return sprites;
  }

  update() {
    this.tick += 1;

    // do action

    if (this.isResponseActive) {
      this.actions[this.K_ACTION_STAND]()
    }

    if (this.action === this.K_ACTION_WALK) {
      window.electronAPI.petStep(this.speed * this.orientation, 0);
    }
    this.actionTick -= 1;

    // end action
    if (this.actionTick <= 0) {
      let act = randomAction([
        this.K_ACTION_WALK,
        this.K_ACTION_WALK,
        this.K_ACTION_WALK,
        this.K_ACTION_WALK,
        this.K_ACTION_STAND,
        this.K_ACTION_IDLE,
      ]);
      this.actions[act]();
    }
  }

  render(ctx) {
    this.update();

    let fr = null;
    let frames = null;

    let drawX = 0;
    let drawY = 0;

    fr = this.sprites[this.action][this.tick % this.SPRITE_LENGTH];

    if (this.orientation == -1) {
      ctx.scale(-1, 1);

      drawX = drawX * this.orientation - this.canvas.width;
    }

    ctx.drawImage(fr, drawX, drawY, this.canvas.width, this.canvas.height);
  }

  //   getScreenInfo(){
  //     const t = this;
  //     const {screenWidth, screenHeight} = window.electronAPI.screenInfo()
  //     t.screenWidth = screenWidth
  //     t.screenHeight = screenHeight
  //   }

  //   async walkToPosition(x, y) {
  //     this.action = "walk";
  //     const dx = x - this.currentX;
  //     const dy = y - this.currentY;
  //     const distance = Math.sqrt(dx * dx + dy * dy);
  //     const stepCount = distance / 20;

  //     const stepX = dx / stepCount;
  //     const stepY = dy / stepCount;

  //     this.walkDx = Math.round(stepX);
  //     this.walkDy = Math.round(stepY);

  //     this.mirrorHorizontal = this.walkDx < 0;

  //     this.currentFrame = 1;
  //     this.lastSpriteFrameNumber = 8;

  //     return new Promise((resolve) => {
  //       setTimeout(() => {
  //         resolve();
  //       }, (stepCount * 1000) / 8);
  //     });
  //   }

  //   async screenshot() {
  //     try {
  //       const data = await apiService.screenshot();
  //       const responseWithCoordinate = JSON.parse(
  //         data.data.response.initial_response
  //       );
  //       console.log("Data:", data);
  //       const { x, y } = this.calculateCoordinateByScreenRatio(
  //         responseWithCoordinate.x,
  //         responseWithCoordinate.y,
  //         data.data.screen_size.width,
  //         data.data.screen_size.height
  //       );
  //       console.log(x, y);
  //       await this.walkToPosition(x, y);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   }

    //   calculateCoordinateByScreenRatio(x, y, screenshotWidth, screenshotHeight) {
    //     let widthScalingFactor = this.screenWidth / screenshotWidth;
    //     let heightScalingFactor = this.screenHeight / screenshotHeight;
    //     let convertedX = x * widthScalingFactor;
    //     let convertedY = y * heightScalingFactor;
    //     return {
    //       x:
    //         convertedX >= 0
    //           ? convertedX - this.canvas.width / 2
    //           : convertedX + this.canvas.width / 2,
    //       y:
    //         convertedY >= 0
    //           ? convertedY - this.canvas.height / 2
    //           : convertedY + this.canvas.height / 2,
    //     };
    //   }
}
