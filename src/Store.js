import { Subject } from 'rxjs'

import { isFunction } from './isFunction'

export class Store {
  constructor(props) {
    this.props = props
    this.state = {}

    this.setState.notifier = new Subject()
  }

  setState = func => {
    if (isFunction(func)) {
      this.state = func(this.state)
      this.setState.notifier.next(
        Object.assign(Object.create(this.constructor), this)
      )
    } else {
      const newState = func
      this.state = newState
      this.setState.notifier.next(Object.assign({}, this))
    }
  }

  storeDidMount() {}

  storeWillUnmount() {}
}
