import { Component, ComponentType } from "../component"
import { GameObject } from "../gameObject"

export enum AttributeType {
  BulletSize,
  BulletSpeed,
  BulletCooldown,
  BulletRange,
  BulletWeight,
  Damage,
  CritChance,
  CritMultiplier,
  NumBullets,
  LifeOnHit,
  MoveSpeed,
}

export class Attributes extends Component {
  bonuses: Map<AttributeType, number> = new Map()
  constructor() {
    super(ComponentType.Attributes)
  }
  getBonus(type: AttributeType): number {
    return this.bonuses.get(type) ?? 0
  }
  update(_obj: GameObject): void {
    return
  }
  deserialize(data: any): void {
    this.bonuses = new Map(data.bonuses)
  }
  serialize(): Object {
    return {
      type: this.type,
      bonuses: Array.from(this.bonuses.entries()),
    }
  }
}
