import { expect } from 'chai'

import { createMountPoint } from './prepare/CommunicateApp'

describe('Cyclic DI', () => {
  describe('CommunicateApp', () => {
    it('should resolve cyclic dependency injection', () => {
      const wrapper = createMountPoint()

      const a = wrapper.find('#a')
      const b = wrapper.find('#b')

      expect(a.text()).to.be.equal(
        'true',
        'expect #a text to be true'
      )
      expect(b.text()).to.be.equal(
        'true',
        'expect #a text to be true'
      )
    })
  })
})
