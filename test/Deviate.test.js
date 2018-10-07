import { expect } from 'chai'

import { createMountPoint } from './TodoApp'

describe('Deviate', () => {
  describe('TodoApp', () => {
    it('should add new todos', () => {
      const wrapper = createMountPoint()

      const newTodos = [
        'Make this test works',
        'Fix the bugs',
        'Deploy the library',
        'Close issues'
      ]

      const addTodoButton = wrapper.find('#add-todo')

      for (const todo of newTodos) {
        addTodoButton.prop('onClick')(todo)
      }

      wrapper.update()

      expect(
        wrapper.find('#todo-list').find('li')
      ).to.have.lengthOf(newTodos.length)
    })
  })
})
