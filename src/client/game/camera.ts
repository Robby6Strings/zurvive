import { Player } from "../../shared/gameObjects/entities"
import { Vec2 } from "../../shared/vec2"

export class Camera {
  pos: Vec2 = new Vec2(0, 0)
  screenOffset: Vec2 = new Vec2(window.innerWidth / 2, window.innerHeight / 2)
  fixed: boolean = true
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

  followPlayer(player: Player) {
    this.pos = player.pos.multiply(-1)
  }

  update(player: Player) {
    this.followPlayer(player)
  }
}
