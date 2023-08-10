import { Collider } from "../components/collider"
import { Experience } from "../components/experience"
import { GameObject, GameObjectType } from "../gameObject"
import { CollisionLayer } from "../layers"
import { ShapeType } from "../types"

export class ExperienceOrb extends GameObject {
  value: number = 1
  constructor() {
    super(GameObjectType.ExperienceOrb)
    const collider = Collider.circleCollider(5).withCollisionEffect((obj) => {
      if (obj.type === GameObjectType.Player) {
        obj.getComponent(Experience)?.addExperience(1)
        this.remove = true
      }
    })
    this.collisionLayers.push(CollisionLayer.ExperienceOrb)
    this.components.push(collider)
    this.setRenderSettings({
      shapeType: ShapeType.Circle,
      radius: 5,
      color: "#8c8",
      glow: true,
      glowColor: "#8c8",
      glowSize: 8,
      offset: { x: 0, y: 0 },
    })

    this.applyFriction = false
  }

  public update(): void {
    // this.renderSettings.offset = {
    //   x: Math.sin(Date.now() / 100) * 2,
    //   y: Math.cos(Date.now() / 100) * 2,
    // }
  }
}
