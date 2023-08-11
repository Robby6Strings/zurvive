import { SocketStream } from "@fastify/websocket"
import { Player } from "../../shared/gameObjects/entities"
import { Health } from "../../shared/components/health"
import { Inventory } from "../../shared/components/inventory"
import { Item, ItemType } from "../../shared/item"
import { BonusData, ItemData } from "../../shared/constants"
import { Experience } from "../../shared/components/experience"
import { AttributeType, Attributes } from "../../shared/components/attributes"
import { Bonus, BonusType } from "../../shared/bonus"

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
    attributes!.bonuses.set(AttributeType.MoveSpeed, 50)
    attributes!.bonuses.set(AttributeType.BulletCooldown, -100)
  }

  setBonusSetSelection(setId: string, bonusId: number): void {
    const bonusSet = this.bonusSets.get(setId)
    if (bonusSet && !bonusSet.chosen) {
      const bonus = bonusSet.items.find((i) => i.id === bonusId)
      if (bonus) {
        bonusSet.chosen = bonus
        this.applyBonus(bonus)
      }
    }
  }
  applyBonus(bonus: Bonus) {
    console.log("applying bonus", bonus)
    const attributes = this.getComponent(Attributes)
    const bonusData = BonusData.find((b) => b.id === bonus.id)
    if (!bonusData) {
      console.error("bonus not found", bonus)
      return
    }
    if (bonusData.type === BonusType.Ability) {
    } else {
      attributes!.bonuses.set(bonusData.attribute, bonus.value)
    }
  }
}
