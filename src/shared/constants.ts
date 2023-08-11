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
      type: "Weapon",
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
      type: "Weapon",
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
      type: "Weapon",
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
      type: "Weapon",
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
      type: "Weapon",
      damage: 5,
      critChance: 0.1,
      critMultiplier: 2,
      bulletSpeed: 10,
      bulletRange: 500,
      bulletWeight: 6,
      bulletCooldown: 200,
      numBullets: 1,
      bulletSize: 3,
    },
    {
      name: "Minigun",
      description: "A minigun",
      type: "Weapon",
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
      type: "Weapon",
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
      type: "Weapon",
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
      type: "Weapon",
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
} as const
