import { Component, ComponentType } from "../component"
import { GameObject } from "../gameObject"
import { Item, ItemType } from "../item"

export class Inventory extends Component {
  items: Item[] = []
  equippedItems: string[] = []
  constructor() {
    super(ComponentType.Inventory, true)
  }
  getWeapon(): Item | undefined {
    return this.items.find((i) => i.type === ItemType.Weapon)
  }
  update(_obj: GameObject): void {
    return
  }

  addItem(item: Item): void {
    this.items.push(item)
  }

  removeItem(item: Item): void {
    this.items = this.items.filter((i) => i.id !== item.id)
  }

  deserialize(data: any): void {
    this.items = (data.items ?? []).map((item: any) =>
      new Item(item.type).deserialize(item)
    )
  }
  serialize(): Object {
    return {
      type: this.type,
      items: this.items.map((i) => i.serialize()),
    }
  }
}
