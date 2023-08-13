import { GameObjectType } from "./gameObject"
import { IVec2 } from "./vec2"

export enum ErrorMessage {
  gameNotFound = "game not found",
  characterNotFound = "character not found",
  forbidden = "forbidden",
}

export enum MessageType {
  ping = "ping",
  auth = "auth",
  newUser = "new-user",
  selectUser = "select-user",
  newCharacter = "new-character",
  selectCharacter = "select-character",
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
  players = "players",
}
export type TypedMessage<T extends GameActionType | undefined> = {
  type: MessageType
  action?: GameAction<T extends GameActionType ? T : GameActionType.unset>
  gameState?: string
  error?: ErrorMessage
  object?: any
  userId?: string
  name?: string
  changes?: TypedMessage<GameActionType>[]
  items?: any[]
  data?: any
  players?: any[]
}

export enum GameActionType {
  unset,
  setTargetPos = "set-target",
  setTargetObj = "set-target-obj",
  attack = "attack",
  move = "move",
  interact = "interact",
  takeDamage = "take-damage",
  heal = "heal",
  exp = "exp",
  chooseBonus = "choose-bonus",
}

type GameActionData<T extends GameActionType> =
  T extends GameActionType.setTargetPos
    ? IVec2 | null
    : T extends GameActionType.setTargetObj
    ? string
    : T extends GameActionType.attack | GameActionType.move
    ? IVec2
    : T extends GameActionType.interact
    ? boolean
    : T extends GameActionType.takeDamage | GameActionType.heal
    ? number
    : T extends GameActionType.exp
    ? {
        level: number
        experience: number
        souls: number
      }
    : T extends GameActionType.chooseBonus
    ? {
        id: string
        bonusId: number
      }
    : never

export type GameAction<T extends GameActionType> = {
  type: T
  payload: {
    objectType: GameObjectType
    objectId: string
    data: GameActionData<T>
  }
}
