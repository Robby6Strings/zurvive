import { BonusSet } from "../../bonus"
import { AttributeType, Attributes } from "../../components/attributes"
import { Collider, CollisionLayer } from "../../components/collider"
import { Experience } from "../../components/experience"
import { Health } from "../../components/health"
import { Inventory } from "../../components/inventory"
import { PlayerSprite } from "../../components/playerSprite"
import { Shooter } from "../../components/shooter"
import { GameObject, GameObjectType } from "../../gameObject"
import { calculateDamage } from "../../utils"
import { IVec2 } from "../../vec2"
import { Bullet } from "../bullet"

export class Player extends GameObject {
  bonusSets: Map<string, BonusSet> = new Map()
  get unchosenBonuses() {
    return Array.from(this.bonusSets.values()).filter((set) => !set.chosen)
  }

  constructor() {
    super(GameObjectType.Player)
    this.components.push(
      new Health(),
      new Shooter(),
      //Collider.rectangleCollider(24, 36),
      Collider.circleCollider(12),
      new Experience(),
      new Inventory(),
      new Attributes(),
      new PlayerSprite()
    )
    this.collisionLayers.push(CollisionLayer.Player)
  }

  handleAttack(pos: IVec2): void | GameObject[] {
    const shooter = this.getComponent(Shooter)!
    const weapon = this.getComponent(Inventory)!.getWeapon()
    if (!weapon) {
      console.log("no weapon equipped")
      return
    }
    const attributes = this.getComponent(Attributes)!
    const config = {
      size:
        weapon.itemData.bulletSize +
        attributes.getBonus(AttributeType.BulletSize),
      speed:
        weapon.itemData.bulletSpeed +
        attributes.getBonus(AttributeType.BulletSpeed),
      damage: calculateDamage({
        damage:
          weapon.itemData.damage + attributes.getBonus(AttributeType.Damage),
        critChance:
          weapon.itemData.critChance +
          attributes.getBonus(AttributeType.CritChance),
        critMultiplier:
          weapon.itemData.critMultiplier +
          attributes.getBonus(AttributeType.CritMultiplier),
      }),
      range:
        weapon.itemData.bulletRange +
        attributes.getBonus(AttributeType.BulletRange),
      weight:
        weapon.itemData.bulletWeight +
        attributes.getBonus(AttributeType.BulletWeight),
    }
    const bullets = shooter.shoot(
      this,
      weapon.itemData.bulletSpeed +
        attributes.getBonus(AttributeType.BulletSpeed),
      weapon.itemData.bulletCooldown +
        attributes.getBonus(AttributeType.BulletCooldown),
      pos,
      ...Array.from({
        length:
          weapon.itemData.numBullets +
          attributes.getBonus(AttributeType.NumBullets),
      }).map(() => new Bullet().withConfig(config))
    )
    return bullets
  }

  public serialize(): Object {
    return {
      ...super.serialize(),
      bonusSets: Array.from(this.bonusSets.values()).map((set) => ({
        ...set,
        items: Array.from(set.items.values()),
      })),
    }
  }

  public deserialize(data: any): Player {
    super.deserialize(data)
    this.bonusSets = new Map(data.bonusSets.map((set: any) => [set.id, set]))
    return this
  }
}
