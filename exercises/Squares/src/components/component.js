import DOM from '../lib/dom'

class Component {
  constructor (name) {
    this.name = name
    this.node = null
    this.events = {}
  }

  createNode () {
    throw new Error('Method not implemented')
  }

  render (container) {
    console.log(`[${this.constructor.name}:render]`, container)
    if (DOM.find(this.name)) {
      DOM.remove(this.name)
    }

    this.node = this.createNode()
    if (!container) {
      throw new Error(
        `[${this.constructor.name}:render] Could not find container with selector '${container}'`)
    }
    container.appendChild(this.node)

    return this
  }

  show () {
    DOM.show(this.name)
    return this
  }

  hide () {
    console.log(`[${this.constructor.name}:hide] Hide`, this.name)
    DOM.hide(this.name)
    return this
  }

  subscribe (event, callback) {
    if (!this.events[event]) this.events[event] = []
    this.events[event].push(callback)
  }
}

export default Component
