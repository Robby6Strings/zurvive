import { Component, ComponentType } from "../component"
import { GameObject } from "../gameObject"
import { DamageConfig } from "../types"
import { calculateDamage } from "../utils"
import { Collider } from "./collider"
import { Health } from "./health"
import { Mover } from "./mover"

export class Fighter extends Component {
  damage: DamageConfig = {
    damage: 5,
    critChance: 0.1,
    critMultiplier: 2,
  }
  _prevTarget: GameObject | null = null
  target: GameObject | null = null
  followRange: number = 1000
  attackRange: number = 8
  attackTimer: number = 0
  attackCooldown: number = 1000

  get targetChanged(): boolean {
    return this.target !== this._prevTarget
  }

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
    this.attackTimer += 1000 / 60
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
    target.takeDamage(calculateDamage(this.damage))
  }

  deserialize(data: any): void {
    this.enabled = data.enabled
    this.damage = data.damage
  }
  serialize(): Object {
    return {
      type: this.type,
      enabled: this.enabled,
      damage: this.damage,
    }
  }
}
