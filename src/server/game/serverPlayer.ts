import { SocketStream } from "@fastify/websocket"
import { Player } from "../../shared/gameObjects/entities"
import { IVec2 } from "../../shared/vec2"
import { Shooter } from "../../shared/components/shooter"
import { Bullet } from "../../shared/gameObjects/bullet"
import { GameObject } from "../../shared/gameObject"
import { Health } from "../../shared/components/health"

export class ServerPlayer extends Player {
  conn: SocketStream
  constructor(conn: SocketStream) {
    super()
    this.conn = conn
    this.getComponent(Health)!.onKilled = (health) => {
      health.currentHealth = health.maxHealth
      return false
    }
  }

  handleAttack(pos: IVec2): void | GameObject[] {
    const shooter = this.getComponent(Shooter)!
    const bullets = shooter.shoot(
      this,
      pos,
      ...Array.from({ length: this.numBullets }).map(() =>
        Object.assign(new Bullet(), {
          config: {
            size: 5,
            speed: 10,
            damage: 1,
            range: 1000,
            weight: this.bulletWeight,
          },
        })
      )
    )
    return bullets
  }
}
