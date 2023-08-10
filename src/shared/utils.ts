import { DamageConfig } from "./types"

export const calculateDamage = (damage: DamageConfig) => {
  let dmg = damage.damage
  if (Math.random() < damage.critChance) {
    dmg *= damage.critMultiplier
  }
  return dmg
}
