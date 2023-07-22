import { BaseGame } from "../../shared/game"
import { GameObjectStore } from "../../shared/gameObjectStore"
import { GameObjectType } from "../../shared/gameObject"
import { Enemy, Spawner } from "../../shared/gameObjects"
import { GameActionType, GameAction } from "../../shared/gameAction"
import { Fighter } from "../../shared/components/fighter"
import { Mover } from "../../shared/components/mover"
import { ServerPlayer } from "./serverPlayer"
import { MessageType, TypedMessage } from "../../shared/message"
import { Vec2 } from "../../shared/vec2"
//import { Collider } from "../../shared/components/collider"

export class ServerGame extends BaseGame {
  intervalRef: NodeJS.Timer
  constructor(players: ServerPlayer[] = [], enemies: Enemy[] = []) {
    super()
    this.playerStore = new GameObjectStore(GameObjectType.Player, players)
    this.enemyStore = new GameObjectStore(GameObjectType.Enemy, enemies)
    const enemySpawner = new Spawner<GameObjectType.Enemy>()
    enemySpawner.configure(() => {
      return { pos: new Vec2(0, 0) }
    }, Enemy)
    this.enemyStore.add(enemySpawner.spawn())

    this.enemySpawnerStore = new GameObjectStore(GameObjectType.EnemySpawner, [
      enemySpawner,
    ])
    this.intervalRef = setInterval(() => {
      this.update()
    }, this.frameDuration)
  }

  update(): void {
    // this.enemySpawnerStore.objects.forEach((spawner) => {
    //   const _spawner: Spawner<GameObjectType.Enemy> =
    //     spawner as Spawner<GameObjectType.Enemy>
    //   if (performance.now() - _spawner.lastSpawnTime < 10_000) return
    //   console.log("spawning enemy")
    //   const randomPlayer =
    //     this.playerStore.objects[
    //       Math.floor(Math.random() * this.playerStore.objects.length)
    //     ]
    //   const enemy = _spawner.spawn()
    //   enemy.getComponent(Fighter)!.setTarget(randomPlayer)
    //   this.enemyStore.add(enemy)
    // })

    this.enemyStore.objects.forEach((enemy) => {
      const fighter = enemy.getComponent(Fighter)!
      if (!fighter.target) {
        fighter.target = fighter.getTargetWithinFollowRange(
          enemy,
          this.playerStore.objects
        )
      }
      //const collisions = Collider.getCollisions(enemy, this.playerStore.objects)
      // for (const collision of collisions) {
      //   const playerObj =
      //     collision.objA.type === GameObjectType.Player
      //       ? collision.objA
      //       : collision.objB
      //   const player = playerObj as ServerPlayer
      //   player.pos = player.pos.add(collision.dir.scale(collision.overlap))
      // }
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
