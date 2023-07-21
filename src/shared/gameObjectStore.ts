import { GameObject, GameObjectType } from "./gameObject"
import { Enemy, Player } from "./gameObjects"

export class GameObjectStore<T extends GameObjectType> {
  constructor(
    public objectType: GameObjectType,
    public objects: GameObject<T>[] = []
  ) {}
  add(object: GameObject<T>) {
    this.objects.push(object)
  }
  remove(object: GameObject<T>) {
    this.objects = this.objects.filter((o) => o.id !== object.id)
  }
  update(removeFlagged: boolean = true) {
    this.objects.forEach((o) => o.update())
    if (removeFlagged) this.removeFlagged()
  }

  updateById(id: string, data: Partial<GameObject<T>>) {
    const object = this.get(id)
    if (object) Object.assign(object, data)
  }

  removeFlagged() {
    this.objects = this.objects.filter((o) => !o.remove)
  }
  get(id: string) {
    return this.objects.find((o) => o.id === id)
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
