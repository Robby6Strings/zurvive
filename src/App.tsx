import * as Cinnabun from "cinnabun"
import { Cinnabun as cb, createSignal } from "cinnabun"
import { HtmlElements } from "./state"
import { LiveSocket } from "./client/liveSocket"
import { ClientPlayer } from "./client/game/clientPlayer"

const loading = createSignal(true)
if (cb.isClient) {
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

export const App = () => {
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
        <h1 className="main-menu__title">Zurvive</h1>
        <div className="main-menu__buttons">
          <div>
            <button
              className="main-menu__button"
              onclick={() => liveSocket?.newGame()}
            >
              New Game
            </button>
          </div>
          <div>
            <input
              watch={gameId}
              bind:value={() => gameId.value}
              oninput={(e: Event) => {
                const target = e.target as HTMLInputElement
                gameId.value = target.value
              }}
            />
            <button
              className="main-menu__button"
              onclick={() => liveSocket?.joinGame(gameId.value)}
            >
              Join Game
            </button>
          </div>
        </div>
      </div>
      <div
        watch={clientGameState ?? createSignal(false)}
        bind:visible={() => {
          if (loading.value) return false
          if (cb.isClient && clientGameState!.value !== null) {
            const player = clientGameState?.value.getPlayer() as ClientPlayer
            if (!player) return false
            return player.unchosenBonuses.length > 0
          }
          return true
        }}
        id="game-overlay"
        className="fullscreen"
        bind:children
      >
        {() => {
          console.log("rendering game overlay")
          const player = clientGameState?.value?.getPlayer() as ClientPlayer
          if (!player) return <></>
          return () => (
            <>
              <div className="game-overlay__bonuses">
                {player.unchosenBonuses.map((bonus) => {
                  return (
                    <div className="game-overlay__bonus_items">
                      {bonus.items.map((item) => {
                        return (
                          <div className="game-overlay__bonus_item">
                            <div className="game-overlay__bonus_item_name">
                              {item.name}
                            </div>
                            <div className="game-overlay__bonus_item_description">
                              {item.value}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </>
          )
        }}
      </div>
    </>
  )
}
