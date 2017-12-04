import React, {Component} from 'react'
import {connect} from 'react-redux'
import ReactRevealText from 'react-reveal-text'
import history from '../history'


export class NavBar extends Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }


  handleClick (e) {
    history.push('/')
    window.location.reload();
  }
    render () {

    return (
      <div id="navbar" >
          <div>
        {<h1 id="navmargin" onClick={e => this.handleClick(e)}>VIBEZ</h1>}
          </div>
      </div>
    )
  }
}

export default connect()(NavBar)
