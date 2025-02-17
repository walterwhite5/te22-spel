import Layer from './Layer'
import fgImage from "./assets/foreground_layer.png"
import glImage from "./assets/ground_layer.png"
import mlImage from "./assets/middle_layer.png"
import slImage from "./assets/sky_layer.png"

export default class Background {
  constructor(game) {
    this.game = game
    this.width = 1708
    this.height = 500

    this.fg = new Image()
    this.fg.src = fgImage
    this.gl = new Image()
    this.gl.src = glImage
    this.ml = new Image()
    this.ml.src = mlImage
    this.sl = new Image()
    this.sl.src = slImage

    this.backgroundLayers = [
      new Layer(this.game, this.width, this.height, 0.1, this.sl),
      new Layer(this.game, this.width, this.height, 0.2, this.ml),
      new Layer(this.game, this.width, this.height, 0.5, this.gl),
      new Layer(this.game, this.width, this.height, 1, this.fg)
    ]
  }

  update(deltaTime) {
    this.backgroundLayers.forEach(layer => {
      layer.update(deltaTime)
    })
  }

  draw(ctx) {
    this.backgroundLayers.forEach(layer => {
      layer.draw(ctx)
    })
  }

}