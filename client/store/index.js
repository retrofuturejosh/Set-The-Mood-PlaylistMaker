import {createStore, combineReducers, applyMiddleware} from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import user from './user'
import tagOptions from './tags'
import chosenTags from './chosen-tags'
import playlist from './playlist'
import chosenTrack from './chosen-song'

const reducer = combineReducers({user, tagOptions, chosenTags, playlist, chosenTrack})
const middleware = composeWithDevTools(applyMiddleware(
  thunkMiddleware,
  createLogger({collapsed: true})
))
const store = createStore(reducer, middleware)

export default store
export * from './user'
export * from './tags'
export * from './chosen-tags'
export * from './playlist'
export * from './chosen-song'