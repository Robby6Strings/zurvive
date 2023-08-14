import { GameObjectStore } from "./gameObjectStore"
import { GameActionType, GameAction } from "./message"
import { GameObject, GameObjectType } from "./gameObject"

export abstract class Game {
  frameDuration: number = 1000 / 60
  id: string = Math.random().toString(36).substring(7)
  objectStore: GameObjectStore = new GameObjectStore()

  abstract handleAction<T extends GameActionType>(action: GameAction<T>): void

  update(): void {
    this.objectStore.update()
    this.onUpdated()
  }

  public onUpdated(): void {
    this.objectStore.removeFlagged()
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
