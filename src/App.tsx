import * as Cinnabun from "cinnabun"
import { Cinnabun as cb, createSignal } from "cinnabun"
import { HtmlElements } from "./state"
import { LiveSocket } from "./client/liveSocket"

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
    </>
  )
}
