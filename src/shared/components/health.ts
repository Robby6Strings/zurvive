import { Component, ComponentType } from "../component"
import { GameObject } from "../gameObject"

export class Health extends Component {
  _maxHealth: number = 30
  currentHealth: number = 30
  _lastHealth: number = 30
  maxHealthChanged: boolean = false
  renderTime: number = 0
  regenTick: number = 0
  regenInterval: number = 1000
  regenAmount: number = 0

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

  get currentHealthChanged(): boolean {
    return this._lastHealth !== this.currentHealth
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
      if (this._onKilled) {
        if (this._onKilled(this)) obj.remove = true
      } else {
        obj.remove = true
      }
    }

    this._lastHealth = this.currentHealth
    this.regenTick += 1000 / 60
    if (this.regenTick >= this.regenInterval) {
      this.regenTick = 0
      this.heal(this.regenAmount)
    }
  }

  takeDamage(amount: number): void {
    if (this.invulnerable) return
    this.currentHealth -= amount

    if (this.currentHealth < 0) {
      this.currentHealth = 0
    }
  }

  setHealth(amount: number): void {
    this.currentHealth = amount
    if (this.currentHealth > this.maxHealth) {
      this.currentHealth = this.maxHealth
    }
  }

  heal(amount: number): void {
    this.currentHealth += amount
    if (this.currentHealth > this.maxHealth) {
      this.currentHealth = this.maxHealth
    }
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
