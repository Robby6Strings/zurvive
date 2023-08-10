import { Collider } from "../../components/collider"
import { Experience } from "../../components/experience"
import { Health } from "../../components/health"
import { Shooter } from "../../components/shooter"
import { GameObject, GameObjectType } from "../../gameObject"
import { IGunConfig } from "../../gunConfig"
import { CollisionLayer } from "../../layers"
import { DamageConfig, ShapeType } from "../../types"

const playerRadius = 16

export class Player extends GameObject implements IGunConfig {
  numBullets: number = 5
  bulletWeight: number = 6
  bulletCooldown: number = 200
  damage: DamageConfig = {
    damage: 7,
    critChance: 0.1,
    critMultiplier: 2,
  }

  constructor() {
    super(GameObjectType.Player)
    this.components.push(
      Object.assign(new Health()),
      Object.assign(new Shooter(), { shootCooldown: this.bulletCooldown }),
      Collider.circleCollider(playerRadius),
      new Experience()
    )
    this.collisionLayers.push(CollisionLayer.Player)
    this.setRenderSettings({
      shapeType: ShapeType.Circle,
      radius: playerRadius,
      color: "#44E",
    })
  }
}
