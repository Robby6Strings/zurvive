import { BaseGame } from "../../shared/game"
import { GameObjectStore } from "../../shared/gameObjectStore"
import { GameObjectType } from "../../shared/gameObject"
import { Enemy } from "../../shared/gameObjects"
import { GameActionType, GameAction } from "../../shared/gameAction"
import { Collider } from "../../shared/components/collider"
import { Health } from "../../shared/components/health"
import { Fighter } from "../../shared/components/fighter"
import { Mover } from "../../shared/components/mover"
import { ServerPlayer } from "./serverPlayer"
import { MessageType } from "../../shared/message"

export class ServerGame extends BaseGame {
  playerStore: GameObjectStore<GameObjectType.Player>
  enemyStore: GameObjectStore<GameObjectType.Enemy>
  constructor(players: ServerPlayer[] = [], enemies: Enemy[] = []) {
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

  private broadcast(data: any, players: ServerPlayer[]) {
    for (const player of players) {
      player.conn.socket.send(JSON.stringify(data))
    }
  }

  broadcastAction<T extends GameActionType>(action: GameAction<T>): void {
    this.broadcast(
      { type: MessageType.action, action },
      this.playerStore.objects as ServerPlayer[]
    )
  }
  broadcastPlayer(player: ServerPlayer) {
    this.broadcast(
      { type: MessageType.playerJoined, player: player.serialize() },
      this.playerStore.objects as ServerPlayer[]
    )
  }

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
          .getComponent(Mover)!
          .setTarget(
            (action as GameAction<GameActionType.setTargetPos>).payload.data
          )
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
