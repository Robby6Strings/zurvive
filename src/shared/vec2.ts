export interface IVec2 {
  x: number
  y: number
}

export class Vec2 implements IVec2 {
  constructor(public x: number = 0, public y: number = 0) {}
  static serialize(v: Vec2) {
    return { x: v.x, y: v.y }
  }
  static deserialize(data: IVec2): Vec2 {
    const { x, y } = data
    return new Vec2(x, y)
  }
  static fromObject(obj: IVec2): Vec2 {
    return new Vec2(obj.x, obj.y)
  }

  add(other: IVec2): Vec2 {
    return new Vec2(this.x + other.x, this.y + other.y)
  }
  sub(other: IVec2): Vec2 {
    return new Vec2(this.x - other.x, this.y - other.y)
  }
  mul(other: IVec2): Vec2 {
    return new Vec2(this.x * other.x, this.y * other.y)
  }
  div(other: IVec2): Vec2 {
    return new Vec2(this.x / other.x, this.y / other.y)
  }
  scale(scalar: number): Vec2 {
    return new Vec2(this.x * scalar, this.y * scalar)
  }
  distance(other: IVec2): number {
    return Vec2.distance(this, other)
  }
  magnitude(): number {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
  }
  length(): number {
    return this.magnitude()
  }

  normalize(): Vec2 {
    const mag = this.magnitude()
    return new Vec2(this.x / mag, this.y / mag)
  }
  dot(other: IVec2): number {
    return this.x * other.x + this.y * other.y
  }
  cross(other: IVec2): number {
    return this.x * other.y - this.y * other.x
  }
  angle(other: IVec2): number {
    return Math.atan2(this.cross(other), this.dot(other))
  }
  rotate(angle: number): Vec2 {
    return new Vec2(
      this.x * Math.cos(angle) - this.y * Math.sin(angle),
      this.x * Math.sin(angle) + this.y * Math.cos(angle)
    )
  }
  equals(other: IVec2): boolean {
    return this.x === other.x && this.y === other.y
  }
  clone(): Vec2 {
    return new Vec2(this.x, this.y)
  }

  static fromAngle(angle: number): Vec2 {
    return new Vec2(Math.cos(angle), Math.sin(angle))
  }
  static zero(): Vec2 {
    return new Vec2(0, 0)
  }
  static one(): Vec2 {
    return new Vec2(1, 1)
  }
  static up(): Vec2 {
    return new Vec2(0, 1)
  }
  static down(): Vec2 {
    return new Vec2(0, -1)
  }
  static left(): Vec2 {
    return new Vec2(-1, 0)
  }
  static right(): Vec2 {
    return new Vec2(1, 0)
  }
  static distance(a: IVec2, b: IVec2): number {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
  }
}
