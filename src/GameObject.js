export default class GameObject {
  constructor(game, x, y, width, height) {
    this.game = game
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.color = "#fff"

    this.maxSpeed = 1
    this.direction = 1
  }

  update(deltaTime) {
    this.x = this.x + this.maxSpeed / 1000 * deltaTime * this.direction
    if (this.x > this.game.width - this.width) this.direction = -1
    if (this.x < 0) this.direction = 1
  }

  draw(ctx) {
    ctx.fillStyle = this.color
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }
}