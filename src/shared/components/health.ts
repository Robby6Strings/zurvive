import { Component, ComponentType } from "../component"
import { GameObject } from "../gameObject"

export class Health extends Component {
  maxHealth: number = 30
  currentHealth: number = 30

  constructor() {
    super(ComponentType.Health, true)
  }

  update(_obj: GameObject<any>): void {}

  takeDamage(amount: number): void {
    this.currentHealth -= amount
  }

  heal(amount: number): void {
    this.currentHealth += amount
    if (this.currentHealth > this.maxHealth) {
      this.currentHealth = this.maxHealth
    }
  }

  isDead(): boolean {
    return this.currentHealth <= 0
  }
}
