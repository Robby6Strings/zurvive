import { BaseGame } from "../../shared/game"
import { GameObjectType } from "../../shared/gameObject"
import { Enemy } from "../../shared/gameObjects/entities"
import { Spawner } from "../../shared/gameObjects/spawner"
import { GameActionType, GameAction } from "../../shared/gameAction"
import { Fighter } from "../../shared/components/fighter"
import { Mover } from "../../shared/components/mover"
import { ServerPlayer } from "./serverPlayer"
import { MessageType, TypedMessage } from "../../shared/message"
import { Vec2 } from "../../shared/vec2"
import { Tree } from "../../shared/gameObjects/environment/tree"
//import { Collider } from "../../shared/components/collider"

export class ServerGame extends BaseGame {
  intervalRef: NodeJS.Timer
  constructor() {
    super()
    const enemySpawner = new Spawner<GameObjectType.Enemy>()
    this.spawnerStore.add(enemySpawner)
    enemySpawner.configure(() => {
      return { pos: new Vec2(0, 0) }
    }, Enemy)
    this.enemyStore.add(enemySpawner.spawn())

    const treeSpawner = new Spawner<GameObjectType.Tree>()
    this.spawnerStore.add(treeSpawner)
    treeSpawner.configure(() => {
      return { pos: new Vec2(-200, -200) }
    }, Tree)
    this.treeStore.add(treeSpawner.spawn())

    this.intervalRef = setInterval(() => {
      this.update()
    }, this.frameDuration)
  }

  update(): void {
    // const enemySpawners = this.spawnerStore.filter(
    //   (s) => (s as Spawner<any>).classRef === Enemy
    // )

    this.enemyStore.forEach((enemy) => {
      const fighter = enemy.getComponent(Fighter)!
      if (!fighter.target) {
        fighter.target = fighter.getTargetWithinFollowRange(
          enemy,
          this.playerStore.objects
        )
      }
    })

    super.update()
  }

  onUpdated(): void {
    let changes: TypedMessage<GameActionType | undefined>[] = []
    for (const store of this.objectStores) {
      changes = changes.concat(store.getChanges())
    }
    if (changes.length > 0) {
      this.broadcast(
        { type: MessageType.update, changes },
        this.playerStore.objects as ServerPlayer[]
      )
    }
    super.onUpdated()
  }

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
      { type: MessageType.newObject, object: player.serialize() },
      this.playerStore.objects as ServerPlayer[]
    )
  }

  handleAction<T extends GameActionType>(action: GameAction<T>): void {
    const pool = this.getObjectPool(action.payload.objectType)
    const obj = pool.find(action.payload.objectId)
    if (!obj) {
      throw new Error(
        `Object ${action.payload.objectId} not found in pool ${action.payload.objectType}`
      )
    }
    switch (action.type) {
      case GameActionType.setTargetPos:
        obj
          .getComponent(Mover)!
          .setTargetPos(
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
