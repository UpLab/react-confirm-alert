import React from 'react'
import ReactDOM from 'react-dom'
import { confirmAlert, ConfirmAlertContainer } from '../src'
import '../src/react-confirm-alert.css'

class App extends React.Component {
  handleClickCustomUI = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui'>
            <h1>Are you sure?</h1>
            <p>You want to delete this file?1</p>
            <button onClick={() => confirmAlert({
              customUI: ({ onClose }) => {
                return (
                  <div className='custom-ui'>
                    <h1>Are you sure?</h1>
                    <p>You want to delete this file?2</p>
                    <button onClick={() => confirmAlert({
                      customUI: ({ onClose }) => {
                        return (
                          <div className='custom-ui'>
                            <h1>Are you sure?</h1>
                            <p>You want to delete this file?3</p>
                            <button onClick={onClose}>No</button>
                            <button onClick={onClose}>Yes, Delete it!</button>
                          </div>
                        )
                      }
                    })}>No</button>
                    <button onClick={onClose}>Yes, Delete it!</button>
                  </div>
                )
              }
            })}>No</button>
            <button onClick={onClose}>Yes, Delete it!</button>
          </div>
        )
      }
    })
  }

  render () {
    return (
      <div className='main-container'>
        <section className='section1'>
          <div className='center'>
            <div className='title'>React confirm alert 2</div>
            <br />
            <br />
            <a href='javascript:;' className='button outline' onClick={this.handleClickCustomUI}>
              Show confirm Custom UI
            </a>
          </div>
        </section>
        <ConfirmAlertContainer />
      </div>
    )
  }
}

const rootEl = document.getElementById('root')
ReactDOM.render(<App />, rootEl)
