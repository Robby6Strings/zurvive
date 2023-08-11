import { SocketStream } from "@fastify/websocket"
import { Player } from "../../shared/gameObjects/entities"
import { Health } from "../../shared/components/health"

export class ServerPlayer extends Player {
  conn: SocketStream
  constructor(conn: SocketStream) {
    super()
    this.conn = conn
    const health = this.getComponent(Health)
    health!.onKilled = (health) => {
      health.currentHealth = health.maxHealth
      return false
    }
    health!.regenAmount = 1
  }
}
