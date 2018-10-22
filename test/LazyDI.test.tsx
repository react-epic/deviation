import { expect } from 'chai'
import { mount } from 'enzyme'
import * as React from 'react'
import * as sinon from 'sinon'

import { Deviation } from '../src'

import {
  AppComponent,
  HttpMockupProvider
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

      expect(stub.calledOnce).to.equal(
        true,
        'expect getApi to be called once'
      )
      stub.restore()
    })
  })
})
