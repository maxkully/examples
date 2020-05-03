import Component from '../component'
import DOM from '../../lib/dom'

const $ERROR_NODE = 'error-panel'

class Error extends Component {
  constructor () {
    super($ERROR_NODE)
  }

  publish (message) {
    this.node.appendChild(DOM.createBlock(`${this.name}-message`, message))
    this.node.appendChild(DOM.createButton('Close', `${this.name}-close`))
    document.addEventListener('click', (event) => {
      if (!event.target.matches(`#${this.name}-close`)) return
      console.log('[Error]', event.target)
      DOM.remove(`#${this.name}`)
    }, false)

    this.show()
  }

  createNode () {
    return DOM.createBlock($ERROR_NODE)
  }
}

export default Error
