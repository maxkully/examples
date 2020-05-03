class App {
  constructor (props) {
    this.container = document.getElementById(props.appId || 'app')
    this.form = props.formComponent
    this.game = props.gameComponent
    this.error = props.errorComponent
  }

  start () {
    this.setUpErrorHandler()
    try {
      this.setUpSquareForm()
      this.setUpGame()
    } catch (e) {
      console.error(e)
      this.error.publish(e.message)
    }
  }

  setUpErrorHandler () {
    this.error.render(this.container)
    this.error.hide()
  }

  setUpSquareForm () {
    this.form.render(this.container)
    this.form.subscribe('clickPlay', (count, size, minSize) => {
      console.log('[App:start] clickPlay handler', count, size, minSize)
      this.form.hide()
      this.game.play(count, size, minSize)
    })
  }

  setUpGame () {
    this.game.render(this.container)
    this.game.hide()
    this.game.subscribe('stop', () => {
      console.log(`[${this.constructor.name}:setUpGame] Call stop callback`)
      this.form.show()
    })
  }
}

export default App
