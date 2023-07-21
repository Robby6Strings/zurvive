import { BaseGame } from "../../shared/game"
import { GameObjectStore } from "../../shared/gameObjectStore"
import { GameObjectType } from "../../shared/gameObject"
import { GameActionType, GameAction } from "../../shared/gameAction"
import { Mover } from "../../shared/components/mover"
import { Renderer } from "./renderer"
import { Camera } from "./camera"
import { Vec2 } from "../../shared/vec2"
import { LiveSocket } from "../liveSocket"

export class ClientGame extends BaseGame {
  playerId: string = ""
  liveSocket: LiveSocket
  playerStore: GameObjectStore<GameObjectType.Player>
  enemyStore: GameObjectStore<GameObjectType.Enemy>
  camera: Camera
  renderer: Renderer
  intervalRef: number
  mousePos: Vec2 = new Vec2(0, 0)
  lastMousePos: Vec2 = new Vec2(0, 0)
  mouseDown: boolean = false
  keys: {
    [key: string]: boolean
  } = {}
  constructor(serializedGameState: string, liveSocket: LiveSocket) {
    super()
    this.liveSocket = liveSocket
    const { id, players, enemies } = JSON.parse(serializedGameState)
    this.id = id
    console.log("game id", this.id)
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
    this.attachListeners()
  }

  attachListeners(): void {
    window.addEventListener("keydown", this.handleKeyDown.bind(this))
    window.addEventListener("keyup", this.handleKeyUp.bind(this))
    window.addEventListener("mousemove", this.handleMouseMove.bind(this))
    window.addEventListener("mousedown", this.handleMouseDown.bind(this))
    window.addEventListener("mouseup", this.handleMouseUp.bind(this))
  }

  handleKeyDown(e: KeyboardEvent): void {
    this.keys[e.key] = true
  }
  handleKeyUp(e: KeyboardEvent): void {
    this.keys[e.key] = false
  }
  handleMouseMove(e: MouseEvent): void {
    this.mousePos = new Vec2(e.clientX, e.clientY)
  }
  handleMouseDown(): void {
    this.mouseDown = true
  }
  handleMouseUp(): void {
    this.mouseDown = false
  }

  update(): void {
    if (this.mouseDown && !this.mousePos.equals(this.lastMousePos)) {
      const coords = this.mousePos.sub(this.camera.offset)
      this.liveSocket.sendGameAction({
        type: GameActionType.setTargetPos,
        payload: {
          objectType: GameObjectType.Player,
          objectId: this.playerId,
          data: coords,
        },
      })
      this.lastMousePos = this.mousePos
      //this.playerStore.objects[0].getComponent(Mover)?.setTarget(coords)
    }
    this.playerStore.update()
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
          .getComponent(Mover)!
          .setTarget(
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
