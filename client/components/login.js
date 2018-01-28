import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter, Link} from 'react-router-dom'
import history from '../history'

import { detect } from 'detect-browser'

export const Login = props => {
  const browser = detect();

  return (browser.name === 'safari') ?
    (
      <div id="safari">
        sorry, safari is not supported
      </div>
    )
  : (
    <div className="login-window">
      <div className="login-main">
        <a href="/api/spotifyAuth/login">AUDIO</a> <img id="spotify-logo" src="/spotify-icon.png"/>
      </div>
      <div className="login" onClick={e => {history.push('/landing')}}>
        <a>VIDEO<img id="youtube-logo" src="/youtube-icon.png"/></a>
      </div>
      <div id="login-disappear">
        playlist maker
      </div>
    </div>
  )
}