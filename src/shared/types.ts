type Only<T, U> = {
  [P in keyof T]: T[P]
} & {
  [P in keyof U]?: never
}
export type Either<T, U> = Only<T, U> | Only<U, T>

export enum ShapeType {
  Circle,
  Rectangle,
}

export type DamageConfig = {
  damage: number
  critChance: number
  critMultiplier: number
}
