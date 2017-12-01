import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter, Link} from 'react-router-dom'
import history from '../history'

import { chooseTagsThunk } from '../store/chosen-tags'
import { fetchPlaylistThunk } from '../store/playlist'
import { possibleSongsThunk } from '../store/possible-songs'
import { tagOptionsThunk, setTrackThunk, removeTagOptionThunk } from '../store'

/**
 * COMPONENT
 *  The Main component is our 'picture frame' - it displays the navbar and anything
 *  else common to our entire app. The 'picture' inside the frame is the space
 *  rendered out by the component's `children`.
 */
class TagOptions extends Component {
    constructor(props) {
        super(props)
        this.state = {
            choosingTags: [],
            tooMany: false,
            notEnough: true,
            deletedTooMany: false
        }
        this.handleClick = this.handleClick.bind(this)
        this.removeFromChosen = this.removeFromChosen.bind(this)
    }

    handleClick (e, tagName) {
        if (this.state.choosingTags.includes(tagName)){
            let toRemove = this.state.choosingTags.indexOf(tagName)
            let newState = [...this.state.choosingTags]
            newState.splice(toRemove, 1)
            this.setState({choosingTags: newState}, () => {
                if (this.state.choosingTags.length < 5) {
                    this.setState({tooMany: false}, () => {
                        if (!this.state.choosingTags.length){
                            this.setState({notEnough: true})
                        }
                    })
                }
            })
        } else {
            if (this.state.choosingTags.length < 5) {
                this.setState({choosingTags: [...this.state.choosingTags, tagName]}, () => {
                    this.setState({notEnough: false})
                })
            } else {
                this.setState({tooMany: true})
            }
        }
    }

    removeFromChosen (e, i) {
        let currentlyChosen = this.state.choosingTags.slice()
        currentlyChosen.splice(i, 1)
        if (this.state.choosingTags.length === 1) this.setState({
            notEnough: true
        })
        this.setState({choosingTags: currentlyChosen})
    }


    render() {
        if (this.props.tagOptions[0] === 'NOT FOUND' && !this.props.possibleSongs.length) {
            this.props.handleNotFound(`${this.props.chosenTrack.artist} ${this.props.chosenTrack.track}`)
        }
        if (this.props.tagOptions[0] === 'NOT FOUND' && this.props.possibleSongs.length){
            return (
                <div>
                    <h3>
                    Did you mean...
                    </h3>
                    {
                        this.props.possibleSongs.length ? 
                            this.props.possibleSongs.map((song, idx) => {
                                if (idx < 3) {
                                    return (<div key={idx} onClick={e => this.props.handleNewSong(e, song.track, song.artist)}>
                                        {song.track} - {song.artist}
                                    </div>
                                    )
                                }
                            })
                        : null
                    }
                </div>
            )
        }
        if (this.props.tagOptions[0] === 'NOT FOUND') {
            <div>
                Song not found!
            </div>
        }
        if (+this.props.tagsAvail > 1){
            return (
                <div id="options-div">
                        <button id={this.state.notEnough ? "chose-tags-disable" : "chose-tags"}
                        disabled={this.state.notEnough}
                        onClick={e => this.props.handleSubmit(e, this.state.choosingTags, this.props.tagOptions, this.props.chosenTrack.artist, this.props.chosenTrack.track)}>VIBE!</button>
                        {
                            this.state.choosingTags.length ? (
                                <div className="center-text">
                                </div>
                            ) : null
                        }
                    <div className="tag-holder">
                        {this.state.choosingTags.map((tag, i) => {
                            return (
                                <div 
                                className="taga" key ={i}>
                                    <div>
                                        {tag.toLowerCase()}
                                    </div>
                                    <button 
                                    className="remove-button"
                                    onClick={
                                        (e) => this.removeFromChosen(e, i)}> x </button>
                                </div>
                            )
                        })}
                    </div>
                    <div id="directions">
                    <h3>pick 1 - 5 qualities that especially fit the vibe</h3>
                    <h4>remove any qualities that don't vibe</h4>
                    </div>
                    {
                        this.state.tooMany ? 
                        (<div> you can only choose 5 </div>)
                        :
                        null
                    }
                    {
                        this.state.deletedTooMany ? (
                            <div>
                                you must leave at least 5 qualities
                            </div>
                        )
                        : null
                    }
                    <div className="tag-holder">
                        {this.props.tagOptions.map((tag, i) => {
                            return (
                                <div className={(this.state.choosingTags.includes(this.props.tagOptions[i].name)) ? "chosentag" : "tag"} key={i}>
                                    <div onClick={e => this.handleClick(e, tag.name)}>
                                        {tag.name.toLowerCase()}
                                    </div>
                                    {
                                        (this.state.choosingTags.includes(this.props.tagOptions[i].name)) ? 
                                        null :
                                <button 
                                className={"remove-button"}
                                key={i + 'a'}
                                onClick={
                                    (this.props.tagOptions.length > 5) ? (
                                    (e) => this.props.handleRemoveTagOption(this.props.tagOptions, i)
                                    ) :
                                    ((e) => this.setState({deletedTooMany: true}))}
                                    disabled={this.state.deletedTooMany}>
                                    x
                                    </button> 
                                        }
                                </div>                              
                            )
                        })}
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    {/* <h1>VIBING!</h1> */}
                    {/* <h3>Gathering info about that song. Hold on to your butts, we'll get the mood right soon.</h3> */}
                </div>
            )
        }
    }   
}

const mapState = (state) => {
    return {
      tagOptions: state.tagOptions,
      tagsAvail: state.tagOptions.length,
      chosenTags: state.chosenTags,
      chosenTrack: state.chosenTrack,
      possibleSongs: state.possibleSongs
    }
  }
  
  const mapDispatch = (dispatch) => {
    return {
        handleSubmit: (evt, chosenTags, moreTags, artist, track) => {
            evt.preventDefault()
            if (chosenTags.length){
                dispatch(chooseTagsThunk(chosenTags))
                dispatch(fetchPlaylistThunk(chosenTags, moreTags, artist, track))
                history.push('/playlist')
            }
        }, 
        handleNotFound: (searchTerm) => {
            dispatch(possibleSongsThunk(searchTerm))
        },
        handleNewSong: (e, track, artist) => {
            dispatch(setTrackThunk(artist, track))
            dispatch(tagOptionsThunk(track, artist))
            history.push('/tagoptions')
        },
        handleRemoveTagOption: (oldOptions, tagIdx) => {
            let newOptions = oldOptions.slice()
            newOptions.splice(tagIdx, 1)
            dispatch(removeTagOptionThunk(newOptions))
        }
      }
  }



// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(TagOptions))