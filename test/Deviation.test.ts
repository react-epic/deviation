import { expect } from 'chai'
import { ReactWrapper } from 'enzyme'
import * as React from 'react'

import { createMountPoint as createMultipleCounterMountPoint } from './prepare/MultipleCounter'
import { createMountPoint as createTodoMountPoint } from './prepare/TodoApp'

describe('Deviation', () => {
  describe('TodoApp', () => {
    it('should add new todos', () => {
      const wrapper = createTodoMountPoint()
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
        } as unknown) as React.KeyboardEvent<any>)
      }

      wrapper.update()

      expect(
        wrapper.find('#todo-list').find('li')
      ).to.have.lengthOf(newTodos.length)
    })
  })

  describe('MultipleCounter', () => {
    it('should create local stores', () => {
      const wrapper = createMultipleCounterMountPoint()
      const totalCounter = wrapper.find('#total-counter')
      const addCounterInput = wrapper.find('#add-counter')

      const numberOfCounters = 4

      Array.from({ length: numberOfCounters }).forEach(() => {
        ;(addCounterInput.prop('onClick') as Function)()
      })

      wrapper.update()

      const counters = Array.from({
        length: numberOfCounters
      }).map((value, id) => wrapper.find(`#counter-${id}`))

      function increaseCounter(
        counter: ReactWrapper,
        count: number
      ): void {
        const incrementButton = counter.find('button')

        Array.from({ length: count }).forEach(() => {
          ;(incrementButton.prop('onClick') as Function)()
        })
      }

      increaseCounter(counters[1], 5)
      increaseCounter(counters[3], 8)

      expect(totalCounter.text()).to.equal('13')
      expect(counters[1].find('p').text()).to.equal('5')
      expect(counters[3].find('p').text()).to.equal('8')
    })
  })
})
