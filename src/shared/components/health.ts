import { Component, ComponentType } from "../component"
import { GameObject } from "../gameObject"

export class Health extends Component {
  _maxHealth: number = 30
  _currentHealth: number = 30
  maxHealthChanged: boolean = false
  currentHealthChanged: boolean = false
  invulnerable: boolean = false
  private _onKilled: { (health: Health): boolean } | undefined

  set onKilled(value: { (health: Health): boolean }) {
    this._onKilled = value
  }

  get maxHealth(): number {
    return this._maxHealth
  }
  set maxHealth(value: number) {
    this.maxHealthChanged = value !== this._maxHealth
    this._maxHealth = value
  }

  get currentHealth(): number {
    return this._currentHealth
  }
  set currentHealth(value: number) {
    this.currentHealthChanged = value !== this._currentHealth
    this._currentHealth = value
  }

  get dead(): boolean {
    return this.currentHealth <= 0
  }

  constructor() {
    super(ComponentType.Health, true)
  }

  update(obj: GameObject): void {
    if (!this.enabled) return
    if (this.dead) {
      if (this._onKilled && this._onKilled(this)) obj.remove = true
    }
  }

  takeDamage(amount: number): void {
    console.log("taking damage", amount)
    if (this.invulnerable) return
    this.currentHealth -= amount
    this.currentHealthChanged = true

    if (this.currentHealth < 0) {
      this.currentHealth = 0
    }
  }

  heal(amount: number): void {
    let prevHealth = this.currentHealth
    this.currentHealth += amount
    if (this.currentHealth > this.maxHealth) {
      this.currentHealth = this.maxHealth
    }
    if (prevHealth !== this.currentHealth) this.currentHealthChanged = true
  }

  deserialize(data: any): void {
    this.enabled = data.enabled
    this.maxHealth = data.maxHealth
    this.currentHealth = data.currentHealth
    this.invulnerable = data.invulnerable
  }
  serialize(): Object {
    return {
      type: this.type,
      maxHealth: this.maxHealth,
      currentHealth: this.currentHealth,
    }
  }
}
