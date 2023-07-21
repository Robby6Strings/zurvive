import * as Cinnabun from "cinnabun"
import { HtmlElements } from "./state"

export const App = () => {
  const onCanvasMounted = (self: Cinnabun.Component) => {
    const canvas = self.element as HTMLCanvasElement
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
    HtmlElements.value = { canvas, ctx }
  }
  return (
    <>
      <canvas onMounted={onCanvasMounted} />
    </>
  )
}
