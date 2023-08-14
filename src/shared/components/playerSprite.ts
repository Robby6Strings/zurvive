import { images } from "../../client/state"
import { ComponentType } from "../component"
import { GameObject } from "../gameObject"
import { RenderSettings } from "../traits/renderable"
import { ShapeType } from "../types"
import { radiansToDeg } from "../utils"
import { IVec2, Vec2 } from "../vec2"
import { Sprite } from "./sprite"

let h = 64
let w = 46

export class PlayerSprite extends Sprite {
  imgIdx: number = 0
  imgSetIdx: number = 0
  imgSetOffset: IVec2 = { x: 0, y: 0 }
  imgUpdateCooldown: number = 1000 / 60
  renderSettings: RenderSettings = {
    render: true,
    color: "transparent",
    fill: false,
    lineWidth: 0,
    shapeType: ShapeType.Rectangle,
    height: h,
    width: w,
    imgRef: "player",
    offset: { x: 0, y: 0 },
  }
  imgOffsets: (IVec2 & {
    dir:
      | "up"
      | "upleft"
      | "upright"
      | "down"
      | "downleft"
      | "downright"
      | "left"
      | "right"
  })[] = []
  constructor() {
    super()
    this.type = ComponentType.PlayerSprite
    const yOffset_UpLeft = 0
    const yOffset_Up = 64
    const yOffset_UpRight = 128
    const yOffset_Right = 192
    const yOffset_Left = 257
    const yOffset_Down = 390
    const yOffset_DownLeft = 326
    const yOffset_DownRight = 454

    ;[
      "up",
      "upleft",
      "upright",
      "right",
      "left",
      "down",
      "downleft",
      "downright",
    ].forEach((dir) => {
      const yOffset =
        dir === "up"
          ? yOffset_Up
          : dir === "upleft"
          ? yOffset_UpLeft
          : dir === "upright"
          ? yOffset_UpRight
          : dir === "right"
          ? yOffset_Right
          : dir === "left"
          ? yOffset_Left
          : dir === "downleft"
          ? yOffset_DownLeft
          : dir === "downright"
          ? yOffset_DownRight
          : yOffset_Down
      const w = 55

      for (let i = 0; i < 8; i++) {
        this.imgOffsets.push({
          x: i * w,
          y: yOffset,
          dir: dir as any,
        })
      }
    })
  }

  setImage() {
    if ("window" in globalThis) {
      const img = images.value.find(
        (img) => img.name === this.renderSettings.imgRef
      )?.image
      if (!img)
        throw new Error("Image not found: " + this.renderSettings.imgRef)
      this.renderSettings.img = img
    }
  }

  update(_obj: GameObject): void {
    return
  }

  setRenderSettings(settings: Partial<RenderSettings>): void {
    Object.assign(this.renderSettings, settings)
  }

  setImageOffset(obj: GameObject, lookAt: Vec2): void {
    if (!("window" in globalThis)) return

    if (this.imgUpdateCooldown > 0) {
      this.imgUpdateCooldown -= 1
      return
    }

    this.imgUpdateCooldown = 5

    let dir:
      | "up"
      | "upleft"
      | "upright"
      | "down"
      | "downleft"
      | "downright"
      | "right"
      | "left" = "down"

    const angle = obj.pos.angleTo(lookAt)
    let deg = radiansToDeg(angle) + 90
    if (deg < 0) deg = 360 - Math.abs(deg)

    if (deg > 337.5 || deg < 22.5) {
      dir = "up"
    } else if (deg > 22.5 && deg < 67.5) {
      dir = "upright"
    } else if (deg > 67.5 && deg < 112.5) {
      dir = "right"
    } else if (deg > 112.5 && deg < 157.5) {
      dir = "downright"
    } else if (deg > 157.5 && deg < 202.5) {
      dir = "down"
    } else if (deg > 202.5 && deg < 247.5) {
      dir = "downleft"
    } else if (deg > 247.5 && deg < 292.5) {
      dir = "left"
    } else if (deg > 292.5 && deg < 337.5) {
      dir = "upleft"
    }

    const imgOffsets = this.imgOffsets.filter((offset) => offset.dir === dir)
    this.imgIdx--
    if (this.imgIdx < 0) {
      this.imgIdx = imgOffsets.length - 1
    } else if (this.imgIdx >= imgOffsets.length) {
      this.imgIdx = 0
    }

    if (obj.vel.magnitude() < 1) {
      this.imgIdx = 0
    }

    const imgOffset = imgOffsets[this.imgIdx]

    if (!imgOffset)
      throw new Error("imgOffset not found: " + dir + ": " + this.imgIdx)
    this.renderSettings.offset = {
      x: this.imgSetOffset.x + imgOffset.x,
      y: this.imgSetOffset.y + imgOffset.y,
    }
  }
  deserialize(): void {
    this.imgSetIdx = 0

    this.setImage()
  }
  serialize(): Object {
    return {
      type: this.type,
      imgSetIdx: this.imgSetIdx,
    }
  }
}
