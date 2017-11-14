import React, {Component} from 'react'
import {connect} from 'react-redux'
import ReactRevealText from 'react-reveal-text'
import history from '../history'

/**
 * COMPONENT
 */
class NavBar extends Component {
  consructor() {
    props()
    this.handleClick = this.handClick.bind(this)
  }

  handClick (e) {
    history.push('/')
    window.location.reload();
    
  }
    render () {
    return (
      <div id="navbar">
          {/* <ReactRevealText className="navbar">VIBEZ</ReactRevealText> */}
        {<h1 onClick={e => this.handClick(e)}>VIBEZ</h1>}
      </div>
    )
  }
}

/**
 * CONTAINER
 */
// const mapState = (state) => {
//   return {
//     email: state.user.email
//   }
// }

export default connect()(NavBar)
