export interface IVec2 {
  x: number
  y: number
}

export class Vec2 implements IVec2 {
  constructor(public x: number = 0, public y: number = 0) {}

  add(other: IVec2): Vec2 {
    return new Vec2(this.x + other.x, this.y + other.y)
  }
  subtract(other: IVec2): Vec2 {
    return new Vec2(this.x - other.x, this.y - other.y)
  }
  multiply(v2OrNumber: IVec2 | number): Vec2 {
    if (typeof v2OrNumber === "number") {
      return new Vec2(this.x * v2OrNumber, this.y * v2OrNumber)
    }
    return new Vec2(this.x * v2OrNumber.x, this.y * v2OrNumber.y)
  }
  divide(other: IVec2): Vec2 {
    return new Vec2(this.x / other.x, this.y / other.y)
  }
  distance(other: IVec2): number {
    return Vec2.distance(this, other)
  }
  magnitude(): number {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
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
  equals(other: IVec2 | null): boolean {
    if (!other) return false
    return this.x === other.x && this.y === other.y
  }
  notEquals(other: IVec2 | null): boolean {
    if (!other) return true
    return this.x !== other.x || this.y !== other.y
  }
  clone(): Vec2 {
    return new Vec2(this.x, this.y)
  }

  round(): Vec2 {
    return new Vec2(Math.round(this.x), Math.round(this.y))
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

  static serialize(v: Vec2) {
    return { x: Math.round(v.x), y: Math.round(v.y) }
  }
  static deserialize(data: IVec2): Vec2 {
    const { x, y } = data
    return new Vec2(x, y)
  }
  static fromObject(obj: IVec2): Vec2 {
    return new Vec2(obj.x, obj.y)
  }
}
