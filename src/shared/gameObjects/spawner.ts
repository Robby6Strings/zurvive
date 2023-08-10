import { GameObject, GameObjectType } from "../gameObject"
import { Vec2 } from "../vec2"

type GameObjectConstructor = { new (): GameObject }

export class Spawner extends GameObject {
  modifierFunc: { (obj: GameObject): GameObject } | undefined
  spawnClass: GameObjectConstructor | undefined
  lastSpawnTime: number = performance.now()
  lastSpawnPos: Vec2 = new Vec2(0, 0)
  pos: Vec2
  variance: number = 50
  constructor() {
    super(GameObjectType.Spawner)
    this.renderSettings.render = false
    this.pos = new Vec2(0, 0)
  }
  configure(
    fn: { (obj: GameObject): GameObject },
    spawnClass: GameObjectConstructor,
    pos: Vec2 = new Vec2(0, 0),
    variance: number = 50
  ) {
    this.modifierFunc = fn
    this.spawnClass = spawnClass
    this.pos = pos
    this.variance = variance
    return this
  }
  spawn(): GameObject {
    if (!this.modifierFunc || !this.spawnClass)
      throw new Error("Spawner not configured")
    this.lastSpawnTime = performance.now()
    const obj = new this.spawnClass()
    obj.pos = this.pos.add(
      new Vec2(
        Math.random() * this.variance - this.variance / 2,
        Math.random() * this.variance - this.variance / 2
      )
    )
    return this.modifierFunc(obj)
  }
}
