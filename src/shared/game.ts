import { GameObjectStore } from "./gameObjectStore"
import { GameActionType, GameAction } from "./gameAction"
import { GameObjectType } from "./gameObject"

export abstract class BaseGame {
  playerStore: GameObjectStore<GameObjectType.Player> = new GameObjectStore()
  enemyStore: GameObjectStore<GameObjectType.Enemy> = new GameObjectStore()

  abstract handleAction<T extends GameActionType>(action: GameAction<T>): void
  abstract onUpdated(): void

  update(): void {
    this.playerStore.update()
    this.enemyStore.update()
    this.onUpdated()
  }

  protected getObjectPool<T extends GameObjectType>(
    type: T
  ): GameObjectStore<T> {
    switch (type) {
      case GameObjectType.Player:
        return this.playerStore as GameObjectStore<T>
      case GameObjectType.Enemy:
        return this.enemyStore as GameObjectStore<T>
      default:
        throw new Error(`Unknown object type ${type}`)
    }
  }
}
