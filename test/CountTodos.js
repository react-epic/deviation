import React from 'react'
import { mount } from 'enzyme'

import { Deviation, Inject } from '../src/Deviation'
import { Store } from '../src/Store'

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
  render() {
    const { counterStore } = this.props
    const { todoStore } = this.props

    return (
      <div>
        <p id="todo-counter">{counterStore.state.counter}</p>
        <button id="add-todo" onClick={todoStore.addTodo}>
          Add Todo
        </button>
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
