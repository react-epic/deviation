import React from 'react'
import { mount } from 'enzyme'

import { Deviation, Inject } from '../src/Deviation'
import { Store } from '../src/Store'
import { enter } from './enter'

export class CounterStore extends Store {
  state = {
    counter: 0
  }

  increment = () => {
    this.setState(({ counter }) => ({ counter: counter + 1 }))
  }
}

@Inject({
  counterStore: CounterStore
})
export class TodoStore extends Store {
  state = {
    todos: []
  }

  addTodo = newTodo => {
    this.props.counterStore.increment()

    this.setState(({ todos }) => ({
      todos: [...todos, newTodo]
    }))
  }
}

@Inject({
  counterStore: CounterStore,
  todoStore: TodoStore
})
export class CountTodos extends React.Component {
  handleSubmit = event => {
    this.props.todoStore.addTodo(event.target.value)
  }

  render() {
    const { counterStore } = this.props

    return (
      <div>
        <p id="todo-counter">{counterStore.state.counter}</p>

        <div>
          <label htmlFor="new-todo">New Todo:</label>
          <input
            name="new-todo"
            id="todo-input"
            onKeyDown={enter(this.handleSubmit)}
          />
        </div>
      </div>
    )
  }
}

export function createMountPoint() {
  return mount(
    <Deviation providers={[CounterStore, TodoStore]}>
      <CountTodos />
    </Deviation>
  )
}
