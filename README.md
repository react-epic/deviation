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

Deviation is a library that trying to simulate Angular DI model into React using RxJS and React Context API. Here is our example:

```jsx
ReactDOM.render(
  <Deviation providers={[TodoStore, HttpProvider]}>
    <TodoApp />
  </Deviation>,
  document.querySelector('#root')
)

@Inject({
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
        <div>
          <label for="new-todo">New Todo:</label>
          <input
            name="new-todo"
            type="input"
            onKeyDown={enter(todoStore.addTodo)}
          />
        </div>
      </div>
    )
  }
}
```
