import { GameObject, GameObjectType } from "../../shared/gameObject"
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
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    for (const player of this.game.playerStore.objects) {
      this.renderObject(player)
    }
    for (const enemy of this.game.enemyStore.objects) {
      this.renderObject(enemy)
    }
  }

  private renderObject<T extends GameObjectType>(obj: GameObject<T>) {
    if (!this.ctx) return
    const { ctx } = this
    const { x, y } = this.game.camera.offset
    const { shapeType, radius, width, height, lineWidth, fill, color } =
      obj.renderSettings

    ctx.save()
    ctx.beginPath()
    if (shapeType == ShapeType.Circle) {
      if (!radius) throw new Error("radius not set")
      ctx.arc(obj.pos.x + x, obj.pos.y + y, radius, 0, 2 * Math.PI)
    } else {
      console.log("rendering rect", obj)
      if (!width || !height) throw new Error("width or height not set")
      ctx.rect(obj.pos.x + x, obj.pos.y + y, width, height)
    }
    if (fill) {
      ctx.fillStyle = color
      ctx.fill()
    }
    if (obj.renderSettings.lineWidth > 0) {
      ctx.lineWidth = lineWidth
      ctx.strokeStyle = color
      ctx.stroke()
    }
    ctx.closePath()
  }
}
