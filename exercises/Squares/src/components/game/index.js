import DOM from '../../lib/dom'
import Component from '../component'
import Board from './board'
import Worker from '../../square.worker.js'
import Square from "./square";

const $SQUARE_GAME = 'game-board'
const $GAME_OVER = 'game-over'

class SquareGame extends Component {
  constructor () {
    super($SQUARE_GAME)

    this.worker = new Worker()
    this.worker.onmessage = function (event) {
      console.log('[SquareGame] Received message from worker', event.data)
    }
  }

  play (count, size, minSize) {
    this.worker.postMessage({
      event: 'generate',
      request: { count, size, minSize }
    })
  }

  stop () {
    this.worker.postMessage({
      event: 'stop',
      request: {}
    })
  }

  createNode () {
    const gameOver = DOM.createContainer($GAME_OVER)
    gameOver.appendChild(DOM.createBlock(`${$GAME_OVER}-title`, 'GAME OVER!'))
    gameOver.appendChild(DOM.createButton('Close', `${$GAME_OVER}-close`))
    DOM.hideElement(gameOver)
    document.addEventListener('click', (event) => {
      if (!event.target.matches(`#${$GAME_OVER}-close`)) return
      console.log(`[${this.constructor.name}]`, event.target)
      this.stop()
    }, false)
    document.addEventListener('click', event => {
      if (!event.target.matches('body')) return
      if (this.mode === 'stop') return

      let pageX = event.pageX
      let pageY = event.pageY
      if (pageX === undefined) {
        pageX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft
        pageY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop
      }

      this.worker.postMessage({
        event: 'append',
        request: { position: { x: pageX, y: pageY } }
      })
    }, false)
    window.addEventListener('resize', () => {
      this.worker.postMessage({ event: 'resize', request: this.borderSize() })
    })
    const gameBoard = DOM.createContainer(this.name)
    gameBoard.appendChild(gameOver)
    return gameBoard
  }

  borderSize () {
    const w = window
    const d = document
    const e = d.documentElement
    const g = d.getElementsByTagName('body')[0]
    const x = w.innerWidth || e.clientWidth || g.clientWidth
    const y = w.innerHeight || e.clientHeight || g.clientHeight

    return [x - 2, y - 2]
  }
}

export default SquareGame
