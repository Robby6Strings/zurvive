import { BonusType } from "./bonus"
import { AttributeType } from "./components/attributes"
import { GameObjectType } from "./gameObject"

export const ObjectColors = {
  [GameObjectType.Player]: "#44E",
  [GameObjectType.Enemy]: "#E44",
  [GameObjectType.ExperienceOrb]: "#8c8",
  [GameObjectType.Bullet]: "#aaaa",
}

export const ItemData = {
  weapons: [
    {
      name: "Pistol",
      description: "A pistol",
      damage: 8,
      critChance: 0.1,
      critMultiplier: 2,
      bulletSpeed: 10,
      bulletRange: 500,
      bulletWeight: 6,
      bulletCooldown: 500,
      numBullets: 1,
      bulletSize: 3,
    },
    {
      name: "Shotgun",
      description: "A shotgun",
      damage: 5,
      critChance: 0.1,
      critMultiplier: 2,
      bulletSpeed: 10,
      bulletRange: 200,
      bulletWeight: 6,
      bulletCooldown: 1000,
      numBullets: 5,
      bulletSize: 3,
    },
    {
      name: "Rifle",
      description: "A rifle",
      damage: 15,
      critChance: 0.1,
      critMultiplier: 2,
      bulletSpeed: 10,
      bulletRange: 500,
      bulletWeight: 6,
      bulletCooldown: 200,
      numBullets: 1,
      bulletSize: 5,
    },
    {
      name: "Sniper",
      description: "A sniper",
      damage: 20,
      critChance: 0.1,
      critMultiplier: 2,
      bulletSpeed: 10,
      bulletRange: 500,
      bulletWeight: 6,
      bulletCooldown: 200,
      numBullets: 1,
      bulletSize: 5,
    },
    {
      name: "Machine Gun",
      description: "A machine gun",
      damage: 4,
      critChance: 0.1,
      critMultiplier: 2,
      bulletSpeed: 10,
      bulletRange: 500,
      bulletWeight: 6,
      bulletCooldown: 100,
      numBullets: 1,
      bulletSize: 3,
    },
    {
      name: "Minigun",
      description: "A minigun",
      damage: 5,
      critChance: 0.1,
      critMultiplier: 2,
      bulletSpeed: 10,
      bulletRange: 500,
      bulletWeight: 6,
      bulletCooldown: 200,
      numBullets: 1,
      bulletSize: 2,
    },
    {
      name: "Rocket Launcher",
      description: "A rocket launcher",
      damage: 5,
      critChance: 0.1,
      critMultiplier: 2,
      bulletSpeed: 10,
      bulletRange: 500,
      bulletWeight: 6,
      bulletCooldown: 200,
      numBullets: 1,
      bulletSize: 15,
    },
    {
      name: "Grenade Launcher",
      description: "A grenade launcher",
      damage: 5,
      critChance: 0.1,
      critMultiplier: 2,
      bulletSpeed: 10,
      bulletRange: 500,
      bulletWeight: 6,
      bulletCooldown: 200,
      numBullets: 1,
      bulletSize: 15,
    },
    {
      name: "Flamethrower",
      description: "A flamethrower",
      damage: 5,
      critChance: 0.1,
      critMultiplier: 2,
      bulletSpeed: 10,
      bulletRange: 500,
      bulletWeight: 6,
      bulletCooldown: 200,
      numBullets: 8,
      bulletSize: 15,
    },
  ],
  helmets: [
    {
      name: "Raggedy Helmet",
      description: "A pretty shit helmet",
      armor: 2,
    },
    {
      name: "Leather Helmet",
      description: "An average helmet",
      armor: 5,
    },
  ],
  gloves: [
    {
      name: "Raggedy Gloves",
      description: "Some pretty shite gloves",
      armor: 1,
    },
    {
      name: "Leather Gloves",
      description: "An average pair of gloves",
      armor: 3,
    },
  ],
  armor: [
    {
      name: "Raggedy Armor",
      description: "A pretty shite armor",
      armor: 1,
    },
    {
      name: "Leather Armor",
      description: "An average armor",
      armor: 3,
    },
  ],
  boots: [
    {
      name: "Raggedy Boots",
      description: "Some pretty shite boots",
      armor: 1,
    },
    {
      name: "Leather Boots",
      description: "An average pair of boots",
      armor: 3,
    },
  ],
  belt: [
    {
      name: "Raggedy Belt",
      description: "A pretty shite belt",
      armor: 1,
    },
    {
      name: "Leather Belt",
      description: "An average belt",
      armor: 3,
    },
  ],
  ring: [],
} as const

export type BonusDataItem = {
  id: number
  type: BonusType
  name: string
  description: string
  weight: number
  rarity_weights?: number[]
  modifiers?: number[]
} & (
  | {
      type: BonusType.Ability
      cooldown: number
      duration: number
    }
  | {
      type: BonusType.Attribute
      attribute: AttributeType
    }
)

const weights = {
  common: 100,
  uncommon: 50,
  rare: 25,
  epic: 10,
} as const

export const BonusData: BonusDataItem[] = [
  {
    id: 0,
    type: BonusType.Ability,
    name: "Dash",
    description: "Dash in a direction",
    cooldown: 1000,
    duration: 100,
    weight: weights.epic,
  },
  {
    id: 1,
    type: BonusType.Ability,
    name: "Fireball",
    description: "Shoot a fireball",
    cooldown: 1000,
    duration: 100,
    weight: weights.epic,
  },
  {
    id: 2,
    type: BonusType.Ability,
    name: "Lightning",
    description: "Shoot a lightning bolt",
    cooldown: 1000,
    duration: 100,
    weight: weights.epic,
  },
  {
    id: 3,
    type: BonusType.Ability,
    name: "Meteor",
    description: "Summon a meteor",
    cooldown: 1000,
    duration: 100,
    weight: weights.epic,
  },
  {
    id: 4,
    type: BonusType.Attribute,
    attribute: AttributeType.BulletSize,
    name: "Bullet Size",
    description: "Increase bullet size",
    weight: weights.common,
    rarity_weights: [9, 2],
    modifiers: [0.5, 1],
  },
  {
    id: 5,
    type: BonusType.Attribute,
    attribute: AttributeType.BulletSpeed,
    name: "Bullet Speed",
    description: "Increase bullet speed",
    weight: weights.common,
    rarity_weights: [9, 6, 3],
    modifiers: [1, 2, 4],
  },
  {
    id: 6,
    type: BonusType.Attribute,
    attribute: AttributeType.BulletCooldown,
    name: "Bullet Cooldown",
    description: "Decrease bullet cooldown",
    weight: weights.common,
    rarity_weights: [9, 6, 3],
    modifiers: [-5, -10, -15],
  },
  {
    id: 7,
    type: BonusType.Attribute,
    attribute: AttributeType.BulletRange,
    name: "Bullet Range",
    description: "Increase bullet range",
    weight: weights.common,
    rarity_weights: [9, 6, 2],
    modifiers: [10, 25, 50],
  },
  {
    id: 8,
    type: BonusType.Attribute,
    attribute: AttributeType.BulletWeight,
    name: "Bullet Weight",
    description: "Increase bullet weight",
    weight: weights.common,
    rarity_weights: [36, 16, 1],
    modifiers: [0.5, 1, 6],
  },
  {
    id: 9,
    type: BonusType.Attribute,
    attribute: AttributeType.Damage,
    name: "Damage",
    description: "Increase damage",
    weight: weights.common,
    rarity_weights: [96, 64, 8, 1],
    modifiers: [1, 2, 3, 5],
  },
  {
    id: 10,
    type: BonusType.Attribute,
    attribute: AttributeType.CritChance,
    name: "Crit Chance",
    description: "Increase crit chance",
    weight: weights.common,
    rarity_weights: [48, 36, 8, 1],
    modifiers: [0.04, 0.08, 0.15, 0.3],
  },
  {
    id: 11,
    type: BonusType.Attribute,
    attribute: AttributeType.CritMultiplier,
    name: "Crit Multiplier",
    description: "Increase crit multiplier",
    weight: weights.common,
    rarity_weights: [72, 48, 16, 1],
    modifiers: [0.04, 0.08, 0.2, 0.5],
  },
  {
    id: 12,
    type: BonusType.Attribute,
    attribute: AttributeType.NumBullets,
    name: "Num Bullets",
    description: "Increase number of bullets",
    weight: weights.epic,
    rarity_weights: [9, 6, 4],
    modifiers: [1, 2, 3],
  },
  {
    id: 13,
    type: BonusType.Attribute,
    attribute: AttributeType.LifeOnHit,
    name: "Life on Hit",
    description: "Gain life on hit",
    weight: weights.epic,
    rarity_weights: [9, 6, 4, 2],
    modifiers: [1, 2, 3, 5],
  },
]
