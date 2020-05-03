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
    this.mode = 'stop'

    this.worker = new Worker()
    this.worker.onmessage = function (event) {
      console.log('[SquareGame] Received message from worker', event.data)
      switch (event.data.event) {
        case 'move': {
          console.log('Move')
          break
        }
        case 'create': {
          if (!event.data.response.collision) {
            const square = new Square(event.data.response)
            square.append(document.querySelector(`#${$SQUARE_GAME}`))
            this.worker.postMessage({ event: 'move', request: {

              }
            })
          }
          break
        }
        case 'checker': {
          console.log('Checker event')
          break
        }
      }
    }
    window.addEventListener('resize', () => {
      this.worker.postMessage({ event: 'resize', request: this.borderSize() })
    })
  }

  play (count, size, minSize) {
    console.log('[SquareGame:play] Game started!', count, size, minSize)
    this.show()
    DOM.hide($GAME_OVER)

    // const board = new Board(this.node, minSize)
    const Game = {
      mode: 'stop',
      start: function () {
        this.mode = 'start'
        // board.generateSquares(
        //   count,
        //   size,
        //   minSize,
        //   () => {
        //     const checker = () => {
        //       setTimeout(() => {
        //         console.log('check!', Object.keys(board.runningSquares).length)
        //         if (Object.keys(board.runningSquares).length > 1) {
        //           checker()
        //         } else {
        //           Game.stop()
        //           console.log('Game over!')
        //         }
        //       }, 500)
        //     }
        //     checker()
        //   }
        // )
      },
      stop: function () {
        DOM.show($GAME_OVER)
        this.mode = 'stop'
        // board.clearSquares()
      }
    }
    this.worker.postMessage({ event: 'resize', request: this.borderSize() })
    Game.start()

    this.subscribe('stop', () => {
      console.log('[SquareGame:play] Stop callback')
      Game.stop()
    })

    const addSquare = event => {
      if (!event.target.matches('body')) return
      if (Game.mode === 'stop') return

      console.log(event.target)
      let pageX = event.pageX
      let pageY = event.pageY

      // IE 8
      if (pageX === undefined) {
        pageX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft
        pageY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop
      }

      this.addSquare({ x: pageX, y: pageY }, size)
    }

    document.addEventListener('click', addSquare, false)
  }

  stop () {
    console.log('[SquareGame:stop] Game stopped!')
    this.hide()
    if (this.events.stop) {
      this.events.stop.forEach(callback => {
        callback()
      })
    }
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

  addSquare (point, size) {
    this.worker.postMessage({ event: 'create', request: { point, size } })
  }
}

export default SquareGame
