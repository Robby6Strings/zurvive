import { SocketStream } from "@fastify/websocket"

export class User {
  id: string
  constructor(public conn: SocketStream, public name: string) {
    this.id = Math.random().toString(36).substring(2, 9)
  }

  send(data: any) {
    this.conn.socket.send(JSON.stringify(data))
  }
}
export class AccountService {
  static users: User[] = []
  constructor() {}
  static add(conn: SocketStream, name: string) {
    const user = new User(conn, name)
    this.users.push(user)
    return user
  }

  static get(id: string) {
    return this.users.find((u) => u.id === id)
  }

  static getByName(conn: SocketStream, name: string) {
    const user = this.users.find((u) => u.name == name)
    if (user) {
      user.conn = conn
      return user
    }
    return undefined
  }

  static removebyId(id: string) {
    this.users = this.users.filter((u) => u.id !== id)
  }
}
