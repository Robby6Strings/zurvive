import { SocketStream } from "@fastify/websocket"
import { Player } from "../../shared/gameObjects/entities"
import { Health } from "../../shared/components/health"
import { Inventory } from "../../shared/components/inventory"
import { Item, ItemType } from "../../shared/item"
import { ItemData } from "../../shared/constants"
import { Experience } from "../../shared/components/experience"
import { AttributeType, Attributes } from "../../shared/components/attributes"

export class ServerPlayer extends Player {
  conn: SocketStream
  onLevelUp: { (): void } | undefined
  constructor(conn: SocketStream) {
    super()
    this.conn = conn
    const health = this.getComponent(Health)
    health!.onKilled = (health) => {
      health.currentHealth = health.maxHealth
      return false
    }
    health!.regenAmount = 1
    const inventory = this.getComponent(Inventory)
    inventory!.addItem(
      Object.assign(new Item(ItemType.Weapon), {
        itemData: ItemData.weapons[4],
      })
    )
    const xp = this.getComponent(Experience)
    xp!.onLevelUp = () => {
      if (this.onLevelUp) this.onLevelUp()
    }
    const attributes = this.getComponent(Attributes)
    attributes!.bonuses.set(AttributeType.NumBullets, 2)
  }
}
