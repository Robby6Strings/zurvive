import { SocketStream } from "@fastify/websocket"
import { ServerPlayer } from "../game/serverPlayer"

export class PlayerService {
  static players: Map<SocketStream, ServerPlayer> = new Map<
    SocketStream,
    ServerPlayer
  >()

  public static newPlayer(conn: SocketStream) {
    const player = new ServerPlayer(conn)
    PlayerService.players.set(conn, player)
    return player
  }
}
