import Board from './components/game/board'

console.log('[square.worker] Worker started!')
const board = new Board()

// Respond to message from parent thread
self.addEventListener('message', e => {
  console.log('[square.worker] Received message: ', e.data)
  const request = e.data.request
  const event = e.data.event
  switch (event) {
    case 'resize': {
      const [width, height] = request
      const response = board.resize(width, height)
      self.postMessage({ event, response })
      break
    }
    case 'generate': {
      board.generateSquares(request.count, request.size, request.minSize, () => {
        Object.keys(board.runningSquares).map(key => {
          self.postMessage({ event: 'create', response: board.runningSquares[key]})
        })
      })
      break
    }
  }
})
