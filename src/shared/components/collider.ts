import { Component, ComponentType } from "../component"
import { GameObject } from "../gameObject"
import { ShapeType } from "../types"
import { IVec2, Vec2 } from "../vec2"

type CollisionCheckResult = {
  objA: GameObject<any>
  objB: GameObject<any>
  aStatic: boolean
  bStatic: boolean
  dir: Vec2
  overlap: number
}

export class Collider extends Component {
  radius: number = 0
  width: number = 0
  height: number = 0
  shape: ShapeType = ShapeType.Circle
  static: boolean = false

  constructor() {
    super(ComponentType.Collider, true)
  }

  getPoints(): Vec2[] {
    if (this.shape === ShapeType.Circle) {
      return []
    }
    return [
      new Vec2(this.width / 2, this.height / 2),
      new Vec2(-this.width / 2, this.height / 2),
      new Vec2(-this.width / 2, -this.height / 2),
      new Vec2(this.width / 2, -this.height / 2),
    ]
  }

  update(_obj: GameObject<any>): void {}

  static rectangleCollider(
    width: number,
    height: number,
    isStatic: boolean = false
  ) {
    return Object.assign(new Collider(), {
      width,
      height,
      shape: ShapeType.Rectangle,
      static: isStatic,
    })
  }

  static circleCollider(radius: number, isStatic: boolean = false): Collider {
    return Object.assign(new Collider(), {
      radius,
      shape: ShapeType.Circle,
      static: isStatic,
    })
  }

  static checkCollisions(obj: GameObject<any>, objs: GameObject<any>[]) {
    const collisions: CollisionCheckResult[] = []
    for (const obj2 of objs) {
      const collision = Collider.checkCollision(obj, obj2)
      if (collision) collisions.push(collision)
    }
    return collisions
  }

  static checkCollision(
    obj1: GameObject<any>,
    obj2: GameObject<any>
  ): CollisionCheckResult | void {
    const collider1 = obj1.getComponent(Collider)
    const collider2 = obj2.getComponent(Collider)
    if (!collider1 || !collider2) return
    if (collider1.enabled || collider2.enabled) return
    if (collider1.static && collider2.static) return

    if (
      collider1.shape === ShapeType.Circle &&
      collider2.shape === ShapeType.Circle
    ) {
      return Collider.circleCircleCollision(obj1, obj2)
    }
    if (
      collider1.shape === ShapeType.Circle &&
      collider2.shape === ShapeType.Rectangle
    ) {
      return Collider.circleRectangleCollision(obj1, obj2)
    }
    if (
      collider1.shape === ShapeType.Rectangle &&
      collider2.shape === ShapeType.Circle
    ) {
      return Collider.circleRectangleCollision(obj2, obj1)
    }
    if (
      collider1.shape === ShapeType.Rectangle &&
      collider2.shape === ShapeType.Rectangle
    ) {
      return Collider.rectangleRectangleCollision(obj1, obj2)
    }
  }

  static circleCircleCollision(
    obj1: GameObject<any>,
    obj2: GameObject<any>
  ): CollisionCheckResult | void {
    const collider1 = obj1.getComponent(Collider)
    const collider2 = obj2.getComponent(Collider)
    if (!collider1 || !collider2) return

    const dist = obj1.pos.distance(obj2.pos)
    const collided = dist < collider1.radius + collider2.radius
    if (!collided) return

    const overlap = collider1.radius + collider2.radius - dist
    const dir = obj1.pos.sub(obj2.pos).normalize()

    return {
      dir,
      overlap,
      objA: obj1,
      objB: obj2,
      aStatic: collider1.static,
      bStatic: collider2.static,
    }
  }

  static circleRectangleCollision(
    circleObj: GameObject<any>,
    rectObj: GameObject<any>
  ): CollisionCheckResult | void {
    const circleCollider = circleObj.getComponent(Collider)
    const rectCollider = rectObj.getComponent(Collider)
    if (!circleCollider || !rectCollider) return

    const rectRotation = rectObj.rotation
    const rectCenter = rectObj.pos

    const circleCenter = circleObj.pos
    const circleRadius = circleCollider.radius

    const rectPoints = rectCollider.getPoints()

    const rectPointsRotated = rectPoints.map((p) =>
      p.rotate(rectRotation).add(rectCenter)
    )

    const closestPoint = rectPointsRotated.reduce(
      (acc, p) => {
        const dist = p.distance(circleCenter)
        if (dist < acc.dist) return { dist, point: p }
        return acc
      },
      { dist: Infinity, point: new Vec2(0, 0) }
    )

    const dist = closestPoint.point.distance(circleCenter)
    const collided = dist < circleRadius
    if (!collided) return

    const overlap = circleRadius - dist
    const dir = circleCenter.sub(closestPoint.point).normalize()

    return {
      dir,
      overlap,
      objA: circleObj,
      objB: rectObj,
      aStatic: circleCollider.static,
      bStatic: rectCollider.static,
    }
  }

  static rectangleRectangleCollision(
    obj1: GameObject<any>,
    obj2: GameObject<any>
  ): CollisionCheckResult | void {
    const collider1 = obj1.getComponent(Collider)
    const collider2 = obj2.getComponent(Collider)
    if (!collider1 || !collider2) return

    const rect1Rotation = obj1.rotation
    const rect1Center = obj1.pos

    const rect2Rotation = obj2.rotation
    const rect2Center = obj2.pos

    const rect1Points = collider1.getPoints()
    const rect2Points = collider2.getPoints()

    const rect1PointsRotated = rect1Points.map((p) =>
      p.rotate(rect1Rotation).add(rect1Center)
    )

    const rect2PointsRotated = rect2Points.map((p) =>
      p.rotate(rect2Rotation).add(rect2Center)
    )

    const collided = rect1PointsRotated.some((p) =>
      Collider.pointInRectangle(p, rect2PointsRotated)
    )
    if (!collided) return

    const overlap = rect1PointsRotated.reduce(
      (acc, p) => {
        const dist = p.distance(rect2Center)
        if (dist < acc.dist) return { dist, point: p }
        return acc
      },
      { dist: Infinity, point: new Vec2(0, 0) }
    )
    const dir = obj1.pos.sub(obj2.pos).normalize()

    return {
      dir,
      overlap: overlap.dist,
      objA: obj1,
      objB: obj2,
      aStatic: collider1.static,
      bStatic: collider2.static,
    }
  }

  static pointInRectangle(point: IVec2, rectPoints: IVec2[]): boolean {
    const x = point.x
    const y = point.y
    const x1 = rectPoints[0].x
    const y1 = rectPoints[0].y
    const x2 = rectPoints[1].x
    const y2 = rectPoints[1].y
    const x3 = rectPoints[2].x
    const y3 = rectPoints[2].y
    const x4 = rectPoints[3].x
    const y4 = rectPoints[3].y

    const d1 = Collider.sign(x, y, x1, y1, x2, y2)
    const d2 = Collider.sign(x, y, x2, y2, x3, y3)
    const d3 = Collider.sign(x, y, x3, y3, x4, y4)
    const d4 = Collider.sign(x, y, x4, y4, x1, y1)

    const hasNeg = d1 < 0 || d2 < 0 || d3 < 0 || d4 < 0
    const hasPos = d1 > 0 || d2 > 0 || d3 > 0 || d4 > 0

    return !(hasNeg && hasPos)
  }

  static sign(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
  ): number {
    return (x1 - x3) * (y2 - y3) - (x2 - x3) * (y1 - y3)
  }

  deserialize(data: any): void {
    this.enabled = data.enabled
    this.radius = data.radius
    this.width = data.width
    this.height = data.height
    this.shape = data.shape
    this.static = data.static
  }
  serialize(): string {
    return JSON.stringify({
      type: this.type,
      enabled: this.enabled,
      radius: this.radius,
      width: this.width,
      height: this.height,
      shape: this.shape,
      static: this.static,
    })
  }
}
