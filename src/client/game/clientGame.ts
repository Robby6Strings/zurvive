import { BaseGame } from "../../shared/game"
import { GameObjectStore } from "../../shared/gameObjectStore"
import { GameObjectType } from "../../shared/gameObject"
import { Enemy, Player } from "../../shared/gameObjects"
import { GameActionType, GameAction } from "../../shared/gameAction"
import { Mover } from "../../shared/components/mover"

export class ClientGame extends BaseGame {
  playerStore: GameObjectStore<GameObjectType.Player>
  enemyStore: GameObjectStore<GameObjectType.Enemy>
  constructor(players: Player[] = [], enemies: Enemy[] = []) {
    super()
    this.playerStore = new GameObjectStore(players)
    this.enemyStore = new GameObjectStore(enemies)
  }

  onUpdated(): void {}

  handleAction<T extends GameActionType>(action: GameAction<T>): void {
    const pool = this.getObjectPool(action.payload.objectType)
    const obj = pool.get(action.payload.objectId)
    if (!obj) {
      throw new Error(
        `Object ${action.payload.objectId} not found in pool ${action.payload.objectType}`
      )
    }

    switch (action.type) {
      case GameActionType.setTargetPos:
        obj
          .getComponent(Mover)
          ?.setTarget(
            (action as GameAction<GameActionType.setTargetPos>).payload.data
          )
        break
      case GameActionType.attack:
        break
      case GameActionType.interact:
        break
      default:
        throw new Error(`Unknown action type ${action.type}`)
    }
  }
}
