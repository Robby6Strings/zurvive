import { GameObjectStore } from "./gameObjectStore"
import { GameActionType, GameAction } from "./gameAction"
import { GameObject, GameObjectType } from "./gameObject"
import { CollisionLayer } from "./layers"
import { Collider } from "./components/collider"

export abstract class Game {
  frameDuration: number = 1000 / 60
  id: string = Math.random().toString(36).substring(7)
  playerStore: GameObjectStore<GameObjectType.Player> = new GameObjectStore(
    GameObjectType.Player,
    CollisionLayer.Player
  )
  enemyStore: GameObjectStore<GameObjectType.Enemy> = new GameObjectStore(
    GameObjectType.Player,
    CollisionLayer.Enemy
  )
  spawnerStore: GameObjectStore<GameObjectType.Spawner> = new GameObjectStore(
    GameObjectType.Spawner,
    CollisionLayer.Background
  )
  treeStore: GameObjectStore<GameObjectType.Tree> = new GameObjectStore(
    GameObjectType.Tree,
    CollisionLayer.Environment
  )

  static collisionLayers: Map<GameObjectType, CollisionLayer[]> = new Map([
    [
      GameObjectType.Player,
      [CollisionLayer.Player, CollisionLayer.Enemy, CollisionLayer.Environment],
    ],
    [
      GameObjectType.Enemy,
      [CollisionLayer.Player, CollisionLayer.Enemy, CollisionLayer.Environment],
    ],
  ])

  get objectStores() {
    return [
      this.playerStore,
      this.enemyStore,
      this.spawnerStore,
      this.treeStore,
    ]
  }

  handleCollisions() {
    for (const store of this.objectStores) {
      for (const objA of store.objects) {
        const collisionLayers = Game.collisionLayers.get(objA.type)
        if (!collisionLayers) continue

        for (const layer of collisionLayers) {
          const otherStores = this.getObjectPoolsByLayer(layer)
          for (const otherStore of otherStores) {
            const collisions = Collider.getCollisions(objA, otherStore.objects)
            for (const collision of collisions) {
              objA.pos = objA.pos.add(
                collision.dir.multiply(collision.depth / 2)
              )
            }
          }
        }
      }
    }
  }

  abstract handleAction<T extends GameActionType>(action: GameAction<T>): void
  public onUpdated(): void {
    for (const store of this.objectStores) {
      store.removeFlagged()
    }
  }

  update(): void {
    for (const store of this.objectStores) {
      store.update()
    }
    this.onUpdated()
  }

  addObject<T extends GameObjectType>(object: GameObject<T>) {
    this.getObjectPoolByType(object.type).add(object)
  }

  removeObject<T extends GameObjectType>({
    id,
    type,
  }: {
    id: string
    type: T
  }) {
    console.log("removing", id, type)
    this.getObjectPoolByType(type).removeById(id)
  }

  getObjectPoolByType<T extends GameObjectType>(type: T): GameObjectStore<T> {
    switch (type) {
      case GameObjectType.Player:
        return this.playerStore as GameObjectStore<T>
      case GameObjectType.Enemy:
        return this.enemyStore as GameObjectStore<T>
      case GameObjectType.Spawner:
        return this.spawnerStore as GameObjectStore<T>
      case GameObjectType.Tree:
        return this.treeStore as GameObjectStore<T>
      default:
        throw new Error(`Unknown object type ${type}`)
    }
  }

  getObjectPoolsByLayer(layer: CollisionLayer): GameObjectStore<any>[] {
    return this.objectStores.filter((store) => store.objectLayer === layer)
  }

  serialize(): Object {
    return {
      id: this.id,
      players: this.playerStore.serialize(),
      enemies: this.enemyStore.serialize(),
    }
  }
}
