import "./index.css"
import { Cinnabun } from "cinnabun"
import { Hydration } from "cinnabun/hydration"
import { SSRProps } from "cinnabun/src/types"
import { App } from "./App"
import { Template } from "./Template"
import { LiveSocket } from "./liveSocket"

const env = process.env.NODE_ENV ?? "development"

if ("__cbData" in window) {
  try {
    Cinnabun.registerRuntimeServices(new LiveSocket())
    Hydration.hydrate(Template(App), window.__cbData as SSRProps)
  } catch (error) {
    console.error(error)
  }

  if (env === "development") {
    const evtHandler = new EventSource("/sse")
    let didConnect = false
    evtHandler.addEventListener("handshake", () => {
      didConnect = true
    })

    evtHandler.addEventListener("error", (evt: Event) => {
      const connIsReset = didConnect && evtHandler.readyState === 0
      if (connIsReset) location.reload()
      console.log("evtHandler err evt", evt)
    })
  }
}
