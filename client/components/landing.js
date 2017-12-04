import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter, Link} from 'react-router-dom'
import history from '../history'

import { tagOptionsThunk, setTrackThunk } from '../store'

export class Landing extends Component {
    constructor() {
        super()
    }

    render() {
        return (
            <div>
                <div>
                    <form className="form" onSubmit={e => this.props.handleSubmit(e)}>
                        <div className="line">
                        <h3>what song best fits the vibe you want?</h3>
                        song: <input className="input" type="text" name="song"/>
                        </div>
                        <div className="line">
                        artist: <input type="text" className="input"name="artist"/>
                        </div>
                        <div className="line">
                        <button id="entersong" type="submit">SET VIBEZ</button>
                        </div>
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
            dispatch(setTrackThunk(artist, song))
            dispatch(tagOptionsThunk(song, artist))
            history.push('/tagoptions')
        }
      }
  }


export default withRouter(connect(mapState, mapDispatch)(Landing))

