import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter, Link} from 'react-router-dom'
import history from '../history'

import { tagOptionsThunk } from '../store'

/**
 * COMPONENT
 *  The Main component is our 'picture frame' - it displays the navbar and anything
 *  else common to our entire app. The 'picture' inside the frame is the space
 *  rendered out by the component's `children`.
 */
class Playlist extends Component {
    constructor() {
        super()
    }

    render() {
        return (
            <div>
                <h1>Set the Mood...</h1>
            </div>
        )
    }
}

const mapState = (state) => {
    return {
      chosenTags: state.chosenTags
    }
  }
  
  const mapDispatch = (dispatch) => {
    return {
        handleSubmit (evt) {
            evt.preventDefault()
            const song = evt.target.song.value
            const artist = evt.target.artist.value
            dispatch(tagOptionsThunk(song, artist))
            history.push('/tagoptions')
        }
      }
  }



// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Playlist))