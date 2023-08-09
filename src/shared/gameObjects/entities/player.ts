import { Collider } from "../../components/collider"
import { Health } from "../../components/health"
import { Shooter } from "../../components/shooter"
import { GameObject, GameObjectType } from "../../gameObject"
import { IGunConfig } from "../../gunConfig"
import { CollisionLayer } from "../../layers"
import { ShapeType } from "../../types"

const playerRadius = 16

export class Player extends GameObject implements IGunConfig {
  numBullets: number = 3
  bulletWeight: number = 3
  bulletCooldown: number = 666

  constructor() {
    super(GameObjectType.Player)
    this.components.push(
      Object.assign(new Health()),
      Object.assign(new Shooter(), { shootCooldown: this.bulletCooldown }),
      Collider.circleCollider(playerRadius)
    )
    this.collisionLayers.push(CollisionLayer.Player)
    this.setRenderSettings({
      shapeType: ShapeType.Circle,
      radius: playerRadius,
      color: "#44E",
    })
  }
}
