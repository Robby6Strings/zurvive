import { GameObjectType } from "./gameObject"

export enum CollisionLayer {
  Background,
  Environment,
  PlayerBullet,
  EnemyBullet,
  Player = GameObjectType.Player,
  Enemy = GameObjectType.Enemy,
}
