import { GameObjectType } from "./gameObject"
import { IVec2 } from "./vec2"

export enum GameActionType {
  unset,
  setTargetPos,
  setTargetObj,
  attack,
  interact,
  takeDamage,
}

type GameActionData<T extends GameActionType> =
  T extends GameActionType.setTargetPos
    ? IVec2
    : T extends GameActionType.setTargetObj
    ? string
    : T extends GameActionType.attack
    ? boolean
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
