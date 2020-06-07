export class GameSubscription {
  static events = [];
  static emit (event: string, ...arg: any[]) {
    for (let i of this.events[event] || []) {
      i(...arg)
    }
  }
  static on (event: string, callback: Function) {
    ;(this.events[event] = this.events[event] || []).push(callback)
    return () => (this.events[event] = this.events[event].filter(i => i !== callback))
  }
}
