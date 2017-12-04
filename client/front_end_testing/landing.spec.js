import {expect} from 'chai'
import React from 'react'
import enzyme, {shallow, mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import {Landing} from '../components/landing'
import { spy, stub } from 'sinon'

const adapter = new Adapter()
enzyme.configure({adapter})

describe('Landing', () => {
  let landing
  let form
  let button
  let callback = spy()
  let handleSubmit

  beforeEach(() => {
    handleSubmit = stub()
    landing = shallow(<Landing handleSubmit={handleSubmit}/>)
    form = landing.find('form')
    button = form.find('button')
  })

  it('renders a form', () => {
    expect(form.exists()).to.equal(true)
  })

  it('form has two inputs ', () => {
    expect(form.find('input')).to.have.length(2)
  })

  it ('form has an h3 header', () => {
    expect(form.find('h3').text()).to.be.equal('what song best fits the vibe you want?')
  })

  it('form has a submit button', () => {
    expect(button.exists()).to.equal(true)
    expect(button.text()).to.equal('SET VIBEZ')
  })

  it('has an onSubmit function called on submit', () => {
    form.simulate('submit')
    expect(handleSubmit.calledOnce).to.equal(true);
  })
})