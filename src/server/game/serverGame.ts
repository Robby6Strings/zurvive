import { Game } from "../../shared/game"
import { Enemy, Player } from "../../shared/gameObjects/entities"
import { Spawner } from "../../shared/gameObjects/spawner"
import { GameActionType, GameAction } from "../../shared/gameAction"
import { Fighter } from "../../shared/components/fighter"
import { Mover } from "../../shared/components/mover"
import { ServerPlayer } from "./serverPlayer"
import { MessageType, TypedMessage } from "../../shared/message"
import { Vec2 } from "../../shared/vec2"
import { GameObject, GameObjectType } from "../../shared/gameObject"
import { Health } from "../../shared/components/health"
import { ExperienceOrb } from "../../shared/gameObjects/experienceOrb"

export class ServerGame extends Game {
  intervalRef: NodeJS.Timer
  constructor() {
    super()

    const variance = 50
    const spawnerDist = 300
    const spawnerPositions = [
      new Vec2(-spawnerDist, -spawnerDist),
      new Vec2(spawnerDist, -spawnerDist),
      new Vec2(spawnerDist, spawnerDist),
      new Vec2(-spawnerDist, spawnerDist),
    ]
    for (let i = 0; i < spawnerPositions.length; i++) {
      const pos = spawnerPositions[i]
      setTimeout(() => {
        this.addObject(
          new Spawner().configure(
            (e: Enemy) => {
              e.getComponent(Health)!.onKilled = () => {
                this.spawnExperience(e.pos, 1)
                return true
              }
              return e
            },
            Enemy,
            pos,
            variance
          )
        )
      }, i * 2000)
    }

    this.intervalRef = setInterval(() => {
      this.update()
    }, this.frameDuration)
  }

  get players(): ServerPlayer[] {
    return this.objectStore.objects.filter(
      (o) => o instanceof ServerPlayer
    ) as ServerPlayer[]
  }

  spawnExperience(pos: Vec2, value: number): void {
    this.addObject(
      Object.assign(new ExperienceOrb(), {
        pos,
        value,
      })
    )
  }

  update(): void {
    if (this.objectStore.objects.length === 0) {
      return
    }

    const enemySpawners = this.objectStore
      .findByType<Spawner>(GameObjectType.Spawner)
      .filter((s) => s.spawnClass === Enemy)

    const enemies = this.objectStore.findByType<Enemy>(GameObjectType.Enemy)
    const players = this.objectStore.findByType<Player>(GameObjectType.Player)

    enemySpawners.forEach((spawner) => {
      if (
        enemies.length < 100 &&
        performance.now() - spawner.lastSpawnTime >= 10_000
      ) {
        for (let i = 0; i < 3; i++) {
          let closestPlayer
          let closestDist = Infinity
          for (const player of players) {
            const dist = GameObject.getDistance(spawner, player)
            if (dist < closestDist) {
              closestDist = dist
              closestPlayer = player
            }
          }
          const enemy = spawner.spawn()
          if (closestPlayer) {
            enemy.getComponent(Mover)!.setTargetPos(closestPlayer.pos)
          }
          this.objectStore.add(enemy)
        }
      }
    })

    for (const enemy of enemies) {
      const fighter = enemy.getComponent(Fighter)!
      if (!fighter.target) {
        fighter.target = fighter.getTargetWithinFollowRange(enemy, players)
      }
      if (!fighter.target) {
        enemy.getComponent(Mover)?.setTargetPos(null)
      }
    }
    this.objectStore.update()
    this.handleCollisions()
    this.onUpdated()
    this.objectStore.removeFlagged()
  }

  onUpdated(): void {
    const changes: TypedMessage<GameActionType | undefined>[] =
      this.objectStore.getChanges()

    if (changes.length > 0) {
      this.broadcast({ type: MessageType.update, changes }, this.players)
    }
  }

  private broadcast(data: any, players: ServerPlayer[]) {
    for (const player of players) {
      player.conn.socket.send(JSON.stringify(data))
    }
  }

  handleAction<T extends GameActionType>(action: GameAction<T>): void {
    const obj = this.objectStore.find(
      (o) =>
        o.id === action.payload.objectId && o.type === action.payload.objectType
    ) as ServerPlayer | undefined
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
        const attackPos = (action as GameAction<GameActionType.attack>).payload
          .data
        const bullets = obj.handleAttack(attackPos)
        if (bullets) this.objectStore.add(...bullets)
        break
      case GameActionType.interact:
        break
      case GameActionType.move:
        const inputVel = (action as GameAction<GameActionType.move>).payload
          .data
        const vel = new Vec2()
        // clamp input velocity to -1, 1
        if (inputVel.x !== 0 || inputVel.y !== 0) {
          if (inputVel.x !== 0) {
            vel.x = Math.max(-1, Math.min(1, inputVel.x))
          }
          if (inputVel.y !== 0) {
            vel.y = Math.max(-1, Math.min(1, inputVel.y))
          }
        }
        obj.vel = obj.vel.add(vel).clamp(-15, 15)
        break
      default:
        throw new Error(`Unknown action type ${action.type}`)
    }
  }
}
