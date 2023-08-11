import { Component, ComponentType } from "../component"
import { GameObject } from "../gameObject"

export class Experience extends Component {
  _prevLevel: number = 1
  _prevExperience: number = 0
  _prevSouls: number = 0
  currentLevel: number = 1
  currentExperience: number = 0
  souls: number = 0
  onLevelUp: { (lvl: Number): void } | undefined
  onXpChange: { (xp: Number): void } | undefined

  constructor() {
    super(ComponentType.Experience)
  }

  get levelChanged(): boolean {
    return this._prevLevel !== this.currentLevel
  }
  get experienceChanged(): boolean {
    return this._prevExperience !== this.currentExperience
  }
  get soulsChanged(): boolean {
    return this.souls !== this._prevSouls
  }

  get experienceToPrevLevel() {
    return (this.currentLevel - 1) * 10
  }
  get experienceToNextLevel() {
    return this.currentLevel * 10
  }
  get levelPercentage(): number {
    return this.currentExperience / this.experienceToNextLevel
  }

  addExperience(amount: number): void {
    this.currentExperience += amount
    this.souls += amount
    if (this.currentExperience >= this.experienceToNextLevel) {
      this.currentLevel++
      this.currentExperience = 0
      if (this.onLevelUp) this.onLevelUp(this.currentLevel)
    }
    if (this.onXpChange) this.onXpChange(this.currentExperience)
  }
  setExperience(data: { level: number; experience: number; souls: number }) {
    this.currentLevel = data.level
    this.currentExperience = data.experience
    this.souls = data.souls
  }
  update(_obj: GameObject): void {
    this._prevExperience = this.currentExperience
    this._prevLevel = this.currentLevel
  }
  deserialize(data: any): void {
    this.currentLevel = data.level
    this.currentExperience = data.experience
  }
  serialize(): Object {
    return {
      type: this.type,
      level: this.currentLevel,
      experience: this.currentExperience,
    }
  }
}
