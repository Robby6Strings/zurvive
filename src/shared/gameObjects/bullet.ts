import { Collider } from "../components/collider"
import { Health } from "../components/health"
import { GameObject, GameObjectType } from "../gameObject"
import { CollisionLayer } from "../layers"
import { ShapeType } from "../types"

export type BulletConfig = {
  size: number
  speed: number
  damage: number
  range: number
  weight: number
}

export class Bullet extends GameObject {
  config: BulletConfig = {
    size: 3,
    speed: 10,
    damage: 5,
    range: 1000,
    weight: 1,
  }
  constructor() {
    super(GameObjectType.Bullet)
    this.components.push(
      Collider.circleCollider(this.config.size).withCollisionEffect((obj) => {
        if (obj.type === GameObjectType.Bullet) return
        if (this.remove) return
        obj.getComponent(Health)?.takeDamage(this.config.damage)
        this.remove = true
      })
    )
    this.collisionLayers.push(CollisionLayer.PlayerBullet)
    this.setRenderSettings({
      shapeType: ShapeType.Circle,
      radius: this.config.size,
      color: "#aaaa",
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
