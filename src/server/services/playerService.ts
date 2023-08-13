import { ServerPlayer } from "../game/serverPlayer"
import { User } from "./userService"

export class PlayerService {
  static players: ServerPlayer[] = []

  public static newCharacter(user: User, name: string) {
    const player = new ServerPlayer(user.id, name)
    PlayerService.players.push(player)
    return player
  }

  static findPlayer(user: User, id: string) {
    return PlayerService.players.find(
      (p) => p.id === id && p.userId === user.id
    )
  }

  static removePlayer(player: ServerPlayer) {
    const index = PlayerService.players.indexOf(player)
    if (index !== -1) {
      PlayerService.players.splice(index, 1)
    }
  }

  static getUserPlayers(user: User) {
    return PlayerService.players.filter((p) => p.userId === user.id)
  }
}
