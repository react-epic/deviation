import { expect } from 'chai'
import * as React from 'react'

import { createMountPoint } from './prepare/CountTodos'

describe('Internal DI', () => {
  describe('CountTodos', () => {
    it('should update store dependency state', () => {
      const wrapper = createMountPoint()
      const todoInput = wrapper.find('#todo-input')

      const newTodos = [
        'Make this test works',
        'Fix the bugs',
        'Deploy the library',
        'Close issues'
      ]

      for (const todo of newTodos) {
        todoInput.prop('onKeyDown')(({
          target: {
            value: todo
          },
          keyCode: 13
        } as unknown) as React.KeyboardEvent<{}>)
      }

      const todoCounter = wrapper.find('#todo-counter')
      expect(
        Number.parseInt(todoCounter.text(), 10)
      ).to.be.equal(newTodos.length)
    })
  })
})
