import DOM from '../../lib/dom'
import Component from '../component'

const $SQUARES_FORM = 'squares-form'
const $INITIAL_SQUARES = 'initial-squares'
const $INITIAL_SQUARE_SIZE = 'initial-square-size'
const $INITIAL_MIN_SQUARE_SIZE = 'initial-min-square-size'
const $PLAY_BUTTON = 'play-button'

class Form extends Component {
  constructor () {
    super($SQUARES_FORM)
  }

  createNode () {
    const countInput = DOM.createInput('Count of squares', $INITIAL_SQUARES, 20)
    const sizeInput = DOM.createInput('Size of square', $INITIAL_SQUARE_SIZE, 50)
    const minSizeInput = DOM.createInput('Minimal size', $INITIAL_MIN_SQUARE_SIZE, 3)
    const playButton = DOM.createButton('Play', $PLAY_BUTTON)
    document.addEventListener('click', (event) => {
      if (!event.target.matches(`#${$PLAY_BUTTON}`)) return
      console.log('[Form]', event.target)

      const count = parseInt(document.querySelector(`#${$INITIAL_SQUARES} input`).value)
      const size = parseInt(document.querySelector(`#${$INITIAL_SQUARE_SIZE} input`).value)
      const minSize = parseInt(document.querySelector(`#${$INITIAL_MIN_SQUARE_SIZE} input`).value)
      if (this.events.clickPlay) {
        this.events.clickPlay.forEach(callback => {
          callback(count, size, minSize)
        })
      }
    }, false)

    const form = document.createElement('form')
    form.setAttribute('id', this.name)

    form.appendChild(countInput)
    form.appendChild(sizeInput)
    form.appendChild(minSizeInput)
    form.appendChild(playButton)

    return form
  }
}

export default Form
