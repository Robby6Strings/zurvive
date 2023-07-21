import { Player } from "../../shared/gameObjects"
import { ServerGame } from "../game/serverGame"

export class GameService {
  static games: Map<string, ServerGame> = new Map<string, ServerGame>()

  public static newGame(...players: Player[]) {
    const game = new ServerGame(players)
    GameService.games.set(game.id, game)
    return game
  }
}
