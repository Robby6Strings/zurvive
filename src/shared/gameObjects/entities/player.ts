import { Collider } from "../../components/collider"
import { Experience } from "../../components/experience"
import { Health } from "../../components/health"
import { Inventory } from "../../components/inventory"
import { Shooter } from "../../components/shooter"
import { ObjectColors } from "../../constants"
import { GameObject, GameObjectType } from "../../gameObject"
import { CollisionLayer } from "../../layers"
import { ShapeType } from "../../types"
import { calculateDamage } from "../../utils"
import { IVec2 } from "../../vec2"
import { Bullet } from "../bullet"

const playerRadius = 16

export class Player extends GameObject {
  constructor() {
    super(GameObjectType.Player)
    this.components.push(
      new Health(),
      new Shooter(),
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
    const weapon = this.getComponent(Inventory)!.getWeapon()
    if (!weapon) {
      console.log("no weapon equipped")
      return
    }
    const config = {
      size: weapon.itemData.bulletSize,
      speed: weapon.itemData.bulletSpeed,
      damage: calculateDamage({
        damage: weapon.itemData.damage,
        critChance: weapon.itemData.critChance,
        critMultiplier: weapon.itemData.critMultiplier,
      }),
      range: weapon.itemData.bulletRange,
      weight: weapon.itemData.bulletWeight,
    }
    const bullets = shooter.shoot(
      this,
      weapon.itemData.bulletSpeed,
      weapon.itemData.bulletCooldown,
      pos,
      ...Array.from({ length: weapon.itemData.numBullets }).map(() =>
        new Bullet().withConfig(config)
      )
    )
    return bullets
  }
}
