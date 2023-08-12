import { Signal, createSignal } from "cinnabun"
import { ClientGame } from "./game/clientGame"
import { MessageType, TypedMessage } from "../shared/message"
import { GameAction, GameActionType } from "../shared/gameAction"
import { newInstanceOfType } from "../shared/gameObjects"
import { loadImages } from "./images"

export class LiveSocket {
  socket: any
  authId: string = ""
  _connected: Signal<boolean> = createSignal<boolean>(false)
  get connected() {
    return this._connected.value
  }
  set connected(value: boolean) {
    if (this._connected.value !== value) this._connected.value = value
  }
  public gameState: Signal<ClientGame | null> = createSignal<ClientGame | null>(
    null
  )
  get game(): ClientGame | null {
    return this.gameState.value
  }

  constructor() {
    loadImages(() => {
      this.connect()
    })
  }

  private async connect() {
    const { hostname, port, protocol } = window.location
    console.log("connecting to", hostname, port, protocol)
    this.socket = new WebSocket(
      `${protocol === "https:" ? "wss" : "ws"}://${hostname}:${port}/ws`
    )
    this.socket.onmessage = (msg: any) => {
      const data = JSON.parse(msg.data)
      if (!("type" in data)) throw new Error("received invalid message")
      this.handleMessage(data)
    }
    this.socket.onopen = () => {
      setInterval(() => {
        if (this.socket.readyState !== this.socket.OPEN) {
          this.connected = false
          return
        }
        this.connected = true
        this.socket.send(JSON.stringify({ type: MessageType.ping }))
      }, 1000)
    }
  }

  public sendGameAction<T extends GameActionType>(action: GameAction<T>) {
    this.socket.send(JSON.stringify({ type: MessageType.action, action }))
  }

  public newGame() {
    this.socket.send(JSON.stringify({ type: MessageType.newGame }))
  }

  public joinGame(gameId: string) {
    this.socket.send(JSON.stringify({ type: MessageType.joinGame, gameId }))
  }

  private handleMessage<T extends GameActionType>(message: TypedMessage<T>) {
    switch (message.type) {
      case MessageType.auth:
        this.authId = message.playerId ?? ""
        if (this.authId && this.game) {
          this.game.playerId = this.authId
          this.gameState.notify()
        }
        break

      case MessageType.gameState:
        this.gameState.value = new ClientGame(message.gameState as any, this)
        if (this.authId) {
          this.gameState.value.playerId = this.authId
          this.gameState.notify()
        }
        break

      case MessageType.action:
        this.game?.handleAction(message.action as GameAction<T>)
        break

      case MessageType.newObject:
        try {
          this.game?.addObject(
            newInstanceOfType(message.object.type).deserialize(message.object)
          )
        } catch (error) {
          console.error("Failed to add object", message.object, error)
        }
        break
      case MessageType.removeObject:
        this.game?.removeObject(message.object)
        break
      case MessageType.updateObject:
        this.game?.updateObject(message.object)
        break

      case MessageType.update:
        const changes = message.changes as TypedMessage<
          GameActionType | undefined
        >[]
        for (const change of changes) {
          this.handleMessage(change as TypedMessage<GameActionType>)
        }
        break

      case MessageType.error:
        console.error(message.error)
        break
      case MessageType.items:
        console.log("items", message)
        break
      case MessageType.bonusSet:
        console.log("bonusSet", message)
        this.game?.getPlayer()?.bonusSets.set(message.data.id, message.data)
        this.gameState.notify()
        break
      default:
        return
    }
  }
}
