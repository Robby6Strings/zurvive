import { Collider } from "../components/collider"
import { Fighter } from "../components/fighter"
import { Health } from "../components/health"
import { Mover } from "../components/mover"
import { GameObject, GameObjectType } from "../gameObject"

export class Enemy extends GameObject<GameObjectType.Enemy> {
  constructor() {
    super(GameObjectType.Enemy)
    this.components.push(
      new Mover(),
      new Fighter(),
      new Health(),
      Collider.circleCollider(25)
    )
    this.renderSettings.color = "#F00"
  }
}
