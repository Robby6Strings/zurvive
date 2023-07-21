import { Collider } from "../components/collider"
import { Fighter } from "../components/fighter"
import { Mover } from "../components/mover"
import { GameObject, GameObjectType } from "../gameObject"
import { Vec2 } from "../vec2"

export class Player extends GameObject<GameObjectType.Player> {
  constructor() {
    super(GameObjectType.Player)
    this.center = new Vec2(50, 50)
    this.components.push(
      new Mover(),
      new Fighter(),
      Collider.circleCollider(25)
    )

    this.getComponent(Mover)!.setTarget(new Vec2(50, 50))
  }
}
