import { GameObjectType } from "./gameObject"

export enum CollisionLayer {
  Background = "bg",
  Environment = "env",
  Player = GameObjectType.Player,
  Enemy = GameObjectType.Enemy,
}
