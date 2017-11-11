import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter, Link} from 'react-router-dom'
import history from '../history'

import { chooseTagsThunk } from '../store/chosen-tags'
import { fetchPlaylistThunk } from '../store/playlist'

/**
 * COMPONENT
 *  The Main component is our 'picture frame' - it displays the navbar and anything
 *  else common to our entire app. The 'picture' inside the frame is the space
 *  rendered out by the component's `children`.
 */
class TagOptions extends Component {
    constructor() {
        super()
        this.state = {
            choosingTags: [],
            tooMany: false,
            notEnough: true
        }
        this.handleClick = this.handleClick.bind(this)
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

    render() {
        console.log(this.state)
        if (this.props.tagsAvail){
            return (
                <div>
                    <h1>Set the Mood...</h1>
                    <h3>Pick up to 5 qualities that set the right mood...</h3>
                    {
                        this.state.tooMany ? 
                        (<div> You can only choose 5! </div>)
                        :
                        null
                    }
                    {
                        this.state.notEnough ? 
                        (<div> You must choose at least one tag! </div>)
                        :
                        <button onClick={e => this.props.handleSubmit(e, this.state.choosingTags, this.props.tagOptions, this.props.chosenTrack.artist, this.props.chosenTrack.track)}>Set the mood!</button>
                    }
                    <div>
                        {this.props.tagOptions.map((tag, i) => {
                            return (
                                <div key={i} onClick={e => this.handleClick(e, tag.name)}>
                                    {tag.name}
                                </div>
                            )
                        })}
                    </div>
                    <div>
                        <h3>I'm looking for...</h3>
                        {this.state.choosingTags.map((tag, i) => {
                            return (
                                <div key ={i}>
                                    {tag}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    <h1>Set the Mood...</h1>
                    <h3>Gathering info about that song. Hold on to your butts, we'll get the mood right soon.</h3>
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
      chosenTrack: state.chosenTrack
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
        }
      }
  }



// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(TagOptions))