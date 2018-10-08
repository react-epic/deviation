import { expect } from 'chai'

import { createMountPoint } from './TodoApp'

describe('Deviation', () => {
  describe('TodoApp', () => {
    it('should add new todos', () => {
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

      wrapper.update()

      expect(
        wrapper.find('#todo-list').find('li')
      ).to.have.lengthOf(newTodos.length)
    })
  })
})
