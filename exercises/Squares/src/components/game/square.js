import sjcl from 'sjcl'
const $SQUARE = 'square'

class Square {
  constructor (props = {}) {
    this.size = props.size || 20
    this.pos = props.position || { x: 0, y: 0 }
    this.angle = 0
    this.board = props.board

    // this.square = document.createElement('div')
    // this.square.classList.add($SQUARE)
    this.visibility = false
    this.environment = 'clear'
    this.touched = false
    this.bumped = false
    this.id = sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(Date.now()))
    // this.square.id = this.id

    this.rotate(props.angle || 0)
    // this.point()
  }

  sides () {
    return [
      [{ x: this.pos.x, y: this.pos.y + this.size }, { x: this.pos.x, y: this.pos.y }],
      [{ x: this.pos.x, y: this.pos.y }, { x: this.pos.x + this.size, y: this.pos.y }],
      [{ x: this.pos.x + this.size, y: this.pos.y }, { x: this.pos.x + this.size, y: this.pos.y + this.size }],
      [{ x: this.pos.x + this.size, y: this.pos.y + this.size }, { x: this.pos.x, y: this.pos.y + this.size }]
    ]
  }

  append (target) {
    this.target = target
    target.appendChild(this.square)
    this.visibility = true
  }

  remove () {
    const square = document.getElementById(this.id)
    square.classList.add('explode')
    setTimeout(() => {
      while (document.getElementById(this.id)) {
        if (this.target.removeChild(document.getElementById(this.id))) this.visibility = false
      }
    }, 500)
  }

  // point () {
  //   this.square.style.width = `${this.size}px`
  //   this.square.style.height = `${this.size}px`
  //   this.square.style.left = `${this.pos.x}px`
  //   this.square.style.top = `${this.pos.y}px`
  // }

  moveLeft () {
    if (this.touched) return this
    if (this.bumped) return this
    if (this.scout('left')) this.pos.x -= 1

    return this
  }

  moveUp () {
    if (this.touched) return this
    if (this.bumped) return this
    if (this.scout('up')) this.pos.y -= 1

    return this
  }

  moveRight () {
    if (this.touched) return this
    if (this.bumped) return this
    if (this.scout('right')) this.pos.x += 1

    return this
  }

  moveDown () {
    if (this.touched) return this
    if (this.bumped) return this
    if (this.scout('down')) this.pos.y += 1

    return this
  }

  rotate (angle) {
    this.angle += angle
    if (this.angle > 359) this.angle -= 360
    if (this.angle < 0) this.angle += 360
    console.log('rotate', this.id, this.angle)

    return this.angle
  }

  randomRotate (angle) {
    Math.random() < 0.501 ? angle += 45 : angle -= 45
    this.rotate(angle)

    return this.angle
  }

  scout (direction) {
    this.environment = this.board.broadcast(this.id, direction, this.sides())
    return this.environment === 'clear'
  }

  move () {
    const angle = this.angle

    if (angle < 22 || angle >= 337) this.moveLeft()
    else if (angle < 67) this.moveLeft().moveUp()
    else if (angle < 112) this.moveUp()
    else if (angle < 157) this.moveRight().moveUp()
    else if (angle < 202) this.moveRight()
    else if (angle < 247) this.moveDown().moveRight()
    else if (angle < 292) this.moveDown()
    else if (angle < 337) this.moveLeft().moveDown()
    // this.point()
  }

  play () {
    if (this.visibility) {
      this.move()

      this.environment = 'clear'
      setTimeout(() => {
        this.play()
      }, 10)
    }
  }
}

export default Square
