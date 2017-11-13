import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const FETCH_POSSIBLE_SONGS = 'FETCH_POSSIBLE_SONGS'

/**
 * INITIAL STATE
 */
const possibleTracks = []

/**
 * ACTION CREATORS
 */
export const possibleSongsActionCreator = options => ({type: FETCH_POSSIBLE_SONGS, possibleSongs: options})

/**
 * THUNK CREATORS
 */
export const possibleSongsThunk = (searchTerm) =>
    dispatch => {
        return axios.get(`api/songs/find/${searchTerm}`)
        .then(res => {
            return dispatch(possibleSongsActionCreator(res.data || possibleTracks))
        })
    }

/**
 * REDUCER
 */
export default function (state = possibleTracks, action) {
    switch (action.type) {
        case FETCH_POSSIBLE_SONGS:
            return action.possibleSongs
        default:
            return state
    }
}