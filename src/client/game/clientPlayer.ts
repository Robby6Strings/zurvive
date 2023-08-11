import { Cinnabun } from "cinnabun"
import { Player } from "../../shared/gameObjects/entities"
import { LiveSocket } from "../liveSocket"
import { GameActionType } from "../../shared/gameAction"

export class ClientPlayer extends Player {
  socket: LiveSocket
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
        this.socket.sendGameAction({
          type: GameActionType.chooseBonus,
          payload: {
            objectId: this.id,
            objectType: this.type,
            data: {
              id: setId,
              name: bonusName,
            },
          },
        })
      }
    }
  }
}
