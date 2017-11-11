import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const SET_TRACK = 'SET_TRACK'

/**
 * INITIAL STATE
 */
const chosenTrack = {}

/**
 * ACTION CREATORS
 */
export const setSong = (artist, track) => ({type: SET_TRACK, track: {artist, track}})


/**
 * THUNK CREATORS
 */
export const setTrackThunk = (artist, track) =>
dispatch => {
    return dispatch(setSong(artist, track))
}

/**
 * REDUCER
 */
export default function (state = chosenTrack, action) {
    switch (action.type) {
        case SET_TRACK:
            return action.track
        default:
            return state
    }
}