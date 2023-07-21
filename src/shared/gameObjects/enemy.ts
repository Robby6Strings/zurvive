import { Collider } from "../components/collider"
import { Fighter } from "../components/fighter"
import { Mover } from "../components/mover"
import { GameObject, GameObjectType } from "../gameObject"

export class Enemy extends GameObject<GameObjectType.Enemy> {
  constructor() {
    super(GameObjectType.Enemy)
    this.components.push(
      new Mover(),
      new Fighter(),
      Collider.circleCollider(25)
    )
  }
}
