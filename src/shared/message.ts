import { GameAction, GameActionType } from "./gameAction"

export enum MessageType {
  ping = "ping",
  action = "action",
}
export type TypedMessage<T extends GameActionType | undefined> = {
  type: MessageType
  action?: GameAction<T extends GameActionType ? T : GameActionType.unset>
}
