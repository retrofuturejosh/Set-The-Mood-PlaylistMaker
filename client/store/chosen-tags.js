import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const CHOOSE_TAGS = 'CHOOSE_TAG'

/**
 * INITIAL STATE
 */
const chosenTags = []

/**
 * ACTION CREATORS
 */
export const chooseTags = tags => ({type: CHOOSE_TAGS, chosenTags: tags})


/**
 * THUNK CREATORS
 */
export const chooseTagsThunk = (tags) =>
dispatch => {
    return dispatch(chooseTags(tags))
}

/**
 * REDUCER
 */
export default function (state = chosenTags, action) {
    switch (action.type) {
        case CHOOSE_TAGS:
            return action.chosenTags
        default:
            return state
    }
}