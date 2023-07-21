import { BaseGame } from "../../shared/game"
import { GameObjectStore } from "../../shared/gameObjectStore"
import { GameObjectType } from "../../shared/gameObject"
import { Enemy, Player } from "../../shared/gameObjects"
import { GameActionType, GameAction } from "../../shared/gameAction"
import { Collider } from "../../shared/components/collider"
import { Health } from "../../shared/components/health"
import { Fighter } from "../../shared/components/fighter"

export class ServerGame extends BaseGame {
  playerStore: GameObjectStore<GameObjectType.Player>
  enemyStore: GameObjectStore<GameObjectType.Enemy>
  constructor(players: Player[] = [], enemies: Enemy[] = []) {
    super()
    this.playerStore = new GameObjectStore(GameObjectType.Player, players)
    this.enemyStore = new GameObjectStore(GameObjectType.Enemy, enemies)
  }

  update(): void {
    this.playerStore.objects.forEach((player) => {
      const collisionResults = Collider.checkCollisions(
        player,
        this.enemyStore.objects
      )
      const playerHealth = player.getComponent(Health)!
      for (const result of collisionResults) {
        const enemy = result.objA === player ? result.objB! : result.objA!
        const enemyFighter = enemy.getComponent(Fighter)!
        enemyFighter.attack(playerHealth)
      }
    })

    super.update()
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
        break
      case GameActionType.setTargetObj:
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
