import { SocketStream } from "@fastify/websocket"
import { Player } from "../../shared/gameObjects"

export class ServerPlayer extends Player {
  conn: SocketStream
  constructor(conn: SocketStream) {
    super()
    this.conn = conn
  }
}
