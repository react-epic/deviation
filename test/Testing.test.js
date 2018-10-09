import React from 'react'
import sinon from 'sinon'
import { expect } from 'chai'
import { mount } from 'enzyme'

import {
  CallService,
  createMountPoint,
  CallApp
} from './CallApp'
import { createStoreExtractor, Deviation } from '../src'

describe('Testing', () => {
  describe('CallApp', () => {
    it('should be called once', () => {
      const callCount = 3

      const stub = sinon.stub(
        CallService.prototype,
        'makeAPhoneCall'
      )

      const wrapper = createMountPoint()
      const button = wrapper.find('button')
      for (let i = 0; i < callCount; ++i) {
        button.prop('onClick')()
      }

      expect(stub.callCount).to.be.equal(callCount)

      CallService.prototype.makeAPhoneCall.restore()
    })

    it('should extract CallService from providers', () => {
      const callCount = 3

      const Extractor = createStoreExtractor()

      const wrapper = mount(
        <Deviation providers={[CallService, Extractor]}>
          <CallApp />
        </Deviation>
      )

      const callService = Extractor.getStore(CallService)
      const stub = sinon.stub(callService, 'makeAPhoneCall')

      const button = wrapper.find('button')
      for (let i = 0; i < callCount; ++i) {
        button.prop('onClick')()
      }

      expect(stub.callCount).to.be.equal(callCount)
    })
  })
})
