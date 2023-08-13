import { Signal, createSignal } from "cinnabun"
import { ClientGame } from "./game/clientGame"
import {
  MessageType,
  TypedMessage,
  GameAction,
  GameActionType,
} from "../shared/message"
import { newInstanceOfType } from "../shared/gameObjects"
import { loadImages } from "./images"
import { auth, characters } from "./state"
import { Player } from "../shared/gameObjects/entities"

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
      if (!data) return console.error("received invalid message")
      if (typeof data !== "object")
        return console.error("received invalid message", data)
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

  public authenticate(name: string) {
    this.socket.send(JSON.stringify({ type: MessageType.selectUser, name }))
  }

  public newCharacter(name: string) {
    this.socket.send(JSON.stringify({ type: MessageType.newCharacter, name }))
  }

  public selectCharacter(id: string) {
    const character = characters.value.find((c) => c.id === id)
    if (!character) return
    character.selected = true
    this.socket.send(JSON.stringify({ type: MessageType.selectCharacter, id }))
  }

  private handleMessage<T extends GameActionType>(message: TypedMessage<T>) {
    switch (message.type) {
      case MessageType.auth:
        auth.value = {
          id: message.userId!,
          name: message.name!,
        }
        console.log("auth", auth.value)
        break
      case MessageType.selectCharacter:
        console.log("selectCharacter", message.object)
        const character = characters.value.find(
          (c) => c.id === message.object.id
        )
        if (!character) {
          characters.value.push(
            Object.assign(new Player().deserialize(message.object), {
              selected: true,
              name: message.object.name,
            })
          )
        } else {
          character.selected = true
        }
        characters.notify()
        this.gameState.notify()
        break
      case MessageType.gameState:
        console.log("gameState", message.gameState)
        this.gameState.value = new ClientGame(message.gameState as any, this)
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
      case MessageType.players:
        for (const player of message.players ?? []) {
          characters.value.push(
            Object.assign(new Player().deserialize(player), {
              name: player.name,
            })
          )
        }
        characters.notify()
        //characters.value = message.players!
        console.log("players", characters.value)
        break
      default:
        return
    }
  }
}
