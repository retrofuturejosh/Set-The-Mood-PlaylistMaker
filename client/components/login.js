import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter, Link} from 'react-router-dom'
import history from '../history'

export const Login = props => {
  return (
    <div>
      <a href="/api/spotifyAuth/login" className="btn btn-primary">Log in with Spotify</a>
    </div>
  )
}