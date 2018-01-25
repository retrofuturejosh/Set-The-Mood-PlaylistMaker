import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_USER_NAME = 'GET_USER_NAME'

/**
 * INITIAL STATE
 */
const defaultUser = ''

/**
 * ACTION CREATORS
 */
export const getUser = user => ({type: GET_USER_NAME, user})


/**
 * REDUCER
 */
export default function (state = defaultUser, action) {
  switch (action.type) {
    case GET_USER_NAME:
      return action.user
    default:
      return state
  }
}
