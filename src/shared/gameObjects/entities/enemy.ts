import { Collider, CollisionLayer } from "../../components/collider"
import { Fighter } from "../../components/fighter"
import { Health } from "../../components/health"
import { Mover } from "../../components/mover"
import { Sprite } from "../../components/sprite"
import { ObjectColors } from "../../constants"
import { GameObject, GameObjectType } from "../../gameObject"
import { ShapeType } from "../../types"

const enemyRadius = 16

export class Enemy extends GameObject {
  constructor() {
    super(GameObjectType.Enemy)
    this.components.push(
      Object.assign(new Mover(), { speed: 1.5 }),
      new Fighter(),
      new Health(),
      Collider.circleCollider(enemyRadius),
      new Sprite()
    )
    this.collisionLayers.push(CollisionLayer.Enemy)
    this.setRenderSettings({
      shapeType: ShapeType.Circle,
      radius: enemyRadius,
      color: ObjectColors[GameObjectType.Enemy],
    })
  }
}
