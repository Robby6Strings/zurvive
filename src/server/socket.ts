import { FastifyRequest } from "fastify"

import { SocketStream } from "@fastify/websocket"
import { ErrorMessage, MessageType } from "../shared/message"
import { GameService } from "./services/gameService"
import { PlayerService } from "./services/playerService"
import { ServerGame } from "./game/serverGame"
type ConnGameRef = {
  __game?: ServerGame
}
export const socketHandler = (
  conn: SocketStream & ConnGameRef,
  _req: FastifyRequest
) => {
  conn.setEncoding("utf8")
  const player = PlayerService.newPlayer(conn)
  conn.socket.send(
    JSON.stringify({ type: MessageType.auth, playerId: player.id })
  )

  conn.on("data", (chunk) => {
    const data = JSON.parse(chunk)

    switch (data.type) {
      case MessageType.ping:
        conn.socket.send(JSON.stringify({ type: MessageType.ping }))
        break
      case MessageType.newGame:
        conn.__game = GameService.newGame()
        conn.__game.addPlayer(player)
        conn.socket.send(
          JSON.stringify({
            type: MessageType.gameState,
            gameState: conn.__game.serialize(),
          })
        )
        break
      case MessageType.joinGame:
        console.log("join game", data.gameId)
        const game = GameService.getGame(data.gameId)
        if (!game) {
          conn.socket.send(
            JSON.stringify({
              type: MessageType.error,
              error: ErrorMessage.gameNotFound,
            })
          )
          return
        }
        conn.__game = game
        game.addPlayer(player)
        conn.socket.send(
          JSON.stringify({
            type: MessageType.gameState,
            gameState: conn.__game.serialize(),
          })
        )
        conn.__game.broadcastPlayer(player)
        break

      case MessageType.action:
        conn.__game!.handleAction(data.action)
        conn.__game!.broadcastAction(data.action)
      default:
    }
  })
}
