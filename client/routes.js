import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Router} from 'react-router'
import {Route, Switch} from 'react-router-dom'
import PropTypes from 'prop-types'
import history from './history'
import {Landing, TagOptions, Playlist} from './components'
import {me} from './store'
import NavBar from './components/nav-bar'

/**
 * COMPONENT
 */
class Routes extends Component {

  render () {
    const {isLoggedIn} = this.props

    return (
      <div id="global">
        <NavBar />
        <div id="main">
      <Router history={history}>
        <Switch>
          <Route path="/tagoptions" component={TagOptions}/>
          <Route path="/playlist" component={Playlist}/>
          <Route path="/" component={Landing}/>
        </Switch>
      </Router>
      </div>
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
    // Otherwise, state.user will be an empty object, and state.user.id will be falsey
    isLoggedIn: !!state.user.id
  }
}

export default connect(mapState)(Routes)

/**
 * PROP TYPES
 */
// Routes.propTypes = {
//   loadInitialData: PropTypes.func.isRequired,
//   isLoggedIn: PropTypes.bool.isRequired
// }
