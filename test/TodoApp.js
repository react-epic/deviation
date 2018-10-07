import React from 'react'
import { mount } from 'enzyme'

import { Deviate, Provider } from '../src/Deviation'
import { Store } from '../src/Store'
import { noop } from 'rxjs'

class ErrorBoundary extends React.Component {
  componentDidCatch(error, info) {
    console.log(error, info)
  }

  render() {
    return this.props.children
  }
}

export class TodoStore extends Store {
  state = {
    todos: []
  }

  addTodo = todo => {
    this.setState({
      todos: this.state.todos.concat([todo])
    })
  }
}

@Deviate({
  todoStore: TodoStore
})
export class TodoApp extends React.Component {
  render() {
    const { todoStore } = this.props

    return (
      <div>
        <ul id="todo-list">
          {todoStore &&
            todoStore.state &&
            todoStore.state.todos.map((todo, key) => (
              <li className="item" key={key}>
                {todo}
              </li>
            ))}
        </ul>
        <button
          id="add-todo"
          onClick={(todoStore && todoStore.addTodo) || noop}
        >
          Add Todo
        </button>
      </div>
    )
  }
}

export function createMountPoint() {
  return mount(
    <Provider providers={[TodoStore]}>
      <TodoApp />
    </Provider>
  )
}
