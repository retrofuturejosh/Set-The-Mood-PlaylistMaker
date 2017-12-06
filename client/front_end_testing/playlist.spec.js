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
  let playlistRendering
  let playlist
  let timeOutSpy = spy(Playlist.prototype, 'timeOutGraphic')
  let handleClickSpy = spy(Playlist.prototype, 'handleClick')
  let removeTrack = stub()
  let tags = [
    {name: 'calm'},
    {name: 'peaceful'},
    {name: 'serene'},
    {name: 'ballad'},
    {name: 'cool'},
    {name: 'fun'},
    {name: 'oldies'}
  ]
  let playlistProp = { playlistArr: [
        {name: "I Will Survive", artist: "Gloria Gaynor"},
        {name: "Atomic", artist: "Blondie"},
        {name: "U Can't Touch This", artist: "MC Hammer"},
        {name: "Super Freak", artist: "Rick James"},
        {name: "Billie Jean", artist: "Michael Jackson"},
        {name: "Fight for Your Right", artist: "Beastie Boys"}
      ]
    }

  beforeEach(() => {
    playlistRendering = shallow(<Playlist playlist={{}} chosenTags={tags}/>)
    timeOutSpy.reset()
    handleClickSpy.reset()
    playlist = shallow(<Playlist playlist={playlistProp} chosenTags={tags} removeTrack={removeTrack}/>)
  })

  it('has an initial state', () => {
    expect(playlistRendering.state('videoToggle')).to.equal(0)
    expect(playlistRendering.state('started')).to.equal(false)
    expect(playlistRendering.state('show')).to.equal(false)
  })

  it('renders a loading screen when playlist is being made', () => {
    expect(playlistRendering.find('#loading')).to.have.length(1)
  })

  it('calls timeOutGraphic function when component mounts', () => {
    expect(timeOutSpy.callCount).to.equal(1)
  })

  it('renders the video player when playlist is available', () => {
      expect(playlist.find('#player')).to.have.length(2)
  })

  it('has a prev button that decrements state.videoToggle', () => {
      let prevButton = playlist.find('.control').first()
      expect(prevButton.text()).to.equal('prev')
      playlist.setState({videoToggle: 4})
      prevButton.simulate('click')
      expect(playlist.state('videoToggle')).to.equal(3)
  })

  it('has a next button that increments state.videoToggle', () => {
      let nextButton = playlist.find('.control').last()
      expect(nextButton.text()).to.equal('next')
      playlist.setState({videoToggle: 4})
      nextButton.simulate('click')
      expect(playlist.state('videoToggle')).to.equal(5)
  })

  it('has a getVideo function that increments state.videoToggle', () => {
      playlist.instance().getVideo()
      expect(playlist.state('videoToggle')).to.equal(1)
  })

  it('renders a table of songs when playlist is available', () => {
      expect(playlistRendering.find('table')).to.have.length(0)
      playlistRendering.setProps({playlist: playlistProp})
      expect(playlistRendering.find('table')).to.have.length(1)
      expect(playlistRendering.find('th')).to.have.length(12)
  })

  it('adds leftselect class to currently playing video', () => {
      expect(playlist.find('.left')).to.have.length(5)
      expect(playlist.find('.leftselect')).to.have.length(1)
  })

  it('displays song name and artist in playlist table', () => {
      expect(playlist.find('.leftselect').text()).to.equal('I Will Survive - Gloria Gaynor')
      playlist.setState({videoToggle: 1})
      expect(playlist.find('.leftselect').text()).to.equal('Atomic - Blondie')
  })

  it('renders a delete button for every row in playlist table', () => {
      expect(playlist.find('.hover-red')).to.have.length(6)
  })

  it('runs handleClick function when a different song is clicked', () => {
      expect(handleClickSpy.called).to.equal(false)
      playlist.find('.left').first().simulate('click')
      expect(handleClickSpy.calledOnce).to.equal(true)
  })

  it('has a handleClick function that changes state.videoToggle to correct index for selected song', () => {
      playlist.find('.left').last().simulate('click')
      expect(playlist.state('videoToggle')).to.equal(5)
  })

  it('runs removeTrack function when remove button is clicked', () => {
      playlist.find('.hover-red').first().simulate('click')
      expect(removeTrack.calledOnce).to.equal(true)
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