import * as Cinnabun from "cinnabun"
import { Cinnabun as cb, createSignal, useComputed } from "cinnabun"
import { HtmlElements } from "../state"
import { LiveSocket } from "../liveSocket"
import { Bonus } from "../../shared/bonus"
import { Player } from "../../shared/gameObjects/entities"

export const LandingPage = () => {
  const showInput = createSignal(false)

  const loading = createSignal(true)
  if (cb.isClient) {
    setTimeout(() => {
      loading.value = false
    }, 1000)
  }
  const onCanvasMounted = (self: Cinnabun.Component) => {
    const canvas = self.element as HTMLCanvasElement
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
    HtmlElements.value = { canvas, ctx }
  }
  const liveSocket = cb.isClient
    ? (cb.getRuntimeService(LiveSocket) as LiveSocket)
    : null
  const clientGameState = cb.isClient ? liveSocket!.gameState : null

  const gameId = createSignal("")

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

  return (
    <>
      <canvas id="game" onMounted={onCanvasMounted} />
      <div
        className="loader-wrapper fullscreen"
        watch={loading}
        bind:visible={() => loading.value}
      >
        <div className="loader" />
      </div>
      <div
        id="main-menu"
        className="fullscreen"
        watch={[loading, clientGameState ?? createSignal(false)]}
        bind:visible={() => {
          if (loading.value) return false
          if (cb.isClient) return !clientGameState!.value
          return true
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-settings settings-icon-container"
        >
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
        <div className="main-menu__title lobby-title">Zurvive</div>
        <div className="main-menu__buttons lobby-button-wrapper">
          <div>
            <button
              className="main-menu__button lobby-button"
              onclick={() => liveSocket?.newGame()}
            >
              New Game
            </button>
          </div>
          <div watch={showInput} bind:visible={() => !showInput.value}>
            <button
              className="main-menu__button lobby-button"
              onclick={() => (showInput.value = !showInput.value)}
            >
              Join Game
            </button>
          </div>
          <div watch={showInput} bind:visible={() => showInput.value}>
            <input
              className="lobby-input"
              watch={gameId}
              bind:value={() => gameId.value}
              onMounted={(self: Cinnabun.Component) => {
                const input = self.element as HTMLInputElement
                input.focus()
              }}
              oninput={(e: Event) => {
                const target = e.target as HTMLInputElement
                gameId.value = target.value
              }}
            />
            <button
              className="main-menu__button lobby-join-button"
              onclick={() => liveSocket?.joinGame(gameId.value)}
            >
              Join
            </button>
          </div>
        </div>
      </div>
      <div
        watch={[pendingBonuses, selectedBonuses, loading]}
        bind:visible={() => {
          if (loading.value) return false
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
                        {bonus.value}
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
                            return (
                              <div className="game-overlay__pending_bonus_item">
                                <div className="game-overlay__pending_bonus_item_name">
                                  {item.name}
                                </div>
                                <div className="game-overlay__pending_bonus_item_description">
                                  <b>{item.value}</b>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <></>
              )}

              <div className="game-overlay__game_id">
                {clientGameState?.value?.id}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
