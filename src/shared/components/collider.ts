import { Component, ComponentType } from "../component"
import { GameObject } from "../gameObject"
import { ShapeType } from "../types"
import { IVec2, Vec2 } from "../vec2"

export enum CollisionLayer {
  None,
  Background,
  Environment,
  PlayerBullet,
  EnemyBullet,
  Player,
  Enemy,
  ExperienceOrb,
}

type CollisionCheckResult = {
  objA: GameObject
  objB: GameObject
  aStatic: boolean
  bStatic: boolean
  dir: Vec2
  depth: number
}

export class Collider extends Component {
  radius: number = 0
  width: number = 0
  height: number = 0
  shape: ShapeType = ShapeType.Circle
  static: boolean = false
  private _onCollision: { (obj: GameObject): void } | undefined

  constructor() {
    super(ComponentType.Collider, true)
  }

  get onCollision(): { (obj: GameObject): void } | undefined {
    return this._onCollision
  }

  withCollisionEffect(fn: { (obj: GameObject): void }): Collider {
    this._onCollision = fn
    return this
  }

  getPoints(): Vec2[] {
    if (this.shape === ShapeType.Circle) {
      return [
        new Vec2(this.radius, this.radius),
        new Vec2(-this.radius, this.radius),
        new Vec2(-this.radius, -this.radius),
        new Vec2(this.radius, -this.radius),
      ]
    }
    return [
      new Vec2(this.width / 2, this.height / 2),
      new Vec2(-this.width / 2, this.height / 2),
      new Vec2(-this.width / 2, -this.height / 2),
      new Vec2(this.width / 2, -this.height / 2),
    ]
  }

  static getSize(obj: GameObject): number {
    const collider = obj.getComponent(Collider)
    if (!collider) return 0
    return collider.shape === ShapeType.Circle
      ? collider.radius
      : Math.max(collider.width, collider.height) / 2
  }

  update(_obj: GameObject): void {}

  static rectangleCollider(
    width: number,
    height: number,
    isStatic: boolean = false
  ) {
    return Object.assign<Collider, Partial<Collider>>(new Collider(), {
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

  static checkCollision(
    obj1: GameObject,
    obj2: GameObject,
    obj1Pos: Vec2 = obj1.pos,
    obj2Pos: Vec2 = obj2.pos
  ): CollisionCheckResult | undefined {
    const collider1 = obj1.getComponent(Collider)
    const collider2 = obj2.getComponent(Collider)
    if (!collider1 || !collider2) return
    if (!collider1.enabled || !collider2.enabled) return
    if (collider1.static && collider2.static) return

    let res: CollisionCheckResult | undefined
    if (
      collider1.shape === ShapeType.Circle &&
      collider2.shape === ShapeType.Circle
    ) {
      res = Collider.circleCircleCollision(obj1, obj2, obj1Pos, obj2Pos)
    }
    if (
      collider1.shape === ShapeType.Circle &&
      collider2.shape === ShapeType.Rectangle
    ) {
      res = Collider.circleRectangleCollision(obj1, obj2, obj1Pos, obj2Pos)
    }
    if (
      collider1.shape === ShapeType.Rectangle &&
      collider2.shape === ShapeType.Circle
    ) {
      res = Collider.circleRectangleCollision(obj2, obj1, obj1Pos, obj2Pos)
    }
    if (
      collider1.shape === ShapeType.Rectangle &&
      collider2.shape === ShapeType.Rectangle
    ) {
      res = Collider.rectangleRectangleCollision(obj1, obj2, obj1Pos, obj2Pos)
    }
    if (res) {
      if (collider1.onCollision) collider1.onCollision(obj2)
      if (collider2.onCollision) collider2.onCollision(obj1)
    }
    return res
  }

  static circleCircleCollision(
    obj1: GameObject,
    obj2: GameObject,
    obj1Pos: Vec2 = obj1.pos,
    obj2Pos: Vec2 = obj2.pos
  ): CollisionCheckResult | undefined {
    const collider1 = obj1.getComponent(Collider)
    const collider2 = obj2.getComponent(Collider)
    if (!collider1 || !collider2) return

    const dist = obj1Pos.distance(obj2Pos)
    const collided = dist < collider1.radius + collider2.radius
    if (!collided) return

    const overlap = collider1.radius + collider2.radius - dist
    const dir = obj1Pos.subtract(obj2Pos).normalize()

    return {
      dir,
      depth: overlap,
      objA: obj1,
      objB: obj2,
      aStatic: collider1.static,
      bStatic: collider2.static,
    }
  }

  static circleRectangleCollision(
    circleObj: GameObject,
    rectObj: GameObject,
    circleObjPos: Vec2 = circleObj.pos,
    rectObjPos: Vec2 = rectObj.pos
  ): CollisionCheckResult | undefined {
    const circleCollider = circleObj.getComponent(Collider)
    const rectCollider = rectObj.getComponent(Collider)
    if (!circleCollider || !rectCollider) return

    const rectRotation = rectObj.rotation
    const rectCenter = rectObjPos

    const rectPoints = rectCollider.getPoints()
    const rectPointsRotated = rectPoints.map((p) =>
      p.rotate(rectRotation).add(rectCenter)
    )

    const circleCenter = circleObjPos
    const circleRadius = circleCollider.radius

    const collidedWithCorner = rectPointsRotated.some((p) =>
      Collider.pointInRectangle(p, [
        new Vec2(circleCenter.x + circleRadius, circleCenter.y + circleRadius),
        new Vec2(circleCenter.x - circleRadius, circleCenter.y + circleRadius),
        new Vec2(circleCenter.x - circleRadius, circleCenter.y - circleRadius),
        new Vec2(circleCenter.x + circleRadius, circleCenter.y - circleRadius),
      ])
    )

    if (collidedWithCorner) {
      const overlap = rectPointsRotated.reduce(
        (acc, p) => {
          const dist = p.distance(circleCenter)
          if (dist < acc.dist) return { dist, point: p }
          return acc
        },
        { dist: Infinity, point: new Vec2(0, 0) }
      )
      const dir = circleObjPos.subtract(overlap.point).normalize()
      const depth = circleObjPos.distance(overlap.point)
      return {
        dir,
        depth,
        objA: circleObj,
        objB: rectObj,
        aStatic: circleCollider.static,
        bStatic: rectCollider.static,
      }
    }

    return Collider.rectangleRectangleCollision(
      circleObj,
      rectObj,
      circleObjPos,
      rectObjPos
    )
  }

  static rectangleRectangleCollision(
    obj1: GameObject,
    obj2: GameObject,
    obj1Pos: Vec2 = obj1.pos,
    obj2Pos: Vec2 = obj2.pos
  ): CollisionCheckResult | undefined {
    const collider1 = obj1.getComponent(Collider)
    const collider2 = obj2.getComponent(Collider)
    if (!collider1 || !collider2) return

    const rect1Rotation = obj1.rotation
    const rect1Center = obj1Pos

    const rect2Rotation = obj2.rotation
    const rect2Center = obj2Pos

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
    const dir = obj1Pos.subtract(obj2Pos).normalize()

    return {
      dir,
      depth: overlap.dist,
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

  deserialize(data: any) {
    this.enabled = data.enabled
    this.radius = data.radius
    this.width = data.width
    this.height = data.height
    this.shape = data.shape
    this.static = data.static
  }
  serialize(): Object {
    return {
      type: this.type,
      enabled: this.enabled,
      radius: this.radius,
      width: this.width,
      height: this.height,
      shape: this.shape,
      static: this.static,
    }
  }
}
