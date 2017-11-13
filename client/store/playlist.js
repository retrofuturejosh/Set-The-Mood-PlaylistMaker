import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const FETCH_PLAYLIST = 'FETCH_PLAYLIST'
const REMOVE_TRACK = 'REMOVE_TRACK'

/**
 * INITIAL STATE
 */
const playlist = {}

/**
 * ACTION CREATORS
 */
export const fetchPlaylistActionCreator = fetchedPlaylist => ({type: FETCH_PLAYLIST, playlist: fetchedPlaylist})
export const removeTrackActionCreator = updatedPlaylist => ({type: REMOVE_TRACK, playlist: updatedPlaylist})

/**
 * THUNK CREATORS
 */
export const fetchPlaylistThunk = (chosenTags, tagOptions, artist, track) =>
dispatch => {
    let queryStr = `?artist=${artist}&track=${track}&`
    tagOptions = tagOptions.filter(tag => {
        if (chosenTags.includes(tag.name)) return false
        return true
    })
    chosenTags.forEach((tag, i) => {
        queryStr += `tag${i+1}=${tag}&`
    })
    for (let i = 1; i < 10; i++){
        if (tagOptions[i]){
        queryStr += `moretags${i}=${tagOptions[i].name}&`
        }
    }
    return axios.get(`/api/playlist/${queryStr.slice(0, queryStr.length-1)}`)
    .then(res => {
        return dispatch(fetchPlaylistActionCreator(res.data || playlist))
    })
}

export const removeTrackThunk = updatedPlaylist =>
dispatch => {
    dispatch(removeTrackActionCreator(updatedPlaylist))
}

/**
 * REDUCER
 */
export default function (state = playlist, action) {
    switch (action.type) {
        case FETCH_PLAYLIST:
            return action.playlist
        case REMOVE_TRACK:
            return action.playlist
        default:
            return state
    }
}