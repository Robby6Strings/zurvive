import { GameActionType } from "./gameAction"
import { GameObject, GameObjectType } from "./gameObject"
import { newInstanceOfType } from "./gameObjects"
import { MessageType, TypedMessage } from "./message"
import { Vec2 } from "./vec2"

export class GameObjectStore {
  constructor(public objects: GameObject[] = []) {}
  add(object: GameObject) {
    if (this.find(object.id)) return
    this.objects.push(object)
  }
  update() {
    for (const obj of this.objects) {
      obj.update()
    }
  }

  updateById(id: string, data: Partial<GameObject>) {
    const object = this.find(id)
    if (object) Object.assign(object, data)
  }

  remove(object: GameObject) {
    this.objects = this.objects.filter((o) => o.id !== object.id)
  }
  removeById(id: string) {
    const object = this.find(id)
    if (object) object.remove = true
    this.removeFlagged()
  }

  removeFlagged() {
    this.objects = this.objects.filter((o) => !o.remove)
  }
  find(idOrPredicate: string | { (o: GameObject): boolean }) {
    if (typeof idOrPredicate === "string") {
      return this.objects.find((o) => o.id === idOrPredicate)
    }
    return this.objects.find(idOrPredicate)
  }

  findByObjectType<T extends GameObject>(objectType: GameObjectType) {
    return this.objects.filter((o) => o.type === objectType) as T[]
  }

  filter(predicate: { (o: GameObject): boolean }) {
    return this.objects.filter(predicate)
  }

  forEach(callback: { (o: GameObject): void }) {
    for (const obj of this.objects) {
      callback(obj)
    }
  }

  getChanges(): TypedMessage<undefined | GameActionType>[] {
    let changes: TypedMessage<undefined | GameActionType>[] = []
    for (let i = 0; i < this.objects.length; i++) {
      const obj = this.objects[i]
      if (obj.new) {
        obj.new = false
        changes.push({
          type: MessageType.newObject,
          object: obj.serialize(),
        })
      } else if (obj.remove) {
        changes.push({
          type: MessageType.removeObject,
          object: {
            type: obj.type,
            id: obj.id,
          },
        })
      } else if (obj.posChanged) {
        obj.lastPos = obj.pos.clone()
        changes.push({
          type: MessageType.updateObject,
          object: {
            type: obj.type,
            id: obj.id,
            properties: {
              pos: Vec2.serialize(obj.pos),
            },
          },
        })
      }
      // for (const component of obj.components) {
      //   switch (component.type) {
      //     case ComponentType.Mover:
      //       const mover = component as Mover
      //       if (mover.targetPosChanged) {
      //         mover.targetPosChanged = false
      //         changes.push({
      //           type: MessageType.action,
      //           action: {
      //             type: GameActionType.setTargetPos,
      //             payload: {
      //               objectType: obj.type,
      //               objectId: obj.id,
      //               data: mover.targetPos
      //                 ? Vec2.serialize(mover.targetPos)
      //                 : null,
      //             },
      //           },
      //         })
      //       }
      //       break
      //   }
      // }
    }
    return changes
  }

  serialize() {
    return this.objects.map((o) => o.serialize())
  }
  deserialize(data: any) {
    this.objects = data.map((obj: any) =>
      newInstanceOfType(obj.type).deserialize(obj)
    )
  }
}
