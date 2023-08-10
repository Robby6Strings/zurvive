import { Component, ComponentType } from "../component"
import { GameObject } from "../gameObject"

export class Experience extends Component {
  _prevLevel: number = 1
  _prevExperience: number = 0
  currentLevel: number = 1
  currentExperience: number = 0
  constructor() {
    super(ComponentType.Experience)
  }
  get experienceToPrevLevel() {
    return (this.currentLevel - 1) * 10
  }
  get experienceToNextLevel() {
    return this.currentLevel * 10
  }
  get levelChanged(): boolean {
    return this._prevLevel !== this.currentLevel
  }
  get experienceChanged(): boolean {
    return this._prevExperience !== this.currentExperience
  }

  get levelPercentage(): number {
    return this.currentExperience / this.experienceToNextLevel
  }

  addExperience(amount: number): void {
    this.currentExperience += amount
    if (this.currentExperience >= this.experienceToNextLevel) {
      this.currentLevel++
      this.currentExperience = 0
    }
  }
  setExperience(data: { level: number; experience: number }) {
    this.currentLevel = data.level
    this.currentExperience = data.experience
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
