import { BaseGame } from "../../shared/game"
import { GameObjectStore } from "../../shared/gameObjectStore"
import { GameObjectType } from "../../shared/gameObject"
import { GameActionType, GameAction } from "../../shared/gameAction"
import { Mover } from "../../shared/components/mover"
import { Renderer } from "./renderer"
import { Camera } from "./camera"

export class ClientGame extends BaseGame {
  playerStore: GameObjectStore<GameObjectType.Player>
  enemyStore: GameObjectStore<GameObjectType.Enemy>
  camera: Camera
  renderer: Renderer
  intervalRef: number
  constructor(serializedGameState: string) {
    super()
    const { id, players, enemies } = JSON.parse(serializedGameState)
    this.id = id
    this.playerStore = new GameObjectStore(GameObjectType.Player)
    this.playerStore.deserialize(players)
    this.enemyStore = new GameObjectStore(GameObjectType.Enemy)
    this.enemyStore.deserialize(enemies)
    this.camera = new Camera()
    this.renderer = new Renderer(this)
    this.intervalRef = window.setInterval(() => {
      this.update()
      this.renderer.render()
    }, this.frameDuration)
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
