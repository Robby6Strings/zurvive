import { Component, ComponentType } from "../component"
import { GameObject } from "../gameObject"
import { IVec2, Vec2 } from "../vec2"

export class Mover extends Component {
  speed: number = 5
  targetPos: Vec2 = new Vec2(0, 0)
  targetObj: GameObject<any> | null = null

  constructor() {
    super(ComponentType.Mover, true)
  }

  update(obj: GameObject<any>): void {
    if (!this.enabled) return

    if (obj.center.equals(this.targetPos)) return
    const dir = this.targetPos.sub(obj.center).normalize()
    obj.center = obj.center.add(dir.scale(this.speed))
  }
  setTarget(target: IVec2 | GameObject<any>) {
    if (target instanceof GameObject) {
      this.targetObj = target
      this.targetPos = target.center.clone()
      return
    }
    this.targetObj = null
    this.targetPos = Vec2.fromObject(target)
  }
}
