import { Collider } from "../components/collider"
import { Fighter } from "../components/fighter"
import { Health } from "../components/health"
import { Mover } from "../components/mover"
import { GameObject, GameObjectType } from "../gameObject"
import { Vec2 } from "../vec2"

export class Player extends GameObject<GameObjectType.Player> {
  constructor() {
    super(GameObjectType.Player)
    this.pos = new Vec2(0, 0)
    this.components.push(
      new Mover(),
      new Fighter(),
      new Health(),
      Collider.circleCollider(25)
    )
    this.getComponent(Mover)!.setTargetPos(new Vec2(0, 0))
    this.getComponent(Health)!.invulnerable = true
    this.renderSettings.color = "#00F"
  }
}
