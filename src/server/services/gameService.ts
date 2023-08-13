import { ServerGame } from "../game/serverGame"
import { ServerPlayer } from "../game/serverPlayer"
import { MessageType } from "../../shared/message"
import { User } from "./userService"

export class GameService {
  static games: Map<string, ServerGame> = new Map<string, ServerGame>()
  static lobbyGame: ServerGame = new ServerGame()

  public static newGame() {
    const game = new ServerGame()
    GameService.games.set(game.id, game)
    return game
  }

  public static getGame(id: string) {
    return GameService.games.get(id)
  }

  public static removeGame(id: string) {
    return GameService.games.delete(id)
  }

  public static JoinLobby(player: ServerPlayer, user: User) {
    this.lobbyGame.addPlayer(player)
    user.send({
      type: MessageType.selectCharacter,
      object: player.serialize(),
    })
    user.send({
      type: MessageType.gameState,
      gameState: GameService.lobbyGame.serialize(),
    })
  }
}
