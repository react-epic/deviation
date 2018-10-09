import React from 'react'
import { mount } from 'enzyme'

import { Inject, Deviation } from '../src/Deviation'
import { Store } from '../src/Store'
import { enter } from './enter'

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
  handleSubmit = event => {
    this.props.todoStore.addTodo(event.target.value)
  }

  render() {
    const { todoStore } = this.props

    return (
      <div>
        <ul id="todo-list">
          {todoStore.state.todos.map((todo, key) => (
            <li key={key}>{todo}</li>
          ))}
        </ul>

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
    <Deviation providers={[TodoStore]}>
      <TodoApp />
    </Deviation>
  )
}
