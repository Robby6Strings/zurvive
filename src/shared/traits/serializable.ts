export interface ISerializable {
  serialize(): Object
  deserialize(data: any): void
}
