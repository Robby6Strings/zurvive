import { ItemData } from "../../shared/constants"
import { Item, ItemType } from "../../shared/item"

export class ItemService {
  static generateItems(count: number, ...types: ItemType[]): Item[] {
    const res: Item[] = []
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * types.length)
      res.push(ItemService.generateItem(types[idx]))
    }
    return res
  }

  static generateItemsOfType(count: number, type: ItemType): Item[] {
    let tries = 100
    const items: Item[] = []
    while (tries > 0 && items.length < count) {
      const newItem = ItemService.generateItem(type)
      if (
        newItem.itemData &&
        !items.find((i) => i.itemData.name === newItem.itemData.name)
      ) {
        items.push(newItem)
      }
      tries--
    }
    return items
  }

  static generateItem(type: ItemType) {
    const res = new Item(type)
    switch (type) {
      case ItemType.Weapon:
        const idx = Math.floor(Math.random() * ItemData.weapons.length)
        res.itemData = ItemData.weapons[idx]
        break
      case ItemType.Helmet: {
        const data =
          ItemData.helmets[Math.floor(Math.random() * ItemData.helmets.length)]
        res.itemData = data
        break
      }
      case ItemType.Gloves: {
        const data =
          ItemData.gloves[Math.floor(Math.random() * ItemData.gloves.length)]
        res.itemData = data
        break
      }
      case ItemType.Armor: {
        const data =
          ItemData.armor[Math.floor(Math.random() * ItemData.armor.length)]
        res.itemData = data
      }
      case ItemType.Boots: {
        const data =
          ItemData.boots[Math.floor(Math.random() * ItemData.boots.length)]
        res.itemData = data
      }
      case ItemType.Belt: {
        const data =
          ItemData.belt[Math.floor(Math.random() * ItemData.belt.length)]
        res.itemData = data
      }
      case ItemType.Ring: {
        const data =
          ItemData.ring[Math.floor(Math.random() * ItemData.ring.length)]
        res.itemData = data
      }
      default:
        break
    }
    return res
  }
}
