import { ServerGame } from "../game/serverGame"
import { ServerPlayer } from "../game/serverPlayer"

export class GameService {
  static games: Map<string, ServerGame> = new Map<string, ServerGame>()

  public static newGame(...players: ServerPlayer[]) {
    const game = new ServerGame()
    players.forEach((p) => game.playerStore.add(p))
    GameService.games.set(game.id, game)
    return game
  }

  public static getGame(id: string) {
    return GameService.games.get(id)
  }
}
