import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter, Link} from 'react-router-dom'
import history from '../history'
import YouTube from 'react-youtube'
import ReactRevealText from 'react-reveal-text'


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
            started: false,
            show: false
        }
        this.getVideo = this.getVideo.bind(this)
        this._onReady = this._onReady.bind(this)
        this._onRemove = this._onRemove.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
    }

    componentDidMount() {
        setTimeout(() => {
          this.setState({ show: true });
        }, 500);
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

    handleKeyPress(e) {
        console.log(e.key)
    }
    

    render() {
        const bgStyles = {
            background: 'linear-gradient(135deg, #723362, #9d223c)',
            padding: '36px',
          };
          const textStyles = {
            color: 'white',
            fontSize: '24px',
            lineHeight: '36px',
            fontFamily: 'sans-serif',
            textAlign: 'center',
            letterSpacing: '1em',
            paddingLeft: '1em', // to compensate for letter spacing
          };


        console.log(this.state)
        const opts = {
            height: '390',
            width: '640',
            playerVars: { // https://developers.google.com/youtube/player_parameters
              autoplay: 1
            }
          };
        return (
            <div id="player" onKeyPress={this.handleKeyPress}>
                {   this.props.playlist.playlistArr ? (
                    <div id="player">
                        <div className="control" 
                        onKeyPress={this.handleKeyPress}
                        onClick={e => this.setState({
                            videoToggle: (+this.state.videoToggle - 1)
                            })}>
                        prev
                        </div>
                    < YouTube playing
                    videoId={this.props.playlist.playlistArr[+this.state.videoToggle].youtubeid} 
                    onEnd={this.getVideo}
                    opts={opts}
                    onStateChange={this._onRemove}
                    onReady={this._onReady}
                    />
                        <div className="control" 
                        onKeyPress={this.handleKeyPress}
                        onClick={e => this.setState({
                            videoToggle: (+this.state.videoToggle + 1)
                            })}>
                        next
                        </div>
                    </div>
                ) : <div className="flex-center">
                          <div id="loading">
                            <div style={textStyles}>
                            <ReactRevealText show={this.state.show} text="...vibing..." />
                            </div>
                    </div>
                    </div>
                }
                {   this.props.playlist.playlistArr ? (
                    <table>
                    {this.props.playlist.playlistArr.map((song, i) => {
                        return (
                            <tr key={`${i}div`}>

                                <th className={(i === +this.state.videoToggle) ? "leftselect" : "left"} onClick={(e) => this.handleClick(e, i)} key={i}>
                                    {song.name} - {song.artist}
                                </th>
                                <th
                                    className="hover-red"
                                    key={`${i}a`} 
                                    onClick={(e) => this.props.removeTrack(e, this.props.playlist, i)}
                                >
                                    x 
                                </th>
                            </tr>
                        )
                    })}
                    </table>
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