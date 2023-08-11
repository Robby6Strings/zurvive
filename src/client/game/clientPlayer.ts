import { Cinnabun } from "cinnabun"
import { Player } from "../../shared/gameObjects/entities"
import { LiveSocket } from "../liveSocket"

export class ClientPlayer extends Player {
  socket: LiveSocket
  get unchosenBonuses() {
    return Array.from(this.bonusSets.values()).filter((set) => !set.chosen)
  }
  constructor() {
    super()
    this.socket = Cinnabun.getRuntimeService(LiveSocket) as LiveSocket
  }
  setBonusSetSelection(setId: string, bonusName: string): void {
    const bonusSet = this.bonusSets.get(setId)
    if (bonusSet && !bonusSet.chosen) {
      const bonus = bonusSet.items.find((i) => i.name === bonusName)
      if (bonus) {
        bonusSet.chosen = bonus
      }
    }
  }
}
