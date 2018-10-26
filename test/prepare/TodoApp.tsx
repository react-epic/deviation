import { ReactWrapper, mount } from 'enzyme'
import * as React from 'react'

import { Deviation, Inject, Store } from '../../src'

import { enter } from './enter'

export interface IStoreState {
  todos: string[]
}

export class TodoStore extends Store<{}, IStoreState> {
  public state: IStoreState = {
    todos: []
  }

  public addTodo = (todo: string): void => {
    this.setState(state => ({
      todos: state.todos.concat([todo])
    }))
  }
}

export interface ITodoAppProps {
  todoStore?: TodoStore
}

@Inject({
  todoStore: TodoStore
})
export class TodoApp extends React.Component<ITodoAppProps> {
  public handleSubmit = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    this.props.todoStore.addTodo(
      (event.target as HTMLInputElement).value
    )
  }

  public render(): React.ReactNode {
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

export function createMountPoint(): ReactWrapper<
  any,
  Readonly<{}>,
  React.Component<{}, {}, any>
> {
  return mount(
    <Deviation providers={[TodoStore]}>
      <TodoApp />
    </Deviation>
  )
}
