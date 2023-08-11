import { Collider } from "../../components/collider"
import { Experience } from "../../components/experience"
import { Health } from "../../components/health"
import { Inventory } from "../../components/inventory"
import { Shooter } from "../../components/shooter"
import { ObjectColors } from "../../constants"
import { GameObject, GameObjectType } from "../../gameObject"
import { IGunConfig } from "../../gunConfig"
import { CollisionLayer } from "../../layers"
import { DamageConfig, ShapeType } from "../../types"
import { calculateDamage } from "../../utils"
import { IVec2 } from "../../vec2"
import { Bullet } from "../bullet"

const playerRadius = 16

export class Player extends GameObject implements IGunConfig {
  numBullets: number = 1
  bulletWeight: number = 3
  bulletCooldown: number = 500
  bulletSpeed: number = 10
  bulletRange: number = 300
  damage: DamageConfig = {
    damage: 10,
    critChance: 0.1,
    critMultiplier: 2,
  }

  constructor() {
    super(GameObjectType.Player)
    this.components.push(
      Object.assign(new Health()),
      Object.assign(new Shooter(), { shootCooldown: this.bulletCooldown }),
      Collider.circleCollider(playerRadius),
      new Experience(),
      new Inventory()
    )
    this.collisionLayers.push(CollisionLayer.Player)
    this.setRenderSettings({
      shapeType: ShapeType.Circle,
      radius: playerRadius,
      color: ObjectColors[GameObjectType.Player],
    })
  }

  handleAttack(pos: IVec2): void | GameObject[] {
    const shooter = this.getComponent(Shooter)!
    const bullets = shooter.shoot(
      this,
      this.bulletSpeed,
      this.bulletCooldown,
      pos,
      ...Array.from({ length: this.numBullets }).map(() =>
        Object.assign(new Bullet(), {
          config: {
            size: 3,
            speed: this.bulletSpeed,
            damage: calculateDamage(this.damage),
            range: this.bulletRange,
            weight: this.bulletWeight,
          },
        })
      )
    )
    return bullets
  }
}
