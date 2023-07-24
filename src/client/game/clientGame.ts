import { Game } from "../../shared/game"
import { GameObject, GameObjectType } from "../../shared/gameObject"
import { GameActionType, GameAction } from "../../shared/gameAction"
import { Mover } from "../../shared/components/mover"
import { Renderer } from "./renderer"
import { Camera } from "./camera"
import { Vec2 } from "../../shared/vec2"
import { LiveSocket } from "../liveSocket"

export class ClientGame extends Game {
  playerId: string = ""
  liveSocket: LiveSocket
  camera: Camera
  renderer: Renderer
  intervalRef: number
  mousePos: Vec2 = new Vec2(0, 0)
  lastMousePos: Vec2 = new Vec2(0, 0)
  mouseDown: boolean = false
  keys: {
    [key: string]: boolean
  } = {}
  constructor(serializedGameState: any, liveSocket: LiveSocket) {
    super()
    this.liveSocket = liveSocket
    const { id, objects } = serializedGameState
    this.id = id
    console.log("game id", this.id)
    this.objectStore.deserialize(objects)
    this.camera = new Camera()
    this.renderer = new Renderer()
    this.intervalRef = window.setInterval(() => {
      this.update()
      this.renderer.render(this, this.camera)
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
      const coords = this.mousePos.subtract(this.camera.offset)
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
    //this.playerStore.update()
    //this.enemyStore.update()
    // for (const player of this.playerStore.objects) {
    //   console.log(player.id, player.pos)
    // }
  }

  onUpdated(): void {}

  updateObject<T extends GameObjectType>(object: {
    id: string
    type: T
    properties: Partial<GameObject>
  }) {
    const obj = this.objectStore.find(
      (o) => o.id === object.id && o.type === object.type
    )
    if (!obj) {
      return
    }
    for (const key in object.properties) {
      if (["id", "type"].includes(key)) {
        continue
      }
      if (key === "pos" && object.properties.pos) {
        obj.pos = Vec2.fromObject(object.properties.pos)
        continue
      }
    }
  }

  handleAction<T extends GameActionType>(action: GameAction<T>): void {
    const obj = this.objectStore.find(
      (o) =>
        o.id === action.payload.objectId && o.type === action.payload.objectType
    )
    if (!obj) {
      return
    }

    switch (action.type) {
      case GameActionType.setTargetPos:
        let targetPos = (action as GameAction<GameActionType.setTargetPos>)
          .payload.data
        if (typeof targetPos === "string")
          targetPos = Vec2.fromObject(JSON.parse(targetPos))

        obj.getComponent(Mover)!.setTargetPos(targetPos)
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
