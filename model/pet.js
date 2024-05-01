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
    this.K_ACTION_RESPOND = "respond"

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
      },
      idle: () => {
        this.action = this.K_ACTION_IDLE;
        this.actionTick = randomIntFromInterval(8, 32);
      },
      stand: () => {
        this.action = this.K_ACTION_STAND;
        this.actionTick = randomIntFromInterval(8, 32);
      },
      respond: () => {
        this.action = this.K_ACTION_RESPOND;
        this.actionTick = 32
      }
    };

    this.sprites = {};
    this.load();

    this.isResponseActive = false;
  }

  load() {
    this.sprites[this.K_ACTION_WALK] = this.loadSprite("texture-pet-walk");
    this.sprites[this.K_ACTION_STAND] = this.loadSprite("texture-pet-stand");
    this.sprites[this.K_ACTION_IDLE] = this.loadSprite("texture-pet-idle");
    this.sprites[this.K_ACTION_RESPOND] = this.loadSprite("texture-pet-responding");

  }

  loadSprite(cls) {
    let sprites = [...document.getElementsByClassName(cls)];

    return sprites;
  }

  update() {
    this.tick += 1;

    // do action

    if (this.isResponseActive) {
      this.actions[this.K_ACTION_RESPOND]()
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
}