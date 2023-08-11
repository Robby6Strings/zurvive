import * as Cinnabun from "cinnabun"
import { Cinnabun as cb, createSignal } from "cinnabun"
import { HtmlElements } from "../../state"
import { LiveSocket } from "../liveSocket"
import { ClientPlayer } from "../game/clientPlayer"

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

function useState(second: any): [any, any] {
  throw new Error("Function not implemented.")
}
