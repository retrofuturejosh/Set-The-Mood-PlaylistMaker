import React, {Component} from 'react'
import {connect} from 'react-redux'
import ReactRevealText from 'react-reveal-text'
import history from '../history'


class NavBar extends Component {
  constructor(props) {
    super(props)

    this.handleClick = this.handClick.bind(this)

  }


  handClick (e) {
    history.push('/')
    window.location.reload();
    
  }
    render () {

    return (
      <div id="navbar" >
          <div>
        {<h1 id="navmargin" onClick={e => this.handClick(e)}>VIBEZ</h1>}
          </div>
      </div>
    )
  }
}

export default connect()(NavBar)
