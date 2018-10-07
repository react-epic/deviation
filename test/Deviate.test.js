import { expect } from 'chai'

import { createMountPoint } from './TodoApp'

describe('Deviate', () => {
  describe('TodoApp', () => {
    it('should add new todo', () => {
      const wrapper = createMountPoint()

      const newTodo = 'Make this test works!'
      const todoList = wrapper.find('#todo-list')
      const addTodoButton = wrapper.find('#add-todo')

      addTodoButton.prop('onClick')(newTodo)
      addTodoButton.prop('onClick')(newTodo)

      expect(todoList.find('.item')).to.have.lengthOf(2)
    })
  })
})
