import request from 'superagent'
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'

const cl = obj => console.log( obj )

/* Viewの実装 */
// View (Container Components)
class FormApp extends React.Component {
  render() {
    return (
      <div>
        <FormInput url="/api.php" handleSend={this.props.onClickToSend} handleClear={this.props.onClickToClear} />
        <FormDisplay data={this.props.value} />
      </div>
    )
  }
}

// View (Presentational Components)
class FormInput extends React.Component {
  send(e) {
    e.preventDefault()
    let val = this.refs.myInput.value.trim()
    if( val == '' ) return true
    this.ajaxing( val )
    this.refs.myInput.value = ''
    return
  }
  ajaxing( value ){
    request
      .get( this.props.url )
      .query( { param: value } )
      .end(( err, res ) => {
        let data = JSON.parse(res.text),
            str = ''
        for (var value of data.param) {
          str += `id: ${value.id}, message: ${value.message}\n`
        }
        this.props.handleSend( str )
      })
  }
  clear(){
    this.props.handleClear()
  }
  render() {
    return (
      <form>
        <input type="text" ref="myInput" defaultValue="" />
        <button onClick={ (event) => { this.send(event) }}>Send</button>
        <p onClick={ (event) => { this.clear() } }>Clear</p>
      </form>
    )
  }
}

// Veiw (Presentational Components)
class FormDisplay extends React.Component {
  render() {
    return (
      <div>{this.props.data}</div>
    )
  }
}

/* Actionsの実装 */
// Action名の定義
const SEND = 'SEND',
      CLEAR = 'CLEAR'

// Action Creators
function send(value) {
  // Action
  return {
    type: SEND, value,
  }
}
function clear() {
  return {
    type: CLEAR
  }
}


/* Reducersの実装 */
function formReducer(state, action) {
  switch (action.type) {
    case 'SEND':
      return Object.assign({}, state, {
        value: action.value,
      })
    case 'CLEAR':
      return Object.assign({}, state, {
        value: 'cleared',
      })      
    default:
      return state
  }
}
/* Storeの実装 */
const initialState = {
  value: null,
}
const store = createStore(formReducer, initialState)


// Connect to Redux
function mapStateToProps(state) {
  return {
    value: state.value
  }
}
function mapDispatchToProps(dispatch) {
  return {
    onClickToSend(value) {
      dispatch(send(value))
    },
    onClickToClear() {
      dispatch(clear())
    },
  }
}

const AppContainer = connect( mapStateToProps, mapDispatchToProps )(FormApp)

// Rendering
ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.querySelector('.content')
)
