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
        <a href="/api/spotifyAuth/login">vibe with Spotify</a>
      </div>
      <div className="login" onClick={e => {history.push('/landing')}}>
        <a>vibe without Spotify</a>
      </div>
      <div id="login-disappear">
        playlist maker
      </div>
    </div>
  )
}