import { ClassConstructor } from "cinnabun/src/types"
import { Component, ComponentType, IComponent } from "./component"
import { Fighter } from "./components/fighter"
import { Mover } from "./components/mover"
import { Vec2 } from "./vec2"
import { Health } from "./components/health"
import { Collider } from "./components/collider"
import { ShapeType } from "./types"

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
  renderSettings: {
    shapeType: ShapeType
    color: string
    lineWidth: number
    fill: boolean
    radius?: number
    width?: number
    height?: number
  } = {
    shapeType: ShapeType.Circle,
    color: "#FFF",
    lineWidth: 1,
    fill: true,
  }

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

  public serialize(): string {
    return JSON.stringify({
      id: this.id,
      type: this.type,
      center: this.center,
      rotation: this.rotation,
      components: this.components.map((c) => c.serialize()),
    })
  }

  public deserialize(data: any): void {
    this.id = data.id
    this.type = data.type
    this.center = Vec2.fromObject(data.center)
    this.rotation = data.rotation
    this.components = data.components.map((c: any) => {
      const parsed = JSON.parse(c)
      let classType: ClassConstructor<Component> | undefined
      switch (parsed.type as ComponentType) {
        case ComponentType.Mover:
          classType = Mover
          break
        case ComponentType.Health:
          classType = Health
          break
        case ComponentType.Fighter:
          classType = Fighter
          break
        case ComponentType.Collider:
          classType = Collider
          break
        default:
          throw new Error(`Unknown component type ${c.type}`)
      }
      const component = new classType()
      component.deserialize(parsed)
      return component
    })
  }
}
