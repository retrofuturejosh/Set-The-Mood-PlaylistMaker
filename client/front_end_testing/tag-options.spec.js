import {expect} from 'chai'
import React from 'react'
import enzyme, {shallow, mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { TagOptions } from '../components/tag-options'
import { spy, stub } from 'sinon'
import { JSDOM } from 'jsdom'

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .reduce((result, prop) => ({
      ...result,
      [prop]: Object.getOwnPropertyDescriptor(src, prop),
    }), {})
  Object.defineProperties(target, props)
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
}

copyProps(window, global)
const adapter = new Adapter()
enzyme.configure({adapter})

const clickAllTags = (tags) => {
    tags.forEach((tag) => {
    tag.children().first().simulate('click')
  })
}

describe('TagOptions', () => {
  let tagOptions
  let tagOptionsNotFound
  let handleNotFound
  let handleRemoveTagOption
  let handleSubmit
  let newSongSpy = spy(TagOptions.prototype, 'chooseNewSong')
  let handleClickSpy = spy(TagOptions.prototype, 'handleClick')
  let tagsForProps

  beforeEach(() => {
    tagsForProps = {
      tagOptions:
        [{name: 'calm'},
        {name: 'peaceful'},
        {name: 'serene'},
        {name: 'ballad'},
        {name: 'cool'},
        {name: 'fun'},
        {name: 'oldies'}],
      tagsAvail: 7}
    handleRemoveTagOption = stub()
    handleNotFound = stub()
    handleSubmit = stub()

    tagOptions = shallow(<TagOptions
        tagOptions={[]}
        chosenTags={[]}
        chosenTrack={{}}
        possibleSongs={[]}
        handleRemoveTagOption={handleRemoveTagOption}
        handleSubmit={handleSubmit}/>)

    tagOptionsNotFound = shallow(<TagOptions
        tagOptions={['NOT FOUND']}
        chosenTags={[]}
        chosenTrack={{ track: 'Always Love', artist: 'Whitney Houston'}}
        possibleSongs={[]}
        handleNotFound={handleNotFound}
        />)
  })

  it('has an initial state', () => {
    expect(tagOptions.state('choosingTags')).to.have.length(0)
    expect(tagOptions.state('tooMany')).to.equal(false)
    expect(tagOptions.state('notEnough')).to.equal(true)
    expect(tagOptions.state('deletedTooMany')).to.equal(false)
    expect(tagOptions.state('possibilitySelected')).to.equal(false)
  })

  it('runs the handleNotFound function if song is not found', () => {
    expect(handleNotFound.calledOnce).to.equal(true)
  })

  it('renders a sorry message if no possible songs are found', () => {
    tagOptionsNotFound.setState({triedToFindSong: true})
    let sorryDiv = tagOptionsNotFound.find('#sorry')
    expect(sorryDiv).to.have.length(1)
    expect(sorryDiv.text()).to.equal('Sorry! Song not found!')
  })

  it('shows possible songs if possible song search yields results', () => {
      tagOptionsNotFound.setProps({possibleSongs: [{track: 'I Will Always Love You', artist: 'Whitney Houston'}]})
      expect(tagOptionsNotFound.find('h3').text()).to.equal('Did you mean...')
      expect(tagOptionsNotFound.find('.did-you-mean')).to.have.length(1)
  })

  it('runs the chooseNewSong function if a new song is chosen', () => {
    let handleNewSongSpy = stub()
    tagOptionsNotFound.setProps({possibleSongs: [{track: 'Bad', artist: 'Michael Jackson'}], handleNewSong: handleNewSongSpy})
    tagOptionsNotFound.find('.did-you-mean').simulate('click')
    expect(newSongSpy.calledOnce).to.equal(true)
    expect(handleNewSongSpy.calledOnce).to.equal(true)
    expect(tagOptionsNotFound.state('possibilitySelected')).to.equal(true)
  })

  it('renders divs with tag name and remove button-div if tags are available', () => {
    tagOptions.setProps(tagsForProps)
    expect(tagOptions.find('.tag')).to.have.length(7)
    expect(tagOptions.find('.remove-button')).to.have.length(7)
  })

  it('renders directions if tags are available', () => {
    tagOptions.setProps(tagsForProps)
    expect(tagOptions.find('#directions')).to.have.length(1)
  })

  it('runs handleClick function when a tag is clicked and adds the correct tag to choosingTags array on state', () => {
    tagOptions.setProps(tagsForProps)
    let tagDivs = tagOptions.find('.tag')
    tagDivs.last().children().first().simulate('click')
    expect(handleClickSpy.calledOnce).to.equal(true)
    let choosingTagsArr = tagOptions.state('choosingTags')
    expect(choosingTagsArr).to.have.length(1)
    expect(choosingTagsArr[0]).to.equal('oldies')
  })

  it('handleClick function removes tag from state.choosingTags if that tag was already chosen', () => {
    tagOptions.setProps(tagsForProps)
    tagOptions.setState({choosingTags: ['oldies']})
    let tagDivs = tagOptions.find('.chosentag')
    tagDivs.last().children().first().simulate('click')
    expect(tagOptions.state('choosingTags')).to.have.length(0)
  })

  it('handleRemoveTagOption function is called when tag remove-button is clicked', () => {
    tagOptions.setProps(tagsForProps)
    let removeButtons = tagOptions.find('.remove-button')
    expect(removeButtons).to.have.length(7)
    removeButtons.first().simulate('click')
    expect(handleRemoveTagOption.calledOnce).to.equal(true)
  })

  it('clicking remove-button on a tag when there are 5 or less tag options available will NOT run handleRemoveTagOptions', () => {
    tagsForProps.tagOptions = tagsForProps.tagOptions.slice(0, 5)
    tagsForProps.tagsAvail = 5
    tagOptions.setProps(tagsForProps)
    tagOptions.find('.remove-button').first().simulate('click')
    expect(handleRemoveTagOption.calledOnce).to.equal(false)
  })

  it('clicking remove-button on a tag when there are 5 or less tag options available will set state.deletedTooMany to true', () => {
    expect(tagOptions.state('deletedTooMany')).to.equal(false)
    tagsForProps.tagOptions = tagsForProps.tagOptions.slice(0, 5)
    tagsForProps.tagsAvail = 5
    tagOptions.setProps(tagsForProps)
    tagOptions.find('.remove-button').first().simulate('click')
    expect(tagOptions.state('deletedTooMany')).to.equal(true)
  })

  it('if state.deletedTooMany is true, too many deleted div renders', () => {
    tagsForProps.tagOptions = tagsForProps.tagOptions.slice(0, 5)
    tagsForProps.tagsAvail = 5
    tagOptions.setProps(tagsForProps)
    tagOptions.find('.remove-button').first().simulate('click')
    expect(tagOptions.find('#deleted-too-many')).to.have.length(1)
  })

  it('if more than 5 tags are chosen, state.TooMany should be true', () => {
    tagOptions.setProps(tagsForProps)
    let tags = tagOptions.find('.tag')
    clickAllTags(tags)
    expect(tagOptions.state('tooMany')).to.equal(true)
  })

  it('if more than 5 tags are chosen, too-many-chosen div renders', () => {
    expect(tagOptions.find('#too-many-chosen')).to.have.length(0)
    tagOptions.setProps(tagsForProps)
    let tags = tagOptions.find('.tag')
    clickAllTags(tags)
    expect(tagOptions.find('#too-many-chosen')).to.have.length(1)
  })

  it('vibe button is disabled when component first loads', () => {
    tagOptions.setProps(tagsForProps)
    let vibeButton = tagOptions.find('#chose-tags-disable')
    expect(vibeButton).to.have.length(1)
  })

  it('handleSubmit function is called if vibe button is clicked', () => {
    tagOptions.setProps(tagsForProps)
    let tags = tagOptions.find('.tag')
    clickAllTags(tags)
    tagOptions.find('#chose-tags').simulate('click')
    expect(handleSubmit.calledOnce).to.equal(true)
  })

})