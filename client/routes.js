import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Router} from 'react-router'
import {Route, Switch} from 'react-router-dom'
import PropTypes from 'prop-types'
import history from './history'
import {Landing, TagOptions, Playlist} from './components'
import NavBar from './components/nav-bar'

/**
 * COMPONENT
 */
class Routes extends Component {

  render () {

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

export default Routes
