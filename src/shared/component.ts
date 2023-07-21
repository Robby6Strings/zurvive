import { GameObject } from "./gameObject"

export enum ComponentType {
  Mover,
  Transform,
  Health,
}

export interface IComponent<T extends ComponentType> {
  type: T
  update(_obj: GameObject<any>): void
}

export abstract class Component implements IComponent<ComponentType> {
  constructor(public type: ComponentType, public enabled: boolean = true) {}

  abstract update(_obj: GameObject<any>): void
}
