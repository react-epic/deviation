import { ReactWrapper, mount } from 'enzyme'
import * as React from 'react'

import { Deviation, Inject, Store } from '../../src'

import { enter } from './enter'

export interface ICounterStore {
  counter: number
}

export class CounterStore extends Store<{}, ICounterStore> {
  public state: ICounterStore = {
    counter: 0
  }

  public increment = () => {
    this.setState(({ counter }) => ({ counter: counter + 1 }))
  }
}

export interface ITodoStoreProps {
  counterStore: CounterStore
}

export interface ITodoStoreState {
  todos: string[]
}

@Inject({
  counterStore: CounterStore
})
export class TodoStore extends Store<
  ITodoStoreProps,
  ITodoStoreState
> {
  public state: ITodoStoreState = {
    todos: []
  }

  public addTodo = (newTodo: string): void => {
    this.props.counterStore.increment()

    this.setState(({ todos }) => ({
      todos: [...todos, newTodo]
    }))
  }
}

export interface ICounterTodosProps {
  todoStore?: TodoStore
  counterStore?: CounterStore
}

@Inject({
  counterStore: CounterStore,
  todoStore: TodoStore
})
export class CountTodos extends React.Component<
  ICounterTodosProps
> {
  public handleSubmit = (event: React.KeyboardEvent<{}>): void => {
    this.props.todoStore.addTodo(
      (event.target as HTMLInputElement).value
    )
  }

  public render(): React.ReactNode {
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

export function createMountPoint(): ReactWrapper<
  any,
  Readonly<{}>,
  React.Component<{}, {}, any>
> {
  return mount(
    <Deviation providers={[CounterStore, TodoStore]}>
      <CountTodos />
    </Deviation>
  )
}
