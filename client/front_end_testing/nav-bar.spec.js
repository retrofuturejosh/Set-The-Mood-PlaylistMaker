import {expect} from 'chai'
import React from 'react'
import enzyme, {shallow, mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { NavBar } from '../components/nav-bar'
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
    }), {});
  Object.defineProperties(target, props);
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};
copyProps(window, global);

const adapter = new Adapter()
enzyme.configure({adapter})

describe('NavBar', () => {
  let navBar

  beforeEach(() => {
    navBar = shallow(<NavBar/>)
  })

  it('has an h1 header', () => {
    expect(navBar.find('h1').text()).to.equal('VIBEZ')
  })

  it('header calls a function when clicked', () => {
    const clickSpy = spy(NavBar.prototype, 'handleClick')
    navBar = shallow(<NavBar/>)
    navBar.find('h1').simulate('click')
    expect(clickSpy.calledOnce).to.equal(true);
  })
})