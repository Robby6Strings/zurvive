import { Collider } from "../../components/collider"
import { Health } from "../../components/health"
import { Shooter } from "../../components/shooter"
import { GameObject, GameObjectType } from "../../gameObject"
import { CollisionLayer } from "../../layers"
import { ShapeType } from "../../types"

const playerRadius = 25

export class Player extends GameObject {
  constructor() {
    super(GameObjectType.Player)
    this.components.push(
      new Shooter(),
      Object.assign(new Health(), { invulnerable: true }),
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
