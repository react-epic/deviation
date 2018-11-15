[![Build Status](https://travis-ci.com/react-epic/deviation.svg?branch=master?style=flat-square)](https://travis-ci.com/react-epic/deviation)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/react-epic/deviation)
[![Gitter chat](https://badges.gitter.im/ReactEpic/Deviation.png)](https://gitter.im/ReactEpic/Deviation)

<div align="center">
  
  <img src="images/DeviationBackground.png" width="100%" alt="Deviation"/>

</div>

## Install

You can install Deviation by either using PNPM, Yarn or NPM:

```bash
# PNPM
$ pnpm add deviation

# Yarn
$ yarn add deviation

# NPM
$ npm add deviation
```

## What is Deviation?

Deviation is a library for dependency injection in React using RxJS and React Context API. Deviation is largely inspired by Angular dependency injection.

## Example

```jsx
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Deviation, Store, Inject } from 'deviation'

export interface ICounterStoreState {
  counter: number;
}

export class CounterStore extends Store<
  {},
  ICounterStoreState
> {
  state = {
    counter: 0
  }

  increment = () => {
    this.setState(state => ({ counter: state.counter + 1 }))
  }

  decrement = () => {
    this.setState(state => ({ counter: state.counter - 1 }))
  }
}

export interface IAppComponentProps {
  counterStore?: CounterStore;
}

@Inject({
  counterStore: CounterStore
})
export class AppComponent extends React.Component<
  IAppComponentProps
> {
  render() {
    const { counterStore } = this.props
    return (
      <div>
        <p>{counterStore.state.counter}</p>
        <button onClick={counterStore.decrement}>
          Decrement
        </button>
        <button onClick={counterStore.increment}>
          Increment
        </button>
      </div>
    )
  }
}

ReactDOM.render(
  <Deviation providers={[CounterStore]}>
    <AppComponent />
  </Deviation>,
  document.getElementById('root')
)
```

The live version can be found here on [CodeSandbox](https://codesandbox.io/s/2wp6217v8r):

[![Edit deviation-example-app](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/2wp6217v8r)

## Documentation

For more information about documentation please visit our homepage: https://react-epic.gitbook.io/deviation
