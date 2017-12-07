import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter, Link} from 'react-router-dom'
import history from '../history'
import YouTube from 'react-youtube'
import ReactRevealText from 'react-reveal-text'


import { tagOptionsThunk, removeTrackThunk } from '../store'

export class Playlist extends Component {
    constructor() {
        super()
        this.state = {
            videoToggle: 0,
            started: false,
            show: false,
            paused: false
        }
        this.getVideo = this.getVideo.bind(this)
        this._onReady = this._onReady.bind(this)
        this._onRemove = this._onRemove.bind(this)
        this._handleKeyDown = this._handleKeyDown.bind(this)
        this.timeOutGraphic = this.timeOutGraphic.bind(this)
    }

    componentDidMount() {
        if (!this.props.chosenTags.length) history.push('/')
        this.timeOutGraphic()
        document.addEventListener("keydown", this._handleKeyDown)
      }

    componentWillUnmount() {
        document.removeEventListener("keydown", this._handleKeyDown)
    }

    _onReady(event) {
        if (!this.state.started){
            event.target.pauseVideo();
            this.setState({started: true})
        }
    }

    _onRemove(event) {
        if (!this.state.started){
            event.target.pauseVideo();
        }
    } 

    _handleKeyDown(e) {
        if(e.key === "ArrowRight" || e.key === "ArrowLeft") {
            e.preventDefault()
            let currentToggle = this.state.videoToggle
            if (currentToggle === 0 && e.key === "ArrowLeft"){
                currentToggle = this.props.playlist.playlistArr.length
            }
            if (currentToggle === this.props.playlist.playlistArr.length-1 && e.key === "ArrowRight") {
                currentToggle = -1
            }
            this.setState({videoToggle:
                e.key === "ArrowRight" ?
                currentToggle + 1
                :
                currentToggle - 1})
        }
       if(e.code === "Space") {
           e.preventDefault()
           let player = this.refs.youTubePlayer.internalPlayer
           if(this.state.paused){
               this.setState({paused: false})
               player.playVideo()
           }
           else {
               this.setState({paused: true})
               player.pauseVideo()
           }
       }
    }

    getVideo () {
        if (+this.state.videoToggle < this.props.playlist.playlistArr.length-1){
            this.setState({videoToggle: +this.state.videoToggle + 1})
        } else this.setState({videoToggle: 0})
    }

    timeOutGraphic() {
        setTimeout(() => {
            this.setState({ show: true });
          }, 250);
    }

    handleClick (e, i) {
        this.setState({
            videoToggle: i
        })
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


        const opts = {
            height: '390',
            width: '640',
            origin: "https://vibez-playlist-maker.herokuapp.com/",
            playerVars: { // https://developers.google.com/youtube/player_parameters
              autoplay: 1
            }
          };
        return (
            <div id="player">
                {   this.props.playlist.playlistArr ? (
                    <div id="player">
                        <div className="control" 
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
                    ref="youTubePlayer"
                    />
                        <div className="control" 
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
                        <tbody>
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
                        </tbody>
                    </table>
                ) : null
                }
            </div>
        )
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
        removeTrack (e, currentPlaylist, idx) {
            let playlistCopy = Object.assign({}, currentPlaylist)
            playlistCopy.playlistArr.splice(idx, 1)
            dispatch(removeTrackThunk(playlistCopy))
          }
      }
  }


export default withRouter(connect(mapState, mapDispatch)(Playlist))