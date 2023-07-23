import { GameObject, GameObjectType } from "../../gameObject"

export class Tree extends GameObject<GameObjectType.Tree> {
  constructor() {
    super(GameObjectType.Tree)
    Object.assign(this.renderSettings, {
      shapeType: "rect",
      width: 50,
      height: 50,
      color: "#4E4",
    })
  }
}
