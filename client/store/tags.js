import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_TAG_OPTIONS = 'GET_TAG_OPTIONS'


/**
 * INITIAL STATE
 */
const tagOptions = []

/**
 * ACTION CREATORS
 */
const getTagOptions = fetchedTags => ({type: GET_TAG_OPTIONS, tags: fetchedTags})

/**
 * THUNK CREATORS
 */
export const tagOptionsThunk = (songName, artistName) =>
    dispatch => {
        return axios.get(`/api/songs/?tags=true&song=${songName}&artist=${artistName}&num=20`)
        .then(res => {
            dispatch(getTagOptions(res.data || tagOptions))
        })
        .catch(err => console.log(err))
    }

/**
 * REDUCER
 */
export default function (state = tagOptions, action) {
    switch (action.type) {
        case GET_TAG_OPTIONS:
            return action.tags
        default:
            return state
    }
}