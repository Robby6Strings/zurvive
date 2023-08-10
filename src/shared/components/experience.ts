import { Component } from "../component"
import { GameObject } from "../gameObject"

export class Experience extends Component {
  _prevLevel: number = 1
  _prevExperience: number = 0
  currentLevel: number = 1
  currentExperience: number = 0
  get experienceToNextLevel() {
    return this.currentLevel * 10
  }
  get levelChanged(): boolean {
    return this._prevLevel !== this.currentLevel
  }
  get experienceChanged(): boolean {
    return this._prevExperience !== this.currentExperience
  }
  addExperience(amount: number): void {
    this.currentExperience += amount
    if (this.currentExperience >= this.experienceToNextLevel) {
      this.currentLevel++
    }
  }
  update(_obj: GameObject): void {
    this._prevLevel = this.currentLevel
  }
  deserialize(data: any): void {
    this.currentLevel = data.currentLevel
    this.currentExperience = data.currentExperience
  }
  serialize(): Object {
    return {
      currentLevel: this.currentLevel,
      currentExperience: this.currentExperience,
    }
  }
}
