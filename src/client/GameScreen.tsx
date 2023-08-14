import * as Cinnabun from "cinnabun"
import { useComputed, createSignal, Cinnabun as cb } from "cinnabun"
import { Bonus } from "../shared/bonus"
import { Player } from "../shared/gameObjects/entities"
import { LiveSocket } from "./liveSocket"
import { HtmlElements } from "./state"

export const GameScreen = () => {
  const liveSocket = cb.isClient
    ? (cb.getRuntimeService(LiveSocket) as LiveSocket)
    : null
  const clientGameState = cb.isClient ? liveSocket!.gameState : null

  const pendingBonuses = useComputed(() => {
    const player = clientGameState?.value?.getPlayer() as Player
    if (!player) return []
    return player.unchosenBonuses
  }, [clientGameState ?? createSignal(false)])

  const selectedBonuses = useComputed(() => {
    const player = clientGameState?.value?.getPlayer() as Player

    if (!player) return []
    const allSelected = Array.from(player.bonusSets.values())
      .filter((set) => !!set.chosen)
      .map((set) => {
        return {
          ...set.chosen!,
        }
      }) as Bonus[]
    const aggregated: Bonus[] = []
    allSelected.forEach((bonus) => {
      const existing = aggregated.find((b) => b.name === bonus.name)
      if (existing) {
        existing.value += bonus.value
      } else {
        aggregated.push(bonus)
      }
    })
    return aggregated
  }, [clientGameState ?? createSignal(false)])

  const onCanvasMounted = (self: Cinnabun.Component) => {
    const canvas = self.element as HTMLCanvasElement
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
    HtmlElements.value = { canvas, ctx }
  }

  return (
    <>
      <canvas id="game" onMounted={onCanvasMounted} />
      <div
        watch={[pendingBonuses, selectedBonuses]}
        bind:visible={() => {
          try {
            return (
              pendingBonuses.value.length > 0 ||
              selectedBonuses.value.length > 0 ||
              !!clientGameState?.value
            )
          } catch (error) {
            debugger
            return false
          }
        }}
        id="game-overlay"
        className="fullscreen"
        bind:children
      >
        {() => (
          <>
            {selectedBonuses.value.length > 0 ? (
              <div className="game-overlay__selected_bonuses">
                {selectedBonuses.value.map((bonus) => {
                  return (
                    <div className="game-overlay__selected_bonus_item">
                      <div className="game-overlay__selected_bonus_item_name">
                        {bonus.name}
                      </div>
                      <div className="game-overlay__selected_bonus_item_description">
                        {bonus.value.toString().includes(".") ? (
                          <b>{bonus.value.toFixed(2)}</b>
                        ) : (
                          <b>{bonus.value}</b>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <></>
            )}

            <div style="width:100%;height:100%;display:flex;">
              {pendingBonuses.value.length > 0 ? (
                <div className="game-overlay__pending_bonuses">
                  <div className="game-overlay__pending_bonuses_keys">
                    {[1, 2, 3].map((key) => (
                      <div className="game-overlay__pending_bonuses_key_name">
                        <span>{key}</span>
                      </div>
                    ))}
                  </div>
                  <div className="game-overlay__pending_bonuses_list">
                    {pendingBonuses.value.map((bonus) => {
                      return (
                        <div className="game-overlay__pending_bonus_items">
                          {bonus.items.map((item) => {
                            return <BonusItem bonus={item} />
                          })}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}

const BonusItem = ({ bonus }: { bonus: Bonus }) => {
  return (
    <div
      data-rarity={bonus.rarity}
      className="game-overlay__pending_bonus_item"
    >
      <div className="game-overlay__pending_bonus_item_name">{bonus.name}</div>
      <div className="game-overlay__pending_bonus_item_description">
        <b>{bonus.value}</b>
      </div>
    </div>
  )
}
