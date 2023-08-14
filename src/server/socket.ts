import { FastifyRequest } from "fastify"

import { SocketStream } from "@fastify/websocket"
import { ErrorMessage, MessageType } from "../shared/message"
import { GameService } from "./services/gameService"
import { PlayerService } from "./services/playerService"
import { ServerGame } from "./game/serverGame"
import { User, AccountService } from "./services/userService"
import { ServerPlayer } from "./game/serverPlayer"

const forbidden = (conn: SocketStream) => {
  conn.socket.send(
    JSON.stringify({
      type: MessageType.error,
      error: ErrorMessage.forbidden,
    })
  )
}

const gameNotFound = (conn: SocketStream) => {
  conn.socket.send(
    JSON.stringify({
      type: MessageType.error,
      error: ErrorMessage.gameNotFound,
    })
  )
}

const noCharacter = (conn: SocketStream) => {
  conn.socket.send(
    JSON.stringify({
      type: MessageType.error,
      error: ErrorMessage.characterNotFound,
    })
  )
}
export const socketHandler = (conn: SocketStream, _req: FastifyRequest) => {
  conn.setEncoding("utf8")
  let game: ServerGame | undefined = undefined
  let user: User | undefined
  let player: ServerPlayer | undefined

  conn.on("data", (chunk) => {
    const data = JSON.parse(chunk)

    switch (data.type) {
      case MessageType.selectUser:
        user =
          AccountService.getByName(conn, data.name) ??
          AccountService.add(conn, data.name)

        user.send({ type: MessageType.auth, userId: user.id, name: user.name })
        const players = PlayerService.getUserPlayers(user).map((p) =>
          p.serialize()
        )
        user.send({
          type: MessageType.players,
          players,
        })
        break

      case MessageType.newUser:
        user = AccountService.add(conn, data.name)
        user.send({ type: MessageType.auth, userId: user.id })
        break
      case MessageType.newCharacter:
        if (!user) return forbidden(conn)
        player = PlayerService.newCharacter(user, data.name)
        game = GameService.lobbyGame
        GameService.JoinLobby(player, user)
        break
      case MessageType.selectCharacter:
        if (!user) return forbidden(conn)
        const _player = PlayerService.findPlayer(user, data.id)
        if (!_player) {
          conn.socket.send(
            JSON.stringify({
              type: MessageType.error,
              error: ErrorMessage.characterNotFound,
            })
          )
          return
        }
        player = _player
        player.remove = false
        game = GameService.lobbyGame
        GameService.JoinLobby(player, user)
        break
      case MessageType.ping:
        conn.socket.send(JSON.stringify({ type: MessageType.ping }))
        break

      case MessageType.newGame:
        if (!user) return forbidden(conn)
        if (!player) return noCharacter(conn)
        game = GameService.newGame()
        game.addPlayer(player)
        user.send({
          type: MessageType.gameState,
          gameState: game.serialize(),
        })
        break

      case MessageType.joinGame:
        if (!user) return forbidden(conn)
        if (!player) return noCharacter(conn)

        game = GameService.getGame(data.gameId)
        if (!game) return gameNotFound(conn)
        game.addPlayer(player)
        user.send(
          JSON.stringify({
            type: MessageType.gameState,
            gameState: game.serialize(),
          })
        )
        break

      case MessageType.action:
        if (!user) return forbidden(conn)
        if (!player) return noCharacter(conn)
        if (!game) return gameNotFound(conn)
        game.handleAction(player, data.action)
        break

      default:
        break
    }
  })
  conn.on("end", () => {
    console.log("ending connection")
    if (player) {
      game?.removeObject(player)
      player.remove = false
    }
  })
}
