import { Component, ComponentType } from "../component"
import { GameObject } from "../gameObject"
import { Collider } from "./collider"
import { Health } from "./health"
import { Mover } from "./mover"

export class Fighter extends Component {
  damage: number = 5
  critChance: number = 0.1
  critMultiplier: number = 2
  target: GameObject | null = null
  followRange: number = 500
  attackRange: number = 10
  attackTimer: number = 0
  attackCooldown: number = 1000

  constructor() {
    super(ComponentType.Fighter, true)
  }

  getTargetWithinFollowRange(
    obj: GameObject,
    objects: GameObject[]
  ): GameObject | null {
    return (
      objects.find((o) => GameObject.getDistance(obj, o) < this.followRange) ??
      null
    )
  }

  update(obj: GameObject): void {
    if (!this.enabled) return
    if (this.target?.remove) this.target = null
    if (!this.target) return

    const dist = GameObject.getDistance(obj, this.target)
    if (dist > this.followRange) {
      this.target = null
      return
    }

    if (dist <= this.attackRange) {
      obj.getComponent(Mover)!.setTargetPos(null)
      if (this.attackTimer >= this.attackCooldown) {
        this.attack(this.target.getComponent(Health)!)
        this.attackTimer = 0
      } else {
        this.attackTimer += 1000 / 60
      }
      return
    }

    // get direction to target
    const dir = this.target.pos.subtract(obj.pos).normalize()
    // get position to move to
    const targetPos = this.target.pos.subtract(
      dir.multiply(
        this.attackRange + Collider.getSize(obj) + Collider.getSize(this.target)
      )
    )
    obj.getComponent(Mover)!.setTargetPos(targetPos)
  }

  setTarget(target: GameObject) {
    this.target = target
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
  serialize(): Object {
    return {
      type: this.type,
      enabled: this.enabled,
      damage: this.damage,
      critChance: this.critChance,
      critMultiplier: this.critMultiplier,
    }
  }
}
