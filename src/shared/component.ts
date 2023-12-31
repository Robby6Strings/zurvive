import { GameObject } from "./gameObject"
import { ISerializable } from "./traits/serializable"

export enum ComponentType {
  Mover,
  Health,
  Fighter,
  Collider,
  Shooter,
  Sprite,
  PlayerSprite,
  Experience,
  Inventory,
  Attributes,
}

export interface IComponent<T extends ComponentType> {
  type: T
  update(_obj: GameObject): void
  serialize(): Object
  deserialize(data: any): void
}

export abstract class Component
  implements IComponent<ComponentType>, ISerializable
{
  constructor(public type: ComponentType, public enabled: boolean = true) {}

  abstract update(_obj: GameObject): void
  abstract deserialize(data: any): void
  abstract serialize(): Object
}
