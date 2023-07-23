import { GameObject, GameObjectType } from "../gameObject"
import { Vec2 } from "../vec2"

type GameObjectConstructor<T extends GameObjectType> = { new (): GameObject<T> }

export class Spawner<
  T extends GameObjectType
> extends GameObject<GameObjectType.Spawner> {
  modifierFunc: { (obj: GameObject<T>): GameObject<T> } | undefined
  classRef: GameObjectConstructor<T> | undefined
  lastSpawnTime: number = performance.now()
  lastSpawnPos: Vec2 = new Vec2(0, 0)
  constructor() {
    super(GameObjectType.Spawner)
    this.renderSettings.render = false
    this.pos = new Vec2(0, 0)
  }
  configure(
    fn: { (obj: GameObject<T>): GameObject<T> },
    classRef: GameObjectConstructor<T>
  ) {
    this.modifierFunc = fn
    this.classRef = classRef
  }
  spawn(): GameObject<T> {
    if (!this.modifierFunc || !this.classRef)
      throw new Error("Spawner not configured")
    this.lastSpawnTime = performance.now()
    const res = this.modifierFunc(new this.classRef())
    this.lastSpawnPos = res.pos.clone()
    return res
  }
}
