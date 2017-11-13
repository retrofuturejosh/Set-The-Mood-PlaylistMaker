import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter, Link} from 'react-router-dom'
import history from '../history'
import YouTube from 'react-youtube'

import { tagOptionsThunk, removeTrackThunk } from '../store'

/**
 * COMPONENT
 *  The Main component is our 'picture frame' - it displays the navbar and anything
 *  else common to our entire app. The 'picture' inside the frame is the space
 *  rendered out by the component's `children`.
 */
class Playlist extends Component {
    constructor() {
        super()
        this.state = {
            videoToggle: 0,
            started: false
        }
        this.getVideo = this.getVideo.bind(this)
        this._onReady = this._onReady.bind(this)
        this._onRemove = this._onRemove.bind(this)
    }

    getVideo () {
        console.log('getting video ', this.state)
        if (+this.state.videoToggle < 50){
            this.setState({videoToggle: +this.state.videoToggle + 1})
        }
    }

    handleClick (e, i) {
        this.setState({
            videoToggle: i
        })
    }
    

    render() {
        console.log(this.state)
        const opts = {
            height: '390',
            width: '640',
            playerVars: { // https://developers.google.com/youtube/player_parameters
              autoplay: 1
            }
          };
        return (
            <div>
                <h1>Set the Mood...</h1>
                {   this.props.playlist.playlistArr ? (
                    < YouTube playing
                    videoId={this.props.playlist.playlistArr[+this.state.videoToggle].youtubeid} 
                    onEnd={this.getVideo}
                    opts={opts}
                    onStateChange={this._onRemove}
                    onReady={this._onReady}
                    />
                ) : <div>Creating playlist!</div>
                }
                {   this.props.playlist.playlistArr ? (
                    this.props.playlist.playlistArr.map((song, i) => {
                        return (
                            <div key={`${i}div`}>
                                <div onClick={(e) => this.handleClick(e, i)} key={i}>
                                    {song.name} - {song.artist}
                                </div>
                                <button key={`${i}a`} onClick={(e) => this.props.removeTrack(e, this.props.playlist, i)}> x </button>
                            </div>
                        )
                    })
                ) : null
                }
            </div>
        )
    }
    _onReady(event) {
        // access to player in all event handlers via event.target
        if (!this.state.started){
            event.target.pauseVideo();
            this.setState({started: true})
        }
      }
      _onRemove(event) {
        // access to player in all event handlers via event.target
        if (!this.state.started){
            event.target.pauseVideo();
        }
      }      
}

const mapState = (state) => {
    return {
      chosenTags: state.chosenTags,
      playlist: state.playlist
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
        },
        removeTrack (e, currentPlaylist, idx) {
            console.log('i fired!')
            let playlistCopy = Object.assign({}, currentPlaylist)
            playlistCopy.playlistArr.splice(idx, 1)
            console.log('playlist copy is ', playlistCopy)
            dispatch(removeTrackThunk(playlistCopy))
          }
      }
  }



// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Playlist))