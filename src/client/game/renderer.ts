import { ShapeType } from "../../shared/types"
import { HtmlElements } from "../../state"
import { ClientGame } from "./clientGame"

export class Renderer {
  constructor(private game: ClientGame) {}
  get canvas() {
    return HtmlElements.value?.canvas
  }
  get ctx() {
    return HtmlElements.value?.ctx
  }
  public render() {
    if (!this.canvas || !this.ctx) return
    const { x, y } = this.game.camera.offset
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    for (const obj of this.game.playerStore.objects) {
      this.ctx.save()
      this.ctx.beginPath()
      if (obj.renderSettings.shapeType === ShapeType.Circle) {
        this.ctx.arc(
          obj.center.x + x,
          obj.center.y + y,
          obj.renderSettings.radius ?? 30,
          0,
          2 * Math.PI
        )
      } else {
        this.ctx.rect(
          obj.center.x + x,
          obj.center.y + y,
          obj.renderSettings.width ?? 30,
          obj.renderSettings.height ?? 30
        )
      }
      if (obj.renderSettings.fill) {
        this.ctx.fillStyle = obj.renderSettings.color
        this.ctx.fill()
      }
      if (obj.renderSettings.lineWidth > 0) {
        this.ctx.lineWidth = obj.renderSettings.lineWidth
        this.ctx.strokeStyle = obj.renderSettings.color
        this.ctx.stroke()
      }
      this.ctx.closePath()
    }
  }
}
