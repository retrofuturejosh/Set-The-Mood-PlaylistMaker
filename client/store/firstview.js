import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const VIEWED = 'VIEWED'

/**
 * INITIAL STATE
 */
const viewCount = 0

/**
 * ACTION CREATORS
 */
export const viewed = (num) => ({type: VIEWED, num})


/**
 * REDUCER
 */
export default function (state = viewCount, action) {
  switch (action.type) {
    case VIEWED:
      return viewCount + action.num
    default:
      return state
  }
}