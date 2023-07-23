import { ClassConstructor } from "cinnabun/src/types"
import { Component, ComponentType, IComponent } from "./component"
import { Fighter } from "./components/fighter"
import { Mover } from "./components/mover"
import { Vec2 } from "./vec2"
import { Health } from "./components/health"
import { Collider } from "./components/collider"
import { ShapeType } from "./types"
import { ISerializable } from "./serializable"
import { IRenderable, RenderSettings } from "./renderable"

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
  Spawner = "spawner",
}

export abstract class GameObject<T extends GameObjectType>
  implements ISerializable, IRenderable
{
  id: string
  remove: boolean
  new: boolean = true
  components: IComponent<ComponentType>[]
  _pos: Vec2 = new Vec2(0, 0)
  posChanged: boolean = false
  rotation: number = 0
  renderSettings: RenderSettings = {
    render: true,
    shapeType: ShapeType.Circle,
    color: "#FFF",
    lineWidth: 1,
    fill: true,
  }

  get pos(): Vec2 {
    return this._pos
  }
  set pos(value: Vec2) {
    this.posChanged = !this._pos.round().equals(value.round())
    this._pos = value
  }

  constructor(public type: T) {
    this.id = Math.random().toString(36).substring(2, 9)
    this.remove = false
    this.components = []
  }
  setRenderSettings(settings: Partial<RenderSettings>): void {
    Object.assign<RenderSettings, Partial<RenderSettings>>(
      this.renderSettings,
      settings
    )
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

  static getDistance(objA: GameObject<any>, objB: GameObject<any>): number {
    return (
      objA.pos.distance(objB.pos) -
      Collider.getSize(objA) +
      Collider.getSize(objB)
    )
  }

  public serialize(): Object {
    return {
      id: this.id,
      type: this.type,
      pos: Vec2.serialize(this.pos),
      rotation: this.rotation,
      components: this.components.map((c) => c.serialize()),
    }
  }

  public deserialize(data: any): GameObject<T> {
    this.id = data.id
    this.type = data.type
    this.pos = data.pos ? Vec2.fromObject(data.pos) : Vec2.zero()
    this.rotation = data.rotation
    this.components = data.components.map((c: any) => {
      let classType: ClassConstructor<Component> | undefined
      switch (c.type as ComponentType) {
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
      component.deserialize(c)
      return component
    })
    return this
  }
}
