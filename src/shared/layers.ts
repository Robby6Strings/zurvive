import { GameObjectType } from "./gameObject"

export enum CollisionLayer {
  Background,
  Environment,
  Player = GameObjectType.Player,
  Enemy = GameObjectType.Enemy,
}
