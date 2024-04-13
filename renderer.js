
function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

class Pet {
  /**
   * @param {HTMLElement} canvas
   */
  constructor(canvas) {
    this.canvas = canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    this.petImage = new Image;

    const t = this
    this.petImage.onload = function () {
      t.ctx.clearRect(0, 0, t.ctx.canvas.width, t.ctx.canvas.height);
      t.ctx.drawImage(t.petImage, 0, 0, t.ctx.canvas.width, t.ctx.canvas.height);
    };

    this.animationInterval = null
    
  }

  playAnimation(type, lastSpriteFrameNumber, duration = -1, postAnimationHandler = () => { }, preFrameAdvanceHandler = async () => { }) {
    clearInterval(this.animationInterval)

    this.currentFrameNumber = 1
    this.frameCounter = 0

    const t = this

    this.animationInterval = setInterval(async function () {
      await preFrameAdvanceHandler()

      if (t.currentFrameNumber > lastSpriteFrameNumber) {
        t.currentFrameNumber = 1
      }

      t.petImage.src = `assets/${type}/${type}${t.currentFrameNumber++}.png`;
      console.log(t.petImage.src)

      if (duration !== -1) {
        t.frameCounter += 1

        if (t.frameCounter > duration) {
          clearInterval(t.animationInterval)
          t.animationInterval = null
          postAnimationHandler()
        }
      }
    }, 100);
  }

  idle() {
    const duration = randomIntFromInterval(20, 30)
    const postAnimationHandler = async () => {
      this.walk()
    }
    this.playAnimation("idle", 8, duration, postAnimationHandler)
  }

  stand() {
    const duration = randomIntFromInterval(10, 15)
    const nextAction = Math.random() < 0.5 ? "idle" : "walk"
    const postAnimationHandler = async () => {
      this[nextAction]()
    }
    this.playAnimation("stand", 8, duration, postAnimationHandler)
  }

  walk() {
    const t = this

    let dx = randomIntFromInterval(-5, 5)
    let dy = randomIntFromInterval(-2, 2)

    if (dx === 0 && dy === 0) {
      dx = 1
    }

    if (dx < 0) {
      this.petImage.onload = function () {
        t.ctx.clearRect(0, 0, t.ctx.canvas.width, t.ctx.canvas.height);
        t.ctx.scale(-1, 1);
        t.ctx.drawImage(t.petImage, -t.petImage.width, 0, -t.ctx.canvas.width, t.ctx.canvas.height);
      };
    }
    else if (dx > 0) {
      this.petImage.onload = function () {
        t.ctx.clearRect(0, 0, t.ctx.canvas.width, t.ctx.canvas.height);
        t.ctx.drawImage(t.petImage, 0, 0, t.ctx.canvas.width, t.ctx.canvas.height);
      };
    }

    const preFrameAdvanceHandler = async () => {
      await window.electronAPI.petStep(dx, dy)
    }
    const postAnimationHandler = async () => {
      this.stand()
    }
    const duration = randomIntFromInterval(20, 30)

    this.playAnimation("walk", 8, duration, postAnimationHandler, preFrameAdvanceHandler)
  }


  async step(dx, dy) {
    if (this.walkCurrentFrameNumber > this.walkLastFrameNumber) {
      this.walkCurrentFrameNumber = 1
    }

    await window.electronAPI.petStep(dx, dy)
    this.petImage.src = `assets/walk/walk${this.walkCurrentFrameNumber++}.png`;
  }
}


const canvas = document.getElementById('canvas');

const pet = new Pet(canvas)
// pet.walk()
pet.walk()

