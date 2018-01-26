import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter, Link} from 'react-router-dom'
import history from '../history'

export const Login = props => {
  return (
    <div>
      <div className="login">
        <a href="/api/spotifyAuth/login" style={{"color":"white"}}>Log in with Spotify</a>
      </div>
      <div className="login">
        <a href="/landing" style={{"color":"white"}}>Continue without Spotify</a>
      </div>
    </div>
  )
}