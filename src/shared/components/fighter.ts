import { Component, ComponentType } from "../component"
import { GameObject } from "../gameObject"
import { Health } from "./health"

export class Fighter extends Component {
  damage: number = 5
  critChance: number = 0.1
  critMultiplier: number = 2

  constructor() {
    super(ComponentType.Fighter, true)
  }

  update(_obj: GameObject<any>): void {}

  attack(target: Health): void {
    const isCrit = Math.random() < this.critChance
    target.takeDamage(isCrit ? this.damage * this.critMultiplier : this.damage)
  }

  deserialize(data: any): void {
    this.damage = data.damage
    this.critChance = data.critChance
    this.critMultiplier = data.critMultiplier
  }
  serialize(): string {
    return JSON.stringify({
      type: this.type,
      enabled: this.enabled,
      damage: this.damage,
      critChance: this.critChance,
      critMultiplier: this.critMultiplier,
    })
  }
}
