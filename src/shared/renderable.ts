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
}

export interface IRenderable {
  renderSettings: RenderSettings
}
