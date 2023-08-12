import { ComponentType } from "./component"
import { Experience } from "./components/experience"
import { Fighter } from "./components/fighter"
import { Health } from "./components/health"
import { Mover } from "./components/mover"
import { GameActionType } from "./message"
import { GameObject, GameObjectType } from "./gameObject"
import { newInstanceOfType } from "./gameObjects"
import { MessageType, TypedMessage } from "./message"
import { Vec2 } from "./vec2"

export class GameObjectStore {
  constructor(public objects: GameObject[] = []) {}

  add(...objects: GameObject[]) {
    for (const obj of objects) {
      if (this.find(obj.id)) continue
      this.objects.push(obj)
    }
  }
  update() {
    for (const obj of this.objects) {
      obj.update()
    }
  }

  updateById(id: string, data: Partial<GameObject>) {
    const object = this.find(id)
    if (object) Object.assign(object, data)
  }

  removeById(id: string) {
    const object = this.find(id)
    if (object) object.remove = true
    this.removeFlagged()
  }

  removeFlagged() {
    this.objects = this.objects.filter((o) => !o.remove)
  }
  find(idOrPredicate: string | { (o: GameObject): boolean }) {
    if (typeof idOrPredicate === "string") {
      return this.objects.find((o) => o.id === idOrPredicate)
    }
    return this.objects.find(idOrPredicate)
  }

  findByType<T extends GameObject>(objectType: GameObjectType) {
    return this.objects.filter((o) => o.type === objectType) as T[]
  }

  filter(predicate: { (o: GameObject): boolean }) {
    return this.objects.filter(predicate)
  }

  forEach(callback: { (o: GameObject): void }) {
    for (const obj of this.objects) {
      callback(obj)
    }
  }

  getChanges(): TypedMessage<undefined | GameActionType>[] {
    let changes: TypedMessage<undefined | GameActionType>[] = []
    for (let i = 0; i < this.objects.length; i++) {
      const obj = this.objects[i]
      if (obj.new) {
        obj.new = false
        changes.push({
          type: MessageType.newObject,
          object: obj.serialize(),
        })
      }
      if (obj.remove) {
        changes.push({
          type: MessageType.removeObject,
          object: {
            type: obj.type,
            id: obj.id,
          },
        })
        continue
      } else if (obj.posChanged || obj.velChanged) {
        const deltas: any = {}
        if (obj.posChanged) {
          obj.lastPos = obj.pos.clone()
          deltas.pos = Vec2.serialize(obj.pos)
        }
        if (obj.velChanged) {
          obj.lastVel = obj.vel.clone()
          deltas.vel = Vec2.serialize(obj.vel)
        }

        changes.push({
          type: MessageType.updateObject,
          object: {
            type: obj.type,
            id: obj.id,
            properties: deltas,
          },
        })
      }

      for (const component of obj.components) {
        switch (component.type) {
          case ComponentType.Fighter:
            const fighter = component as Fighter
            if (fighter.targetChanged) {
              changes.push({
                type: MessageType.action,
                action: {
                  type: GameActionType.setTargetObj,
                  payload: {
                    objectType: obj.type,
                    objectId: obj.id,
                    data: fighter.target ? fighter.target.id : null,
                  },
                },
              })
            }
            break
          case ComponentType.Mover:
            const mover = component as Mover
            if (mover.targetPosChanged) {
              changes.push({
                type: MessageType.action,
                action: {
                  type: GameActionType.setTargetPos,
                  payload: {
                    objectType: obj.type,
                    objectId: obj.id,
                    data: mover.targetPos
                      ? Vec2.serialize(mover.targetPos)
                      : null,
                  },
                },
              })
            }
            break
          case ComponentType.Health:
            const health = component as Health
            if (health.currentHealthChanged) {
              changes.push({
                type: MessageType.action,
                action: {
                  type:
                    health.currentHealth > health._lastHealth
                      ? GameActionType.heal
                      : GameActionType.takeDamage,
                  payload: {
                    objectType: obj.type,
                    objectId: obj.id,
                    data: health.currentHealth,
                  },
                },
              })
            }
            break
          case ComponentType.Experience:
            const experience = component as Experience
            if (
              experience.levelChanged ||
              experience.experienceChanged ||
              experience.soulsChanged
            ) {
              changes.push({
                type: MessageType.action,
                action: {
                  type: GameActionType.exp,
                  payload: {
                    objectType: obj.type,
                    objectId: obj.id,
                    data: {
                      level: experience.currentLevel,
                      experience: experience.currentExperience,
                      souls: experience.souls,
                    },
                  },
                },
              })
            }

            break
        }
      }
    }
    return changes
  }

  serialize() {
    return this.objects.map((o) => o.serialize())
  }
  deserialize(data: any) {
    this.objects = data.map((obj: any) =>
      newInstanceOfType(obj.type).deserialize(obj)
    )
  }
}
