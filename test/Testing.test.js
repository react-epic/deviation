import sinon from 'sinon'
import { expect } from 'chai'

import { CallService, createMountPoint } from './CallApp'

describe('Testing', () => {
  describe('CallApp', () => {
    it('should be called once', () => {
      const callCount = 3

      const stub = sinon.stub(
        CallService.prototype,
        'makeAPhoneCall'
      )

      const wrapper = createMountPoint()
      for (let i = 0; i < callCount; ++i) {
        wrapper.find('button').prop('onClick')()
      }

      expect(stub.callCount).to.be.equal(callCount)

      CallService.prototype.makeAPhoneCall.restore()
    })
  })
})
