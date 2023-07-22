import { FastifyRequest } from "fastify"

import { SocketStream } from "@fastify/websocket"
import { ErrorMessage, MessageType } from "../shared/message"
import { GameService } from "./services/gameService"
import { PlayerService } from "./services/playerService"
import { ServerGame } from "./game/serverGame"
import { Mover } from "../shared/components/mover"

export const socketHandler = (conn: SocketStream, _req: FastifyRequest) => {
  conn.setEncoding("utf8")
  let game: ServerGame | undefined = undefined
  const player = PlayerService.newPlayer(conn)
  player.pos = player.pos.add({ x: 100, y: 100 })
  player.getComponent(Mover)!.setTargetPos(player.pos)
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
        conn.socket.send(
          JSON.stringify({
            type: MessageType.gameState,
            gameState: game.serialize(),
          })
        )
        game.addObject(player)

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
        game.addObject(player)
        conn.socket.send(
          JSON.stringify({
            type: MessageType.gameState,
            gameState: game.serialize(),
          })
        )
        break

      case MessageType.action:
        game?.handleAction(data.action)
        break

      default:
        break
    }
  })
  conn.on("end", () => {
    console.log("ending connection")
    player.remove = true
  })
}
