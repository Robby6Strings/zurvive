import { Vec2 } from "../../shared/vec2"

export class Camera {
  pos: Vec2 = new Vec2(0, 0)
  screenOffset: Vec2 = new Vec2(window.innerWidth / 2, window.innerHeight / 2)
  constructor() {
    window.addEventListener("resize", () => {
      this.screenOffset = new Vec2(
        window.innerWidth / 2,
        window.innerHeight / 2
      )
    })
  }

  get offset() {
    return this.pos.add(this.screenOffset)
  }
}
