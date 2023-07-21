import { HtmlElements } from "../../state"
import { ClientGame } from "./clientGame"

export class Renderer {
  game: ClientGame
  constructor(game: ClientGame) {
    this.game = game
  }
  get canvas() {
    return HtmlElements.value?.canvas
  }
  get ctx() {
    return HtmlElements.value?.ctx
  }
  public render() {
    if (!this.canvas || !this.ctx) return
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    for (const obj of this.game.playerStore.objects) {
      this.ctx.fillStyle = "red"
      this.ctx.fillRect(obj.center.x, obj.center.y, 10, 10)
    }

    for (const obj of this.game.enemyStore.objects) {
      this.ctx.fillStyle = "blue"
      this.ctx.fillRect(obj.center.x, obj.center.y, 10, 10)
    }
  }
}
