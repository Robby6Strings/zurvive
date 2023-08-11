import { BonusData } from "./constants"
import { ISerializable } from "./serializable"

export enum BonusType {
  Ability,
  Attribute,
  // Upgrade,
  // Item,
}

export type BonusSet = {
  items: Bonus[]
  id: string
  chosen?: Bonus
}

export class Bonus implements ISerializable {
  constructor(
    public type: BonusType,
    public value: number,
    public name: string,
    public id: number
  ) {
    this.type = type
    this.value = value
  }
  serialize(): Object {
    return {
      type: this.type,
      name: this.name,
      value: this.value,
    }
  }
  deserialize(data: any): Bonus {
    this.type = data.type
    this.name = data.name
    this.value = data.value
    return this
  }

  static generateBonusSet(): BonusSet {
    const items: Bonus[] = []
    let tries = 100

    while (tries > 0 && items.length < 3) {
      const newItemIndex = getRandomIndexByWeight(BonusData)
      const newItem = BonusData[newItemIndex]

      if (!items.some((r) => r.id === newItem.id)) {
        let rarity = 0
        if (newItem.rarity_weights) {
          const map = getRarityWeightMap(newItem.rarity_weights)
          rarity = getRandomWeightMapIndex(map)
        }
        const value = newItem.modifiers ? newItem.modifiers[rarity] : 0
        items.push(new Bonus(newItem.type, value, newItem.name, newItem.id))
      }
    }
    return {
      items,
      id: Math.random().toString(36).substring(2, 9),
    }
  }
}

type ItemWithWeight = { weight: number }
type WeightMap = number[]

export function getRandomIndexByWeight(arr: ItemWithWeight[]) {
  const wm = getWeightMap(arr)
  return getRandomWeightMapIndex(wm)
}
export function getWeightMap(arr: ItemWithWeight[]) {
  return [...arr.map((t, i) => Array(t.weight).fill(i))]
    .join()
    .split(",")
    .map((a) => parseInt(a))
}
export function getRarityWeightMap(arr: WeightMap) {
  return [...arr.map((t, i) => Array(t).fill(i))]
    .join()
    .split(",")
    .map((a) => parseInt(a))
}

export function getRandomWeightMapIndex(wm: WeightMap) {
  return wm[Math.floor(Math.random() * wm.length)]
}
