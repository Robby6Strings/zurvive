import { RenderSettings } from "../../shared/renderable"
import { ShapeType } from "../../shared/types"
import { IVec2 } from "../../shared/vec2"
import { HtmlElements } from "../../state"
import { Camera } from "./camera"
import { ClientGame } from "./clientGame"

export class Renderer {
  constructor() {}
  get canvas() {
    return HtmlElements.value?.canvas
  }
  get ctx() {
    return HtmlElements.value?.ctx
  }
  public render(game: ClientGame, camera: Camera) {
    if (!this.canvas || !this.ctx) return
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    for (const objectStore of game.objectStores) {
      for (const obj of objectStore.objects) {
        this.renderObject(obj.pos, obj.renderSettings, camera)
      }
    }
  }

  private renderObject(pos: IVec2, settings: RenderSettings, camera: Camera) {
    if (!this.ctx) return
    if (settings.render === false) return

    const { ctx } = this
    const { x, y } = pos
    const { x: xOffset, y: yOffset } = camera.offset
    const { shapeType, radius, width, height, lineWidth, fill, color } =
      settings

    ctx.save()
    ctx.beginPath()
    if (shapeType == ShapeType.Circle) {
      if (!radius) throw new Error("radius not set")
      ctx.arc(x + xOffset, y + yOffset, radius, 0, 2 * Math.PI)
    } else {
      if (!width || !height) throw new Error("width or height not set")
      ctx.rect(x + xOffset - width / 2, y + yOffset - height / 2, width, height)
    }
    if (fill) {
      ctx.fillStyle = color
      ctx.fill()
    }
    if (lineWidth > 0) {
      ctx.lineWidth = lineWidth
      ctx.strokeStyle = color
      ctx.stroke()
    }
    ctx.closePath()
  }
}
