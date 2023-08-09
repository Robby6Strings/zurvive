import { Health } from "../../shared/components/health"
import { Sprite } from "../../shared/components/sprite"
import { Player } from "../../shared/gameObjects/entities"
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
    const player = game.getPlayer()
    if (!player) return
    for (const obj of game.objectStore.objects) {
      const sprite = obj.getComponent(Sprite)
      if (sprite) {
        sprite.setImageOffset(obj, player.pos)
        this.renderImage(obj.pos, sprite.renderSettings, camera)
        continue
      }
      this.renderObject(obj.pos, obj.renderSettings, camera)
    }

    this.renderCursor(game)
    this.renderPlayerHealth(player, camera)
  }
  renderPlayerHealth(player: Player, camera: Camera) {
    if (!this.ctx) return
    const health = player.getComponent(Health)
    if (!health) return
    health.renderTime -= 1000 / 60
    if (health.renderTime < 0) {
      health.renderTime = 0
      return
    }
    const { ctx } = this
    const { x, y } = player.pos
    const { x: xOffset, y: yOffset } = camera.offset
    const { radius } = player.renderSettings
    const { currentHealth, maxHealth } = health
    const healthBarWidth = 30
    const healthBarHeight = 5
    const healthBarOffset = 10
    const healthBarX = x + xOffset - healthBarWidth / 2
    const healthBarY = y + yOffset - radius! - healthBarOffset
    const healthBarCurrentWidth = (currentHealth / maxHealth) * healthBarWidth
    ctx.save()
    ctx.beginPath()
    ctx.rect(healthBarX, healthBarY, healthBarWidth, healthBarHeight)
    ctx.fillStyle = "#000a"
    ctx.fill()
    ctx.closePath()
    ctx.beginPath()
    ctx.rect(healthBarX, healthBarY, healthBarCurrentWidth, healthBarHeight)
    ctx.fillStyle = "#f00a"
    ctx.fill()
    ctx.closePath()
    ctx.restore()
  }

  private renderCursor(game: ClientGame) {
    if (!this.ctx) return
    const cursorSize = 20
    const mousePos = game.mousePos
    this.ctx.strokeStyle = "#afac"
    this.ctx.beginPath()
    this.ctx.moveTo(mousePos.x - cursorSize / 2, mousePos.y)
    this.ctx.lineTo(mousePos.x + cursorSize / 2, mousePos.y)
    this.ctx.moveTo(mousePos.x, mousePos.y - cursorSize / 2)
    this.ctx.lineTo(mousePos.x, mousePos.y + cursorSize / 2)
    this.ctx.stroke()
    this.ctx.closePath()
  }

  private renderImage(pos: IVec2, settings: RenderSettings, camera: Camera) {
    if (!this.ctx) return
    const { ctx } = this
    const { x, y } = pos
    const { x: xOffset, y: yOffset } = camera.offset
    const { img, imgOffset, width, height } = settings
    if (!img) throw new Error("img not set")
    if (!imgOffset) {
      throw new Error("imgOffset not set")
    }
    if (!width || !height) throw new Error("width or height not set")

    ctx.drawImage(
      img,
      imgOffset.x,
      imgOffset.y,
      width,
      height,
      x + xOffset - width / 2,
      y + yOffset - height / 2,
      width,
      height
    )
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
    ctx.restore()
  }
}
