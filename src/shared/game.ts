import { GameObjectStore } from "./gameObjectStore"
import { GameActionType, GameAction } from "./gameAction"
import { GameObject, GameObjectType } from "./gameObject"

export abstract class BaseGame {
  frameDuration: number = 1000 / 60
  id: string = Math.random().toString(36).substring(7)
  playerStore: GameObjectStore<GameObjectType.Player> = new GameObjectStore(
    GameObjectType.Player
  )
  enemyStore: GameObjectStore<GameObjectType.Enemy> = new GameObjectStore(
    GameObjectType.Player
  )
  spawnerStore: GameObjectStore<GameObjectType.Spawner> = new GameObjectStore(
    GameObjectType.Spawner
  )

  get objectStores() {
    return [this.playerStore, this.enemyStore, this.spawnerStore]
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
    this.getObjectPool(object.type).add(object)
  }

  removeObject<T extends GameObjectType>({
    id,
    type,
  }: {
    id: string
    type: T
  }) {
    console.log("removing", id, type)
    this.getObjectPool(type).removeById(id)
  }

  getObjectPool<T extends GameObjectType>(type: T): GameObjectStore<T> {
    switch (type) {
      case GameObjectType.Player:
        return this.playerStore as GameObjectStore<T>
      case GameObjectType.Enemy:
        return this.enemyStore as GameObjectStore<T>
      case GameObjectType.Spawner:
        return this.spawnerStore as GameObjectStore<T>
      default:
        throw new Error(`Unknown object type ${type}`)
    }
  }

  serialize(): Object {
    return {
      id: this.id,
      players: this.playerStore.serialize(),
      enemies: this.enemyStore.serialize(),
    }
  }
}
