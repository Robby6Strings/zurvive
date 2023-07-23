import { GameObject, GameObjectType } from "../gameObject"
import { Vec2 } from "../vec2"

type GameObjectConstructor = { new (): GameObject }

export class Spawner extends GameObject {
  modifierFunc: { (obj: GameObject): GameObject } | undefined
  classRef: GameObjectConstructor | undefined
  lastSpawnTime: number = performance.now()
  lastSpawnPos: Vec2 = new Vec2(0, 0)
  constructor() {
    super(GameObjectType.Spawner)
    this.renderSettings.render = false
    this.pos = new Vec2(0, 0)
  }
  configure(
    fn: { (obj: GameObject): GameObject },
    classRef: GameObjectConstructor
  ) {
    this.modifierFunc = fn
    this.classRef = classRef
  }
  spawn(): GameObject {
    if (!this.modifierFunc || !this.classRef)
      throw new Error("Spawner not configured")
    this.lastSpawnTime = performance.now()
    const res = this.modifierFunc(new this.classRef())
    this.lastSpawnPos = res.pos.clone()
    return res
  }
}
