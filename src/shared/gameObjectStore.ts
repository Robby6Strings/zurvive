import { GameObject, GameObjectType } from "./gameObject"

export class GameObjectStore<T extends GameObjectType> {
  constructor(public objects: GameObject<T>[] = []) {}
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
}
