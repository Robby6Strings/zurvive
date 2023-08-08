import { GameObjectStore } from "./gameObjectStore"
import { GameActionType, GameAction } from "./gameAction"
import { GameObject, GameObjectType } from "./gameObject"
import { CollisionLayer } from "./layers"
import { Collider } from "./components/collider"
import { Bullet } from "./gameObjects/bullet"

export abstract class Game {
  frameDuration: number = 1000 / 60
  id: string = Math.random().toString(36).substring(7)
  objectStore: GameObjectStore = new GameObjectStore()

  static objectToCollisionLayerMap: Map<GameObjectType, CollisionLayer[]> =
    new Map([
      [
        GameObjectType.Player,
        [
          CollisionLayer.Player,
          CollisionLayer.Enemy,
          CollisionLayer.Environment,
        ],
      ],
      [
        GameObjectType.Enemy,
        [
          CollisionLayer.Player,
          CollisionLayer.Enemy,
          CollisionLayer.Environment,
          CollisionLayer.PlayerBullet,
        ],
      ],
      [
        GameObjectType.Bullet,
        [CollisionLayer.Enemy, CollisionLayer.Environment],
      ],
    ])

  handleCollisions() {
    for (const objA of this.objectStore.objects) {
      const collidableLayers = Game.objectToCollisionLayerMap.get(objA.type)
      if (!collidableLayers) continue
      for (const objB of this.objectStore.objects) {
        if (objA === objB) continue
        if (
          !collidableLayers.find((layer) =>
            objB.collisionLayers.includes(layer)
          )
        )
          continue
        const collision = Collider.checkCollision(objA, objB)
        if (!collision) continue

        objA.pos = objA.pos.add(collision.dir.multiply(collision.depth / 2))
        if (objA instanceof Bullet || objB instanceof Bullet) {
          const other = objA instanceof Bullet ? objB : objA
          const bullet = (objA instanceof Bullet ? objA : objB) as Bullet
          if (other && !(other instanceof Bullet)) {
            other.vel = other.vel.add(
              bullet.vel.multiply(
                ((collision.depth / 2) * bullet.config.weight) / 100
              )
            )
          }
        }
      }
    }
  }

  abstract handleAction<T extends GameActionType>(action: GameAction<T>): void
  public onUpdated(): void {
    this.objectStore.removeFlagged()
  }

  update(): void {
    this.objectStore.update()
    this.onUpdated()
  }

  addObject(object: GameObject) {
    this.objectStore.add(object)
  }

  removeObject<T extends GameObjectType>({ id }: { id: string; type: T }) {
    this.objectStore.removeById(id)
  }

  serialize(): Object {
    return {
      id: this.id,
      objects: this.objectStore.serialize(),
    }
  }
}
