import { Experience } from "../../shared/components/experience"
import { Fighter } from "../../shared/components/fighter"
import { Health } from "../../shared/components/health"
import { Sprite } from "../../shared/components/sprite"
import { ObjectColors } from "../../shared/constants"
import { GameObject, GameObjectType } from "../../shared/gameObject"
import { Player } from "../../shared/gameObjects/entities"
import { RenderSettings } from "../../shared/traits/renderable"
import { ShapeType } from "../../shared/types"
import { IVec2 } from "../../shared/vec2"
import { HtmlElements } from "../state"
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
    //const start = performance.now()
    if (!this.canvas || !this.ctx) return
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    const player = game.getPlayer()
    if (!player) return

    game.objectStore.objects.sort((a, b) => a.pos.y - b.pos.y)

    for (const obj of game.objectStore.objects) {
      const sprite = obj.getComponent(Sprite)
      const fighter = obj.getComponent(Fighter)
      if (sprite) {
        if (obj.type === GameObjectType.Player) {
          sprite.setImageOffset(obj, game.mousePos.subtract(game.camera.offset))
        } else {
          sprite.setImageOffset(obj, fighter?.target?.pos ?? player.pos)
        }
        this.renderImage(obj.pos, sprite.renderSettings, camera)
      } else {
        if (obj.type === GameObjectType.ExperienceOrb) obj.update()
        this.renderObject(obj, camera)
      }
      this.renderEntityHealth(obj, camera)
    }

    this.renderCursor(game)
    this.renderPlayerXp(player)
    //console.debug(`render time: ${performance.now() - start}`)
  }

  renderPlayerXp(player: Player) {
    const xp = player.getComponent(Experience)
    if (!xp) return
    const { ctx, canvas } = this
    if (!ctx || !canvas) return

    //render a green circle with num souls at top left
    //ObjectColors[GameObjectType.ExperienceOrb]
    const circleRad = 6
    const circleX = circleRad + 10
    const circleY = circleRad + 10
    const numSouls = xp.souls
    ctx.save()
    ctx.beginPath()
    ctx.shadowBlur = 3
    ctx.shadowColor = ObjectColors[GameObjectType.ExperienceOrb]
    ctx.arc(circleX, circleY, circleRad, 0, Math.PI * 2)
    ctx.fillStyle = ObjectColors[GameObjectType.ExperienceOrb]
    ctx.fill()
    ctx.closePath()
    ctx.restore()

    ctx.save()
    ctx.beginPath()
    ctx.shadowBlur = 3
    ctx.shadowColor = "#000"
    ctx.font = "11px Arial"
    ctx.fillStyle = "#fffe"
    ctx.textAlign = "center"
    //ctx.textBaseline = "middle"
    ctx.fillText(`${numSouls}`, circleX + circleRad + 10, circleY + 4)
    ctx.closePath()
    ctx.restore()

    // render a large bar at the bottom of the screen to indicate level progress
    const barWidth = 200
    const barHeight = 10
    const barX = canvas.width / 2 - barWidth / 2
    const barY = canvas.height - barHeight - 10
    const currentXp = xp.currentExperience
    const maxXp = xp.experienceToNextLevel
    const currentWidth = (currentXp / maxXp) * barWidth
    ctx.save()
    ctx.beginPath()
    ctx.rect(barX, barY, barWidth, barHeight)
    ctx.fillStyle = "#ffd70044"
    ctx.fill()
    ctx.closePath()
    ctx.beginPath()
    ctx.rect(barX, barY, currentWidth, barHeight)
    ctx.fillStyle = "#dda500"
    ctx.fill()
    ctx.closePath()
    ctx.restore()

    const levelX = canvas.width / 2 - barWidth / 2 - 14
    // render the current level
    ctx.save()
    ctx.beginPath()
    ctx.shadowBlur = 3
    ctx.shadowColor = "#000"
    ctx.font = "11px Arial"
    ctx.fillStyle = "#fffe"
    ctx.textAlign = "center"
    //ctx.textBaseline = "middle"
    ctx.fillText(`${xp.currentLevel}`, levelX, barY + barHeight / 2 + 3)
    ctx.closePath()
    ctx.restore()

    // draw a white circle outline around the level

    const circleRadius = 8
    ctx.save()
    ctx.beginPath()
    ctx.shadowBlur = 3
    ctx.shadowColor = "#000"
    ctx.arc(levelX, barY + barHeight / 2, circleRadius, 0, Math.PI * 2)

    ctx.strokeStyle = "#fff"
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.closePath()
    ctx.restore()
  }

  renderEntityHealth(obj: GameObject, camera: Camera) {
    if (!this.ctx) return
    const health = obj.getComponent(Health)
    if (!health) {
      return
    }
    health.renderTime -= 1000 / 60
    if (health.renderTime < 0) {
      health.renderTime = 0
      return
    }
    const { ctx } = this
    const { x, y } = obj.pos
    const { x: xOffset, y: yOffset } = camera.offset
    const { radius } = obj.renderSettings
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
    const { img, offset: imgOffset, width, height } = settings
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

  private renderObject(obj: GameObject, camera: Camera) {
    if (!this.ctx) return
    const { renderSettings: settings, pos, rotation } = obj
    if (settings.render === false) return

    const { ctx } = this
    const { x, y } = pos
    const { x: xOffset, y: yOffset } = camera.offset
    const {
      shapeType,
      radius,
      width,
      height,
      lineWidth,
      fill,
      color,
      glow,
      glowColor,
      glowSize,
      offset,
    } = settings

    const offsetVec = offset || { x: 0, y: 0 }

    ctx.save()
    ctx.beginPath()
    if (shapeType == ShapeType.Circle) {
      if (!radius) throw new Error("radius not set")
      ctx.arc(
        x + xOffset + offsetVec.x,
        y + yOffset + offsetVec.y,
        radius,
        0,
        2 * Math.PI
      )
    } else {
      if (!width || !height) throw new Error("width or height not set")
      ctx.translate(x + xOffset + offsetVec.x, y + yOffset + offsetVec.y)
      ctx.rotate(rotation)
      ctx.rect(-width / 2, -height / 2, width, height)

      ctx.rotate(-rotation)
      ctx.translate(-x - xOffset, -y - yOffset)
    }
    if (glow && glowSize && glowColor) {
      ctx.shadowBlur = glowSize
      ctx.shadowColor = glowColor
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
