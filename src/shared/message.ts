import { GameAction, GameActionType } from "./gameAction"

export enum MessageType {
  ping = "ping",
  newGame = "new-game",
  action = "action",
  gameState = "game-state",
}
export type TypedMessage<T extends GameActionType | undefined> = {
  type: MessageType
  action?: GameAction<T extends GameActionType ? T : GameActionType.unset>
  gameState?: string
}
