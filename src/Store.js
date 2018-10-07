import { Subject } from 'rxjs'

import { isFunction } from './isFunction'

export class Store {
  constructor(props) {
    this.props = props

    this.setState.notifier = new Subject()
    this.setState.prevState = this.state
    this.setState.subscription = this.setState.notifier.subscribe(
      state => {
        this.state = state
      }
    )
  }

  setState = func => {
    if (isFunction(func)) {
      this.setState.prevState = func(this.prevState)
      this.setState.notifier.next(this.setState.prevState)
    } else {
      const newState = func
      this.setState.prevState = newState
      this.setState.notifier.next(this.setState.prevState)
    }
  }
}
