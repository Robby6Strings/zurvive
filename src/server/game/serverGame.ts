import { Game } from "../../shared/game"
import { Enemy, Player } from "../../shared/gameObjects/entities"
import { Spawner } from "../../shared/gameObjects/spawner"
import { GameActionType, GameAction } from "../../shared/message"
import { Fighter } from "../../shared/components/fighter"
import { Mover } from "../../shared/components/mover"
import { ServerPlayer } from "./serverPlayer"
import { MessageType, TypedMessage } from "../../shared/message"
import { Vec2 } from "../../shared/vec2"
import { GameObject, GameObjectType } from "../../shared/gameObject"
import { Health } from "../../shared/components/health"
import { ExperienceOrb } from "../../shared/gameObjects/experienceOrb"
import { AttributeType, Attributes } from "../../shared/components/attributes"
import { Bonus } from "../../shared/bonus"
import { AccountService } from "../services/userService"
import { Tree } from "../../shared/gameObjects/environment/tree"
import { CollisionLayer, Collider } from "../../shared/components/collider"
import { Bullet } from "../../shared/gameObjects/bullet"

const spawnEnemies = false

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
      if (!spawnEnemies) break
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

    const tree = new Tree()
    tree.pos = new Vec2(-100, -100)
    //tree.rotation = Math.PI / 4 // 45 degrees
    this.addObject(tree)

    this.intervalRef = setInterval(() => {
      this.update()
    }, this.frameDuration)
  }

  get players(): ServerPlayer[] {
    return this.objectStore.objects.filter(
      (o) => o instanceof ServerPlayer
    ) as ServerPlayer[]
  }

  objectToCollisionLayerMap: Map<GameObjectType, CollisionLayer[]> = new Map([
    [
      GameObjectType.Player,
      [
        CollisionLayer.Player,
        CollisionLayer.Enemy,
        CollisionLayer.Environment,
        CollisionLayer.EnemyBullet,
      ],
    ],
    [
      GameObjectType.Enemy,
      [
        CollisionLayer.Player,
        CollisionLayer.Enemy,
        CollisionLayer.Environment,
        CollisionLayer.PlayerBullet,
      ],
    ],
    [GameObjectType.Bullet, [CollisionLayer.Enemy, CollisionLayer.Environment]],
    [
      GameObjectType.ExperienceOrb,
      [CollisionLayer.Player, CollisionLayer.Environment],
    ],
  ])

  handleCollisions() {
    for (const objA of this.objectStore.objects) {
      const collidableLayers = this.objectToCollisionLayerMap.get(objA.type)
      if (!collidableLayers) continue
      for (const objB of this.objectStore.objects) {
        if (objA === objB) continue
        if (
          !collidableLayers.find((layer) =>
            objB.collisionLayers.includes(layer)
          )
        )
          continue

        const dist = GameObject.getDistance(objA, objB)
        if (dist > 100) continue

        const collision = Collider.checkCollision(objA, objB)
        if (!collision) {
          if (
            (objB.type === GameObjectType.Player &&
              objA.type === GameObjectType.ExperienceOrb) ||
            (objA.type === GameObjectType.Player &&
              objB.type === GameObjectType.ExperienceOrb)
          ) {
            if (dist < 50) {
              const orb =
                objA.type === GameObjectType.ExperienceOrb ? objA : objB
              const dir = GameObject.getDirection(objA, objB)
              orb.pos = orb.pos.add(dir.multiply(5))
            }
          }
          continue
        }
        if (!objA.getComponent(Collider)?.static) {
          objA.pos = objA.pos.add(collision.dir.multiply(collision.depth / 2))
        }
        if (objA instanceof Bullet || objB instanceof Bullet) {
          const other = objA instanceof Bullet ? objB : objA
          const bullet = (objA instanceof Bullet ? objA : objB) as Bullet
          if (
            other &&
            !(other instanceof Bullet) &&
            !other.getComponent(Collider)?.static
          ) {
            other.vel = other.vel.add(
              bullet.vel.multiply(
                ((collision.depth / 2) * bullet.config.weight) / 100
              )
            )
          }
        }
      }
    }
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
    const players = this.objectStore.findByType<Player>(GameObjectType.Player)
    if (players.length === 0) {
      return
    }

    const enemySpawners = this.objectStore
      .findByType<Spawner>(GameObjectType.Spawner)
      .filter((s) => s.spawnClass === Enemy)

    const enemies = this.objectStore.findByType<Enemy>(GameObjectType.Enemy)

    enemySpawners.forEach((spawner) => {
      if (
        (enemies.length < 100 &&
          performance.now() - spawner.lastSpawnTime >= 10_000) ||
        spawner.new
      ) {
        for (let i = 0; i < 3; i++) {
          const enemy = spawner.spawn()
          const [closestPlayer] = GameObject.getClosest(enemy, players)
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

  addPlayer(player: ServerPlayer): void {
    this.addObject(player)
    player.onLevelUp = () => {
      const items = Bonus.generateBonusSet()
      player.bonusSets.set(items.id, items)
      AccountService.get(player.userId)?.send({
        type: MessageType.bonusSet,
        data: items,
      })
    }
  }

  private broadcast(data: any, players: ServerPlayer[]) {
    for (const player of players) {
      AccountService.get(player.userId)?.send(data)
    }
  }

  handleAction<T extends GameActionType>(
    player: ServerPlayer,
    action: GameAction<T>
  ): void {
    switch (action.type) {
      case GameActionType.setTargetPos:
        player
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
        const bullets = player.handleAttack(attackPos)
        if (bullets) this.objectStore.add(...bullets)
        break
      case GameActionType.interact:
        break
      case GameActionType.move:
        const attributes = player.getComponent(Attributes)!
        const speed = attributes.getBonus(AttributeType.MoveSpeed) / 10

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
        player.vel = player.vel
          .add(vel.multiply(speed / 5))
          .clamp(-speed, speed)
        break
      case GameActionType.chooseBonus:
        const { id, bonusId } = (
          action as GameAction<GameActionType.chooseBonus>
        ).payload.data
        player.setBonusSetSelection(id, bonusId)

        break
      default:
        throw new Error(`Unknown action type ${action.type}`)
    }
  }
}
