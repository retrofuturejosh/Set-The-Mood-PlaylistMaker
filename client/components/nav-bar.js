import React, {Component} from 'react'
import {connect} from 'react-redux'
import ReactRevealText from 'react-reveal-text'
import history from '../history'

import { viewed } from '../store'


export class NavBar extends Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount() {
    if (window.location.pathname === '/landing') {
      this.props.viewedonce(1)
    }
  }

  handleClick (e) {
    history.push('/')
    window.location.reload();
  }
    render () {
      return (
        <div id={(this.props.firstview > 1 || window.location.pathname.slice(0, 8) === '/landing') ? "navbar-stay" : "navbar"} >
            <div>
          {<h1 id="navmargin" onClick={e => this.handleClick(e)}>VIBEZ</h1>}
            </div>
        </div>
      )
  }
}

const mapState = (state) => {
  return {
    firstview: !state.firstview
  }
}

const mapDispatch = (dispatch) => {
  return {
      viewedonce (num) {
        dispatch(viewed(num))
      }
    }
}

export default connect(mapState, mapDispatch)(NavBar)
