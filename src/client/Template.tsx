import * as Cinnabun from "cinnabun"
import { type Component } from "cinnabun"

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
      </body>
    </>
  )
}
