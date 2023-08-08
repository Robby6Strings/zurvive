import { Component, ComponentType } from "../component"
import { GameObject } from "../gameObject"
//import { Bullet } from "../gameObjects/bullet"
import { IVec2, Vec2 } from "../vec2"

export class Shooter extends Component {
  lastShotTime: number = 0
  shootCooldown: number = 200
  bulletSpeed: number = 15

  constructor() {
    super(ComponentType.Shooter, true)
  }

  shoot(obj: GameObject, pos: IVec2, bullet: GameObject): GameObject | void {
    if (performance.now() - this.lastShotTime < this.shootCooldown) {
      return
    }
    this.lastShotTime = performance.now()

    bullet.pos = obj.pos.clone()
    bullet.vel = Vec2.fromObject(pos)
      .subtract(obj.pos)
      .normalize()
      .multiply(this.bulletSpeed)
    return bullet
  }

  update(_obj: GameObject): void {
    //throw new Error("Method not implemented.")
  }
  deserialize(data: any): void {
    this.enabled = data.enabled
    this.lastShotTime = data.lastShotTime
    this.shootCooldown = data.shootCooldown
    this.bulletSpeed = data.bulletSpeed
    // this.bulletDamage = data.bulletDamage
    // this.bulletRange = data.bulletRange
    // this.bulletSize = data.bulletSize
  }
  serialize(): Object {
    return {
      type: this.type,
      enabled: this.enabled,
      lastShotTime: this.lastShotTime,
      shootCooldown: this.shootCooldown,
      bulletSpeed: this.bulletSpeed,
      // bulletDamage: this.bulletDamage,
      // bulletRange: this.bulletRange,
      // bulletSize: this.bulletSize,
    }
  }
}
