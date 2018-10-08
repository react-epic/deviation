import { expect } from 'chai'

import { createMountPoint } from './CountTodos'

describe('Internal DI', () => {
  describe('CountTodos', () => {
    it('should update store dependency state', () => {
      const wrapper = createMountPoint()
      const addTodoButton = wrapper.find('#add-todo')

      const newTodos = [
        'Make this test works',
        'Fix the bugs',
        'Deploy the library',
        'Close issues'
      ]

      for (const todo of newTodos) {
        addTodoButton.prop('onClick')(todo)
      }

      const todoCounter = wrapper.find('#todo-counter')
      expect(Number.parseInt(todoCounter.text())).to.be.equal(
        newTodos.length
      )
    })
  })
})
