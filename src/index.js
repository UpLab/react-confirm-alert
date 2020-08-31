import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { render, unmountComponentAtNode } from 'react-dom'

export default class ReactConfirmAlert extends Component {
  static propTypes = {
    title: PropTypes.string,
    message: PropTypes.string,
    buttons: PropTypes.array.isRequired,
    childrenElement: PropTypes.func,
    customUI: PropTypes.func,
    closeOnClickOutside: PropTypes.bool,
    closeOnEscape: PropTypes.bool,
    willUnmount: PropTypes.func,
    afterClose: PropTypes.func,
    onClickOutside: PropTypes.func,
    onKeypressEscape: PropTypes.func,
    id: PropTypes.string
  }

  static defaultProps = {
    buttons: [
      {
        label: 'Cancel',
        onClick: () => null,
        className: null
      },
      {
        label: 'Confirm',
        onClick: () => null,
        className: null
      }
    ],
    childrenElement: () => null,
    closeOnClickOutside: true,
    closeOnEscape: true,
    willUnmount: () => null,
    afterClose: () => null,
    onClickOutside: () => null,
    onKeypressEscape: () => null
  }

  handleClickButton = button => {
    if (button.onClick) button.onClick()
    this.close()
  }

  handleClickOverlay = e => {
    const { closeOnClickOutside, onClickOutside } = this.props
    const isClickOutside = e.target === this.overlay

    if (closeOnClickOutside && isClickOutside) {
      onClickOutside()
      this.close()
    }
  }

  close = () => {
    const { afterClose, id } = this.props
    removeBodyClass(id)
    removeElementReconfirm(id)
    removeSVGBlurReconfirm(afterClose, id)
  }

  keyboardClose = event => {
    const { closeOnEscape, onKeypressEscape } = this.props
    const isKeyCodeEscape = event.keyCode === 27

    if (closeOnEscape && isKeyCodeEscape) {
      onKeypressEscape(event)
      this.close()
    }
  }

  componentDidMount = () => {
    document.addEventListener('keydown', this.keyboardClose, false)
  }

  componentWillUnmount = () => {
    document.removeEventListener('keydown', this.keyboardClose, false)
    this.props.willUnmount()
  }

  renderCustomUI = () => {
    const { title, message, buttons, customUI } = this.props
    const dataCustomUI = {
      title,
      message,
      buttons,
      onClose: this.close
    }

    return customUI(dataCustomUI)
  }

  render () {
    const { title, message, buttons, childrenElement, customUI } = this.props

    return (
      <div
        className='react-confirm-alert-overlay'
        ref={dom => (this.overlay = dom)}
        onClick={this.handleClickOverlay}
      >
        <div className='react-confirm-alert'>
          {customUI ? (
            this.renderCustomUI()
          ) : (
            <div className='react-confirm-alert-body'>
              {title && <h1>{title}</h1>}
              {message}
              {childrenElement()}
              <div className='react-confirm-alert-button-group'>
                {buttons.map((button, i) => (
                  <button key={i} onClick={() => this.handleClickButton(button)} className={button.className}>
                    {button.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

// function createSVGBlurReconfirm (id) {
//   // If has svg ignore to create the svg
//   const svg = document.getElementById('react-confirm-alert-firm-svg')
//   if (svg) return
//   const svgNS = 'http://www.w3.org/2000/svg'
//   const feGaussianBlur = document.createElementNS(svgNS, 'feGaussianBlur')
//   feGaussianBlur.setAttribute('stdDeviation', '0.3')

//   const filter = document.createElementNS(svgNS, 'filter')
//   filter.setAttribute('id', 'gaussian-blur')
//   filter.appendChild(feGaussianBlur)

//   const svgElem = document.createElementNS(svgNS, 'svg')
//   svgElem.setAttribute('id', 'react-confirm-alert-firm-svg')
//   svgElem.setAttribute('class', 'react-confirm-alert-svg')
//   svgElem.appendChild(filter)

//   document.body.appendChild(svgElem)
// }

function removeSVGBlurReconfirm (afterClose, id) {
  // const svg = document.getElementById('react-confirm-alert-firm-svg')
  // svg.parentNode.removeChild(svg)
  document.body.children[0].classList.remove(`react-confirm-alert-blur-${id}`)
  afterClose()
}

function createElementReconfirm (properties, id) {
  let divTarget
  document.body.children[0].classList.add(`react-confirm-alert-blur-${id}`)
  divTarget = document.createElement('div')
  divTarget.id = `react-confirm-alert-${id}`
  document.body.appendChild(divTarget)
  render(<ReactConfirmAlert {...properties} id={id} />, divTarget)
}

function removeElementReconfirm (id) {
  const target = document.getElementById(`react-confirm-alert-${id}`)
  if (target) {
    unmountComponentAtNode(target)
    target.parentNode.removeChild(target)
  }
}

function addBodyClass (id) {
  document.body.classList.add(`react-confirm-alert-body-element-${id}`)
}

function removeBodyClass (id) {
  document.body.classList.remove(`react-confirm-alert-body-element-${id}`)
}

export function confirmAlert (properties) {
  let r = Math.random().toString(36).substring(7)
  console.log('random', r)

  const id = r
  addBodyClass(id)
  // createSVGBlurReconfirm()
  createElementReconfirm(properties, id)
}
