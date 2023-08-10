import { images } from "../../state"
import { Component, ComponentType } from "../component"
import { GameObject } from "../gameObject"
import { IRenderable, RenderSettings } from "../renderable"
import { ShapeType } from "../types"
import { IVec2, Vec2 } from "../vec2"

export class Sprite extends Component implements IRenderable {
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
    height: 32,
    width: 32,
    imgRef: "zombie",
    offset: { x: 0, y: 0 },
  }
  imgOffsets: (IVec2 & { dir: "up" | "right" | "down" | "left" })[] = [
    { x: 0, y: 0, dir: "down" },
    { x: 32, y: 0, dir: "down" },
    { x: 64, y: 0, dir: "down" },
    { x: 0, y: 32, dir: "left" },
    { x: 32, y: 32, dir: "left" },
    { x: 64, y: 32, dir: "left" },
    { x: 0, y: 64, dir: "right" },
    { x: 32, y: 64, dir: "right" },
    { x: 64, y: 64, dir: "right" },
    { x: 0, y: 96, dir: "up" },
    { x: 32, y: 96, dir: "up" },
    { x: 64, y: 96, dir: "up" },
  ]
  constructor() {
    super(ComponentType.Sprite, true)
    // set imgSetIdx to randum num from 0 to 7
    this.imgSetIdx = Math.floor(Math.random() * 8)
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

    this.imgIdx++
    if (this.imgIdx > 2) {
      this.imgIdx = 0
    }

    this.imgUpdateCooldown = 1000 / 60

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

    const imgOffset = this.imgOffsets.filter((offset) => offset.dir === dir)[
      this.imgIdx
    ]
    if (!imgOffset) throw new Error("imgOffset not found")
    this.renderSettings.offset = {
      x: this.imgSetOffset.x + imgOffset.x,
      y: this.imgSetOffset.y + imgOffset.y,
    }
  }
  deserialize(data: any): void {
    this.imgSetIdx = data.imgSetIdx
    if (this.imgSetIdx > 3) {
      this.imgSetOffset.y = 32 * 4
    }
    this.imgSetOffset.x = 32 * 3 * (this.imgSetIdx % 4)
    this.setImage()
  }
  serialize(): Object {
    return {
      type: this.type,
      imgSetIdx: this.imgSetIdx,
    }
  }
}
