import { Signal, createSignal } from "cinnabun"
import { ClientGame } from "./game/clientGame"
import { MessageType, TypedMessage } from "../shared/message"
import { GameAction, GameActionType } from "../shared/gameAction"
import { Player } from "../shared/gameObjects"

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

  constructor() {
    const { hostname, port } = window.location
    this.socket = new WebSocket(`ws://${hostname}:${port}/ws`)
    this.socket.onmessage = (msg: any) => {
      try {
        const data = JSON.parse(msg.data)
        if (!("type" in data)) throw new Error("received invalid message")
        this.handleMessage(data)
      } catch (error) {
        console.error(error)
      }
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

    this.load()
  }

  private async load() {
    // const res = await getChatMessages()
    // if (res.error) return
    //this.state.value = res.data
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
        if (this.authId && this.gameState.value) {
          this.gameState.value.playerId = this.authId
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
        this.gameState.value?.handleAction(message.action as GameAction<T>)
        break
      case MessageType.playerJoined:
        const parsed = JSON.parse(message.player)
        const newPlayer = new Player()
        newPlayer.deserialize(parsed)
        this.gameState.value?.addPlayer(newPlayer)
        break
      case MessageType.error:
        console.error(message.error)
        break
      default:
        return
    }
  }
}
