import { Component, IComponent } from "./component"
import { Vec2 } from "./vec2"

export enum GameObjectType {
  Unset = "unset",
  Player = "player",
  Enemy = "enemy",
  Bullet = "bullet",
  Wall = "wall",
  Tree = "tree",
  Rock = "rock",
  Bush = "bush",
  Chest = "chest",
  Door = "door",
  Floor = "floor",
}

export abstract class GameObject<T extends GameObjectType> {
  id: string
  remove: boolean
  components: IComponent<any>[]
  center: Vec2 = new Vec2(0, 0)
  rotation: number = 0

  constructor(public type: T) {
    this.id = Math.random().toString(36).substring(2, 9)
    this.remove = false
    this.components = []
  }

  getComponent<T extends typeof Component>(
    classRef: T
  ): InstanceType<T> | undefined {
    //@ts-ignore
    return this.components.find((c) => c instanceof classRef)
  }

  public update(): void {
    for (const component of this.components) {
      component.update(this)
    }
  }

  public draw(): void {}
}
