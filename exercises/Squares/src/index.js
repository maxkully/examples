import './scss/style.scss'
import './favicon.ico'

import App from './app'
import SquareForm from './components/form'
import SquareGame from './components/game'
import SquareError from './components/error'

const app = new App({
  appId: 'app',
  formComponent: new SquareForm(),
  gameComponent: new SquareGame(),
  errorComponent: new SquareError()
})
app.start()
