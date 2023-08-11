import { ISerializable } from "./serializable"

export enum ItemType {
  Weapon,
  // Helmet,
  // Gloves,
  // Armor,
  // Boots,
  // Belt,
  // Ring,
}

export class Item implements ISerializable {
  id: string
  name?: string
  description?: string
  itemData: any
  constructor(public type: ItemType) {
    this.id = Math.random().toString(36).substring(2, 9)
  }

  serialize(): Object {
    return {
      id: this.id,
      type: this.type,
      itemData: this.itemData,
    }
  }
  deserialize(data: any): Item {
    this.id = data.id
    this.itemData
    return this
  }
}
