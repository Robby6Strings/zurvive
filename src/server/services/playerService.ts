import { Player } from "../../shared/gameObjects"

export class PlayerService {
  static players: Map<string, Player> = new Map<string, Player>()

  public static newPlayer(socketId: string) {
    const player = new Player()
    PlayerService.players.set(socketId, player)
    return player
  }
}
