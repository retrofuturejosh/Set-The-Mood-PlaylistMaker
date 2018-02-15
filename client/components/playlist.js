import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter, Link} from 'react-router-dom'
import ReactDOM from 'react-dom'
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
            paused: false,
            exportFail: false,
            exported: false,
            playingSongs: []
        }
        this.getVideo = this.getVideo.bind(this)
        this._onReady = this._onReady.bind(this)
        this._onRemove = this._onRemove.bind(this)
        this._handleKeyDown = this._handleKeyDown.bind(this)
        this.timeOutGraphic = this.timeOutGraphic.bind(this)
        this.exportPlaylist = this.exportPlaylist.bind(this)
        this.playSong = this.playSong.bind(this)
        this.moveBack = this.moveBack.bind(this)
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

    moveBack(e, i) {
      if (+i < this.state.videoToggle) {
        let newIdx = +this.state.videoToggle - 1;
        this.setState({videoToggle: newIdx});
      }
    }

    playSong(e, name) {
      let mp3 = document.getElementById(name)
      let songsArr = this.state.playingSongs.slice()

      if (this.state.playingSongs.includes(name)) {
        let toSlice = songsArr.indexOf(name)
        songsArr.splice(toSlice, 1)
        this.setState({playingSongs: songsArr}, () => {
          mp3.pause()
        })
      } else {
        songsArr.push(name)
        this.setState({playingSongs: songsArr}, () => {
          mp3.play()
        })
      }
    }

    exportPlaylist() {
      let token = this.props.tokens.access_token
      let user_id = this.props.tokens.id
      let chosenTags = this.props.chosenTags.join(' ')
      let spotifyPlaylistLink

      const url = 'https://api.spotify.com/v1/users/' + user_id +
      '/playlists';
      fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          "name": `VIBEZ playlist: ${this.props.chosenTrack.artist} - ${this.props.chosenTrack.track}`,
          "description": `based on tags: ${chosenTags}`,
          "public": false
        }),
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        return res.json()
      })
      .then(data => {
        spotifyPlaylistLink = data.external_urls.spotify
        let playlist_id = data.id
        let playlistURL = `https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}/tracks`

        let spotifyPlaylistArr = this.props.playlist.playlistArr
        .filter(song => {
          return song.spotifyID !== null;
        })
        .map(song => {
          return `spotify:track:${song.spotifyID}`
        })

        return fetch(playlistURL, {
          method: 'POST',
          body: JSON.stringify({
            "uris": spotifyPlaylistArr
          }),
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          }
        })
      })
      .then(res => {
        return res.json()
      })
      .then(data => {
        if (data.snapshot_id) {
          window.open(spotifyPlaylistLink, "_blank")
          this.setState({exported: true})
        } else {
          this.setState({exportFail: true, exported: true})
        } 
      })
      .catch(err => {
        console.log(error)
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
            height: '80vh',
            lineHeight: '36px',
            fontFamily: 'sans-serif',
            textAlign: 'center',
            letterSpacing: '1em',
            paddingLeft: '1em', // to compensate for letter spacing
          };


        const opts = {
            height: '390',
            width: '640',
            origin: 'https://vibez-playlist-maker.herokuapp.com/playlist',
            playerVars: { // https://developers.google.com/youtube/player_parameters
              autoplay: 1
            }
          };
        return (
            <div id="player">
                { this.props.playlist.playlistArr ? (
                    <div id="player-wrapper">

                      {(this.props.tokens.access_token && !this.state.exported)?
                        (<div id="export" onClick={this.exportPlaylist}>
                          Export playlist to Spotify!
                        </div>)
                        :
                        (null) 
                      }

                      {(this.props.tokens.access_token && this.state.exported && !this.state.exportFail)?
                        (<div id="playlist-added">
                          playlist successfully added to Spotify!
                        </div>)
                        :
                        (null)
                      }

                      {(this.props.tokens.access_token && this.state.exportFail)?
                        (<div id="playlist-failed">
                          sorry, something went wrong exporting playlist
                        </div>)
                        :
                        (null)
                      }

                      <div id="player">
                          <div className="control" 
                          onClick={e => this.setState({
                              videoToggle: (+this.state.videoToggle - 1)
                              })}>
                          prev
                          </div>
                      <div id="player-center">
                        {`${this.props.playlist.playlistArr[+this.state.videoToggle].artist} - ${this.props.playlist.playlistArr[+this.state.videoToggle].name}`} 
                        < YouTube playing
                        videoId={this.props.playlist.playlistArr[+this.state.videoToggle].youtubeid} 
                        onEnd={this.getVideo}
                        opts={opts}
                        onStateChange={this._onRemove}
                        onReady={this._onReady}
                        ref="youTubePlayer"
                        />
                      </div>
                          <div className="control" 
                          onClick={e => this.setState({
                              videoToggle: (+this.state.videoToggle + 1)
                              })}>
                          next
                          </div>
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
                            <tr>
                              <td className="th-title"> Spotify </td>
                              <td className="th-title"> YouTube </td>
                              <td className="th-title-x"> X </td>
                            </tr>
                           
                          
                            {this.props.playlist.playlistArr.map((song, i) => {
                                return (
                                    <tr key={`${i}div`}>

                                      {song.spotifyID ?
                                        (
                                        <div
                                          key={`spotify${i}`}
                                          className="spotify-image" >
                                          <img className="artist-thumb" src={song.image.url} />
                                          <audio
                                            id={song.name}
                                            src={song.preview}/>
                                          <div className="spotify-controls">
                                            {song.preview ? 
                                                (<div>
                                                  <img
                                                    className="play-button"
                                                    src={(+this.state.playingPreview === i ? "/pause-button.png" : "/play-button.png")}
                                                    onClick={(e) => {this.playSong(e, song.name)}} />
                                                </div>)
                                                :
                                                (<div>
                                                </div>)}
                                            <div>
                                              <img
                                                className ="small-spotify-logo"
                                                src="/spotify-icon.png"
                                                onClick={e => {window.open(song.spotifyURL.spotify)}}/>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                      :
                                        null
                                      }
                                      {(this.props.tokens.access_token && !song.spotifyID) ? 
                                        (<th className="th-title"> Song Not found on Spotify </th> )
                                      :
                                        null
                                      }


                                        <th className={(i === +this.state.videoToggle) ? "leftselect" : "left"} onClick={(e) => this.handleClick(e, i)} key={i}>
                                            {song.name} - {song.artist}
                                        </th>
                                        <th
                                            className="hover-red"
                                            key={`${i}a`} 
                                            
                                            onClick={(e) => {this.moveBack(e, i), this.props.removeTrack(e, this.props.playlist, i);}}
                                        >
                                        
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
      playlist: state.playlist,
      user: state.user,
      tokens: state.spotifyTokens,
      chosenTrack: state.chosenTrack
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