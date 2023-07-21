import { FastifyRequest } from "fastify"

import { SocketStream } from "@fastify/websocket"
import { ErrorMessage, MessageType } from "../shared/message"
import { GameService } from "./services/gameService"
import { PlayerService } from "./services/playerService"
import { ServerGame } from "./game/serverGame"

export const socketHandler = (conn: SocketStream, _req: FastifyRequest) => {
  conn.setEncoding("utf8")
  let game: ServerGame | undefined = undefined
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
        game = GameService.newGame()
        game.addPlayer(player)
        conn.socket.send(
          JSON.stringify({
            type: MessageType.gameState,
            gameState: game.serialize(),
          })
        )
        break

      case MessageType.joinGame:
        console.log("join game", data.gameId)
        game = GameService.getGame(data.gameId)
        if (!game) {
          conn.socket.send(
            JSON.stringify({
              type: MessageType.error,
              error: ErrorMessage.gameNotFound,
            })
          )
          return
        }
        game.addPlayer(player)
        conn.socket.send(
          JSON.stringify({
            type: MessageType.gameState,
            gameState: game.serialize(),
          })
        )
        game.broadcastPlayer(player)
        break

      case MessageType.action:
        game?.handleAction(data.action)
        game?.broadcastAction(data.action)
      default:
        break
    }
  })
}
