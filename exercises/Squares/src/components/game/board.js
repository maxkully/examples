import Square from './square'

class Board {
  constructor () {
    this.runningSquares = {}
    this.minSize = 5
    this.playground = {}
  }

  resize (width, height) {
    console.log('[Board:resize] ', width, height)
    this.width = width
    this.height = height

    return [this.width, this.height]
  }

  generateSquares (count, size, minSize, callback) {
    this.minSize = minSize
    let i = 0
    let collisions = 0
    while (i < count) {
      const position = {
        x: Math.floor(Math.random() * (this.width - size)),
        y: Math.floor(Math.random() * (this.height - size))
      }
      let collision = false

      Object.keys(this.runningSquares).map(key => {
        if (collision) return
        this.playground[key].map(side => {
          if (collision) return
          [
            [{ x: position.x, y: position.y + size }, { x: position.x, y: position.y }],
            [{ x: position.x, y: position.y }, { x: position.x + size, y: position.y }],
            [{ x: position.x + size, y: position.y }, { x: position.x + size, y: position.y + size }],
            [{ x: position.x + size, y: position.y + size }, { x: position.x, y: position.y + size }]
          ].map(currentSide => {
            if (collision) return
            if (!this.touchSquare(currentSide, side)) return
            collision = true
            collisions++
            console.log('Found collision. Regenerating position', collision)
          })
        })
      })

      if (collisions > 1000) {
        break
      }
      if (collision) continue

      const sq = this.createSquare({
        size,
        position,
        angle: Math.floor(Math.random() * 360),
        board: this
      })
      sq.play()
      i++
      collisions = 0
      console.log('generated ', i, 'squares')
    }

    if (callback) callback()
  }

  addSquare (position, size) {
    let collision = false
    console.log('ADD SQUARE', position, size, this.width, this.height)

    if (position.x + size > this.width) {
      console.log('Reject!')
      return
    }
    if (position.y + size > this.height) {
      console.log('Reject!')
      return
    }
    Object.keys(this.runningSquares).map(key => {
      if (collision) return
      this.playground[key].map(side => {
        if (collision) return
        [
          [{ x: position.x, y: position.y + size }, { x: position.x, y: position.y }],
          [{ x: position.x, y: position.y }, { x: position.x + size, y: position.y }],
          [{ x: position.x + size, y: position.y }, { x: position.x + size, y: position.y + size }],
          [{ x: position.x + size, y: position.y + size }, { x: position.x, y: position.y + size }]
        ].map(currentSide => {
          if (collision) return
          if (!this.touchSquare(currentSide, side)) return
          collision = true
          console.log('found collision, reject!')
        })
      })
    })

    return { collision, position, size }
  }

  createSquare (props) {
    console.log('createSquare', props)
    const square = new Square(props)
    this.runningSquares[square.id] = square
    // square.append(this.target)

    return square
  }

  clearSquares () {
    Object.keys(this.runningSquares).map(key => {
      this.runningSquares[key].remove()
      delete this.runningSquares[key]
      delete this.playground[key]
    })
  }

  stop (id) {
    if (this.runningSquares[id]) {
      const square = this.runningSquares[id]
      square.remove()
      delete this.runningSquares[id]
      delete this.playground[id]
    }
  }

  broadcast (id, direction, currentSides) {
    // console.log('broadcast', id, direction, currentSides)
    if (!this.runningSquares[id]) return 'removed'
    let environment = 'clear'

    this.playground[id] = currentSides
    let exploded = false
    let bumped = false
    let currentSide
    const lead = this.runningSquares[id]

    Object.keys(this.playground).map(key => {
      if (exploded) return
      if (bumped) return
      if (id === key) return
      if (!this.playground[key]) return 'removed'

      let coordinates
      const affected = this.runningSquares[key]
      const leadSize = Math.floor(lead.size / 2)
      const affectedSize = Math.floor(affected.size / 2)

      switch (direction) {
        case 'left':
          currentSide = currentSides[0]
          coordinates = {
            first: {
              size: leadSize,
              position: {
                x: lead.pos.x + 1,
                y: lead.pos.y - 1
              },
              angle: lead.angle + 135,
              board: this
            },
            second: {
              size: leadSize,
              position: {
                x: lead.pos.x + 1,
                y: lead.pos.y + lead.size - leadSize + 1
              },
              angle: lead.angle - 135,
              board: this
            },
            third: {
              size: affectedSize,
              position: {
                x: affected.pos.x + affected.size - affectedSize - 1,
                y: affected.pos.y - 1
              },
              angle: affected.angle - 135,
              board: this
            },
            fourth: {
              size: affectedSize,
              position: {
                x: affected.pos.x + affected.size - affectedSize - 1,
                y: affected.pos.y + affected.size - affectedSize + 1
              },
              angle: affected.angle + 135,
              board: this
            }
          }
          break
        case 'up':
          currentSide = currentSides[1]
          coordinates = {
            first: {
              size: leadSize,
              position: {
                x: lead.pos.x - 1,
                y: lead.pos.y + lead.size - leadSize + 1
              },
              angle: lead.angle + 225,
              board: this
            },
            second: {
              size: leadSize,
              position: {
                x: lead.pos.x + lead.size - leadSize + 1,
                y: lead.pos.y + lead.size - leadSize + 1
              },
              angle: lead.angle + 135,
              board: this
            },
            third: {
              size: affectedSize,
              position: {
                x: affected.pos.x - 1,
                y: affected.pos.y - 1
              },
              angle: affected.angle + 135,
              board: this
            },
            fourth: {
              size: affectedSize,
              position: {
                x: affected.pos.x + affected.size - affectedSize + 1,
                y: affected.pos.y - 1
              },
              angle: affected.angle - 135,
              board: this
            }
          }
          break
        case 'right':
          currentSide = currentSides[2]
          coordinates = {
            first: {
              size: leadSize,
              position: {
                x: lead.pos.x + lead.size - leadSize - 1,
                y: lead.pos.y - 1
              },
              angle: lead.angle - 135,
              board: this
            },
            second: {
              size: leadSize,
              position: {
                x: lead.pos.x + lead.size - leadSize - 1,
                y: lead.pos.y + lead.size - leadSize + 1
              },
              angle: lead.angle + 135,
              board: this
            },
            third: {
              size: affectedSize,
              position: {
                x: affected.pos.x + 1,
                y: affected.pos.y - 1
              },
              angle: affected.angle + 135,
              board: this
            },
            fourth: {
              size: affectedSize,
              position: {
                x: affected.pos.x + 1,
                y: affected.pos.y + affected.size - affectedSize + 1
              },
              angle: affected.angle + 225,
              board: this
            }
          }
          break
        case 'down':
          currentSide = currentSides[3]
          coordinates = {
            first: {
              size: leadSize,
              position: {
                x: lead.pos.x - 1,
                y: lead.pos.y + lead.size - leadSize - 1
              },
              angle: lead.angle + 135,
              board: this
            },
            second: {
              size: leadSize,
              position: {
                x: lead.pos.x + lead.size - leadSize + 1,
                y: lead.pos.y + lead.size - leadSize - 1
              },
              angle: lead.angle + 225,
              board: this
            },
            third: {
              size: affectedSize,
              position: {
                x: affected.pos.x - 1,
                y: affected.pos.y + 1
              },
              angle: affected.angle - 135,
              board: this
            },
            fourth: {
              size: affectedSize,
              position: {
                x: affected.pos.x + affected.size - affectedSize + 1,
                y: affected.pos.y + 1
              },
              angle: affected.angle + 135,
              board: this
            }
          }
      }
      this.playground[key].map(side => {
        if (exploded) return
        if (!this.touchSquare(currentSide, side)) return

        this.runningSquares[key].touched = true
        this.runningSquares[id].touched = true
        exploded = true
        environment = 'bumped'
        console.log('EXPLODE', direction, id, key)
        console.log('explode', currentSides[2], side)

        const fragments = this.explode(coordinates)
        this.stop(id)
        this.stop(key)
        // fragments.map(square => square && square.move())
        fragments.map(square => square && square.play())
      })
    })

    switch (direction) {
      case 'left':
        currentSide = currentSides[0]
        if (this.touchLeftBorder(currentSide[0]) || this.touchLeftBorder(currentSide[1])) {
          console.log('BUMPED', direction, lead.angle, lead.id)
          bumped = true
          environment = 'bumped'
          this.bump(lead)
          return
        }
        break
      case 'up':
        currentSide = currentSides[1]
        if (this.touchTopBorder(currentSide[0]) || this.touchTopBorder(currentSide[1])) {
          console.log('BUMPED', direction, lead.angle, lead.id)
          bumped = true
          environment = 'bumped'
          this.bump(lead)
          return
        }
        break
      case 'right':
        currentSide = currentSides[2]
        if (this.touchRightBorder(currentSide[0]) || this.touchRightBorder(currentSide[1])) {
          console.log('BUMPED', direction, lead.angle, lead.id)
          bumped = true
          environment = 'bumped'
          this.bump(lead)
          return
        }
        break
      case 'down':
        currentSide = currentSides[3]
        if (this.touchBottomBorder(currentSide[0]) || this.touchBottomBorder(currentSide[1])) {
          console.log('BUMPED', direction, lead.angle, lead.id)
          bumped = true
          environment = 'bumped'
          this.bump(lead)
          return
        }
    }

    return environment
  }

  bump (square) {
    const sq = this.createSquare({
      size: square.size,
      position: square.pos,
      angle: square.randomRotate(180),
      board: this
    })
    square.bumped = true
    this.stop(square.id)
    sq.play()
  }

  explode (props) {
    let first, second, third, fourth

    if (props.first.size > this.minSize) {
      first = this.createSquare(props.first)
      second = this.createSquare(props.second)
    }

    if (props.fourth.size > this.minSize) {
      third = this.createSquare(props.third)
      fourth = this.createSquare(props.fourth)
    }

    return [first, second, third, fourth]
  }

  touchSquare (target, side) {
    // console.log('touchSquare', target, side)
    if (Math.max(target[0].x, target[1].x) < Math.min(side[0].x, side[1].x) ||
      Math.max(side[0].x, side[1].x) < Math.min(target[0].x, target[1].x)) {
      return false
    }

    return !(
      Math.max(target[0].y, target[1].y) < Math.min(side[0].y, side[1].y) ||
      Math.max(side[0].y, side[1].y) < Math.min(target[0].y, target[1].y)
    )
  }

  touchLeftBorder (point) {
    // console.log('touch left point', point)
    return point.x <= 0
  }

  touchRightBorder (point) {
    // console.log('touch right point', point)
    return point.x >= this.width
  }

  touchTopBorder (point) {
    // console.log('touch top point', point)
    return point.y <= 0
  }

  touchBottomBorder (point) {
    // console.log('touch bottom point', point)
    return point.y >= this.height
  }
}

export default Board
