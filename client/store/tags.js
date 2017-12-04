import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_TAG_OPTIONS = 'GET_TAG_OPTIONS'
const REMOVE_TAG_OPTION = 'REMOVE_TAG_OPTION'


/**
 * INITIAL STATE
 */
const tagOptions = []

/**
 * ACTION CREATORS
 */
const getTagOptions = fetchedTags => ({type: GET_TAG_OPTIONS, tags: fetchedTags})
const removeTagOption = newTagOptions => ({type: REMOVE_TAG_OPTION, tags: newTagOptions})

/**
 * THUNK CREATORS
 */
export const tagOptionsThunk = (songName, artistName) =>
    dispatch => {
        return axios.get(`/api/songTags/?tags=true&song=${songName}&artist=${artistName}&num=20`)
        .then(res => {
            dispatch(getTagOptions(res.data || tagOptions))
        })
        .catch(err => console.log(err))
    }
 export const removeTagOptionThunk = newTags =>
    dispatch => {
        dispatch(removeTagOption(newTags))
    }

/**
 * REDUCER
 */
export default function (state = tagOptions, action) {
    switch (action.type) {
        case GET_TAG_OPTIONS:
            return action.tags
        case REMOVE_TAG_OPTION:
            return action.tags
        default:
            return state
    }
}