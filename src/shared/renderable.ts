import { ShapeType } from "./types"

export type RenderSettings = {
  render: boolean
  shapeType: ShapeType
  color: string
  lineWidth: number
  fill: boolean
  radius?: number
  width?: number
  height?: number
  imgRef?: string
  img?: HTMLImageElement
  imgOffset?: { x: number; y: number }
}

export interface IRenderable {
  renderSettings: RenderSettings
  setRenderSettings(settings: Partial<RenderSettings>): void
}
