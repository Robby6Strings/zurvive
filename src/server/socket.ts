import { FastifyRequest } from "fastify"

import { SocketStream } from "@fastify/websocket"
import { MessageType } from "../shared/message"
import { GameService } from "./services/gameService"
import { PlayerService } from "./services/playerService"

export const socketHandler = (conn: SocketStream, _req: FastifyRequest) => {
  conn.setEncoding("utf8")
  console.log("socket connected")
  conn.on("data", (chunk) => {
    const data = JSON.parse(chunk)

    switch (data.type) {
      case MessageType.ping:
        conn.socket.send(JSON.stringify({ type: "ping" }))
        return
      case MessageType.newGame:
        console.log("new game")
        const player = PlayerService.newPlayer(conn.socket.id)
        const game = GameService.newGame(player)
        conn.socket.send(
          JSON.stringify({
            type: MessageType.gameState,
            gameState: game.serialize(),
          })
        )
        return
      default:
    }
  })
}
