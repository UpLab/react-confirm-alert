class Store {
  getState (key) { return this[key] }
  setState (key, state) { this[key] = state }
}
export default new Store()
