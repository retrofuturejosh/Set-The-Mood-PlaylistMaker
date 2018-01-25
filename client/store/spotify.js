import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_TOKENS = 'GET_TOKENS'

/**
 * INITIAL STATE
 */
const spotifyTokens = {}

/**
 * ACTION CREATORS
 */
export const getSpotifyTokens = tokens => ({type: GET_TOKENS, tokens})



/**
 * REDUCER
 */
export default function (state = spotifyTokens, action) {
  switch (action.type) {
    case GET_TOKENS:
      return action.tokens
    default:
      return state
  }
}