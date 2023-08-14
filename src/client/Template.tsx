import * as Cinnabun from "cinnabun"
import { type Component } from "cinnabun"
import { debug } from "./state"

export const Template = (App: { (): Component }) => {
  return (
    <>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Zurvive</title>
        <link rel="stylesheet" href="/static/index.css" />
      </head>

      <body>
        <div id="app">
          <App />
        </div>
        <DebugUI />
      </body>
    </>
  )
}

const DebugUI = () => {
  const showOptions = Cinnabun.createSignal(false)
  return (
    <div className="debug" watch={debug} bind:visible={() => debug.value.show}>
      <div watch={showOptions} bind:visible={() => showOptions.value}>
        <DebugOptions />
      </div>
      <button onclick={() => (showOptions.value = !showOptions.value)}>
        Options
      </button>
    </div>
  )
}

const DebugOptions = () => {
  return (
    <>
      <div className="debug__content">
        <label htmlFor="debug__renderColliders">Colliders</label>
        <input
          id="debug__renderColliders"
          type="checkbox"
          bind:checked={() => debug.value.renderColliders}
          onchange={(e: Event) => {
            debug.value.renderColliders = (e.target as HTMLInputElement).checked
          }}
        />
      </div>
      <div className="debug__content">
        <label htmlFor="debug__renderSpriteBoxes">SpriteBoxes</label>
        <input
          id="debug__renderSpriteBoxes"
          type="checkbox"
          bind:checked={() => debug.value.renderSpriteBoxes}
          onchange={(e: Event) => {
            debug.value.renderSpriteBoxes = (
              e.target as HTMLInputElement
            ).checked
          }}
        />
      </div>
    </>
  )
}
