import { SocketStream } from "@fastify/websocket"
import { Player } from "../../shared/gameObjects/entities"
import { Health } from "../../shared/components/health"
import { Inventory } from "../../shared/components/inventory"
import { Item, ItemType } from "../../shared/item"
import { ItemData } from "../../shared/constants"

export class ServerPlayer extends Player {
  conn: SocketStream
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
        itemData: ItemData.weapons[0],
      })
    )
  }
}
