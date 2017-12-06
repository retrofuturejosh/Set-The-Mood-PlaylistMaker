import {expect} from 'chai'
import React from 'react'
import enzyme, {shallow, mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Playlist } from '../components/playlist'
import { spy, stub } from 'sinon'
import { JSDOM } from 'jsdom'

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .reduce((result, prop) => ({
      ...result,
      [prop]: Object.getOwnPropertyDescriptor(src, prop),
    }), {})
  Object.defineProperties(target, props)
}

global.window = window
global.document = window.document
global.navigator = {
  userAgent: 'node.js',
};
copyProps(window, global)

const adapter = new Adapter()
enzyme.configure({adapter})

describe('Playlist', () => {
  let navBar
  let tags = [
    {name: 'calm'},
    {name: 'peaceful'},
    {name: 'serene'},
    {name: 'ballad'},
    {name: 'cool'},
    {name: 'fun'},
    {name: 'oldies'}
  ]
  let playlist = 

  beforeEach(() => {
    playlist = shallow(<Playlist chosenTags={tags}/>)
  })

  it('has an initial state', () => {
    expect(playlist.state('videoToggle')).to.equal(0)
  })

//   it('has an h1 header', () => {
//     expect(navBar.find('h1').text()).to.equal('VIBEZ')
//   })

//   it('header calls a function when clicked', () => {
//     NavBar.prototype.handleClick = stub()
//     navBar = shallow(<NavBar/>)
//     navBar.find('h1').simulate('click')
//     expect(NavBar.prototype.handleClick.calledOnce).to.equal(true)
//   })
})