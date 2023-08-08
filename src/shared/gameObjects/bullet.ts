import { Collider } from "../components/collider"
import { GameObject, GameObjectType } from "../gameObject"
import { CollisionLayer } from "../layers"
import { ShapeType } from "../types"

export type BulletConfig = {
  size: number
  speed: number
  damage: number
  range: number
}

export class Bullet extends GameObject {
  config: BulletConfig = {
    size: 5,
    speed: 10,
    damage: 1,
    range: 1000,
  }
  constructor() {
    super(GameObjectType.Bullet)
    this.components.push(
      Collider.circleCollider(this.config.size).withCollisionEffect(
        () => (this.remove = true)
      )
    )
    this.collisionLayers.push(CollisionLayer.PlayerBullet)
    this.setRenderSettings({
      shapeType: ShapeType.Circle,
      radius: this.config.size,
      color: "red",
    })
    this.applyFriction = false
  }

  update(): void {
    super.update()
    if (this.vel.length() > 0) {
      this.config.range -= this.vel.length()
    }
    if (this.config.range <= 0) {
      this.remove = true
    }
  }
}
