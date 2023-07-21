import { Component, ComponentType } from "../component"
import { GameObject } from "../gameObject"
import { Health } from "./health"

export class Fighter extends Component {
  damage: number = 5
  critChance: number = 0.1
  critMultiplier: number = 2

  constructor() {
    super(ComponentType.Health, true)
  }

  update(_obj: GameObject<any>): void {}

  attack(target: Health): void {
    const isCrit = Math.random() < this.critChance
    target.takeDamage(isCrit ? this.damage * this.critMultiplier : this.damage)
  }
}
