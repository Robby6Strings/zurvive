import { Collider } from "../components/collider"
import { Fighter } from "../components/fighter"
import { Health } from "../components/health"
import { Mover } from "../components/mover"
import { GameObject, GameObjectType } from "../gameObject"
import { ShapeType } from "../types"

const enemyRadius = 25

export class Enemy extends GameObject<GameObjectType.Enemy> {
  constructor() {
    super(GameObjectType.Enemy)
    this.components.push(
      new Mover(),
      new Fighter(),
      new Health(),
      Collider.circleCollider(enemyRadius)
    )
    Object.assign(this.renderSettings, {
      shapeType: ShapeType.Circle,
      radius: enemyRadius,
      color: "#E44",
    })
  }
}
