import { Collider } from "../components/collider"
import { Fighter } from "../components/fighter"
import { Health } from "../components/health"
import { Mover } from "../components/mover"
import { GameObject, GameObjectType } from "../gameObject"
import { ShapeType } from "../types"

const playerRadius = 25

export class Player extends GameObject<GameObjectType.Player> {
  constructor() {
    super(GameObjectType.Player)
    this.components.push(
      new Mover(),
      new Fighter(),
      Object.assign(new Health(), { invulnerable: true }),
      Collider.circleCollider(playerRadius)
    )
    Object.assign(this.renderSettings, {
      shapeType: ShapeType.Circle,
      radius: playerRadius,
      color: "#44E",
    })
  }
}
