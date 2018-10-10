import React from 'react'
import sinon from 'sinon'
import { expect } from 'chai'
import { mount } from 'enzyme'

import { Deviation } from '../src'

import {
  HttpMockupProvider,
  AppComponent
} from './prepare/HttpProvider'

describe('Lazy DI', () => {
  describe('HttpApp', () => {
    it('should fallback to the provider subclass', () => {
      const stub = sinon.stub(
        HttpMockupProvider.prototype,
        'getApi'
      )

      const wrapper = mount(
        <Deviation providers={[HttpMockupProvider]}>
          <AppComponent />
        </Deviation>
      )

      expect(stub.calledOnce).to.be.true
      stub.restore()
    })
  })
})
