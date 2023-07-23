import { Cinnabun, createSignal } from "cinnabun"

export const pathStore = createSignal(
  Cinnabun.isClient ? window.location.pathname : "/"
)

export const HtmlElements = createSignal<null | {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
}>(null)

if (Cinnabun.isClient) {
  window.addEventListener("resize", () => {
    const canvas = HtmlElements.value?.canvas
    if (!canvas) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  })
}
