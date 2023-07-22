import { GameObject, GameObjectType } from "../gameObject"
import { Vec2 } from "../vec2"

type GameObjectConstructor<T extends GameObjectType> = { new (): GameObject<T> }

export class Spawner<
  T extends GameObjectType
> extends GameObject<GameObjectType.EnemySpawner> {
  spawnOpts: { (): Partial<GameObject<T>> } | undefined
  classRef: GameObjectConstructor<T> | undefined
  lastSpawnTime: number = performance.now()
  constructor() {
    super(GameObjectType.EnemySpawner)
    this.pos = new Vec2(0, 0)
  }
  configure(
    fn: { (): Partial<GameObject<T>> },
    classRef: GameObjectConstructor<T>
  ) {
    this.spawnOpts = fn
    this.classRef = classRef
  }
  spawn(): GameObject<T> {
    if (!this.spawnOpts || !this.classRef)
      throw new Error("Spawner not configured")
    this.lastSpawnTime = performance.now()
    return Object.assign(new this.classRef(), this.spawnOpts())
  }
}
