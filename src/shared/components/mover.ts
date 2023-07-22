import { Component, ComponentType } from "../component"
import { GameObject } from "../gameObject"
import { IVec2, Vec2 } from "../vec2"

export class Mover extends Component {
  speed: number = 5
  _targetPos: Vec2 | null = null
  targetPosChanged: boolean = false

  get targetPos(): Vec2 | null {
    return this._targetPos
  }
  set targetPos(value: Vec2 | null) {
    this.targetPosChanged = value !== this._targetPos
    this._targetPos = value
  }

  constructor() {
    super(ComponentType.Mover, true)
  }

  update(obj: GameObject<any>): void {
    if (!this.enabled) return
    if (!this.targetPos) return
    if (obj.pos.equals(this.targetPos)) return

    const dir = this.targetPos.sub(obj.pos).normalize()
    const dist = obj.pos.distance(this.targetPos)

    obj.pos = obj.pos.add(dir.scale(Math.min(this.speed, dist)))
  }

  setTargetPos(target: IVec2 | null) {
    this.targetPos = target ? Vec2.fromObject(target) : null
  }

  deserialize(data: any): void {
    this.enabled = data.enabled
    this.speed = data.speed
    this.targetPos = data.targetPos ? Vec2.fromObject(data.targetPos) : null
  }
  serialize(): Object {
    return {
      type: this.type,
      enabled: this.enabled,
      speed: this.speed,
      targetPos: this.targetPos ? Vec2.serialize(this.targetPos) : null,
    }
  }
}
