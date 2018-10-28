import { expect } from 'chai'
import { mount } from 'enzyme'
import * as React from 'react'
import * as sinon from 'sinon'

import { Deviation, createStoreExtractor } from '../../src'

import {
  CallApp,
  CallService,
  createMountPoint
} from './CallApp'

describe('Testing', () => {
  describe('CallApp', () => {
    it('should be called once', () => {
      const callCount = 3

      const stub = sinon.stub(CallService.prototype, 'getPhone')

      const wrapper = createMountPoint()
      const button = wrapper.find('button')
      for (const i of Array.from({ length: callCount })) {
        button.prop('onClick')(
          ({} as unknown) as React.MouseEvent<{}>
        )
      }

      expect(stub.callCount).to.be.equal(callCount)

      stub.restore()
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
      const stub = sinon.stub(callService, 'getPhone')

      const button = wrapper.find('button')

      for (const i of Array.from({ length: callCount })) {
        button.prop('onClick')(
          ({} as unknown) as React.MouseEvent<{}>
        )
      }

      expect(stub.callCount).to.be.equal(callCount)
    })
  })
})
