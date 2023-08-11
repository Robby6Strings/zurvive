import { ISerializable } from "./serializable"

export enum ItemType {
  Unset,
  Weapon,
  Helmet,
  Gloves,
  Armor,
  Boots,
  Belt,
  Ring,
}

export class Item implements ISerializable {
  id: string
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
    this.type = data.type
    this.itemData = data.itemData
    return this
  }
}
