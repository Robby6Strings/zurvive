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
  newObject = "new-object",
  removeObject = "remove-object",
  update = "update",
  updateObject = "update-object",
  items = "items",
  bonusSet = "bonus-set",
}
export type TypedMessage<T extends GameActionType | undefined> = {
  type: MessageType
  action?: GameAction<T extends GameActionType ? T : GameActionType.unset>
  gameState?: string
  error?: ErrorMessage
  object?: any
  playerId?: string
  changes?: TypedMessage<GameActionType>[]
  items?: any[]
  data?: any
}
