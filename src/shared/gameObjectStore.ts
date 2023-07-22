import { ComponentType } from "./component"
import { Mover } from "./components/mover"
import { GameActionType } from "./gameAction"
import { GameObject, GameObjectType } from "./gameObject"
import { Enemy, Player } from "./gameObjects"
import { MessageType, TypedMessage } from "./message"
import { Vec2 } from "./vec2"

export class GameObjectStore<T extends GameObjectType> {
  constructor(
    public objectType: GameObjectType,
    public objects: GameObject<T>[] = []
  ) {}
  add(object: GameObject<T>) {
    if (this.get(object.id)) return
    this.objects.push(object)
  }
  update() {
    this.objects.forEach((o) => o.update())
  }

  updateById(id: string, data: Partial<GameObject<T>>) {
    const object = this.get(id)
    if (object) Object.assign(object, data)
  }

  remove(object: GameObject<T>) {
    this.objects = this.objects.filter((o) => o.id !== object.id)
  }
  removeById(id: string) {
    const object = this.get(id)
    if (object) object.remove = true
    this.removeFlagged()
  }

  removeFlagged() {
    this.objects = this.objects.filter((o) => !o.remove)
  }
  get(id: string) {
    return this.objects.find((o) => o.id === id)
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
        obj.posChanged = false
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
      for (const component of obj.components) {
        switch (component.type) {
          case ComponentType.Mover:
            const mover = component as Mover
            if (mover.targetPosChanged) {
              mover.targetPosChanged = false
              changes.push({
                type: MessageType.action,
                action: {
                  type: GameActionType.setTargetPos,
                  payload: {
                    objectType: obj.type,
                    objectId: obj.id,
                    data: mover.targetPos
                      ? Vec2.serialize(mover.targetPos)
                      : null,
                  },
                },
              })
            }
            break
        }
      }
    }
    return changes
  }

  serialize() {
    return JSON.stringify({
      objectType: this.objectType,
      objects: this.objects.map((o) => o.serialize()),
    })
  }
  deserialize(data: string) {
    const parsed = JSON.parse(data)
    this.objectType = parsed.objectType
    this.objects = parsed.objects.map((d: any) => {
      const parsed = JSON.parse(d)
      switch (parsed.type) {
        case GameObjectType.Player:
          const obj = new Player()
          obj.deserialize(parsed)
          return obj
        case GameObjectType.Enemy:
          const obj2 = new Enemy()
          obj2.deserialize(parsed)
          return obj2
        default:
          throw new Error(`Unknown object type ${parsed.type}`)
      }
    })
  }
}
