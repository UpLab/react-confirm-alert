import React, { Component, useState } from 'react'
import { find } from 'lodash'

let containerDivRef
let globalState = []
let rerender

const addToGlobalState = (el) => {
  document.body.classList.add('react-confirm-alert-body-element')
  globalState = [...globalState, el]
  rerender()
}

const removeFromGlobalState = (id) => {
  document.body.classList.remove('react-confirm-alert-body-element')
  globalState = globalState.filter((existingEl) => existingEl.id !== id)
  rerender()
}

export default class ReactConfirmAlert extends Component {
  handleClickButton = (button) => {
    if (button.onClick) button.onClick()
    this.close()
  }

  handleClickOverlay = (e) => {
    const { closeOnClickOutside, onClickOutside } = this.props
    const isClickOutside = e.target === this.overlay

    if (closeOnClickOutside && isClickOutside) {
      onClickOutside()
      this.close()
    }
  }

  close = () => {
    const { afterClose, id } = this.props
    removeFromGlobalState(id)
    afterClose()
  }

  keyboardClose = (event) => {
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
    return (
      <div
        className='react-confirm-alert-overlay'
        ref={(dom) => (this.overlay = dom)}
        onClick={this.handleClickOverlay}
      >
        <div className='react-confirm-alert'>
          {this.renderCustomUI()}
        </div>
      </div>
    )
  }
}

ReactConfirmAlert.defaultProps = {
  closeOnClickOutside: true,
  closeOnEscape: true,
  willUnmount: () => null,
  afterClose: () => null,
  onClickOutside: () => null,
  onKeypressEscape: () => null
}

export function confirmAlert (properties) {
  window.setTimeout(() => {
    const id = Math.random().toString(36).substring(7)
    addToGlobalState({ id, component: <ReactConfirmAlert {...properties} id={id} /> })
  }, 0)
}

export const ConfirmAlertRenderer = ({ id }) => { const c = find(globalState, { id }); return (c && c.component) || null }
export const MemoConfirmAlertRenderer = React.memo(ConfirmAlertRenderer)
export const ConfirmAlertContainer = () => {
  const [, setState] = useState()
  rerender = () => setState(Math.random())

  return (
    <div ref={containerDivRef}>
      {globalState.map(({ id }) => <ConfirmAlertRenderer id={id} key={id} />)}
    </div>
  )
}
