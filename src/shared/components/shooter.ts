import { Component, ComponentType } from "../component"
import { GameObject } from "../gameObject"
//import { Bullet } from "../gameObjects/bullet"
import { IVec2, Vec2 } from "../vec2"

export class Shooter extends Component {
  lastShotTime: number = 0
  shootCooldown: number = 100
  bulletSpeed: number = 30

  constructor() {
    super(ComponentType.Shooter, true)
  }

  shoot(
    obj: GameObject,
    pos: IVec2,
    ...bullets: GameObject[]
  ): GameObject[] | void {
    if (performance.now() - this.lastShotTime < this.shootCooldown) {
      return
    }
    this.lastShotTime = performance.now()

    const numBullets = bullets.length
    if (numBullets === 0) {
      return
    }

    if (numBullets === 1) {
      const bullet = bullets[0]
      bullet.pos = obj.pos.clone()
      bullet.vel = Vec2.fromObject(pos)
        .subtract(obj.pos)
        .normalize()
        .multiply(this.bulletSpeed)
      return [bullet]
    }

    // fire the bullets in a cone
    const angle = Math.PI / 12
    const angleStep = (2 * angle) / (numBullets - 1)
    const startAngle = -angle
    for (let i = 0; i < numBullets; i++) {
      const bullet = bullets[i]

      bullet.pos = obj.pos.clone()
      bullet.vel = Vec2.fromObject(pos)
        .subtract(obj.pos)
        .normalize()
        .multiply(this.bulletSpeed)
        .rotate(startAngle + i * angleStep)
    }
    return bullets
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
