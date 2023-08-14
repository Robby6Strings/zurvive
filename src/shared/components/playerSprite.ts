import { images } from "../../client/state"
import { ComponentType } from "../component"
import { GameObject } from "../gameObject"
import { RenderSettings } from "../traits/renderable"
import { ShapeType } from "../types"
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
  imgOffsets: (IVec2 & { dir: "up" | "right" | "down" | "left" })[] = []
  constructor() {
    super()
    this.type = ComponentType.PlayerSprite
    const yOffset_Up = 64
    const yOffset_Right = 192
    const yOffset_Left = 257
    const yOffset_Down = 390

    ;["up", "right", "left", "down"].forEach((dir) => {
      const yOffset =
        dir === "up"
          ? yOffset_Up
          : dir === "right"
          ? yOffset_Right
          : dir === "left"
          ? yOffset_Left
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

    let dir: "down" | "up" | "right" | "left" = "down"

    const diff = lookAt.subtract(obj.pos)
    if (diff.x > 0) {
      dir = "right"
    } else if (diff.x < 0) {
      dir = "left"
    }

    if (Math.abs(diff.x) < Math.abs(diff.y)) {
      if (diff.y > 0) {
        dir = "down"
      } else if (diff.y < 0) {
        dir = "up"
      }
    }

    const imgOffsets = this.imgOffsets.filter((offset) => offset.dir === dir)
    this.imgIdx--
    if (this.imgIdx < 0) {
      this.imgIdx = imgOffsets.length - 1
    } else if (this.imgIdx >= imgOffsets.length) {
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
  deserialize(data: any): void {
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
