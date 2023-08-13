import { Cinnabun, computed, createSignal } from "cinnabun"
import { Player } from "../shared/gameObjects/entities"

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

export type GameImage = {
  image: HTMLImageElement
  name: string
}
export const images = createSignal<GameImage[]>([])

export const auth = createSignal<{ id: string; name: string } | null>(null)

export const characters = createSignal<
  (Player & { selected?: boolean; name: string })[]
>([])
export const selectedCharacter = computed(characters, () => {
  return characters.value.find((c) => c.selected)
})
