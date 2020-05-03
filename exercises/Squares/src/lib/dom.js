const $HIDDEN = 'hidden'

class DOM {
  static createInput (title, name, value = '') {
    const element = document.createElement('div')
    element.setAttribute('id', name)
    element.classList.add(name)

    const label = document.createElement('label')
    label.classList.add(`label-${name}`)
    label.innerText = title

    const input = document.createElement('input')
    input.setAttribute('type', 'number')
    input.setAttribute('value', value)
    input.classList.add(`input-${name}`)

    element.appendChild(label)
    element.appendChild(input)
    return element
  }

  static createButton (title, name) {
    const button = document.createElement('input')
    button.setAttribute('type', 'button')
    button.setAttribute('value', title)
    button.setAttribute('id', name)
    button.classList.add(name)

    return button
  }

  static createBlock (name, content) {
    const element = document.createElement('div')
    element.setAttribute('id', name)
    element.classList.add(name)
    if (content) element.innerText = content

    return element
  }

  static createContainer (name) {
    const element = document.createElement('div')
    element.setAttribute('id', name)
    element.classList.add(name)

    return element
  }

  static removeElement (element) {
    console.log('[DOM:removeElement] element', element)
    if (!element) return

    while (element.firstChild) {
      element.removeChild(element.firstChild)
    }
  }

  static find (subject) {
    let element = document.querySelector('#' + subject)
    if (element) return element

    element = document.querySelector('.' + subject)
    if (element) return element

    return document.querySelector(subject)
  }

  static remove (selector) {
    const targets = document.querySelectorAll(selector)
    console.log('[DOM:clear]', selector, targets)
    targets.forEach((target) => {
      DOM.removeElement(target)
    })
  }

  static show (subject) {
    const element = DOM.find(subject)
    element.classList.remove($HIDDEN)

    return element
  }

  static hide (subject) {
    const element = DOM.find(subject)
    if (element) element.classList.add($HIDDEN)

    return element
  }

  static hideElement (element) {
    if (element) element.classList.add($HIDDEN)

    return element
  }
}

export default DOM
