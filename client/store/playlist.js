import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const FETCH_PLAYLIST = 'FETCH_PLAYLIST'

/**
 * INITIAL STATE
 */
const playlist = {}

/**
 * ACTION CREATORS
 */
export const fetchPlaylistActionCreator = fetchedPlaylist => ({type: FETCH_PLAYLIST, playlist: fetchedPlaylist})


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

/**
 * REDUCER
 */
export default function (state = playlist, action) {
    switch (action.type) {
        case FETCH_PLAYLIST:
            return action.playlist
        default:
            return state
    }
}