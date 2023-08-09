import { GameObjectType } from "./gameObject"
import { IVec2 } from "./vec2"

export enum GameActionType {
  unset,
  setTargetPos = "set-target",
  setTargetObj = "set-target-obj",
  attack = "attack",
  move = "move",
  interact = "interact",
  takeDamage = "take-damage",
  heal = "heal",
}

type GameActionData<T extends GameActionType> =
  T extends GameActionType.setTargetPos
    ? IVec2 | null
    : T extends GameActionType.setTargetObj
    ? string
    : T extends GameActionType.attack
    ? IVec2
    : T extends GameActionType.move
    ? IVec2
    : T extends GameActionType.interact
    ? boolean
    : T extends GameActionType.takeDamage
    ? number
    : never

export type GameAction<T extends GameActionType> = {
  type: T
  payload: {
    objectType: GameObjectType
    objectId: string
    data: GameActionData<T>
  }
}
