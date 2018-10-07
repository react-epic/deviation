# Deviation

## Install

You can install Deviation by either using PNPM, Yarn or NPM:

```bash
# PNPM
$ pnpm add react-epic

# Yarn
$ yarn add react-epic

# NPM
$ npm add react-epic
```

## What is Deviation

Deviation is a library that trying to stimulate Angular DI model into React using RxJS and React Context API. Here is our example

```jsx
ReactDOM.render(
  <Provider values={[TodoStore, HttpProvider]}>
    <TodoApp />
  </Provider>,
  document.querySelector('#root')
)

@Deviate({
  todoStore: TodoStore
})
export class TodoApp extends React.Component {
  render() {
    const { todoStore } = this.props

    return (
      <div>
        <ul>
          {todoStore.state.todos.map(todo => (
            <li>{todo}</li>
          ))}
        </ul>
        <button onClick={todoStore.addTodo}>Add Todo</button>
      </div>
    )
  }
}
```

By doing this, Deviation is comparable to React Epic by its simplicity. It has a great advantage over React Epic that you don't have to understand much about RxJS or write a lot of streams and logics in RxJS to make your app works.
