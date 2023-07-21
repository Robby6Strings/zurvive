import { Collider } from "../components/collider"
import { Fighter } from "../components/fighter"
import { Mover } from "../components/mover"
import { GameObject, GameObjectType } from "../gameObject"

export class Player extends GameObject<GameObjectType.Player> {
  constructor() {
    super(GameObjectType.Player)
    this.components.push(
      new Mover(),
      new Fighter(),
      Collider.circleCollider(25)
    )
  }
}
