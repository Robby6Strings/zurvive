import { Cinnabun, createSignal } from "cinnabun"

export const pathStore = createSignal(
  Cinnabun.isClient ? window.location.pathname : "/"
)

type HtmlElements = {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
}
export const HtmlElements = createSignal<HtmlElements | null>(null)

if (Cinnabun.isClient) {
  window.addEventListener("resize", () => {
    const canvas = HtmlElements.value?.canvas
    if (!canvas) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  })
}
