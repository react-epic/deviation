import { expect } from 'chai'
import * as React from 'react'

import { createMountPoint } from './prepare/TodoApp'

describe('Deviation', () => {
  describe('TodoApp', () => {
    it('should add new todos', () => {
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
          code: 'Enter',
          target: {
            value: todo
          }
        } as unknown) as React.KeyboardEvent<any>)
      }

      wrapper.update()

      expect(
        wrapper.find('#todo-list').find('li')
      ).to.have.lengthOf(newTodos.length)
    })
  })
})
