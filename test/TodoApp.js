import React from 'react'
import { mount } from 'enzyme'

import { Inject, Deviation } from '../src/Deviation'
import { Store } from '../src/Store'

export class TodoStore extends Store {
  state = {
    todos: []
  }

  addTodo = todo => {
    this.setState(state => ({
      todos: state.todos.concat([todo])
    }))
  }
}

@Inject({
  todoStore: TodoStore
})
export class TodoApp extends React.Component {
  render() {
    const { todoStore } = this.props

    return (
      <div>
        <ul id="todo-list">
          {todoStore.state.todos.map((todo, key) => (
            <li key={key}>{todo}</li>
          ))}
        </ul>
        <button id="add-todo" onClick={todoStore.addTodo}>
          Add Todo
        </button>
      </div>
    )
  }
}

export function createMountPoint() {
  return mount(
    <Deviation providers={[TodoStore]}>
      <TodoApp />
    </Deviation>
  )
}
