import { Collider, CollisionLayer } from "../components/collider"
import { Experience } from "../components/experience"
import { ObjectColors } from "../constants"
import { GameObject, GameObjectType } from "../gameObject"
import { ShapeType } from "../types"

export class ExperienceOrb extends GameObject {
  value: number = 1
  tick: number = 0
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
      radius: 2,
      color: ObjectColors[GameObjectType.ExperienceOrb],
      glow: true,
      glowColor: ObjectColors[GameObjectType.ExperienceOrb],
      glowSize: 8,
      offset: { x: 0, y: 0 },
    })

    this.applyFriction = false
  }

  public update(): void {
    this.renderSettings.offset = {
      x: Math.sin(this.tick / 100) * 2,
      y: Math.cos(this.tick / 100) * 2,
    }
    this.tick += 5
  }
}
