import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter, Link} from 'react-router-dom'

import { tagOptionsThunk } from '../store'

/**
 * COMPONENT
 *  The Main component is our 'picture frame' - it displays the navbar and anything
 *  else common to our entire app. The 'picture' inside the frame is the space
 *  rendered out by the component's `children`.
 */
class Landing extends Component {
    constructor() {
        super()
    }

    render() {
        console.log(this.props)
        return (
            <div>
                <h1>Set the Mood...</h1>
                <div>
                    <form onSubmit={e => this.props.handleSubmit(e)}>
                        <h3>What song best sets the mood?</h3>
                        Song Name: <input type="text" name="song"/>
                        <br/>
                        <br/>
                        Artist: <input type="text" name="artist"/>
                        <br/>
                        <br/>
                        <button type="submit">Get the mood right</button>
                    </form>
                </div>
            </div>
        )
    }
}

const mapState = (state) => {
    return {
      tagOptions: state.tagOptions
    }
  }
  
  const mapDispatch = (dispatch) => {
    return {
        handleSubmit (evt) {
            evt.preventDefault()
            const song = evt.target.song.value
            const artist = evt.target.artist.value
            dispatch(tagOptionsThunk(song, artist))
        }
      }
  }



// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Landing))

