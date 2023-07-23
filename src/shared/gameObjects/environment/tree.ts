import { Collider } from "../../components/collider"
import { GameObject, GameObjectType } from "../../gameObject"
import { ShapeType } from "../../types"

export class Tree extends GameObject<GameObjectType.Tree> {
  constructor() {
    super(GameObjectType.Tree)
    this.components.push(Collider.rectangleCollider(50, 50, true))
    this.setRenderSettings({
      shapeType: ShapeType.Rectangle,
      width: 50,
      height: 50,
      color: "#4E4",
    })
  }
}