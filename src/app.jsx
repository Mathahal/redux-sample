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
        <FormInput url="/api.php" handleSend={this.props.onClickToSend} />
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
        this.props.handleSend( data.param )
      })
  }
  render() {
    return (
      <form>
        <input type="text" ref="myInput" defaultValue="" />
        <button onClick={ (event) => { this.send(event) }}>Send</button>
      </form>
    )
  }
}

// Veiw (Presentational Components)
class FormDisplay extends React.Component {
  render() {
    
    var testsetset = this.props.data.map( (single) => {
      return( <li key={single.id}>{single.message}</li> )
    } )
    return (
      <ul>
        {testsetset}
      </ul>
    )
  }
}

/* Actionsの実装 */
// Action名の定義
const SEND = 'SEND'

// Action Creators
function send(value) {
  // Action
  return {
    type: SEND, value
  }
}

/* Reducersの実装 */
function formReducer(state, action) {
  switch (action.type) {
    case 'SEND':
      return Object.assign({}, state, {
        value: action.value,
      })
    default:
      return state
  }
}
/* Storeの実装 */
const initialState = {
  value: [],
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
