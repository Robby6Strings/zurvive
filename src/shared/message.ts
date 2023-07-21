import { GameAction, GameActionType } from "./gameAction"

export enum ErrorMessage {
  gameNotFound = "game not found",
}

export enum MessageType {
  ping = "ping",
  auth = "auth",
  newGame = "new-game",
  joinGame = "join-game",
  action = "action",
  gameState = "game-state",
  error = "error",
  playerJoined = "player-joined",
}
export type TypedMessage<T extends GameActionType | undefined> = {
  type: MessageType
  action?: GameAction<T extends GameActionType ? T : GameActionType.unset>
  gameState?: string
  error?: ErrorMessage
  player?: any
  playerId?: string
}
