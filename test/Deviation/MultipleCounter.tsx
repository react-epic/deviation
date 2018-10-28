import { ReactWrapper, mount } from 'enzyme'
import * as React from 'react'

import { Deviation, Inject, Store } from '../../src'

export interface ITotalCounterState {
  counter: number
}

export class TotalCounterStore extends Store<
  {},
  ITotalCounterState
> {
  public state: ITotalCounterState = {
    counter: 0
  }

  public increment = (): void => {
    this.setState(({ counter }) => ({ counter: counter + 1 }))
  }
}

export interface ICounterStoreProps {
  totalCounterStore?: TotalCounterStore
}

export interface ICounterStoreState {
  counter: number
}

@Inject({
  totalCounterStore: TotalCounterStore
})
export class CounterStore extends Store<
  ICounterStoreProps,
  ICounterStoreState
> {
  public state: ICounterStoreState = {
    counter: 0
  }

  public increment = (): void => {
    this.setState(({ counter }) => ({ counter: counter + 1 }))

    this.props.totalCounterStore.increment()
  }
}

export interface ICounterStoreProps {
  id: string
  counterStore?: CounterStore
}

@Inject({
  counterStore: CounterStore
})
export class Counter extends React.Component<
  ICounterStoreProps
> {
  public render(): React.ReactNode {
    const { id, counterStore } = this.props

    return (
      <div id={id}>
        <p>{counterStore.state.counter}</p>
        <button onClick={counterStore.increment}>
          Increment
        </button>
      </div>
    )
  }
}

export interface IMultipleCounterProps {
  totalCounterStore?: TotalCounterStore
}

export interface IMultipleCounterState {
  numberOfCounters: number
}

// tslint:disable-next-line: max-classes-per-file
@Inject({
  totalCounterStore: TotalCounterStore
})
export class MulitpleCounter extends React.Component<
  IMultipleCounterProps,
  IMultipleCounterState
> {
  public state: IMultipleCounterState = {
    numberOfCounters: 0
  }

  public addCounter = (): void => {
    this.setState(({ numberOfCounters }) => ({
      numberOfCounters: numberOfCounters + 1
    }))
  }

  public render(): React.ReactNode {
    const { totalCounterStore } = this.props

    return (
      <div>
        <p id="total-counter">
          {totalCounterStore.state.counter}
        </p>
        {Array.from({
          length: this.state.numberOfCounters
        }).map((value, id) => (
          <Deviation providers={[CounterStore]} key={id}>
            <Counter id={`counter-${id}`} />
          </Deviation>
        ))}
        <button id="add-counter" onClick={this.addCounter}>
          Add Counter
        </button>
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
    <Deviation providers={[TotalCounterStore]}>
      <MulitpleCounter />
    </Deviation>
  )
}
