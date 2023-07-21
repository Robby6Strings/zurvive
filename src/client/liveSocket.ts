import { Signal, createSignal } from "cinnabun"
import { ClientGame } from "./game/clientGame"
import { MessageType, TypedMessage } from "../shared/message"
import { GameAction, GameActionType } from "../shared/gameAction"

export class LiveSocket {
  socket: any
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
        this.socket.send(JSON.stringify({ type: "ping" }))
      }, 1000)
    }

    this.load()
  }

  private async load() {
    // const res = await getChatMessages()
    // if (res.error) return
    //this.state.value = res.data
  }

  private handleMessage<T extends GameActionType>(message: TypedMessage<T>) {
    if (message.type === MessageType.ping) return

    this.gameState.value?.handleAction(message.action as GameAction<T>)
  }
}
