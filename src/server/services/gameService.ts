import { ServerGame } from "../game/serverGame"

export class GameService {
  static games: Map<string, ServerGame> = new Map<string, ServerGame>()

  public static newGame() {
    const game = new ServerGame()
    GameService.games.set(game.id, game)
    return game
  }

  public static getGame(id: string) {
    return GameService.games.get(id)
  }
}
