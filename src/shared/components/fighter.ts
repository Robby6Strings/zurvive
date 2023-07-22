import { Component, ComponentType } from "../component"
import { GameObject } from "../gameObject"
import { Health } from "./health"
import { Mover } from "./mover"

export class Fighter extends Component {
  damage: number = 5
  critChance: number = 0.1
  critMultiplier: number = 2
  target: GameObject<any> | null = null
  followRange: number = 200
  attackRange: number = 80
  attackTimer: number = 0
  attackCooldown: number = 1000

  constructor() {
    super(ComponentType.Fighter, true)
  }

  getTargetWithinFollowRange(
    _obj: GameObject<any>,
    objects: GameObject<any>[]
  ): GameObject<any> | null {
    return (
      objects.find((o) => o.pos.distance(_obj.pos) < this.followRange) ?? null
    )
  }

  update(obj: GameObject<any>): void {
    if (!this.enabled) return
    if (this.target?.remove) {
      this.target = null
    }
    if (!this.target) return

    if (!this.inFollowRange(obj)) {
      this.target = null
      return
    }

    const mover = obj.getComponent(Mover)!

    if (this.inAttackRange(obj)) {
      //mover.setTargetPos(null)
      if (this.attackTimer >= this.attackCooldown) {
        this.attack(this.target.getComponent(Health)!)
        this.attackTimer = 0
      } else {
        this.attackTimer += 1000 / 60
      }
      return
    }
    mover.setTargetPos(this.target.pos)
  }

  setTarget(target: GameObject<any>) {
    this.target = target
  }

  inFollowRange(obj: GameObject<any>): boolean {
    if (!this.target) return false
    return obj.pos.distance(this.target.pos) < this.followRange
  }

  inAttackRange(obj: GameObject<any>): boolean {
    if (!this.target) return false
    return obj.pos.distance(this.target.pos) < this.attackRange
  }

  attack(target: Health): void {
    const isCrit = Math.random() < this.critChance
    target.takeDamage(isCrit ? this.damage * this.critMultiplier : this.damage)
  }

  deserialize(data: any): void {
    this.enabled = data.enabled
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
