import { Cinnabun, createSignal } from "cinnabun"

export const pathStore = createSignal(
  Cinnabun.isClient ? window.location.pathname : "/"
)

type HtmlElements = {
  canvas?: HTMLCanvasElement
  ctx?: CanvasRenderingContext2D
}
export const HtmlElements = createSignal<HtmlElements>({
  canvas: undefined,
  ctx: undefined,
})
