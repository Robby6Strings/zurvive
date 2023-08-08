import { GameObjectType } from "../gameObject"
import { Bullet } from "./bullet"
import { Player, Enemy } from "./entities"
import { Tree } from "./environment/tree"
import { Spawner } from "./spawner"

export const getClassRefFromType = (type: GameObjectType) => {
  switch (type) {
    case GameObjectType.Player:
      return Player
    case GameObjectType.Enemy:
      return Enemy
    case GameObjectType.Spawner:
      return Spawner
    case GameObjectType.Tree:
      return Tree
    case GameObjectType.Bullet:
      return Bullet
    default:
      throw new Error(`Unknown object type ${type}`)
  }
}

export const newInstanceOfType = (type: GameObjectType) => {
  const classRef = getClassRefFromType(type)
  return new classRef()
}
